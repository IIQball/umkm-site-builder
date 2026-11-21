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
  adminServiceFee: number;
  payoutMinimumBalance: number;
  settlementDelayDays: number;
  maxStoreBranches: number;
  maxTemplateRevisions?: number;
  contactPhone?: string;
  contactEmail?: string;
  updatedAt: Date;
  updatedBy: string | null;
}
