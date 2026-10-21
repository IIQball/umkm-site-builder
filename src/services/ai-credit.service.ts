import { db } from '@/lib/db/client';
import { tenantAiCredits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '@/lib/utils/api-handler';

export interface AiCreditBalance {
  tenantId: string;
  balance: number;
  totalPurchased: number;
  totalUsed: number;
}

/**
 * Get AI credit balance for a tenant store.
 * Returns remaining credit saldo based on tenantId.
 */
export async function getAiCreditBalance(tenantId: string): Promise<AiCreditBalance> {
  const [credit] = await db
    .select({
      tenantId: tenantAiCredits.tenantId,
      balance: tenantAiCredits.balance,
      totalPurchased: tenantAiCredits.totalPurchased,
      totalUsed: tenantAiCredits.totalUsed,
    })
    .from(tenantAiCredits)
    .where(eq(tenantAiCredits.tenantId, tenantId));

  if (!credit) {
    throw new AppError(
      'Kredit AI toko tidak ditemukan',
      404,
      undefined,
      'AI_CREDIT_NOT_FOUND'
    );
  }

  return credit;
}

/**
 * Get or initialize AI credit record for tenant.
 * If not exists, creates with default balance = 2.
 */
export async function getOrInitializeAiCredit(tenantId: string): Promise<AiCreditBalance> {
  try {
    return await getAiCreditBalance(tenantId);
  } catch (error) {
    if (error instanceof AppError && error.code === 'AI_CREDIT_NOT_FOUND') {
      // Initialize with default balance
      await db.insert(tenantAiCredits).values({
        id: `aic_${crypto.randomUUID()}`,
        tenantId,
        balance: 2,
        totalPurchased: 0,
        totalUsed: 0,
      });

      return {
        tenantId,
        balance: 2,
        totalPurchased: 0,
        totalUsed: 0,
      };
    }
    throw error;
  }
}
