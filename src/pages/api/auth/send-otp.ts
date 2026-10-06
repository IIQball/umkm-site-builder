import type { APIRoute } from 'astro';
import { db, verifications } from '@/db';
import { sendEmail, getEmailLogoUrl } from '@/lib/utils/email';
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

    const safeLogoUrl = getEmailLogoUrl();

    await sendEmail({
      to: email,
      subject: 'Kode Verifikasi (OTP) - Pinoka',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #F8FAFC; margin: 0; padding: 48px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <!-- CARD CONTAINER -->
  <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
    
    <!-- HEADER BAR (Dark #090D16 background merges logo.webp seamlessly with NO black border box) -->
    <div style="background-color: #090D16; padding: 36px 24px; text-align: center; border-bottom: 1px solid #1E293B;">
      <img src="${safeLogoUrl}" alt="Pinoka" style="height: 42px; max-width: 180px; object-fit: contain; display: inline-block; margin-bottom: 8px;" />
      <div style="color: #38BDF8; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">Platform Digital UMKM Indonesia</div>
    </div>

    <!-- MAIN CONTENT -->
    <div style="padding: 40px 36px;">
      <h1 style="color: #0F172A; font-size: 24px; font-weight: 800; margin: 0 0 20px; letter-spacing: -0.5px; text-align: left;">Kode Verifikasi (OTP)</h1>
      <p style="color: #475569; font-size: 15px; line-height: 1.625; margin: 0 0 24px;">
        Halo,<br><br>
        Gunakan 6 digit kode verifikasi berikut untuk melanjutkan proses verifikasi di Pinoka. Kode ini bersifat rahasia:
      </p>
      
      <div style="background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; padding: 24px 0; margin: 24px 0; text-align: center;">
        <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 36px; font-weight: 800; letter-spacing: 0.25em; color: #00A3EF;">${otp}</span>
      </div>

      <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; border-top-right-radius: 8px; border-bottom-right-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; font-size: 13px; color: #92400E; line-height: 1.5;">
          <strong>Catatan Keamanan:</strong> Kode verifikasi ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapa pun.
        </p>
      </div>

      <p style="margin: 0; font-size: 12px; color: #64748B;">Jika Anda tidak merasa meminta kode ini, Anda dapat mengabaikan email ini dengan aman.</p>
    </div>

    <!-- FOOTER -->
    <div style="background-color: #FAFAFA; border-top: 1px solid #F1F5F9; padding: 24px 36px; text-align: center;">
      <p style="margin: 0 0 6px; font-size: 13px; color: #64748B;">Tim Support Pinoka siap membantu Anda. Hubungi kami di <a href="mailto:support@pinoka.id" style="color: #00A3EF; font-weight: 600; text-decoration: none;">support@pinoka.id</a></p>
      <p style="margin: 0; font-size: 12px; color: #94A3B8;">&copy; ${new Date().getFullYear()} Pinoka. Pesan ini dikirim otomatis oleh sistem, mohon tidak membalas.</p>
    </div>

  </div>

</body>
</html>
      `,
    })

    return new Response(JSON.stringify({ ok: true, message: 'OTP terkirim' }), { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Kesalahan sistem'
    return new Response(JSON.stringify({ ok: false, error: message }), { status: 500 })
  }
};
