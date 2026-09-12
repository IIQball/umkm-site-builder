import type { APIRoute } from 'astro';
import { db, verifications } from '@/db';
import { eq, and, gt, desc } from 'drizzle-orm';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return new Response(JSON.stringify({ ok: false, error: 'Email dan OTP wajib diisi' }), { status: 400 });
    }

    // Verify OTP
    const validVerifications = await db.query.verifications.findMany({
      where: (v, { eq, and, gt }) => and(
        eq(v.identifier, email),
        eq(v.value, otp),
        gt(v.expiresAt, new Date())
      ),
      orderBy: (v, { desc }) => [desc(v.createdAt)],
      limit: 1
    });

    if (validVerifications.length === 0) {
      return new Response(JSON.stringify({ ok: false, error: 'Kode OTP tidak valid atau sudah kedaluwarsa' }), { status: 400 });
    }

    // Optionally we can delete the verification so it can't be reused immediately
    // but better-auth normally handles this or we can just leave it to expire.

    return new Response(JSON.stringify({ ok: true, message: 'OTP valid' }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err.message || 'Kesalahan sistem' }), { status: 500 });
  }
};
