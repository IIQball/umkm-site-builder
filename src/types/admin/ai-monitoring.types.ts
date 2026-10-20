/**
 * AI Monitoring Domain Types
 * Used by Superadmin / Admin AI Monitoring Dashboard & APIs
 */

export interface AiStatusCounts {
  success: number;
  failed: number;
  pending: number;
  processing: number;
}

export interface AiMonitoringSummary {
  totalExecutions: number;
  totalCostIdr: number;
  totalCostUsd: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  statusCounts: AiStatusCounts;
  successRate: number;
  totalDepositUsd?: number;
  totalDepositIdr?: number;
  remainingDepositUsd?: number;
  remainingDepositIdr?: number;
  remainingTokens?: number;
  activeExchangeRate?: number;
}

export interface AiMonitoringRecentLog {
  id: string;
  featureType: string;
  modelUsed: string;
  status: string;
  costIdr: number;
  costUsd: number;
  inputTokens: number;
  outputTokens: number;
  creditsDeducted: number;
  errorMessage?: string | null;
  createdAt: string;
  storeName?: string | null;
  userName?: string | null;
}

export interface AiDepositHistoryItem {
  id: string;
  amountUsd: number;
  amountIdr: number;
  exchangeRate: number;
  description?: string | null;
  createdAt: string;
  createdByName?: string | null;
  createdByEmail?: string | null;
}

export interface AiMonitoringDashboardData {
  summary: AiMonitoringSummary;
  recentLogs: AiMonitoringRecentLog[];
  depositHistory?: AiDepositHistoryItem[];
}
