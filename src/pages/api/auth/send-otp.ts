import type { APIRoute } from 'astro';
import { db, verifications } from '@/db';
import { sendEmail } from '@/lib/utils/email';
import { eq, and, gt, desc } from 'drizzle-orm';
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

    // Send email
    const emailSent = await sendEmail({
      to: email,
      subject: 'Kode Verifikasi (OTP) - UMKM Site Builder',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #0f172a;">Kode Verifikasi Anda</h2>
          <p>Gunakan kode OTP berikut untuk melanjutkan registrasi akun UMKM Site Builder Anda:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2563eb; padding: 16px 0;">
            ${otp}
          </div>
          <p style="font-size: 13px; color: #64748b; margin-top: 24px;">Kode ini akan kedaluwarsa dalam 10 menit. Jika Anda tidak meminta kode ini, abaikan email ini.</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ ok: true, message: 'OTP terkirim' }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err.message || 'Kesalahan sistem' }), { status: 500 });
  }
};
