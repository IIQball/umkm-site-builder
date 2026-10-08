import type { APIRoute } from 'astro';
import { db } from '@/db'

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Kesalahan sistem'
    return new Response(JSON.stringify({ ok: false, error: message }), { status: 500 })
  }
};
