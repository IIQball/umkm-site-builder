import { escapeHtml } from '@/lib/utils/format';

interface ResetPasswordEmailParams {
  userName: string;
  userRole: string;
  finalUrl: string;
  safeLogoUrl: string;
  isActivation: boolean;
}

interface VerificationOtpEmailParams {
  userName: string;
  token: string;
  safeLogoUrl: string;
}

const ROLE_DISPLAY_MAP: Record<string, string> = {
  admin: 'Administrator',
  tenant: 'Pemilik Toko (Merchant)',
  designer: 'Desainer Template',
  superadmin: 'Super Administrator',
};

function renderEmailShell(safeLogoUrl: string, bodyHtml: string, footerNote: string): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #F8FAFC; margin: 0; padding: 48px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #090D16; padding: 36px 24px; text-align: center; border-bottom: 1px solid #1E293B;">
      <img src="${safeLogoUrl}" alt="Pinoka" style="height: 42px; max-width: 180px; object-fit: contain; display: inline-block; margin-bottom: 8px;" />
      <div style="color: #38BDF8; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">Platform Digital UMKM Banyuwangi</div>
    </div>
    <div style="padding: 40px 36px;">
      ${bodyHtml}
    </div>
    <div style="background-color: #FAFAFA; border-top: 1px solid #F1F5F9; padding: 24px 36px; text-align: center;">
      <p style="margin: 0 0 6px; font-size: 13px; color: #64748B;">Tim Support Pinoka siap membantu Anda. Hubungi kami di <a href="mailto:support@pinoka.id" style="color: #00A3EF; font-weight: 600; text-decoration: none;">support@pinoka.id</a></p>
      <p style="margin: 0; font-size: 12px; color: #94A3B8;">&copy; ${year} Pinoka. ${footerNote}</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Builds subject and HTML body for account activation or password recovery emails.
 */
export function buildResetOrActivationEmail(params: ResetPasswordEmailParams): { subject: string; html: string } {
  const safeName = escapeHtml(params.userName);
  const roleDisplay = ROLE_DISPLAY_MAP[params.userRole] || params.userRole;
  const isAdminOrSuper = params.userRole === 'admin' || params.userRole === 'superadmin';
  const isDesigner = params.userRole === 'designer';

  const portalDisplay = isAdminOrSuper
    ? 'Manajemen Pinoka'
    : isDesigner
      ? 'Desainer Template Pinoka'
      : 'Operasional Toko Digital Pinoka';

  let paragraphContent = '';
  if (isAdminOrSuper) {
    paragraphContent = `Akun Anda sebagai <strong style="color: #1E293B; font-weight: 600;">${escapeHtml(roleDisplay)}</strong> di portal <strong style="color: #1E293B; font-weight: 600;">${portalDisplay}</strong> telah berhasil disiapkan oleh tim kami. Untuk mulai memantau operasional dan mendampingi rekan-rekan UMKM, silakan selesaikan pengaturan akun Anda sekarang.`;
  } else if (isDesigner) {
    paragraphContent = `Akun Anda sebagai <strong style="color: #1E293B; font-weight: 600;">Desainer Template</strong> di portal <strong style="color: #1E293B; font-weight: 600;">${portalDisplay}</strong> telah berhasil disiapkan oleh tim kami. Untuk mulai merancang preset tampilan toko dan mendampingi rekan-rekan UMKM, silakan selesaikan pengaturan akun Anda sekarang.`;
  } else {
    paragraphContent = `Akun Anda sebagai <strong style="color: #1E293B; font-weight: 600;">Pemilik Toko (Merchant)</strong> di portal <strong style="color: #1E293B; font-weight: 600;">${portalDisplay}</strong> telah berhasil disiapkan oleh tim kami. Untuk mulai mengelola toko digital dan transaksi usaha Anda, silakan selesaikan pengaturan akun Anda sekarang.`;
  }

  const buttonText = params.isActivation ? 'Aktifkan Akun Saya' : 'Atur Ulang Kata Sandi Saya';
  const safeUrl = escapeHtml(params.finalUrl);

  const cardBodyHtml = params.isActivation
    ? `
      <h1 style="color: #0F172A; font-size: 24px; font-weight: 800; margin: 0 0 20px; letter-spacing: -0.5px; text-align: left;">Selamat datang di Pinoka!</h1>
      <p style="color: #475569; font-size: 15px; line-height: 1.625; margin: 0 0 24px;">
        Halo <strong style="color: #1E293B; font-weight: 600;">${safeName}</strong>,<br><br>
        ${paragraphContent}
      </p>
      <div style="text-align: center; margin-top: 24px; margin-bottom: 32px;">
        <a href="${safeUrl}" style="display: inline-block; background-color: #00A3EF; color: #ffffff; font-weight: 700; font-size: 15px; border-radius: 12px; padding: 14px 28px; text-decoration: none; box-shadow: 0 2px 4px rgba(0, 163, 239, 0.2);">${buttonText}</a>
      </div>
      <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; border-top-right-radius: 8px; border-bottom-right-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; font-size: 13px; color: #92400E; line-height: 1.5;">
          <strong>Catatan Keamanan:</strong> Tautan aktivasi ini bersifat rahasia dan berlaku selama 24 jam. Jangan bagikan email ini kepada siapa pun.
        </p>
      </div>
      <p style="margin: 0 0 8px; font-size: 12px; color: #64748B;">Tombol tidak berfungsi? Salin dan tempel tautan ini ke peramban Anda:</p>
      <a href="${safeUrl}" style="font-size: 12px; color: #00A3EF; word-break: break-all; text-decoration: underline;">${safeUrl}</a>
    `
    : `
      <h1 style="color: #0F172A; font-size: 24px; font-weight: 800; margin: 0 0 20px; letter-spacing: -0.5px; text-align: left;">Pemulihan Kata Sandi</h1>
      <p style="color: #475569; font-size: 15px; line-height: 1.625; margin: 0 0 24px;">
        Halo <strong style="color: #1E293B; font-weight: 600;">${safeName}</strong>,<br><br>
        Kami menerima permintaan untuk mengatur ulang kata sandi pada akun <strong style="color: #1E293B; font-weight: 600;">${escapeHtml(roleDisplay)}</strong> Anda. Jika permohonan ini berasal dari Anda, silakan selesaikan pengaturan kata sandi baru melalui tombol di bawah ini.
      </p>
      <div style="text-align: center; margin-top: 24px; margin-bottom: 32px;">
        <a href="${safeUrl}" style="display: inline-block; background-color: #00A3EF; color: #ffffff; font-weight: 700; font-size: 15px; border-radius: 12px; padding: 14px 28px; text-decoration: none; box-shadow: 0 2px 4px rgba(0, 163, 239, 0.2);">${buttonText}</a>
      </div>
      <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; border-top-right-radius: 8px; border-bottom-right-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; font-size: 13px; color: #92400E; line-height: 1.5;">
          <strong>Catatan Keamanan:</strong> Tautan pemulihan ini dienkripsi dan berlaku selama 24 jam. Jangan bagikan email ini kepada siapa pun.
        </p>
      </div>
      <p style="margin: 0 0 8px; font-size: 12px; color: #64748B;">Tombol tidak berfungsi? Salin dan tempel tautan ini ke peramban Anda:</p>
      <a href="${safeUrl}" style="font-size: 12px; color: #00A3EF; word-break: break-all; text-decoration: underline;">${safeUrl}</a>
    `;

  const subject = params.isActivation
    ? 'Undangan Aktivasi Akun Pinoka'
    : 'Pemulihan Akses Akun Pinoka Anda';

  return {
    subject,
    html: renderEmailShell(
      params.safeLogoUrl,
      cardBodyHtml,
      'Pesan ini dikirim otomatis oleh sistem, mohon tidak membalas.'
    ),
  };
}

/**
 * Builds subject and HTML body for registration OTP verification emails.
 */
export function buildVerificationOtpEmail(params: VerificationOtpEmailParams): { subject: string; html: string } {
  const safeName = escapeHtml(params.userName);
  const safeToken = escapeHtml(params.token);

  const bodyHtml = `
    <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">Konfirmasi Pendaftaran Akun</h2>
    <p style="margin: 0 0 16px; font-size: 14px; color: #334155; line-height: 1.6;">Halo Kak <strong>${safeName}</strong>,</p>
    <p style="margin: 0 0 16px; font-size: 14px; color: #334155; line-height: 1.6;">
      Terima kasih sudah mendaftar di Pinoka! Untuk memastikan ini benar-benar Kakak dan melanjutkan pendaftaran toko, silakan masukkan kode verifikasi berikut:
    </p>
    <div style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 28px 0; margin: 28px 0; text-align: center;">
      <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 38px; font-weight: 800; letter-spacing: 0.25em; color: #0284c7;">${safeToken}</span>
    </div>
    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #b45309;">Perhatian Keamanan:</p>
      <p style="margin: 0; font-size: 13px; color: #b45309; line-height: 1.5;">Kode verifikasi ini berlaku selama <strong>5 menit</strong> dan bersifat rahasia. Tim Pinoka tidak akan pernah meminta kode ini.</p>
    </div>
    <p style="margin: 0; font-size: 12px; color: #64748b;">Jika Kakak tidak merasa melakukan pendaftaran di Pinoka, abaikan saja email ini.</p>
  `;

  return {
    subject: 'Kode Verifikasi Akun Pinoka Anda',
    html: renderEmailShell(
      params.safeLogoUrl,
      bodyHtml,
      'Pinoka Indonesia. Seluruh hak dilindungi.'
    ),
  };
}

/**
 * Builds subject and HTML body for general OTP verification requests.
 */
export function buildOtpEmail(params: { otp: string; safeLogoUrl: string }): { subject: string; html: string } {
  const safeOtp = escapeHtml(params.otp);
  const bodyHtml = `
    <h1 style="color: #0F172A; font-size: 24px; font-weight: 800; margin: 0 0 20px; letter-spacing: -0.5px; text-align: left;">Kode Verifikasi (OTP)</h1>
    <p style="color: #475569; font-size: 15px; line-height: 1.625; margin: 0 0 24px;">
      Halo,<br><br>
      Gunakan 6 digit kode verifikasi berikut untuk melanjutkan proses verifikasi di Pinoka. Kode ini bersifat rahasia:
    </p>
    <div style="background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; padding: 24px 0; margin: 24px 0; text-align: center;">
      <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 36px; font-weight: 800; letter-spacing: 0.25em; color: #00A3EF;">${safeOtp}</span>
    </div>
    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; border-top-right-radius: 8px; border-bottom-right-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0; font-size: 13px; color: #92400E; line-height: 1.5;">
        <strong>Catatan Keamanan:</strong> Kode verifikasi ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapa pun.
      </p>
    </div>
    <p style="margin: 0; font-size: 12px; color: #64748B;">Jika Anda tidak merasa meminta kode ini, Anda dapat mengabaikan email ini dengan aman.</p>
  `;

  return {
    subject: 'Kode Verifikasi (OTP) - Pinoka',
    html: renderEmailShell(
      params.safeLogoUrl,
      bodyHtml,
      'Pesan ini dikirim otomatis oleh sistem, mohon tidak membalas.'
    ),
  };
}
