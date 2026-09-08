import { db } from '@/lib/db/client';
import { withTransaction } from '@/lib/db/transaction';
import { payoutRequests, bankAccounts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { xenditClient } from '@/lib/finance/xendit';
import { creditWallet } from '@/services/finance/wallet.service';
import { AppError } from '@/lib/utils';
import type { PayoutStatus, PayoutDisbursementResult, DbExecutor } from '@/types';


/**
 * Initiates payout request disbursement to Xendit.
 */
export async function createXenditDisbursement(payoutRequestId: string): Promise<void> {
  const [payout] = await db
    .select()
    .from(payoutRequests)
    .where(eq(payoutRequests.id, payoutRequestId))
    .limit(1);

  if (!payout) {
    throw new AppError('Payout request not found', 404, undefined, 'PAYOUT_NOT_FOUND');
  }

  const [bankAcc] = await db
    .select()
    .from(bankAccounts)
    .where(eq(bankAccounts.id, payout.bankAccountId))
    .limit(1);

  if (!bankAcc) {
    throw new AppError('Bank account not found', 404, undefined, 'BANK_ACCOUNT_NOT_FOUND');
  }

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

/**
 * Handles Xendit webhook callback for payout disbursements.
 */
export async function processDisbursementWebhook(payload: {
  id?: string;
  external_id?: string;
  payoutRequestId?: string;
  amount?: number;
  status: string;
  failureCode?: string;
  failure_code?: string;
  failure_message?: string;
  tx?: DbExecutor;
}): Promise<PayoutDisbursementResult> {
  const requestId = payload.payoutRequestId || payload.external_id || payload.id;
  if (!requestId) {
    return {
      status: 'ignored',
      message: 'Missing payout request identifier',
    };
  }

  const [payout] = await db
    .select()
    .from(payoutRequests)
    .where(eq(payoutRequests.id, requestId))
    .limit(1);

  if (!payout) {
    return {
      status: 'ignored',
      message: 'Payout request not found',
    };
  }

  const normalizedStatus = payload.status.toUpperCase();

  if (normalizedStatus === 'COMPLETED' || normalizedStatus === 'SUCCESS') {
    await db
      .update(payoutRequests)
      .set({
        status: 'completed' as PayoutStatus,
        updatedAt: new Date(),
      })
      .where(eq(payoutRequests.id, payout.id));

    return {
      status: 'completed',
      message: 'Payout disbursement processed successfully',
    };
  }

  if (normalizedStatus === 'FAILED' || normalizedStatus === 'REJECTED') {
    const reason = payload.failure_message || payload.failureCode || payload.failure_code || 'Disbursement failed on gateway';

    const executeRollback = async (client: DbExecutor) => {
      await client
        .update(payoutRequests)
        .set({
          status: 'rejected' as PayoutStatus,
          gatewayMessage: reason,
          updatedAt: new Date(),
        })
        .where(eq(payoutRequests.id, payout.id));

      await creditWallet({
        designerId: payout.designerId,
        amount: payout.amount,
        description: `Refund Penarikan Dana Gagal (Ref: ${payout.id})`,
        referenceId: payout.id,
        tx: client,
      });
    };

    if (payload.tx) {
      await executeRollback(payload.tx);
    } else {
      await withTransaction(async (tx) => {
        await executeRollback(tx);
      });
    }

    return {
      status: 'rejected',
      message: 'Payout disbursement failed and balance refunded',
    };
  }

  return {
    status: 'ignored',
    message: `Unhandled disbursement status: ${payload.status}`,
  };
}

export const payoutService = {
  createXenditDisbursement,
  processDisbursementWebhook,
};
