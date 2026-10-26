export interface TopTenantAiItem {
  rank: number;
  tenantId: string;
  storeName: string;
  subdomain: string;
  ownerName: string;
  ownerEmail: string;
  totalGenerations: number;
  successGenerations: number;
  failedGenerations: number;
  successRate: number;
  totalCostIdr: number;
  totalCostUsd: number;
  totalTokens: number;
  creditsUsed: number;
  creditBalance: number;
  lastActiveAt: string | null;
}

export interface TopTenantsAiSummary {
  totalTenants: number;
  totalCostIdr: number;
  totalCostUsd: number;
  totalGenerations: number;
  totalTokens: number;
}

export interface TopTenantsAiResponse {
  summary: TopTenantsAiSummary;
  sortBy: 'cost' | 'generations';
  order: 'desc' | 'asc';
  limit: number;
  period: {
    days?: number;
    year?: number;
    month?: number | 'all';
  };
  tenants: TopTenantAiItem[];
}

export interface GetTopTenantsAiOptions {
  limit?: number;
  sortBy?: 'cost' | 'generations';
  order?: 'desc' | 'asc';
  days?: number;
  year?: number;
  month?: number | 'all';
  isTesting?: boolean;
}
