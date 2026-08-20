/**
 * GET /api/transactions/status/[invoiceId]
 * Get current transaction status for checkout page
 */

import type { APIRoute } from 'astro';
import { transactionService } from '@/services/transaction.service';
import { formatCurrency } from '@/lib/utils/format';

interface ResponseData {
  ok: boolean;
  data?: {
    invoiceId: string;
    status: 'pending' | 'success' | 'failed' | 'expired' | 'canceled' | 'refunded';
    amount: number;
    amountFormatted: string;
    paymentMethod?: string;
    paymentUrl?: string;
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

     // Get transaction details
     const transaction = await transactionService.getTransactionDetails(invoiceId);

    if (!transaction) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Transaction not found',
          },
        } as ResponseData),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch payment URL if pending
    let paymentUrl: string | undefined;
    if (transaction.status === 'pending') {
      paymentUrl = await transactionService.getInvoiceUrl(transaction.externalId) || undefined;
    }

    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          invoiceId: transaction.externalId,
          status: transaction.status,
          amount: transaction.amount,
          amountFormatted: formatCurrency(Math.round(transaction.amount * 100)),
          paymentMethod: transaction.paymentChannel,
          paymentUrl,
        },
      } as ResponseData),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
   } catch {
     return new Response(
      JSON.stringify({
        ok: false,
        error: {
          code: 'INTERNAL',
          message: 'Failed to fetch transaction status',
        },
      } as ResponseData),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
