import { logger } from './logger';

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  try {
    const resendApiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      logger.error('RESEND_API_KEY tidak ditemukan di environment variables.');
      return false;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Domain onboarding@resend.dev hanya bisa mengirim ke email akun Resend Anda
        from: 'onboarding@resend.dev', 
        to: options.to,
        subject: 'Reset Password Akun UMKM Site Builder',
        html: options.html,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.error('Gagal mengirim email (Resend):', errorData);
      return false;
    }

    const data = await response.json();
    logger.info(`Email terkirim (Resend): ${data.id}`);
    return true;
  } catch (error) {
    logger.error('Terjadi kesalahan saat mengirim email:', error);
    return false;
  }
}
