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
  isTesting?: boolean;
  sizeRatio?: string | null;
  qualityTier?: string | null;
}

export interface AiAuditLogItem {
  id: string;
  isTesting: boolean;
  featureType: string;
  modelUsed: string;
  sizeRatio?: string | null;
  qualityTier?: string | null;
  promptFinal: string;
  inputTokens: number;
  outputTokens: number;
  creditsDeducted: number;
  costUsd: number;
  costIdr: number;
  cloudinaryUrl?: string | null;
  status: string;
  errorMessage?: string | null;
  createdAt: string;
  storeName?: string | null;
  userName?: string | null;
}

export interface GetAiLogsQueryOptions {
  isTesting?: boolean;
  page?: number;
  limit?: number;
  status?: string;
  featureType?: string;
  search?: string;
}

export interface AiLogsPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedAiLogsResponse {
  logs: AiAuditLogItem[];
  pagination: AiLogsPaginationMeta;
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

