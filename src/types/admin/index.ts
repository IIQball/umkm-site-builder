/**
 * Admin Domain Types
 */

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: 'tenant' | 'designer';
  status: 'active' | 'suspended' | 'pending';
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

export interface AssistedStoreItem {
  id: string | null;
  name: string | null;
  subdomain: string | null;
  status: string | null;
  userId: string;
  createdAt: string;
  tenantName?: string | null;
  tenantEmail?: string | null;
  totalWaClicks?: number;
  totalViews?: number;
  owner?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  category?: {
    id: string;
    name: string;
  } | null;
}

