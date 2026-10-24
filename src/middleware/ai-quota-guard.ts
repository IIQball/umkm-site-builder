import { db } from '@/db';
import { tenantAiCredits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '@/lib/utils/api-handler';

/**
 * Cost weight mapping for different AI features.
 * Maps feature type to credit cost (weight).
 */
export const AI_FEATURE_CREDIT_WEIGHTS: Record<string, number> = {
  logo: 1,
  packaging_mockup: 2,
  product_poster: 1,
};

export interface QuotaCheckResult {
  hasEnoughCredit: boolean;
  currentBalance: number;
  requiredCredit: number;
  featureType: string;
}

/**
 * Check if tenant has sufficient AI credit balance.
 * Validates credit balance before allowing AI generation request.
 *
 * @param tenantId - The store/tenant ID
 * @param featureType - The AI feature type (logo, packaging_mockup, product_poster)
 * @returns QuotaCheckResult with balance info
 * @throws AppError if tenant credit record not found or insufficient balance
 */
export async function checkAiQuotaGuard(
  tenantId: string,
  featureType: string
): Promise<QuotaCheckResult> {
  // Get credit cost weight for feature type
  const requiredCredit = AI_FEATURE_CREDIT_WEIGHTS[featureType] ?? 1;

  // Fetch current balance from database
  const [credit] = await db
    .select({
      balance: tenantAiCredits.balance,
    })
    .from(tenantAiCredits)
    .where(eq(tenantAiCredits.tenantId, tenantId));

  if (!credit) {
    throw new AppError(
      'Kredit AI toko tidak ditemukan. Hubungi administrator.',
      404,
      { tenantId, featureType },
      'AI_CREDIT_NOT_FOUND'
    );
  }

  const currentBalance = credit.balance;
  const hasEnoughCredit = currentBalance >= requiredCredit;

  if (!hasEnoughCredit) {
    throw new AppError(
      `Saldo kredit AI tidak cukup. Diperlukan ${requiredCredit} poin, tapi hanya tersedia ${currentBalance} poin.`,
      402,
      {
        tenantId,
        featureType,
        currentBalance,
        requiredCredit,
      },
      'INSUFFICIENT_AI_CREDITS'
    );
  }

  return {
    hasEnoughCredit: true,
    currentBalance,
    requiredCredit,
    featureType,
  };
}

/**
 * Deduct AI credit from tenant balance after successful generation.
 * Should only be called AFTER generation succeeds and is logged.
 *
 * @param tenantId - The store/tenant ID
 * @param creditsToDeduct - Number of credits to deduct
 * @throws AppError if deduction fails
 */
export async function deductAiCredit(
  tenantId: string,
  creditsToDeduct: number
): Promise<number> {
  const [credit] = await db
    .select({
      balance: tenantAiCredits.balance,
      totalUsed: tenantAiCredits.totalUsed,
    })
    .from(tenantAiCredits)
    .where(eq(tenantAiCredits.tenantId, tenantId));

  if (!credit) {
    throw new AppError(
      'Kredit AI toko tidak ditemukan',
      404,
      { tenantId },
      'AI_CREDIT_NOT_FOUND'
    );
  }

  const newBalance = Math.max(0, credit.balance - creditsToDeduct);
  const newTotalUsed = credit.totalUsed + creditsToDeduct;

  await db
    .update(tenantAiCredits)
    .set({
      balance: newBalance,
      totalUsed: newTotalUsed,
      updatedAt: new Date(),
    })
    .where(eq(tenantAiCredits.tenantId, tenantId));

  return newBalance;
}

/**
 * Get remaining AI credit balance without modification.
 * Used for frontend display.
 *
 * @param tenantId - The store/tenant ID
 * @returns Current balance or 0 if not found
 */
export async function getAiCreditBalance(tenantId: string): Promise<number> {
  const [credit] = await db
    .select({
      balance: tenantAiCredits.balance,
    })
    .from(tenantAiCredits)
    .where(eq(tenantAiCredits.tenantId, tenantId));

  return credit?.balance ?? 0;
}
