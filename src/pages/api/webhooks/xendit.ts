import type { APIRoute } from 'astro';
import { XenditWebhookPayloadSchema } from '@/schemas';
import { transactionService, payoutService } from '@/services';
import { db } from '@/lib/db/client';
import { payoutRequests } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { handleApiRoute, validate, AppError } from '@/lib/utils';

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    // Read webhook secret with fallback chain (Cloudflare, import.meta.env, process.env)
    const runtimeEnv = ((context.locals as unknown as Record<string, unknown>)?.runtime as Record<string, unknown>)?.env as Record<string, string> | undefined;
    const expectedToken = (
      runtimeEnv?.XENDIT_WEBHOOK_SECRET ||
      import.meta.env.XENDIT_WEBHOOK_SECRET ||
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

    // Verify callback token
    if (callbackToken.trim() !== expectedToken) {
      throw new AppError('Invalid callback token', 403);
    }

    // Read body as raw JSON
    const rawBody = await context.request.json();
    const externalId = rawBody.external_id;

    if (!externalId) {
      throw new AppError('Missing external_id', 400);
    }

    // Detect if payload is a Xendit Disbursement callback
    const isDisbursement =
      rawBody.status &&
      ['COMPLETED', 'FAILED'].includes(String(rawBody.status).toUpperCase()) &&
      !rawBody.event;

    if (isDisbursement) {
      const existingPayout = await db
        .select()
        .from(payoutRequests)
        .where(
          or(
            eq(payoutRequests.id, externalId),
            eq(payoutRequests.gatewayReference, externalId),
            eq(payoutRequests.xenditPayoutId, rawBody.id)
          )
        )
        .limit(1);

      if (existingPayout.length > 0) {
        const payout = existingPayout[0];
        const status = String(rawBody.status).toUpperCase();

        await payoutService.processDisbursementWebhook({
          payoutRequestId: payout.id,
          status,
          failureCode: rawBody.failure_code,
        });
      }

      return Response.json({
        received: true,
      }, { status: 200 });
    }

    // Parse and validate payload for invoice
    const payload = validate(XenditWebhookPayloadSchema, rawBody);

    // Process webhook with business logic & fulfillment
    const result = await transactionService.processWebhook(payload);

    return Response.json({
      success: true,
      ok: true,
      message: result.message,
    }, { status: 200 });
  });
};
