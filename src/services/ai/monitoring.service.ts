import { db } from '@/lib/db/client';
import { aiGenerationLogs, stores, users } from '@/db/schema';
import { count, sql, desc, eq } from 'drizzle-orm';
import type {
  AiMonitoringSummary,
  AiMonitoringRecentLog,
  AiMonitoringDashboardData,
} from '@/types/admin/ai-monitoring.types';

/**
 * Calculates aggregated AI generation metrics directly in the database.
 * Single-pass query using SQL aggregations for maximum performance.
 */
export async function getAiMonitoringSummary(): Promise<AiMonitoringSummary> {
  const [row] = await db
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

  const totalExecutions = row?.totalExecutions || 0;
  const successCount = row?.successCount || 0;
  const failedCount = row?.failedCount || 0;
  const pendingCount = row?.pendingCount || 0;
  const processingCount = row?.processingCount || 0;
  const totalCostIdr = row?.totalCostIdr || 0;
  const totalCostUsd = row?.totalCostUsd || 0;
  const totalInputTokens = row?.totalInputTokens || 0;
  const totalOutputTokens = row?.totalOutputTokens || 0;
  const totalTokens = totalInputTokens + totalOutputTokens;

  const successRate =
    totalExecutions > 0 ? Number(((successCount / totalExecutions) * 100).toFixed(1)) : 0;

  return {
    totalExecutions,
    totalCostIdr,
    totalCostUsd,
    totalInputTokens,
    totalOutputTokens,
    totalTokens,
    statusCounts: {
      success: successCount,
      failed: failedCount,
      pending: pendingCount,
      processing: processingCount,
    },
    successRate,
  };
}

/**
 * Retrieves latest AI generation execution logs with joined store and user info.
 */
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
  }));
}

/**
 * Unified getter for initial dashboard rendering.
 */
export async function getAiMonitoringDashboardData(): Promise<AiMonitoringDashboardData> {
  const [summary, recentLogs] = await Promise.all([
    getAiMonitoringSummary(),
    getAiRecentLogs(10),
  ]);

  return {
    summary,
    recentLogs,
  };
}
