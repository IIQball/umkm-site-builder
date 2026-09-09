import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { withTransaction } from '@/lib/db/transaction';
import { wallets, walletMutations, payoutRequests, platformSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import { calculateEligibleBalance, createXenditDisbursement } from '@/services/finance';
import { payoutSchema } from '@/schemas';
import { handleApiRoute, validate, AppError, jsonSuccess } from '@/lib/utils';
import { formatIDR } from '@/lib/currency';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Akses desainer diperlukan', 401, undefined, 'UNAUTHORIZED');
    }

    const records = await db.query.payoutRequests.findMany({
      where: (payoutRequests, { eq }) => eq(payoutRequests.userId, user.id),
      with: {
        bankAccount: true,
      },
      orderBy: (payoutRequests, { desc }) => [desc(payoutRequests.createdAt)],
    });

    const settingsList = await db.select().from(platformSettings).limit(1);
    const minBalance = settingsList.length > 0 ? settingsList[0].payoutMinimumBalance : 50000;

    return jsonSuccess({
      payouts: records,
      minPayoutLimit: minBalance,
    });
  });
};

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Akses desainer diperlukan', 401, undefined);
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = validate(payoutSchema, body);
    const { amount, bankAccountId } = validated;

    // 1. Verify bank account exists and belongs to the designer
    const bankAcc = await db.query.bankAccounts.findFirst({
      where: (bankAccounts, { and, eq }) => and(eq(bankAccounts.id, bankAccountId), eq(bankAccounts.userId, user.id)),
    });
    if (!bankAcc) {
      throw new AppError('Rekening bank tidak ditemukan', 400, undefined, 'VALIDATION_ERROR');
    }

    // 2. Verify amount is >= payoutMinimumBalance
    const settingsList = await db.select().from(platformSettings).limit(1);
    const minBalance = settingsList.length > 0 ? settingsList[0].payoutMinimumBalance : 50000;
    if (amount < minBalance) {
      throw new AppError(`Nominal penarikan minimal ${formatIDR(minBalance)}`, 400, undefined, 'VALIDATION_ERROR');
    }

    // 3. Verify amount is <= eligible/available balance
    const eligibleBalance = await calculateEligibleBalance(user.id);
    if (amount > eligibleBalance) {
      throw new AppError('Saldo tersedia tidak mencukupi untuk melakukan penarikan', 400, undefined, 'VALIDATION_ERROR');
    }

    // 4. Run atomic database transaction
    let newPayout;
    try {
      newPayout = await withTransaction(async (tx) => {
        const walletList = await tx.select().from(wallets).where(eq(wallets.userId, user.id)).limit(1);
        if (walletList.length === 0) {
          throw new Error('WALLET_NOT_FOUND');
        }
        const wallet = walletList[0];
        const currentBalance = Number(wallet.balance);

        if (currentBalance < amount) {
          throw new Error('INSUFFICIENT_BALANCE');
        }

        // Check eligible balance inside transaction to avoid race conditions
        const txEligible = await calculateEligibleBalance(user.id, tx);
        if (amount > txEligible) {
          throw new Error('INSUFFICIENT_BALANCE');
        }

        const balanceAfter = currentBalance - amount;
        const availableBalanceAfter = txEligible - amount;

        // Update wallet balance and availableBalance
        await tx.update(wallets)
          .set({
            balance: balanceAfter,
            availableBalance: availableBalanceAfter,
            updatedAt: new Date(),
          })
          .where(eq(wallets.id, wallet.id));

        // Record DEBIT mutation
        const mutationId = `wmut_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        await tx.insert(walletMutations)
          .values({
            id: mutationId,
            walletId: wallet.id,
            type: 'DEBIT',
            amount,
            balanceAfter,
            description: `Penarikan dana ke ${bankAcc.bankName} (${bankAcc.accountNumber})`,
            createdAt: new Date(),
          });

        // Create payoutRequests record with status 'processing'
        const payoutId = `po_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const [record] = await tx.insert(payoutRequests)
          .values({
            id: payoutId,
            userId: user.id,
            bankAccountId,
            amount,
            status: 'processing',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return record;
      });
    } catch (txError) {
      if (txError instanceof Error && (txError.message === 'WALLET_NOT_FOUND' || txError.message === 'INSUFFICIENT_BALANCE')) {
        throw new AppError('Saldo tersedia tidak mencukupi', 400, undefined, 'VALIDATION_ERROR');
      }
      throw txError;
    }

    try {
      await createXenditDisbursement(newPayout.id);
    } catch (err) {
      console.error('Failed to initiate Xendit disbursement:', err);
    }

    return jsonSuccess(newPayout);
  });
};
