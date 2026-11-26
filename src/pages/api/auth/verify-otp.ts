import type { APIRoute } from 'astro';
import { and, eq, gt } from 'drizzle-orm';
import { z } from 'zod';
import { db, verifications } from '@/db';
import { handleApiRoute, jsonError, jsonSuccess, parseJsonBody } from '@/lib/utils/api-handler';
import { InMemoryRateLimiter } from '@/lib/utils/rate-limiter';

export const verifyOtpLimiter = new InMemoryRateLimiter(5, 60 * 1000);

const VerifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email tidak valid'),
  otp: z.string().trim().min(1, 'OTP wajib diisi'),
});

export const POST: APIRoute = async ({ request }) => {
  return handleApiRoute(async () => {
    const body = await parseJsonBody<Record<string, unknown>>(request);
    const parsed = VerifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError('Email dan OTP wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    const { email, otp } = parsed.data;

    if (!verifyOtpLimiter.check(`verify-otp:${email}`)) {
      return jsonError('Terlalu banyak percobaan OTP. Silakan tunggu 1 menit.', 429, undefined, 'RATE_LIMITED');
    }

    const consumed = await db.delete(verifications).where(and(
      eq(verifications.identifier, email), eq(verifications.value, otp), gt(verifications.expiresAt, new Date())
    )).returning({ id: verifications.id });
    if (!consumed.length) {
      return jsonError('Kode OTP tidak valid atau sudah kedaluwarsa', 400, undefined, 'VALIDATION_ERROR');
    }
    const proof = crypto.randomUUID() + crypto.randomUUID();
    await db.insert(verifications).values({
      id: `ver_${crypto.randomUUID()}`,
      identifier: `signup:${email}`,
      value: proof,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    return jsonSuccess({ proof }, 200, 'OTP valid');
  });
};
