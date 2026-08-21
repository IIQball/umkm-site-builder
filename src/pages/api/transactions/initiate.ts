/**
 * POST /api/transactions/initiate
 * Initiate a transaction via Xendit. Requires authenticated session.
 */

import type { APIRoute } from 'astro';
import { transactionService } from '@/services';
import { TransactionInitiateInputSchema } from '@/schemas';
import { getAuthenticatedUser } from '@/lib/auth';
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
    const user = await getAuthenticatedUser(context.request);

    if (!user) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' },
        } as ResponseData),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (user.status !== 'active') {
      return new Response(
        JSON.stringify({
          ok: false,
          error: { code: 'FORBIDDEN', message: 'Account is suspended' },
        } as ResponseData),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json();
    const input = TransactionInitiateInputSchema.parse(body);

    const protocol = context.request.url.startsWith('https') ? 'https' : 'http';
    const host = context.request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    const result = await transactionService.initiateTransaction(user.id, input, baseUrl);

    return new Response(
      JSON.stringify({ ok: true, data: result } as ResponseData),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: { code: 'VALIDATION_ERROR', message: error.errors[0].message || 'Invalid input' },
        } as ResponseData),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('Invalid amount')) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: 'INVALID_STATE', message: 'Invalid payment amount' } } as ResponseData),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (errorMessage.includes('Payment already in progress')) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: 'INVALID_STATE', message: 'Payment already in progress' } } as ResponseData),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: false, error: { code: 'INTERNAL', message: 'Payment initiation failed' } } as ResponseData),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
