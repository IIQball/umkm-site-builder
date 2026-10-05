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
      subject: 'Kode Verifikasi (OTP) - Pinoka',
      html: `
        <div style="background-color: #fafafa; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; line-height: 1.5;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="padding: 32px; border-bottom: 1px solid #eaeaea;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #171717; letter-spacing: -0.5px;">Kode Verifikasi (OTP)</h2>
              <p style="margin: 0 0 24px; font-size: 15px; color: #525252;">Halo,</p>
              <p style="margin: 0 0 24px; font-size: 15px; color: #525252;">Gunakan kode verifikasi berikut untuk melanjutkan proses di Pinoka. Kode ini bersifat rahasia.</p>
              <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #171717;">${otp}</span>
              </div>
              <p style="margin: 0; font-size: 14px; color: #737373;">Kode berlaku selama 10 menit.</p>
            </div>
            <div style="padding: 24px 32px; background-color: #fafafa;">
              <p style="margin: 0; font-size: 13px; color: #a3a3a3;">Jika Anda tidak meminta kode ini, Anda dapat mengabaikan email ini dengan aman.</p>
            </div>
          </div>
        </div>
      `,
    })

    return new Response(JSON.stringify({ ok: true, message: 'OTP terkirim' }), { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Kesalahan sistem'
    return new Response(JSON.stringify({ ok: false, error: message }), { status: 500 })
  }
};
