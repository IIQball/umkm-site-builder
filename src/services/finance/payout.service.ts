import { db } from '@/lib/db/client';
import { payoutRequests, wallets, walletMutations, bankAccounts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { xenditClient } from '@/lib/finance/xendit';
import { AppError } from '@/lib/utils';

export async function createXenditDisbursement(payoutRequestId: string): Promise<void> {
  const payoutList = await db
    .select()
    .from(payoutRequests)
    .where(eq(payoutRequests.id, payoutRequestId))
    .limit(1);

  if (payoutList.length === 0) {
    throw new AppError('Permintaan penarikan dana tidak ditemukan', 404, undefined, 'PAYOUT_NOT_FOUND');
  }
  const payout = payoutList[0];

  const bankAccList = await db
    .select()
    .from(bankAccounts)
    .where(eq(bankAccounts.id, payout.bankAccountId))
    .limit(1);

  if (bankAccList.length === 0) {
    throw new AppError('Rekening bank tidak ditemukan', 404, undefined, 'BANK_ACCOUNT_NOT_FOUND');
  }
  const bankAcc = bankAccList[0];

  try {
    const result = await xenditClient.createDisbursement({
      externalId: payout.id,
      amount: payout.amount,
      bankCode: bankAcc.bankName,
      accountHolderName: bankAcc.accountHolder,
      accountNumber: bankAcc.accountNumber,
      description: `Penarikan Dana Desainer - ${payout.id}`,
    });

    await db
      .update(payoutRequests)
      .set({
        xenditPayoutId: result.id,
        gatewayReference: result.externalId,
        updatedAt: new Date(),
      })
      .where(eq(payoutRequests.id, payout.id));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Disbursement creation failed';
    await db
      .update(payoutRequests)
      .set({
        gatewayMessage: errorMessage,
        updatedAt: new Date(),
      })
      .where(eq(payoutRequests.id, payout.id));
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(errorMessage, 400, undefined, 'XENDIT_DISBURSEMENT_ERROR');
  }
}

export async function processDisbursementWebhook(params: {
  payoutRequestId: string;
  status: string; // SUCCESS, FAILED, REJECTED
  failureCode?: string;
}): Promise<void> {
  const payoutList = await db
    .select()
    .from(payoutRequests)
    .where(eq(payoutRequests.id, params.payoutRequestId))
    .limit(1);

  if (payoutList.length === 0) {
    throw new AppError('Permintaan penarikan dana tidak ditemukan', 404, undefined, 'PAYOUT_NOT_FOUND');
  }
  const payout = payoutList[0];

  // If status is already completed or rejected, do nothing (idempotency)
  if (payout.status === 'completed' || payout.status === 'rejected') {
    return;
  }

  const normalizedStatus = params.status.toUpperCase();

  if (normalizedStatus === 'SUCCESS' || normalizedStatus === 'COMPLETED') {
    await db
      .update(payoutRequests)
      .set({
        status: 'completed',
        updatedAt: new Date(),
      })
      .where(eq(payoutRequests.id, payout.id));
  } else if (normalizedStatus === 'FAILED' || normalizedStatus === 'REJECTED') {
    // Run atomic transaction to update payoutRequest status and rollback wallet balance
    await db.transaction(async (tx) => {
      // 1. Update payoutRequest status to 'rejected'
      await tx
        .update(payoutRequests)
        .set({
          status: 'rejected',
          gatewayMessage: params.failureCode || 'Disbursement failed',
          updatedAt: new Date(),
        })
        .where(eq(payoutRequests.id, payout.id));

      // 2. Fetch the wallet
      const walletList = await tx
        .select()
        .from(wallets)
        .where(eq(wallets.designerId, payout.designerId))
        .limit(1);

      if (walletList.length === 0) {
        throw new AppError('Dompet desainer tidak ditemukan', 404, undefined, 'WALLET_NOT_FOUND');
      }
      const wallet = walletList[0];
      
      const newBalance = Number(wallet.balance) + payout.amount;
      const newAvailableBalance = Number(wallet.availableBalance) + payout.amount;

      // 3. Update wallet balance & availableBalance
      await tx
        .update(wallets)
        .set({
          balance: newBalance,
          availableBalance: newAvailableBalance,
          updatedAt: new Date(),
        })
        .where(eq(wallets.id, wallet.id));

      // 4. Record CREDIT mutation for rollback
      const mutationId = `wmut_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await tx
        .insert(walletMutations)
        .values({
          id: mutationId,
          walletId: wallet.id,
          type: 'CREDIT',
          amount: payout.amount,
          balanceAfter: newBalance,
          description: `Rollback penarikan dana gagal (${payout.id})`,
          createdAt: new Date(),
        });
    });
  }
}

export class PayoutService {
  async createXenditDisbursement(payoutRequestId: string): Promise<void> {
    return createXenditDisbursement(payoutRequestId);
  }
  async processDisbursementWebhook(params: {
    payoutRequestId: string;
    status: string;
    failureCode?: string;
  }): Promise<void> {
    return processDisbursementWebhook(params);
  }
}

export const payoutService = new PayoutService();
