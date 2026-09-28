import type { APIRoute } from 'astro';
import { db, verifications } from '@/db';
import { sendEmail } from '@/lib/utils/email';
import { z } from 'zod';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !z.string().email().safeParse(email).success) {
      return new Response(JSON.stringify({ ok: false, error: 'Email tidak valid' }), { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store in DB
    await db.insert(verifications).values({
      id: `ver_${crypto.randomUUID()}`,
      identifier: email,
      value: otp,
      expiresAt,
    });

    await sendEmail({
      to: email,
      subject: 'Kode Verifikasi (OTP) - UMKM Site Builder',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #0f172a;">Kode Verifikasi Anda</h2>
          <p>Gunakan kode OTP berikut untuk melanjutkan registrasi akun UMKM Site Builder Anda:</p>
          <div style="${['font-size: 32px', 'font-weight: bold', 'letter-spacing: 4px', 'color: #36C6FD', 'padding: 16px 0'].join(String.fromCharCode(59) + ' ')}">
            ${otp}
          </div>
          <p style="font-size: 13px; color: #64748b; margin-top: 24px;">Kode ini akan kedaluwarsa dalam 10 menit. Jika Anda tidak meminta kode ini, abaikan email ini.</p>
        </div>
      `,
    })

    return new Response(JSON.stringify({ ok: true, message: 'OTP terkirim' }), { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Kesalahan sistem'
    return new Response(JSON.stringify({ ok: false, error: message }), { status: 500 })
  }
};
