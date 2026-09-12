import { WorkerMailer } from 'worker-mailer';
import { config } from '@/lib/config/app';
import { logger } from './logger';

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// nodemailer's SMTP transport needs node:net/node:tls sockets, which Cloudflare Workers do not
// provide, so the connection hangs until the request times out. worker-mailer speaks SMTP over
// cloudflare:sockets instead. Port 465 is implicit TLS, 587 is plaintext upgraded via STARTTLS.
export async function sendEmail(options: SendEmailOptions) {
  const { host, port, user, pass } = config.email;

  if (!host || !user || !pass) {
    throw new Error('SMTP_HOST, SMTP_USER, atau SMTP_PASS tidak ditemukan di environment variables.');
  }

  try {
    await WorkerMailer.send(
      {
        host,
        port,
        secure: port === 465,
        startTls: port !== 465,
        credentials: { username: user, password: pass },
        authType: 'plain',
      },
      {
        from: { name: 'UMKM Site Builder', email: user },
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      },
    );

    logger.info(`Email terkirim (worker-mailer) ke ${options.to}`);
    return true;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error('Terjadi kesalahan saat mengirim email:', err);
    throw err;
  }
}
