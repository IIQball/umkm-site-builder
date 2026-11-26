/**
 * AI Cost Trends & Quota Usage Types
 * Used by Superadmin / Admin AI Monitoring Dashboard & APIs
 */

export interface AiDailyCostPoint {
  date: string;
  label: string;
  costIdr: number;
  costUsd: number;
  tokens: number;
  executionCount: number;
  successCount: number;
  failedCount: number;
}

export interface AiCostTrendsSummary {
  totalSpentIdr: number;
  totalSpentUsd: number;
  monthlyDepositLimitIdr: number;
  monthlyDepositLimitUsd: number;
  remainingDepositIdr: number;
  remainingDepositUsd: number;
  budgetUsedPercentage: number;
  costPerPercentUsageIdr: number;
  costPerPercentUsageUsd: number;
  averageDailyCostIdr: number;
  peakDailyCostIdr: number;
  totalTokens: number;
  totalExecutions: number;
  days: number;
}

export interface AiCostTrendsData {
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
  summary: AiCostTrendsSummary;
  dailyTrends: AiDailyCostPoint[];
}
