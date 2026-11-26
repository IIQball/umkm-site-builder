import crypto from 'node:crypto';
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db, verifications } from '@/db';
import { sendEmail, getEmailLogoUrl } from '@/lib/utils/email';
import { buildOtpEmail } from '@/lib/auth/email-templates';
import { handleApiRoute, jsonError, jsonSuccess, parseJsonBody } from '@/lib/utils/api-handler';
import { InMemoryRateLimiter, extractClientIp } from '@/lib/utils/rate-limiter';

const sendOtpLimiter = new InMemoryRateLimiter(3, 60 * 1000);
const sendOtpIpLimiter = new InMemoryRateLimiter(15, 60 * 1000);

const SendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email tidak valid'),
});

export const POST: APIRoute = async ({ request, clientAddress }) => {
  return handleApiRoute(async () => {
    const body = await parseJsonBody<Record<string, unknown>>(request);
    const parsed = SendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError('Email tidak valid', 400, undefined, 'VALIDATION_ERROR');
    }

    const { email } = parsed.data;
    const ip = extractClientIp(request, clientAddress);

    if (!sendOtpLimiter.check(`send-otp:${email}`) || !sendOtpIpLimiter.check(`send-otp:ip:${ip}`)) {
      return jsonError('Terlalu sering meminta kode OTP. Coba lagi 1 menit lagi.', 429, undefined, 'RATE_LIMITED');
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.insert(verifications).values({
      id: `ver_${crypto.randomUUID()}`,
      identifier: email,
      value: otp,
      expiresAt,
    });

    const { subject, html } = buildOtpEmail({
      otp,
      safeLogoUrl: getEmailLogoUrl(),
    });

    await sendEmail({ to: email, subject, html });

    return jsonSuccess(null, 200, 'OTP terkirim');
  });
};
