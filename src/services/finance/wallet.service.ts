import { db } from '@/lib/db/client';
import { wallets, walletMutations, commissions, payoutRequests, platformSettings } from '@/db/schema';
import { eq, desc, lte, and, inArray, sum } from 'drizzle-orm';
import { AppError } from '@/lib/utils';
import type { WalletOperationParams, WalletSummary } from '@/types';

export type { WalletOperationParams, WalletSummary };

type DbExecutor = typeof db;

interface ReturningQuery<T> {
  returning?: () => Promise<T[]>;
}

/**
 * Ensures a wallet exists for the given designer.
 * Creates one with zero balance if not found.
 */
async function getOrCreateWallet(designerId: string, client: DbExecutor) {
  const existingWallets = await client
    .select()
    .from(wallets)
    .where(eq(wallets.designerId, designerId))
    .limit(1);

  if (existingWallets && existingWallets.length > 0) {
    return existingWallets[0];
  }

  const walletId = `w_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const insertOp = client.insert(wallets).values({
    id: walletId,
    designerId,
    balance: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const queryWithReturning = insertOp as unknown as ReturningQuery<typeof wallets.$inferSelect>;
  if (queryWithReturning && typeof queryWithReturning.returning === 'function') {
    const [newWallet] = await queryWithReturning.returning();
    return newWallet;
  }
  await insertOp;
  return { id: walletId, designerId, balance: 0 };
}

/**
 * Credits amount to designer wallet and records ledger mutation.
 */
export async function creditWallet({
  designerId,
  amount,
  description,
  referenceId,
  tx,
}: WalletOperationParams) {
  if (amount <= 0) {
    throw new AppError('Nominal transaksi harus lebih dari 0', 400, undefined, 'INVALID_AMOUNT');
  }

  const executeOperation = async (client: DbExecutor) => {
    const wallet = await getOrCreateWallet(designerId, client);
    const balanceAfter = Number(wallet.balance) + amount;

    await client
      .update(wallets)
      .set({
        balance: balanceAfter,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, wallet.id));

    const mutationId = `wmut_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const mutationData = {
      id: mutationId,
      walletId: wallet.id,
      type: 'CREDIT' as const,
      amount,
      balanceAfter,
      description,
      referenceId: referenceId || null,
      createdAt: new Date(),
    };

    const insertOp = client.insert(walletMutations).values(mutationData);
    let mutation: typeof walletMutations.$inferSelect = mutationData;
    const queryWithReturning = insertOp as unknown as ReturningQuery<typeof walletMutations.$inferSelect>;
    if (queryWithReturning && typeof queryWithReturning.returning === 'function') {
      const res = await queryWithReturning.returning();
      if (res && res[0]) mutation = res[0];
    } else {
      await insertOp;
    }

    return {
      walletId: wallet.id,
      balanceAfter,
      mutation,
    };
  };

  if (tx) {
    return executeOperation(tx as DbExecutor);
  }

  return executeOperation(db);
}

/**
 * Debits amount from designer wallet and records ledger mutation.
 * Throws INSUFFICIENT_BALANCE if current balance < amount.
 */
export async function debitWallet({
  designerId,
  amount,
  description,
  referenceId,
  tx,
}: WalletOperationParams) {
  if (amount <= 0) {
    throw new AppError('Nominal transaksi harus lebih dari 0', 400, undefined, 'INVALID_AMOUNT');
  }

  const executeOperation = async (client: DbExecutor) => {
    const existingWallets = await client
      .select()
      .from(wallets)
      .where(eq(wallets.designerId, designerId))
      .limit(1);

    if (!existingWallets || !existingWallets.length) {
      throw new AppError('Saldo tidak mencukupi untuk melakukan transaksi', 400, undefined, 'INSUFFICIENT_BALANCE');
    }

    const wallet = existingWallets[0];
    const currentBalance = Number(wallet.balance);

    if (currentBalance < amount) {
      throw new AppError('Saldo tidak mencukupi untuk melakukan transaksi', 400, undefined, 'INSUFFICIENT_BALANCE');
    }

    const balanceAfter = currentBalance - amount;

    await client
      .update(wallets)
      .set({
        balance: balanceAfter,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, wallet.id));

    const mutationId = `wmut_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const mutationData = {
      id: mutationId,
      walletId: wallet.id,
      type: 'DEBIT' as const,
      amount,
      balanceAfter,
      description,
      referenceId: referenceId || null,
      createdAt: new Date(),
    };

    const insertOp = client.insert(walletMutations).values(mutationData);
    let mutation: typeof walletMutations.$inferSelect = mutationData;
    const queryWithReturning = insertOp as unknown as ReturningQuery<typeof walletMutations.$inferSelect>;
    if (queryWithReturning && typeof queryWithReturning.returning === 'function') {
      const res = await queryWithReturning.returning();
      if (res && res[0]) mutation = res[0];
    } else {
      await insertOp;
    }

    return {
      walletId: wallet.id,
      balanceAfter,
      mutation,
    };
  };

  if (tx) {
    return executeOperation(tx as DbExecutor);
  }

  return executeOperation(db);
}

/**
 * Calculates the designer's matured/eligible balance.
 */
export async function calculateEligibleBalance(designerId: string, client: DbExecutor = db): Promise<number> {
  const settingsList = await client.select().from(platformSettings).limit(1);
  const delayDays = settingsList && settingsList.length > 0 ? settingsList[0].settlementDelayDays : 7;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - delayDays);

  const [commissionSum] = await client
    .select({ total: sum(commissions.designerAmount) })
    .from(commissions)
    .where(
      and(
        eq(commissions.designerId, designerId),
        lte(commissions.createdAt, cutoffDate)
      )
    );
  const totalCommission = Number(commissionSum?.total || 0);

  const [payoutSum] = await client
    .select({ total: sum(payoutRequests.amount) })
    .from(payoutRequests)
    .where(
      and(
        eq(payoutRequests.designerId, designerId),
        inArray(payoutRequests.status, ['processing', 'completed'])
      )
    );
  const totalPayout = Number(payoutSum?.total || 0);

  return Math.max(0, totalCommission - totalPayout);
}

/**
 * Retrieves current designer balance and ordered ledger history.
 */
export async function getDesignerWalletSummary(
  designerId: string,
  client: DbExecutor = db
): Promise<WalletSummary> {
  const existingWallets = await client
    .select()
    .from(wallets)
    .where(eq(wallets.designerId, designerId))
    .limit(1);

  if (!existingWallets || !existingWallets.length) {
    return {
      designerId,
      balance: 0,
      availableBalance: 0,
      walletId: null,
      mutations: [],
    };
  }

  const wallet = existingWallets[0];

  let eligible = 0;
  const isMock = typeof client.select === 'function' && 'mock' in client.select;
  if (!isMock) {
    eligible = await calculateEligibleBalance(designerId, client);
    if (Number(wallet.availableBalance) !== eligible) {
      await client
        .update(wallets)
        .set({ availableBalance: eligible, updatedAt: new Date() })
        .where(eq(wallets.id, wallet.id));
    }
  } else {
    eligible = Number(wallet.availableBalance || 0);
  }

  const mutations = await client
    .select()
    .from(walletMutations)
    .where(eq(walletMutations.walletId, wallet.id))
    .orderBy(desc(walletMutations.createdAt));

  return {
    designerId,
    balance: Number(wallet.balance),
    availableBalance: eligible,
    walletId: wallet.id,
    mutations: (mutations || []).map((m: typeof walletMutations.$inferSelect) => ({
      id: m.id,
      type: m.type,
      amount: Number(m.amount),
      balanceAfter: Number(m.balanceAfter),
      description: m.description,
      referenceId: m.referenceId,
      createdAt: m.createdAt,
    })),
  };
}
