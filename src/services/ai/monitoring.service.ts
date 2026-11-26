import { db } from '@/lib/db/client';
import { aiGenerationLogs, aiDepositHistory, stores, users } from '@/db/schema';
import { count, sql, desc, eq, and } from 'drizzle-orm';
import { getActiveExchangeRate } from './cost-calculator.service';
import type {
  AiMonitoringSummary,
  AiMonitoringRecentLog,
  AiMonitoringDashboardData,
} from '@/types/admin/ai-monitoring.types';
import {
  buildAiLogDateConditions,
  getAiLogs,
  getAiDepositHistory,
  getAiFeatureDistribution,
} from './monitoring.queries';

export { getAiLogs, getAiDepositHistory, getAiFeatureDistribution };
export type { FeatureDistributionFilter } from './monitoring.queries';

export interface GetAiMonitoringSummaryOptions {
  year?: number;
  month?: number | 'all';
  startDate?: Date;
  endDate?: Date;
}

export async function getAiMonitoringSummary(
  filter?: GetAiMonitoringSummaryOptions
): Promise<AiMonitoringSummary> {
  const logConditions = buildAiLogDateConditions(filter);

  const logsQuery = db
    .select({
      totalExecutions: count(aiGenerationLogs.id),
      totalCostIdr: sql<number>`coalesce(sum(${aiGenerationLogs.costIdr}), 0)`.mapWith(Number),
      totalCostUsd: sql<number>`coalesce(sum(${aiGenerationLogs.costUsd}), 0)`.mapWith(Number),
      totalInputTokens: sql<number>`coalesce(sum(${aiGenerationLogs.inputTokens}), 0)`.mapWith(Number),
      totalOutputTokens: sql<number>`coalesce(sum(${aiGenerationLogs.outputTokens}), 0)`.mapWith(Number),
      successCount: sql<number>`count(case when ${aiGenerationLogs.status} = 'success' then 1 end)`.mapWith(Number),
      failedCount: sql<number>`count(case when ${aiGenerationLogs.status} = 'failed' then 1 end)`.mapWith(Number),
      pendingCount: sql<number>`count(case when ${aiGenerationLogs.status} = 'pending' then 1 end)`.mapWith(Number),
      processingCount: sql<number>`count(case when ${aiGenerationLogs.status} = 'processing' then 1 end)`.mapWith(Number),
    })
    .from(aiGenerationLogs);

  const [logsResult, depositResult, activeExchangeRate] = await Promise.all([
    logConditions.length > 0 ? logsQuery.where(and(...logConditions)) : logsQuery,
    db
      .select({
        totalDepositUsd: sql<number>`coalesce(sum(${aiDepositHistory.amountUsd}), 0)`.mapWith(Number),
        totalDepositIdr: sql<number>`coalesce(sum(${aiDepositHistory.amountIdr}), 0)`.mapWith(Number),
      })
      .from(aiDepositHistory),
    getActiveExchangeRate(),
  ]);

  const [row] = logsResult;
  const [dep] = depositResult;

  const totalExecutions = row?.totalExecutions || 0;
  const successCount = row?.successCount || 0, failedCount = row?.failedCount || 0;
  const pendingCount = row?.pendingCount || 0, processingCount = row?.processingCount || 0;
  const totalCostIdr = row?.totalCostIdr || 0, totalCostUsd = row?.totalCostUsd || 0;
  const totalInputTokens = row?.totalInputTokens || 0, totalOutputTokens = row?.totalOutputTokens || 0;
  const totalDepositUsd = dep?.totalDepositUsd || 0, totalDepositIdr = dep?.totalDepositIdr || 0;

  const remainingDepositUsd = Math.max(0, Number((totalDepositUsd - totalCostUsd).toFixed(4)));
  const remainingDepositIdr = Math.max(0, Math.round(remainingDepositUsd * activeExchangeRate));
  const remainingTokens = Math.max(0, Math.round(remainingDepositUsd / 0.000010));
  const successRate =
    totalExecutions > 0 ? Number(((successCount / totalExecutions) * 100).toFixed(1)) : 0;

  return {
    totalExecutions,
    totalCostIdr,
    totalCostUsd,
    totalInputTokens,
    totalOutputTokens,
    totalTokens: totalInputTokens + totalOutputTokens,
    statusCounts: { success: successCount, failed: failedCount, pending: pendingCount, processing: processingCount },
    successRate,
    totalDepositUsd,
    totalDepositIdr,
    remainingDepositUsd,
    remainingDepositIdr,
    remainingTokens,
    activeExchangeRate,
  };
}

export async function getAiRecentLogs(limit = 10): Promise<AiMonitoringRecentLog[]> {
  const rows = await db
    .select({
      id: aiGenerationLogs.id,
      featureType: aiGenerationLogs.featureType,
      modelUsed: aiGenerationLogs.modelUsed,
      status: aiGenerationLogs.status,
      costIdr: aiGenerationLogs.costIdr,
      costUsd: aiGenerationLogs.costUsd,
      inputTokens: aiGenerationLogs.inputTokens,
      outputTokens: aiGenerationLogs.outputTokens,
      creditsDeducted: aiGenerationLogs.creditsDeducted,
      errorMessage: aiGenerationLogs.errorMessage,
      createdAt: aiGenerationLogs.createdAt,
      storeName: stores.name,
      userName: users.name,
      isTesting: aiGenerationLogs.isTesting,
      sizeRatio: aiGenerationLogs.sizeRatio,
      qualityTier: aiGenerationLogs.qualityTier,
    })
    .from(aiGenerationLogs)
    .leftJoin(stores, eq(aiGenerationLogs.tenantId, stores.id))
    .leftJoin(users, eq(aiGenerationLogs.userId, users.id))
    .orderBy(desc(aiGenerationLogs.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    featureType: r.featureType,
    modelUsed: r.modelUsed,
    status: r.status,
    costIdr: Number(r.costIdr || 0),
    costUsd: Number(r.costUsd || 0),
    inputTokens: Number(r.inputTokens || 0),
    outputTokens: Number(r.outputTokens || 0),
    creditsDeducted: Number(r.creditsDeducted || 1),
    errorMessage: r.errorMessage,
    createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
    storeName: r.storeName,
    userName: r.userName,
    isTesting: Boolean(r.isTesting),
    sizeRatio: r.sizeRatio,
    qualityTier: r.qualityTier,
  }));
}

export async function getAiMonitoringDashboardData(): Promise<AiMonitoringDashboardData> {
  const [summary, recentLogs, depositHistory, featureDistribution] = await Promise.all([
    getAiMonitoringSummary(),
    getAiRecentLogs(10),
    getAiDepositHistory(50),
    getAiFeatureDistribution(),
  ]);
  return { summary, recentLogs, depositHistory, featureDistribution };
}
