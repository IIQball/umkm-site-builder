import { db } from '@/lib/db/client';
import { transactions, tenantAiCredits, stores, users } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { formatIDR } from '@/lib/currency';
import type {
  TenantCreditReconciliation,
  ReconciliationReport,
  InvoiceReconciliationItem,
} from '@/types';

/**
 * Calculates credit quota granted from invoice amount or metadata.
 * Mirrors the production fulfillment algorithm.
 */
export function calculateCreditsFromInvoice(tx: {
  amount: number;
  metadata?: { credits?: number } | null;
}): number {
  if (tx.metadata?.credits && typeof tx.metadata.credits === 'number' && tx.metadata.credits > 0) {
    return tx.metadata.credits;
  }
  if (tx.amount === 15000) return 6;
  if (tx.amount === 25000) return 12;
  if (tx.amount === 50000) return 30;
  return Math.max(1, Math.floor(tx.amount / 5000));
}

/**
 * Reconciles AI credit ledger for a specific tenant or store.
 * Compares all SUCCESSFUL Xendit invoices against tenant_ai_credits.total_purchased and balance.
 */
export async function reconcileTenantCredits(
  tenantId: string,
  database = db
): Promise<TenantCreditReconciliation> {
  const [creditRecord] = await database
    .select()
    .from(tenantAiCredits)
    .where(or(eq(tenantAiCredits.tenantId, tenantId), eq(tenantAiCredits.userId, tenantId)))
    .limit(1);

  const [store] = await database
    .select({
      id: stores.id,
      name: stores.name,
      userId: stores.userId,
    })
    .from(stores)
    .where(eq(stores.id, tenantId))
    .limit(1);

  const userId = creditRecord?.userId || store?.userId || tenantId;

  const [owner] = await database
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  // Fetch all successful AI credit purchase transactions
  const successfulTxList = await database
    .select({
      id: transactions.id,
      externalId: transactions.externalId,
      amount: transactions.amount,
      status: transactions.status,
      paymentChannel: transactions.paymentChannel,
      createdAt: transactions.createdAt,
    })
    .from(transactions)
    .where(
      and(
        or(
          eq(transactions.storeId, tenantId),
          eq(transactions.userId, userId)
        ),
        eq(transactions.type, 'ai_credit_purchase'),
        eq(transactions.status, 'success')
      )
    );

  let calculatedPurchasedCredits = 0;
  let totalPaidAmount = 0;

  const invoices: InvoiceReconciliationItem[] = successfulTxList.map((tx) => {
    const credits = calculateCreditsFromInvoice({ amount: tx.amount });
    calculatedPurchasedCredits += credits;
    totalPaidAmount += tx.amount;

    return {
      id: tx.id,
      externalId: tx.externalId,
      amount: tx.amount,
      amountFormatted: formatIDR(tx.amount),
      status: tx.status,
      paymentChannel: tx.paymentChannel || null,
      creditsGranted: credits,
      createdAt: tx.createdAt,
    };
  });

  const totalPurchasedInDb = creditRecord?.totalPurchased || 0;
  const currentBalance = creditRecord?.balance || 0;
  const totalUsedInDb = creditRecord?.totalUsed || 0;
  const discrepancy = calculatedPurchasedCredits - totalPurchasedInDb;
  const isBalanced = discrepancy === 0;

  return {
    tenantId,
    userId,
    storeName: store?.name || null,
    ownerEmail: owner?.email || null,
    currentBalance,
    totalPurchasedInDb,
    totalUsedInDb,
    calculatedPurchasedCredits,
    totalPaidAmount,
    totalPaidAmountFormatted: formatIDR(totalPaidAmount),
    successfulInvoicesCount: invoices.length,
    invoices,
    isBalanced,
    discrepancy,
  };
}

/**
 * Audit reconciles all tenant AI credit records against invoice ledger.
 */
export async function reconcileAllCredits(database = db): Promise<ReconciliationReport> {
  const allCredits = await database.select().from(tenantAiCredits);

  const results: TenantCreditReconciliation[] = [];
  let totalRevenueIdr = 0;
  let totalCreditsPurchased = 0;
  let balancedTenantsCount = 0;
  let discrepantTenantsCount = 0;

  for (const credit of allCredits) {
    const report = await reconcileTenantCredits(credit.tenantId, database);
    results.push(report);

    totalRevenueIdr += report.totalPaidAmount;
    totalCreditsPurchased += report.calculatedPurchasedCredits;

    if (report.isBalanced) {
      balancedTenantsCount++;
    } else {
      discrepantTenantsCount++;
    }
  }

  return {
    generatedAt: new Date(),
    totalTenantsChecked: results.length,
    balancedTenantsCount,
    discrepantTenantsCount,
    totalRevenueIdr,
    totalRevenueIdrFormatted: formatIDR(totalRevenueIdr),
    totalCreditsPurchased,
    tenants: results,
  };
}
