import nodemailer from 'nodemailer';
import { logger } from './logger';

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  try {
    const user = import.meta.env.SMTP_EMAIL || process.env.SMTP_EMAIL;
    const pass = import.meta.env.SMTP_PASSWORD || process.env.SMTP_PASSWORD;
    
    if (!user || !pass) {
      throw new Error('SMTP_EMAIL atau SMTP_PASSWORD tidak ditemukan di environment variables.');
    }

    const oldHttpProxy = process.env.http_proxy;
    const oldHttpsProxy = process.env.https_proxy;
    const oldHTTP_PROXY = process.env.HTTP_PROXY;
    const oldHTTPS_PROXY = process.env.HTTPS_PROXY;
    
    delete process.env.http_proxy;
    delete process.env.https_proxy;
    delete process.env.HTTP_PROXY;
    delete process.env.HTTPS_PROXY;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: `"UMKM Site Builder" <${user}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      logger.info(`Email terkirim (Nodemailer): ${info.messageId}`);
      return true;
    } finally {
      // Restore proxy variables AFTER connection and email sending is completely done
      if (oldHttpProxy !== undefined) process.env.http_proxy = oldHttpProxy;
      if (oldHttpsProxy !== undefined) process.env.https_proxy = oldHttpsProxy;
      if (oldHTTP_PROXY !== undefined) process.env.HTTP_PROXY = oldHTTP_PROXY;
      if (oldHTTPS_PROXY !== undefined) process.env.HTTPS_PROXY = oldHTTPS_PROXY;
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error('Terjadi kesalahan saat mengirim email:', err);
    throw err;
  }
}
