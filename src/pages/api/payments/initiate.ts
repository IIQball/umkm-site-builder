/**
 * POST /api/payments/initiate
 * Initiate a payment via Xendit
 */

import type { APIRoute } from 'astro';
import { paymentService } from '@/lib/payments/service';
import { PaymentInitiateInputSchema } from '@/lib/payments/schemas';
import { z } from 'zod';

interface ResponseData {
  ok: boolean;
  data?: {
    invoiceId: string;
    paymentUrl: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export const POST: APIRoute = async (context): Promise<Response> => {
  try {
    // TODO: Add session verification here when auth is implemented
    // For now, extracting userId from header for testing
    const userId = context.request.headers.get('x-user-id');

    if (!userId) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Please log in to continue',
          },
        } as ResponseData),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse and validate input
    const body = await context.request.json();
    const input = PaymentInitiateInputSchema.parse(body);

    // Get base URL for redirect URLs
    const protocol = context.request.url.startsWith('https') ? 'https' : 'http';
    const host = context.request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    // Initiate payment
    const result = await paymentService.initiatePayment(userId, input, baseUrl);

    return new Response(
      JSON.stringify({
        ok: true,
        data: result,
      } as ResponseData),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[POST /api/payments/initiate]', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message || 'Invalid input',
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

    if (errorMessage.includes('Invalid amount')) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'INVALID_STATE',
            message: 'Invalid payment amount',
          },
        } as ResponseData),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (errorMessage.includes('Payment already in progress')) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'INVALID_STATE',
            message: 'Payment already in progress',
          },
        } as ResponseData),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generic error
    return new Response(
      JSON.stringify({
        ok: false,
        error: {
          code: 'INTERNAL',
          message: 'Payment initiation failed',
        },
      } as ResponseData),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
