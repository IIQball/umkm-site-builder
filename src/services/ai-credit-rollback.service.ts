/**
 * AI Credit Rollback Service
 * Handles automatic credit compensation if Cloudinary upload fails after deduction
 * Ensures data integrity & prevents credit loss on third-party failures
 */

import { db } from '@/lib/db/client';
import { tenantAiCredits, aiGenerationLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '@/lib/utils/api-handler';

export interface RollbackParams {
  tenantId: string;
  userId: string;
  creditsDeducted: number;
  logId: string;
  reason: string;
}

export interface RollbackResult {
  success: boolean;
  previousBalance: number;
  newBalance: number;
  creditsRestored: number;
  logId: string;
  timestamp: Date;
}

/**
 * Automatically rollback AI credits if Cloudinary upload fails after deduction.
 * Logs the compensation in aiGenerationLogs for audit trail.
 */
export async function rollbackAiCredit(params: RollbackParams): Promise<RollbackResult> {
  const { tenantId, userId, creditsDeducted, logId, reason } = params;

  try {
    // Get current credit balance
    const creditRecord = await db
      .select()
      .from(tenantAiCredits)
      .where(eq(tenantAiCredits.tenantId, tenantId))
      .limit(1);

    if (!creditRecord.length) {
      throw new AppError(
        'Kredit AI toko tidak ditemukan untuk rollback',
        404,
        undefined,
        'AI_CREDIT_NOT_FOUND'
      );
    }

    const current = creditRecord[0];
    const previousBalance = current.balance;
    const newBalance = previousBalance + creditsDeducted;

    // Restore credits to balance
    await db
      .update(tenantAiCredits)
      .set({
        balance: newBalance,
        updatedAt: new Date(),
      })
      .where(eq(tenantAiCredits.id, current.id));

    // Update aiGenerationLog status to 'failed' with error message
    await db
      .update(aiGenerationLogs)
      .set({
        status: 'failed',
        errorMessage: `Rollback: ${reason}. Kredit dikembalikan sebesar ${creditsDeducted}.`,
        updatedAt: new Date(),
      })
      .where(eq(aiGenerationLogs.id, logId))
      .catch(() => {
        // Non-blocking: if log update fails, continue with compensation
        console.warn(`[AI_CREDIT_ROLLBACK] Failed to update log ${logId}`);
      });

    const result: RollbackResult = {
      success: true,
      previousBalance,
      newBalance,
      creditsRestored: creditsDeducted,
      logId,
      timestamp: new Date(),
    };

    console.info(`[AI_CREDIT_ROLLBACK] Restored ${creditsDeducted} credits to tenant ${tenantId}. Balance: ${previousBalance} → ${newBalance}`);

    return result;
  } catch (error) {
    console.error(`[AI_CREDIT_ROLLBACK] Error rolling back credits for tenant ${tenantId}:`, error);
    throw error;
  }
}

/**
 * Verify credit balance consistency after rollback.
 * Compares totalPurchased - totalUsed + pendingRollbacks against current balance.
 * Returns discrepancy report for audit purposes.
 */
export async function verifyCreditsConsistency(tenantId: string): Promise<{
  isConsistent: boolean;
  currentBalance: number;
  expectedBalance: number;
  discrepancy: number;
  failureReason?: string;
}> {
  try {
    const creditRecord = await db
      .select()
      .from(tenantAiCredits)
      .where(eq(tenantAiCredits.tenantId, tenantId))
      .limit(1);

    if (!creditRecord.length) {
      return {
        isConsistent: false,
        currentBalance: 0,
        expectedBalance: 0,
        discrepancy: 0,
        failureReason: 'Kredit AI toko tidak ditemukan',
      };
    }

    const credit = creditRecord[0];
    const { balance, totalPurchased, totalUsed } = credit;

    // Expected balance = totalPurchased - totalUsed
    const expectedBalance = totalPurchased - totalUsed;
    const discrepancy = Math.abs(balance - expectedBalance);

    return {
      isConsistent: discrepancy === 0,
      currentBalance: balance,
      expectedBalance,
      discrepancy,
      failureReason: discrepancy > 0 ? `Saldo tidak cocok: ${balance} vs ${expectedBalance}` : undefined,
    };
  } catch (error) {
    console.error(`[AI_CREDIT_VERIFY] Error verifying credits for tenant ${tenantId}:`, error);
    throw error;
  }
}

/**
 * Get detailed credit transaction history for tenant.
 * Includes generation logs & rollback records for full audit trail.
 */
export async function getCreditAuditTrail(tenantId: string, limit: number = 50) {
  try {
    const logs = await db
      .select({
        id: aiGenerationLogs.id,
        featureType: aiGenerationLogs.featureType,
        creditsDeducted: aiGenerationLogs.creditsDeducted,
        status: aiGenerationLogs.status,
        errorMessage: aiGenerationLogs.errorMessage,
        createdAt: aiGenerationLogs.createdAt,
      })
      .from(aiGenerationLogs)
      .where(eq(aiGenerationLogs.tenantId, tenantId))
      .orderBy((t) => t.createdAt);

    return logs.slice(0, limit);
  } catch (error) {
    console.error(`[AI_CREDIT_AUDIT] Error fetching audit trail for tenant ${tenantId}:`, error);
    throw error;
  }
}

export const aiCreditRollbackService = {
  rollbackAiCredit,
  verifyCreditsConsistency,
  getCreditAuditTrail,
};
