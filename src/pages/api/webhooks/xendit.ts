/**
 * POST /api/webhooks/xendit
 * Receive payment confirmation webhooks from Xendit Invoice
 * Verified via callback token (x-callback-token header)
 */

import type { APIRoute } from 'astro';
import { XenditWebhookPayloadSchema } from '@/lib/transactions/schemas';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { transactions } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface ResponseData {
  ok: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export const POST: APIRoute = async (context): Promise<Response> => {
  try {
    // Read webhook secret with fallback chain (Cloudflare, import.meta.env, process.env)
    const expectedToken = (
      (context.locals as any)?.runtime?.env?.XENDIT_WEBHOOK_SECRET ||
      import.meta.env.XENDIT_WEBHOOK_SECRET ||
      process.env.XENDIT_WEBHOOK_SECRET ||
      ''
    ).trim();

    // Get callback token from header
    const callbackToken = context.request.headers.get('x-callback-token');

    console.log('[Webhook Xendit] Incoming request:', {
      callbackToken: callbackToken?.slice(0, 8) + '...',
      hasSecret: !!expectedToken,
      contentType: context.request.headers.get('content-type'),
    });

    if (!expectedToken) {
      console.error('[Webhook Xendit] XENDIT_WEBHOOK_SECRET not configured in any runtime source');
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'CONFIGURATION_ERROR',
            message: 'Webhook secret not configured',
          },
        } as ResponseData),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!callbackToken) {
      console.warn('[Webhook Xendit] Missing callback token header');
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Missing callback token',
          },
        } as ResponseData),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify callback token
    if (callbackToken.trim() !== expectedToken) {
      console.error('[Webhook Xendit] Token mismatch', {
        receivedLength: callbackToken.length,
        expectedLength: expectedToken.length,
      });
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid callback token',
          },
        } as ResponseData),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[Webhook Xendit] Token verified, parsing payload');

    // Parse and validate payload
    const payload = XenditWebhookPayloadSchema.parse(await context.request.json());

    console.log('[Webhook Xendit] Received event:', {
      external_id: payload.external_id,
      status: payload.status,
      id: payload.id,
    });

    // Handle Invoice payment callback
    const isPaid = payload.status === 'PAID' || payload.status === 'SETTLED';
    
    if (isPaid) {
      console.log('[Webhook Xendit] Processing payment success:', payload.external_id);

      // Update transaction status
      await db
        .update(transactions)
        .set({
          status: 'success',
          paymentChannel: payload.payment_channel || payload.payment_method || 'xendit',
          paymentGatewayRef: payload.id,
        })
        .where(eq(transactions.externalId, payload.external_id));

      console.log('[Webhook Xendit] Transaction updated for:', payload.external_id);
    } else if (payload.status === 'FAILED' || payload.status === 'EXPIRED') {
      console.log('[Webhook Xendit] Processing payment failure:', payload.external_id);

      // Update transaction status to failed/expired
      const failedStatus = payload.status === 'EXPIRED' ? 'expired' : 'failed';
      await db
        .update(transactions)
        .set({
          status: failedStatus,
          paymentGatewayRef: payload.id,
        })
        .where(eq(transactions.externalId, payload.external_id));

      console.log('[Webhook Xendit] Transaction marked as', failedStatus, ':', payload.external_id);
    }

    console.log('[Webhook Xendit] Processing complete');

    // Return success (200 OK)
    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Webhook processed successfully',
      } as ResponseData),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[Webhook Xendit] Error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      console.warn('[Webhook Xendit] Validation error:', error.errors[0]);
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message || 'Invalid payload',
          },
        } as ResponseData),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generic error - return 500 so Xendit retries
    return new Response(
      JSON.stringify({
        ok: false,
        error: {
          code: 'INTERNAL',
          message: 'Webhook processing failed',
        },
      } as ResponseData),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
