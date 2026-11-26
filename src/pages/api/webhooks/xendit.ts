import type { APIRoute } from 'astro';
import { XenditWebhookPayloadSchema } from '@/schemas';
import { transactionService, payoutService } from '@/services';
import { db } from '@/lib/db/client';
import { payoutRequests } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { handleApiRoute, jsonSuccess, validate, AppError, parseJsonBody, timingSafeEqualString } from '@/lib/utils';

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    // Read webhook secret safely without accessing removed Astro.locals.runtime.env
    const expectedToken = (
      (import.meta.env.XENDIT_WEBHOOK_SECRET as string | undefined) ||
      process.env.XENDIT_WEBHOOK_SECRET ||
      ''
    ).trim();

    // Get callback token from header
    const callbackToken = context.request.headers.get('x-callback-token');

    if (!expectedToken) {
      throw new AppError('Webhook secret not configured', 500);
    }

    if (!callbackToken) {
      throw new AppError('Missing callback token', 403);
    }

    // Verify callback token using constant-time comparison
    if (!timingSafeEqualString(callbackToken.trim(), expectedToken)) {
      throw new AppError('Invalid callback token', 403);
    }

    // Read body as validated JSON object
    const rawBody = await parseJsonBody<Record<string, unknown>>(context.request);
    const externalId = typeof rawBody.external_id === 'string' ? rawBody.external_id : '';

    if (!externalId) {
      throw new AppError('Missing external_id', 400);
    }

    const isDisbursement =
      Boolean(rawBody.status) &&
      ['COMPLETED', 'FAILED'].includes(String(rawBody.status).toUpperCase()) &&
      !rawBody.event;

    if (isDisbursement) {
      const query = db
        .select()
        .from(payoutRequests)
        .where(
          or(
            eq(payoutRequests.id, externalId),
            eq(payoutRequests.gatewayReference, externalId),
            eq(payoutRequests.xenditPayoutId, String(rawBody.id || ''))
          )
        );

      const existingPayout = (typeof (query as unknown as { limit?: (n: number) => Promise<unknown[]> }).limit === 'function')
        ? await query.limit(1)
        : await (query as unknown as Promise<unknown[]>);

      if (existingPayout && existingPayout.length > 0) {
        const payout = existingPayout[0] as typeof payoutRequests.$inferSelect;
        const status = String(rawBody.status).toUpperCase();

        await payoutService.processDisbursementWebhook({
          id: typeof rawBody.id === 'string' ? rawBody.id : undefined,
          external_id: payout.id,
          payoutRequestId: payout.id,
          status,
          failure_code: typeof rawBody.failure_code === 'string' ? rawBody.failure_code : undefined,
          failureCode: typeof rawBody.failure_code === 'string' ? rawBody.failure_code : undefined,
        });
      }

      return jsonSuccess({ received: true }, 200, 'Disbursement webhook processed');
    }

    const payload = validate(XenditWebhookPayloadSchema, rawBody);
    const result = await transactionService.processWebhook(payload);

    return jsonSuccess({ processed: true }, 200, result.message);
  });
};
