/**
 * POST /api/webhooks/xendit
 * Receive payment confirmation webhooks from Xendit Invoice
 * Verified via callback token (x-callback-token header)
 */

import type { APIRoute } from 'astro';
import { XenditWebhookPayloadSchema } from '@/schemas';
import { z } from 'zod';
import { transactionService } from '@/services';

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

    // Parse and validate payload
    const payload = XenditWebhookPayloadSchema.parse(await context.request.json());

    // Process webhook with business logic & fulfillment
    const result = await transactionService.processWebhook(payload);

    return new Response(
      JSON.stringify({
        ok: true,
        message: result.message,
      } as ResponseData),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0]?.message || 'Invalid payload',
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
          message: error instanceof Error ? error.message : 'Webhook processing failed',
        },
      } as ResponseData),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
