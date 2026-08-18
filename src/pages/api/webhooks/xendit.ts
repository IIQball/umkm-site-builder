/**
 * POST /api/webhooks/xendit
 * Receive payment confirmation webhooks from Xendit
 * Verified via HMAC-SHA256 signature
 */

import type { APIRoute } from 'astro';
import { xenditClient } from '@/lib/xendit';
import { paymentService } from '@/lib/payments/service';
import { XenditWebhookPayloadSchema } from '@/lib/payments/schemas';
import { z } from 'zod';

interface ResponseData {
  ok: boolean;
  data?: Record<string, any>;
  error?: {
    code: string;
    message: string;
  };
}

export const POST: APIRoute = async (context): Promise<Response> => {
  try {
    // Get raw body for signature verification
    const rawBody = await context.request.text();

    // Get signature from headers
    const signature = context.request.headers.get('x-xendit-callback-verification');

    if (!signature) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing signature',
          },
        } as ResponseData),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify webhook signature
    const isValid = xenditClient.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.warn('[Webhook] Invalid signature detected');
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid signature',
          },
        } as ResponseData),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse payload
    const payload = JSON.parse(rawBody);

    // Validate payload structure
    const validatedPayload = XenditWebhookPayloadSchema.parse(payload);

    // Process webhook
    await paymentService.processWebhook({
      id: validatedPayload.id,
      external_id: payload.external_id,
      amount: validatedPayload.amount,
      paid_amount: validatedPayload.paidAmount,
      status: validatedPayload.status,
      paid: validatedPayload.paid,
      paid_at: validatedPayload.paidAt,
      payment_method: validatedPayload.paymentMethod,
      payment_channel: validatedPayload.paymentChannel,
    });

    // Return success
    return new Response(
      JSON.stringify({
        ok: true,
        data: {},
      } as ResponseData),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[POST /api/webhooks/xendit]', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
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

    // Handle known errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('Payment record not found')) {
      // Don't fail webhook - Xendit will retry
      return new Response(
        JSON.stringify({
          ok: true,
          data: { warning: 'Payment record not found, will retry' },
        } as ResponseData),
        {
          status: 200,
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
