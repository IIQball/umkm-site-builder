import nodemailer from 'nodemailer';
import { config } from '@/lib/config/app';
import { logger } from './logger';

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const { host, port, user, pass } = config.email;

  if (!host || !user || !pass) {
    throw new Error('SMTP_HOST, SMTP_USER, atau SMTP_PASS tidak ditemukan di environment variables.');
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: `"UMKM Site Builder" <${user}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    logger.info(`Email terkirim (Nodemailer): ${info.messageId}`);
    return true;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error('Terjadi kesalahan saat mengirim email:', err);
    throw err;
  }
}
