import type { APIRoute } from 'astro';
import { transactionService } from '@/services/finance';
import { handleApiRoute, jsonSuccess, AppError, timingSafeEqualString } from '@/lib/utils';

/**
 * Background Cron Job: Auto-expire pending transactions older than 24 hours.
 * Triggered by external schedulers (Cloudflare Cron Triggers, cron-job.org, GitHub Actions, etc.).
 *
 * Security: Requires header `x-cron-secret: <CRON_SECRET>` or `Authorization: Bearer <CRON_SECRET>`
 */
export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const cronSecret = (
      (import.meta.env.CRON_SECRET as string | undefined) ||
      process.env.CRON_SECRET ||
      ''
    ).trim();

    if (!cronSecret) {
      throw new AppError('CRON_SECRET is not configured on the server', 500);
    }

    const cronHeader = context.request.headers.get('x-cron-secret') || '';
    const authHeader = context.request.headers.get('authorization') || '';
    const bearerToken = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7).trim() : '';

    const isAuthorized =
      (cronHeader && timingSafeEqualString(cronHeader, cronSecret)) ||
      (bearerToken && timingSafeEqualString(bearerToken, cronSecret));

    if (!isAuthorized) {
      throw new AppError('Unauthorized: Invalid or missing cron secret', 401);
    }

    // Default max age: 24 hours (can be customized via query param `hours`, min 1h, max 72h)
    const url = new URL(context.request.url);
    const customHours = parseInt(url.searchParams.get('hours') || '24', 10);
    const maxHours = Number.isFinite(customHours) && customHours >= 1 && customHours <= 72 ? customHours : 24;

    const result = await transactionService.expireStalePendingTransactions(maxHours);

    return jsonSuccess(
      {
        ...result,
        maxHours,
        processedAt: new Date().toISOString(),
      },
      200,
      `Berhasil memperbarui ${result.expiredCount} transaksi pending kedaluwarsa`
    );
  });
};

// Also support GET for simple uptime/webcron pings with query param `?secret=...`
export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const cronSecret = (
      (import.meta.env.CRON_SECRET as string | undefined) ||
      process.env.CRON_SECRET ||
      ''
    ).trim();

    const url = new URL(context.request.url);
    const querySecret = url.searchParams.get('secret') || '';
    const cronHeader = context.request.headers.get('x-cron-secret') || '';

    const isAuthorized =
      Boolean(cronSecret) &&
      ((querySecret && timingSafeEqualString(querySecret, cronSecret)) ||
        (cronHeader && timingSafeEqualString(cronHeader, cronSecret)));

    if (!isAuthorized) {
      throw new AppError('Unauthorized: Invalid or missing cron secret', 401);
    }

    const result = await transactionService.expireStalePendingTransactions(24);
    return jsonSuccess(
      {
        ...result,
        processedAt: new Date().toISOString(),
      },
      200,
      `Berhasil memproses cron transaksi: ${result.expiredCount} transaksi kedaluwarsa`
    );
  });
};
