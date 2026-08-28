/**
 * Admin Domain Types
 */

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: 'tenant' | 'designer';
  status: 'active' | 'suspended';
  suspendReason: string | null;
  createdAt: string;
}

export interface AdminWhitelistItem {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'superadmin';
  createdAt: string;
}

export interface CommissionSettingsData {
  platformFeePercentage: number;
  designerCommissionPercentage: number;
  settlementDelayDays: number;
  payoutMinimumBalance: number;
}
