import { db } from '@/lib/db/client';
import { platformSettings } from '@/db/schema';

import type { CommissionCalculation } from '@/types';

export type { CommissionCalculation };

export const DEFAULT_PLATFORM_FEE_PERCENTAGE = 30;

/**
 * Retrieves the current active platform fee percentage from platform settings.
 *
 * @param dbClient Optional database client
 * @returns Active platform fee percentage (defaults to 30)
 */
export async function getPlatformFeePercentage(
  dbClient: typeof db = db
): Promise<number> {
  try {
    const settings = await dbClient
      .select({
        platformFeePercentage: platformSettings.platformFeePercentage,
      })
      .from(platformSettings)
      .limit(1);

    if (settings.length > 0 && typeof settings[0].platformFeePercentage === 'number') {
      return settings[0].platformFeePercentage;
    }
  } catch {
    // Fallback to default if table is not seeded or query fails
  }

  return DEFAULT_PLATFORM_FEE_PERCENTAGE;
}

/**
 * Calculates platform fee and net designer commission based on platform settings.
 *
 * @param totalAmount Total transaction amount in integer (e.g. cents or IDR)
 * @param dbClient Optional database client (for dependency injection or transactions)
 * @returns Object with platformFee, designerAmount, and platformFeePercentage
 */
export async function calculateCommission(
  totalAmount: number,
  dbClient: typeof db = db
): Promise<CommissionCalculation> {
  const platformFeePercentage = await getPlatformFeePercentage(dbClient);
  const platformFee = Math.round((totalAmount * platformFeePercentage) / 100);
  const designerAmount = totalAmount - platformFee;

  return {
    platformFee,
    designerAmount,
    platformFeePercentage,
  };
}

