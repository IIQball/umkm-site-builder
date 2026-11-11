import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
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

    const validVerifications = await db.query.verifications.findMany({
      where: (v, { eq: eqFn, and, gt }) =>
        and(eqFn(v.identifier, email), eqFn(v.value, otp), gt(v.expiresAt, new Date())),
      orderBy: (v, { desc }) => [desc(v.createdAt)],
      limit: 1,
    });

    if (validVerifications.length === 0) {
      return jsonError('Kode OTP tidak valid atau sudah kedaluwarsa', 400, undefined, 'VALIDATION_ERROR');
    }

    await db.delete(verifications).where(eq(verifications.id, validVerifications[0].id));

    return jsonSuccess(null, 200, 'OTP valid');
  });
};
