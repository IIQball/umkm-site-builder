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

  // Normalisasi akun legacy yang memiliki sisa bonus 2 kredit tanpa riwayat pembelian
  if (credit.totalPurchased === 0 && credit.totalUsed === 0 && credit.balance > 0) {
    await db
      .update(tenantAiCredits)
      .set({ balance: 0, updatedAt: new Date() })
      .where(eq(tenantAiCredits.tenantId, tenantId));
    credit.balance = 0;
  }

  return credit;
}

/**
 * Get or initialize AI credit record for tenant.
 * If not exists, creates with initial balance = 0 (prevents Sybil dummy account abuse).
 */
export async function getOrInitializeAiCredit(tenantId: string): Promise<AiCreditBalance> {
  try {
    return await getAiCreditBalance(tenantId);
  } catch (error) {
    if (error instanceof AppError && error.code === 'AI_CREDIT_NOT_FOUND') {
      // Initialize with 0 balance to protect against multi-account abuse
      await db.insert(tenantAiCredits).values({
        id: `aic_${crypto.randomUUID()}`,
        tenantId,
        balance: 0,
        totalPurchased: 0,
        totalUsed: 0,
      });

      return {
        tenantId,
        balance: 0,
        totalPurchased: 0,
        totalUsed: 0,
      };
    }
    throw error;
  }
}
