import { db } from '@/lib/db/client';
import { wallets, walletMutations } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { WalletOperationParams, WalletSummary } from '@/types';

export type { WalletOperationParams, WalletSummary };

type DbExecutor = typeof db;

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

  if (existingWallets.length > 0) {
    return existingWallets[0];
  }

  const walletId = `w_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const [newWallet] = await client
    .insert(wallets)
    .values({
      id: walletId,
      designerId,
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return newWallet;
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
    throw new Error('Credit amount must be positive');
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
    const [mutation] = await client
      .insert(walletMutations)
      .values({
        id: mutationId,
        walletId: wallet.id,
        type: 'CREDIT',
        amount,
        balanceAfter,
        description,
        referenceId: referenceId || null,
        createdAt: new Date(),
      })
      .returning();

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
    throw new Error('Debit amount must be positive');
  }

  const executeOperation = async (client: DbExecutor) => {
    const existingWallets = await client
      .select()
      .from(wallets)
      .where(eq(wallets.designerId, designerId))
      .limit(1);

    if (!existingWallets.length) {
      throw new Error('INSUFFICIENT_BALANCE');
    }

    const wallet = existingWallets[0];
    const currentBalance = Number(wallet.balance);

    if (currentBalance < amount) {
      throw new Error('INSUFFICIENT_BALANCE');
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
    const [mutation] = await client
      .insert(walletMutations)
      .values({
        id: mutationId,
        walletId: wallet.id,
        type: 'DEBIT',
        amount,
        balanceAfter,
        description,
        referenceId: referenceId || null,
        createdAt: new Date(),
      })
      .returning();

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
 * Retrieves current designer balance and ordered ledger history.
 */
export async function getDesignerWalletSummary(
  designerId: string,
  client: typeof db = db
): Promise<WalletSummary> {
  const existingWallets = await client
    .select()
    .from(wallets)
    .where(eq(wallets.designerId, designerId))
    .limit(1);

  if (!existingWallets.length) {
    return {
      designerId,
      balance: 0,
      walletId: null,
      mutations: [],
    };
  }

  const wallet = existingWallets[0];
  const mutations = await client
    .select()
    .from(walletMutations)
    .where(eq(walletMutations.walletId, wallet.id))
    .orderBy(desc(walletMutations.createdAt));

  return {
    designerId,
    balance: Number(wallet.balance),
    walletId: wallet.id,
    mutations: mutations.map((m: typeof walletMutations.$inferSelect) => ({
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
