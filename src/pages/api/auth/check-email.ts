import { z } from 'zod';
import { db } from '@/db';
import type { APIRoute } from 'astro';
import { handleApiRoute, jsonError, jsonSuccess, parseJsonBody } from '@/lib/utils/api-handler';
import { InMemoryRateLimiter, extractClientIp } from '@/lib/utils/rate-limiter';

const checkEmailLimiter = new InMemoryRateLimiter(20, 60 * 1000);
const CheckEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email('Format email tidak valid.'),
});

export const POST: APIRoute = async ({ request, clientAddress }) => {
  return handleApiRoute(async () => {
    const ip = extractClientIp(request, clientAddress);
    if (!checkEmailLimiter.check(`check-email:ip:${ip}`)) {
      return jsonError('Terlalu banyak permintaan. Coba lagi 1 menit lagi.', 429, undefined, 'RATE_LIMITED');
    }

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const parsed = CheckEmailSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message || 'Format email wajib diisi.',
        400,
        { exists: false },
        'VALIDATION_ERROR'
      );
    }

    const { email } = parsed.data;

    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    });

    return jsonSuccess({ exists: Boolean(user) }, 200, 'Pemeriksaan email berhasil');
  });
};
