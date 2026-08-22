/**
 * Platform Commission & Fee Types
 */

export interface CommissionCalculation {
  platformFee: number;
  designerAmount: number;
  platformFeePercentage: number;
}

export interface PlatformSettings {
  id: string;
  platformFeePercentage: number;
  payoutMinimumBalance: number;
  settlementDelayDays: number;
  updatedAt: Date;
  updatedBy: string | null;
}
