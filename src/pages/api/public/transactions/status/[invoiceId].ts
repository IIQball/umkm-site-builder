import type { APIRoute } from 'astro';
import { transactionService } from '@/services';
import { formatCurrency } from '@/lib/utils/format';
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

    return jsonSuccess({
      invoiceId: transaction.externalId,
      status: transaction.status,
      amount: transaction.amount,
      amountFormatted: formatCurrency(transaction.amount),
      paymentMethod: transaction.paymentChannel,
      paymentUrl,
    }, 'Status transaksi berhasil diambil');
  });
};
