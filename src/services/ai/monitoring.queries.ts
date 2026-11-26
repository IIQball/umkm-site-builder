import { db } from '@/lib/db/client';
import { aiGenerationLogs, aiDepositHistory, stores, users } from '@/db/schema';
import { count, sql, desc, eq, and, or, ilike, gte, lte, type SQL } from 'drizzle-orm';
import { getPeriodBounds } from '@/lib/utils/format';
import type {
  AiDepositHistoryItem,
  AiFeatureDistributionItem,
  AiFeatureDistributionData,
  AiAuditLogItem,
  GetAiLogsQueryOptions,
  PaginatedAiLogsResponse,
} from '@/types/admin/ai-monitoring.types';
import type { AiFeatureType } from '@/types/ai';
import type { aiFeatureTypeEnum } from '@/db/schema';

type AiFeatureTypeValue = (typeof aiFeatureTypeEnum.enumValues)[number];

export interface FeatureDistributionFilter {
  year?: number;
  month?: number | 'all';
  startDate?: Date;
  endDate?: Date;
}

const FEATURE_METADATA: Record<AiFeatureType, { label: string }> = {
  logo: { label: 'Logo UMKM' },
  packaging_mockup: { label: 'Kemasan Produk' },
  product_poster: { label: 'Poster Produk' },
};

export async function getAiLogs(
  options: GetAiLogsQueryOptions = {}
): Promise<PaginatedAiLogsResponse> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, Math.min(100, options.limit || 10));
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];
  if (typeof options.isTesting === 'boolean') {
    conditions.push(eq(aiGenerationLogs.isTesting, options.isTesting));
  }
  if (options.status && options.status !== 'all') {
    conditions.push(eq(aiGenerationLogs.status, options.status));
  }
  if (options.featureType && options.featureType !== 'all') {
    conditions.push(eq(aiGenerationLogs.featureType, options.featureType as AiFeatureTypeValue));
  }
  if (options.search && options.search.trim()) {
    const term = `%${options.search.trim().toLowerCase()}%`;
    conditions.push(
      or(
        ilike(aiGenerationLogs.id, term),
        ilike(aiGenerationLogs.modelUsed, term),
        ilike(aiGenerationLogs.promptFinal, term),
        ilike(stores.name, term),
        ilike(users.name, term)
      )!
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const countQuery = db
    .select({ total: count(aiGenerationLogs.id) })
    .from(aiGenerationLogs)
    .leftJoin(stores, eq(aiGenerationLogs.tenantId, stores.id))
    .leftJoin(users, eq(aiGenerationLogs.userId, users.id));

  const dataQuery = db
    .select({
      id: aiGenerationLogs.id,
      isTesting: aiGenerationLogs.isTesting,
      featureType: aiGenerationLogs.featureType,
      modelUsed: aiGenerationLogs.modelUsed,
      sizeRatio: aiGenerationLogs.sizeRatio,
      qualityTier: aiGenerationLogs.qualityTier,
      promptFinal: aiGenerationLogs.promptFinal,
      inputTokens: aiGenerationLogs.inputTokens,
      outputTokens: aiGenerationLogs.outputTokens,
      creditsDeducted: aiGenerationLogs.creditsDeducted,
      costUsd: aiGenerationLogs.costUsd,
      costIdr: aiGenerationLogs.costIdr,
      cloudinaryUrl: aiGenerationLogs.cloudinaryUrl,
      status: aiGenerationLogs.status,
      errorMessage: aiGenerationLogs.errorMessage,
      createdAt: aiGenerationLogs.createdAt,
      storeName: stores.name,
      userName: users.name,
    })
    .from(aiGenerationLogs)
    .leftJoin(stores, eq(aiGenerationLogs.tenantId, stores.id))
    .leftJoin(users, eq(aiGenerationLogs.userId, users.id))
    .orderBy(desc(aiGenerationLogs.createdAt))
    .limit(limit)
    .offset(offset);

  const [countResult, rows] = await Promise.all([
    whereClause ? countQuery.where(whereClause) : countQuery,
    whereClause ? dataQuery.where(whereClause) : dataQuery,
  ]);

  const total = Number(countResult?.[0]?.total || 0);
  const logs: AiAuditLogItem[] = rows.map((r) => ({
    id: r.id,
    isTesting: Boolean(r.isTesting),
    featureType: r.featureType,
    modelUsed: r.modelUsed,
    sizeRatio: r.sizeRatio,
    qualityTier: r.qualityTier,
    promptFinal: r.promptFinal,
    inputTokens: Number(r.inputTokens || 0),
    outputTokens: Number(r.outputTokens || 0),
    creditsDeducted: Number(r.creditsDeducted || 1),
    costUsd: Number(r.costUsd || 0),
    costIdr: Number(r.costIdr || 0),
    cloudinaryUrl: r.cloudinaryUrl,
    status: r.status,
    errorMessage: r.errorMessage,
    createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
    storeName: r.storeName,
    userName: r.userName,
  }));

  return {
    logs,
    pagination: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

export async function getAiDepositHistory(limit = 50): Promise<AiDepositHistoryItem[]> {
  const rows = await db
    .select({
      id: aiDepositHistory.id,
      amountUsd: aiDepositHistory.amountUsd,
      amountIdr: aiDepositHistory.amountIdr,
      exchangeRate: aiDepositHistory.exchangeRate,
      description: aiDepositHistory.description,
      createdAt: aiDepositHistory.createdAt,
      createdByName: users.name,
      createdByEmail: users.email,
    })
    .from(aiDepositHistory)
    .leftJoin(users, eq(aiDepositHistory.createdBy, users.id))
    .orderBy(desc(aiDepositHistory.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    amountUsd: Number(r.amountUsd || 0),
    amountIdr: Number(r.amountIdr || 0),
    exchangeRate: Number(r.exchangeRate || 0),
    description: r.description || null,
    createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
    createdByName: r.createdByName || 'Superadmin',
    createdByEmail: r.createdByEmail || null,
  }));
}

export function buildAiLogDateConditions(filter?: FeatureDistributionFilter): SQL[] {
  const conditions: SQL[] = [];
  if (filter?.year) {
    const { start, end } = getPeriodBounds(filter.year, filter.month ?? 'all');
    conditions.push(gte(aiGenerationLogs.createdAt, start), lte(aiGenerationLogs.createdAt, end));
  } else if (filter?.startDate && filter?.endDate) {
    conditions.push(gte(aiGenerationLogs.createdAt, filter.startDate), lte(aiGenerationLogs.createdAt, filter.endDate));
  }
  return conditions;
}

export async function getAiFeatureDistribution(
  filter?: FeatureDistributionFilter
): Promise<AiFeatureDistributionData> {
  const conditions = buildAiLogDateConditions(filter);

  const baseQuery = db
    .select({
      featureType: aiGenerationLogs.featureType,
      totalRequests: count(aiGenerationLogs.id),
      totalCostIdr: sql<number>`coalesce(sum(${aiGenerationLogs.costIdr}), 0)`.mapWith(Number),
      totalCostUsd: sql<number>`coalesce(sum(${aiGenerationLogs.costUsd}), 0)`.mapWith(Number),
      successRequests: sql<number>`count(case when ${aiGenerationLogs.status} = 'success' then 1 end)`.mapWith(Number),
    })
    .from(aiGenerationLogs);

  const rows = conditions.length > 0
    ? await baseQuery.where(and(...conditions)).groupBy(aiGenerationLogs.featureType)
    : await baseQuery.groupBy(aiGenerationLogs.featureType);

  const rowMap = new Map(
    rows.map((r) => [
      r.featureType,
      {
        totalRequests: Number(r.totalRequests || 0),
        totalCostIdr: Number(r.totalCostIdr || 0),
        totalCostUsd: Number(r.totalCostUsd || 0),
        successRequests: Number(r.successRequests || 0),
      },
    ])
  );

  const featureKeys: AiFeatureType[] = ['logo', 'packaging_mockup', 'product_poster'];
  let grandTotalRequests = 0;
  let grandTotalCostIdr = 0;
  let grandTotalCostUsd = 0;

  const rawItems = featureKeys.map((type) => {
    const row = rowMap.get(type);
    const totalRequests = row?.totalRequests || 0;
    const totalCostIdr = row?.totalCostIdr || 0;
    const totalCostUsd = row?.totalCostUsd || 0;
    grandTotalRequests += totalRequests;
    grandTotalCostIdr += totalCostIdr;
    grandTotalCostUsd += totalCostUsd;
    return {
      featureType: type,
      label: FEATURE_METADATA[type].label,
      totalRequests,
      successRequests: row?.successRequests || 0,
      totalCostIdr,
      totalCostUsd,
    };
  });

  const distribution: AiFeatureDistributionItem[] = rawItems.map((item) => ({
    ...item,
    requestPercentage: grandTotalRequests > 0 ? Number(((item.totalRequests / grandTotalRequests) * 100).toFixed(1)) : 0,
    costPercentage: grandTotalCostIdr > 0 ? Number(((item.totalCostIdr / grandTotalCostIdr) * 100).toFixed(1)) : 0,
  }));

  return {
    totalRequests: grandTotalRequests,
    totalCostIdr: grandTotalCostIdr,
    totalCostUsd: Number(grandTotalCostUsd.toFixed(4)),
    distribution,
  };
}

