/**
 * GET /api/payments/status/[invoiceId]
 * Get current payment status for checkout page
 */

import type { APIRoute } from 'astro';
import { paymentService } from '@/lib/payments/service';

interface ResponseData {
  ok: boolean;
  data?: {
    invoiceId: string;
    status: 'pending' | 'completed' | 'failed';
    amount: number;
    amountFormatted: string;
    paymentMethod?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export const GET: APIRoute = async (context): Promise<Response> => {
  try {
    const invoiceId = context.params.invoiceId;

    if (!invoiceId) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing invoice ID',
          },
        } as ResponseData),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get payment details
    const payment = await paymentService.getPaymentDetails(invoiceId);

    if (!payment) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Payment not found',
          },
        } as ResponseData),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          invoiceId: payment.metadata?.invoiceId || invoiceId,
          status: payment.status as 'pending' | 'completed' | 'failed',
          amount: payment.amount,
          amountFormatted: paymentService.formatCurrency(Math.round(payment.amount * 100)),
          paymentMethod: payment.metadata?.method,
        },
      } as ResponseData),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[GET /api/payments/status]', error);

    return new Response(
      JSON.stringify({
        ok: false,
        error: {
          code: 'INTERNAL',
          message: 'Failed to fetch payment status',
        },
      } as ResponseData),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
