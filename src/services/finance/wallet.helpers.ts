import { db } from '@/lib/db/client';
import { wallets, commissions, payoutRequests, platformSettings } from '@/db/schema';
import { eq, lte, and, inArray, sum } from 'drizzle-orm';

export type DbExecutor = typeof db;

export interface ReturningQuery<T> {
  returning?: () => Promise<T[]>;
}

/**
 * Ensures a wallet exists for the given designer.
 * Creates one with zero balance if not found.
 */
export async function getOrCreateWallet(designerId: string, client: DbExecutor) {
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
