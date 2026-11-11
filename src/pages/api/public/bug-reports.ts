import crypto from 'node:crypto';
import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { readRuntimeEnv } from '@/lib/config/env-validator';
import { handleApiRoute, jsonError, jsonSuccess, parseJsonBody, validate } from '@/lib/utils';
import { InMemoryRateLimiter, extractClientIp } from '@/lib/utils/rate-limiter';
import { CreateBugReportSchema, type CreateBugReportInput } from '@/schemas/bug-report.schema';
import { createBugReport } from '@/services/bug-report.service';

export const publicBugReportRequestLimiter = new InMemoryRateLimiter(5, 5 * 60 * 1000);
export const publicBugReportCooldownLimiter = new InMemoryRateLimiter(1, 2 * 60 * 1000);
export const publicBugReportLimiter = new InMemoryRateLimiter(2, 15 * 60 * 1000);
export const publicBugReportDailyLimiter = new InMemoryRateLimiter(5, 24 * 60 * 60 * 1000);
export const publicBugReportDuplicateLimiter = new InMemoryRateLimiter(1, 30 * 60 * 1000);

export function resetBugReportRateLimiters(): void {
  publicBugReportRequestLimiter.reset();
  publicBugReportCooldownLimiter.reset();
  publicBugReportLimiter.reset();
  publicBugReportDailyLimiter.reset();
  publicBugReportDuplicateLimiter.reset();
}

function buildRateLimitedResponse(message: string, retryAfterSeconds: number): Response {
  const res = jsonError(message, 429, undefined, 'RATE_LIMITED');
  res.headers.set('Retry-After', String(retryAfterSeconds));
  return res;
}

function buildBugReportFingerprint(input: Pick<CreateBugReportInput, 'routeUrl' | 'description'>): string {
  const normalized = `${input.routeUrl.trim().toLowerCase()}|${input.description.trim().toLowerCase().replace(/\s+/g, ' ')}`;
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 24);
}

function enforceBugReportRateLimit(
  ip: string,
  userId: string | null | undefined,
  input: Pick<CreateBugReportInput, 'routeUrl' | 'description'>
): Response | null {
  const actorKeys = userId ? [`ip:${ip}`, `user:${userId}`] : [`ip:${ip}`];
  const fingerprint = buildBugReportFingerprint(input);

  if (actorKeys.some((key) => !publicBugReportDuplicateLimiter.check(`${key}:${fingerprint}`))) {
    return buildRateLimitedResponse(
      'Laporan bug serupa baru saja dikirim. Mohon tunggu 30 menit sebelum mengirim ulang.',
      1800
    );
  }
  if (actorKeys.some((key) => !publicBugReportCooldownLimiter.check(key))) {
    return buildRateLimitedResponse(
      'Mohon tunggu minimal 2 menit sebelum mengirim laporan bug berikutnya.',
      120
    );
  }
  if (actorKeys.some((key) => !publicBugReportLimiter.check(key))) {
    return buildRateLimitedResponse(
      'Batas 2 laporan bug per 15 menit tercapai. Silakan coba beberapa saat lagi.',
      900
    );
  }
  if (actorKeys.some((key) => !publicBugReportDailyLimiter.check(key))) {
    return buildRateLimitedResponse(
      'Batas harian 5 laporan bug per 24 jam telah tercapai.',
      86400
    );
  }
  return null;
}

const STATIC_ALLOWED_ORIGINS = new Set([
  'https://pinoka.id',
  'https://www.pinoka.id',
  'https://app.pinoka.id',
]);

function normalizeOrigin(rawUrl: string): string | null {
  if (!rawUrl) return null;
  try {
    return new URL(/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`).origin;
  } catch {
    return null;
  }
}

function isOriginAllowed(origin: string): boolean {
  if (!origin) return false;
  if (STATIC_ALLOWED_ORIGINS.has(origin)) return true;

  const configured = [
    readRuntimeEnv('BETTER_AUTH_URL'),
    readRuntimeEnv('PINOKA_LANDING_URL'),
    readRuntimeEnv('PUBLIC_LANDING_URL'),
    readRuntimeEnv('PUBLIC_SITE_URL'),
  ]
    .map(normalizeOrigin)
    .filter((v): v is string => Boolean(v));

  if (configured.includes(origin)) return true;

  if (!import.meta.env?.PROD || process.env.NODE_ENV === 'test') {
    return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
  }

  return false;
}

function buildCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') || '';
  if (!origin || !isOriginAllowed(origin)) {
    return {};
  }
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function withCors(response: Response, corsHeaders: Record<string, string>): Response {
  if (Object.keys(corsHeaders).length === 0) return response;
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(corsHeaders)) {
    headers.set(k, v);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const OPTIONS: APIRoute = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(request),
  });
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const corsHeaders = buildCorsHeaders(request);

  const response = await handleApiRoute(async () => {
    const ip = extractClientIp(request, clientAddress);

    if (!publicBugReportRequestLimiter.check(`bug-report:req:${ip}`)) {
      return buildRateLimitedResponse(
        'Terlalu banyak percobaan pengiriman dalam waktu singkat. Coba beberapa menit lagi.',
        300
      );
    }

    const body = await parseJsonBody(request);
    const validated = validate(CreateBugReportSchema, body);
    const user = await getAuthenticatedUser(request);

    const rateLimitResponse = enforceBugReportRateLimit(ip, user?.id, validated);
    if (rateLimitResponse) return rateLimitResponse;

    const fallbackUa = request.headers.get('user-agent') || 'unknown';

    const created = await createBugReport(
      validated,
      {
        userId: user?.id ?? null,
        email: user?.email ?? null,
        role: user?.role ?? 'public',
      },
      fallbackUa
    );

    return jsonSuccess(
      created,
      201,
      'Laporan bug berhasil dikirim. Terima kasih telah membantu meningkatkan Pinoka.'
    );
  });

  return withCors(response, corsHeaders);
};

