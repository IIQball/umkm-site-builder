import { db } from '@/lib/db/client';
import { platformSettings } from '@/db/schema';

import type { CommissionCalculation } from '@/types';

export type { CommissionCalculation };

export const DEFAULT_PLATFORM_FEE_PERCENTAGE = 30;

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
  let platformFeePercentage = DEFAULT_PLATFORM_FEE_PERCENTAGE;

  try {
    const settings = await dbClient
      .select({
        platformFeePercentage: platformSettings.platformFeePercentage,
      })
      .from(platformSettings)
      .limit(1);

    if (settings.length > 0 && typeof settings[0].platformFeePercentage === 'number') {
      platformFeePercentage = settings[0].platformFeePercentage;
    }
  } catch {
    // Fallback to default if table is not seeded or query fails
    platformFeePercentage = DEFAULT_PLATFORM_FEE_PERCENTAGE;
  }

  const platformFee = Math.round((totalAmount * platformFeePercentage) / 100);
  const designerAmount = totalAmount - platformFee;

  return {
    platformFee,
    designerAmount,
    platformFeePercentage,
  };
}
