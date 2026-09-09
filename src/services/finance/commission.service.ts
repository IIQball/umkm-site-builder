import { db } from '@/lib/db/client';
import { platformSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '@/lib/utils';
import type { CommissionCalculation, PlatformSettings } from '@/types';

export type { CommissionCalculation, PlatformSettings };

export const DEFAULT_PLATFORM_FEE_PERCENTAGE = 30;
export const DEFAULT_ADMIN_SERVICE_FEE = 5000;
export const DEFAULT_SETTINGS = {
  platformFeePercentage: 30,
  adminServiceFee: 5000,
  payoutMinimumBalance: 50000,
  settlementDelayDays: 7,
};

/**
 * Retrieves the current active platform settings.
 */
export async function getPlatformSettings(
  dbClient: typeof db = db
): Promise<PlatformSettings> {
  const settingsList = await dbClient.select().from(platformSettings).limit(1);
  if (settingsList.length === 0) {
    return {
      id: '',
      ...DEFAULT_SETTINGS,
      updatedAt: new Date(),
      updatedBy: null,
    };
  }
  return settingsList[0];
}

/**
 * Updates the platform settings.
 */
export async function updatePlatformSettings(
  data: {
    platformFeePercentage: number;
    adminServiceFee?: number;
    payoutMinimumBalance?: number;
    settlementDelayDays?: number;
  },
  userId: string,
  dbClient: typeof db = db
): Promise<PlatformSettings> {
  if (data.platformFeePercentage < 0 || data.platformFeePercentage > 100) {
    throw new AppError('Platform fee percentage must be between 0% and 100%', 400, undefined, 'INVALID_PERCENTAGE');
  }
  if (data.adminServiceFee !== undefined && data.adminServiceFee < 0) {
    throw new AppError('Admin service fee cannot be negative', 400, undefined, 'INVALID_ADMIN_FEE');
  }
  if (data.settlementDelayDays !== undefined && data.settlementDelayDays < 0) {
    throw new AppError('Settlement delay days cannot be negative', 400, undefined, 'INVALID_DELAY_DAYS');
  }

  const existingList = await dbClient.select().from(platformSettings).limit(1);

  if (existingList.length === 0) {
    const [newRecord] = await dbClient
      .insert(platformSettings)
      .values({
        id: `ps_${Date.now()}`,
        platformFeePercentage: data.platformFeePercentage,
        adminServiceFee: data.adminServiceFee ?? DEFAULT_SETTINGS.adminServiceFee,
        payoutMinimumBalance: data.payoutMinimumBalance ?? DEFAULT_SETTINGS.payoutMinimumBalance,
        settlementDelayDays: data.settlementDelayDays ?? DEFAULT_SETTINGS.settlementDelayDays,
        updatedBy: userId,
        updatedAt: new Date(),
      })
      .returning();
    return newRecord;
  } else {
    const [updatedRecord] = await dbClient
      .update(platformSettings)
      .set({
        platformFeePercentage: data.platformFeePercentage,
        adminServiceFee: data.adminServiceFee !== undefined ? data.adminServiceFee : existingList[0].adminServiceFee,
        payoutMinimumBalance: data.payoutMinimumBalance !== undefined ? data.payoutMinimumBalance : existingList[0].payoutMinimumBalance,
        settlementDelayDays: data.settlementDelayDays !== undefined ? data.settlementDelayDays : existingList[0].settlementDelayDays,
        updatedBy: userId,
        updatedAt: new Date(),
      })
      .where(eq(platformSettings.id, existingList[0].id))
      .returning();
    return updatedRecord;
  }
}

/**
 * Retrieves the current active admin service fee from platform settings.
 *
 * @param dbClient Optional database client
 * @returns Active admin service fee (defaults to 5000)
 */
export async function getAdminServiceFee(
  dbClient: typeof db = db
): Promise<number> {
  try {
    const settings = await dbClient
      .select({
        adminServiceFee: platformSettings.adminServiceFee,
      })
      .from(platformSettings)
      .limit(1);

    if (settings.length > 0 && typeof settings[0].adminServiceFee === 'number') {
      return settings[0].adminServiceFee;
    }
  } catch {
    // Fallback to default if table is not seeded or query fails
  }

  return DEFAULT_ADMIN_SERVICE_FEE;
}

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
