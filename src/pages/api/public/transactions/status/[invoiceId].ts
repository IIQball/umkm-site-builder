import type { APIRoute } from 'astro';
import { transactionService } from '@/services';
import { formatIDR } from '@/lib/currency';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const invoiceId = context.params.invoiceId;

    if (!invoiceId) {
      throw new AppError('Missing invoice ID', 400);
    }

    const transaction = await transactionService.getTransactionDetails(invoiceId);

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    // Fetch payment URL if pending
    let paymentUrl: string | undefined;
    if (transaction.status === 'pending') {
      paymentUrl = await transactionService.getInvoiceUrl(transaction.externalId) || undefined;
    }

    const adminFee = Number(transaction.adminFee || 0);
    const baseAmount = Math.max(0, transaction.amount - adminFee);

    return jsonSuccess({
      invoiceId: transaction.externalId,
      status: transaction.status,
      amount: transaction.amount,
      amountFormatted: formatIDR(transaction.amount),
      baseAmount,
      adminFee,
      paymentMethod: transaction.paymentChannel,
      paymentUrl,
    });
  });
};
