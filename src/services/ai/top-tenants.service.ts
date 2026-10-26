import { db } from '@/lib/db/client';
import { aiGenerationLogs, stores, users, tenantAiCredits } from '@/db/schema';
import { sql, count, desc, asc, and, eq, gte, lte, isNotNull, inArray } from 'drizzle-orm';
import { getPeriodBounds } from '@/lib/utils/format';
import type {
  TopTenantAiItem,
  TopTenantsAiResponse,
  GetTopTenantsAiOptions,
  TopTenantsAiSummary,
} from '@/types/admin/ai-top-tenants.types';

/**
 * Calculates percentage safely with zero-division protection and rounding.
 */
export function calculateSafePercentage(numerator: number, denominator: number): number {
  if (!denominator || denominator <= 0 || !Number.isFinite(denominator) || !numerator || numerator <= 0) {
    return 0;
  }
  const pct = (numerator / denominator) * 100;
  return Number.isFinite(pct) ? Number(pct.toFixed(1)) : 0;
}

/**
 * Builds date boundary condition for filtering AI generation logs using shared getPeriodBounds SSOT.
 */
export function buildDateConditions(options: {
  days?: number;
  year?: number;
  month?: number | 'all';
}) {
  const conditions = [];

  if (options.days && options.days > 0) {
    const startDate = new Date(Date.now() - options.days * 86400000);
    conditions.push(gte(aiGenerationLogs.createdAt, startDate));
  } else if (options.year) {
    const { start, end } = getPeriodBounds(options.year, options.month || 'all');
    conditions.push(gte(aiGenerationLogs.createdAt, start), lte(aiGenerationLogs.createdAt, end));
  }

  return conditions;
}

/**
 * Fetches ranked top tenants by AI API cost absorption and generation count.
 * Uses indexed grouping on tenant_id for maximum query performance.
 */
export async function getTopTenantsAi(
  options: GetTopTenantsAiOptions = {}
): Promise<TopTenantsAiResponse> {
  const limit = Math.max(1, Math.min(100, options.limit || 10));
  const sortBy = options.sortBy === 'generations' ? 'generations' : 'cost';
  const order = options.order === 'asc' ? 'asc' : 'desc';
  const isTesting = options.isTesting ?? false;

  // 1. Build base filters (indexed on isTesting and createdAt)
  const baseConditions = [
    isNotNull(aiGenerationLogs.tenantId),
    eq(aiGenerationLogs.isTesting, isTesting),
    ...buildDateConditions(options),
  ];

  // 2. Aggregate metrics directly grouped by tenant_id (uses index ai_generation_logs_tenant_id_idx)
  const costSumSql = sql<number>`coalesce(sum(${aiGenerationLogs.costIdr}), 0)`.mapWith(Number);
  const costUsdSumSql = sql<number>`coalesce(sum(${aiGenerationLogs.costUsd}), 0)`.mapWith(Number);
  const countSql = count(aiGenerationLogs.id);

  const orderClause =
    sortBy === 'generations'
      ? [order === 'asc' ? asc(countSql) : desc(countSql), desc(costSumSql)]
      : [order === 'asc' ? asc(costSumSql) : desc(costSumSql), desc(countSql)];

  const aggregatedRows = await db
    .select({
      tenantId: sql<string>`${aiGenerationLogs.tenantId}`.as('tenant_id'),
      totalGenerations: countSql,
      successGenerations: sql<number>`count(case when ${aiGenerationLogs.status} = 'success' then 1 end)`.mapWith(Number),
      failedGenerations: sql<number>`count(case when ${aiGenerationLogs.status} = 'failed' then 1 end)`.mapWith(Number),
      totalCostIdr: costSumSql,
      totalCostUsd: costUsdSumSql,
      totalTokens: sql<number>`coalesce(sum(${aiGenerationLogs.inputTokens} + ${aiGenerationLogs.outputTokens}), 0)`.mapWith(Number),
      creditsUsed: sql<number>`coalesce(sum(${aiGenerationLogs.creditsDeducted}), 0)`.mapWith(Number),
      lastActiveAt: sql<Date | null>`max(${aiGenerationLogs.createdAt})`,
    })
    .from(aiGenerationLogs)
    .where(and(...baseConditions))
    .groupBy(aiGenerationLogs.tenantId)
    .orderBy(...orderClause)
    .limit(limit);

  if (aggregatedRows.length === 0) {
    return {
      summary: {
        totalTenants: 0,
        totalCostIdr: 0,
        totalCostUsd: 0,
        totalGenerations: 0,
        totalTokens: 0,
      },
      sortBy,
      order,
      limit,
      period: {
        days: options.days,
        year: options.year,
        month: options.month,
      },
      tenants: [],
    };
  }

  // 3. Batch fetch store, owner, and credit balance details for returned tenants
  const tenantIds = aggregatedRows.map((r) => r.tenantId).filter(Boolean);

  const storeRows = tenantIds.length > 0
    ? await db
        .select({
          storeId: stores.id,
          storeName: stores.name,
          subdomain: stores.subdomain,
          ownerName: users.name,
          ownerEmail: users.email,
          creditBalance: tenantAiCredits.balance,
        })
        .from(stores)
        .leftJoin(users, eq(stores.userId, users.id))
        .leftJoin(tenantAiCredits, eq(stores.id, tenantAiCredits.tenantId))
        .where(inArray(stores.id, tenantIds))
    : [];

  const storeMap = new Map<string, (typeof storeRows)[number]>();
  for (const s of storeRows) {
    if (s.storeId) {
      storeMap.set(s.storeId, s);
    }
  }

  // 4. Map and rank the items
  let totalPeriodCostIdr = 0;
  let totalPeriodCostUsd = 0;
  let totalPeriodGenerations = 0;
  let totalPeriodTokens = 0;

  const tenants: TopTenantAiItem[] = aggregatedRows.map((row, index) => {
    const store = storeMap.get(row.tenantId);
    const totalGenerations = Number(row.totalGenerations || 0);
    const successGenerations = Number(row.successGenerations || 0);
    const failedGenerations = Number(row.failedGenerations || 0);
    const costIdr = Math.round(Number(row.totalCostIdr || 0));
    const costUsd = Number(Number(row.totalCostUsd || 0).toFixed(4));
    const tokens = Math.round(Number(row.totalTokens || 0));

    totalPeriodCostIdr += costIdr;
    totalPeriodCostUsd += costUsd;
    totalPeriodGenerations += totalGenerations;
    totalPeriodTokens += tokens;

    return {
      rank: index + 1,
      tenantId: row.tenantId,
      storeName: store?.storeName || 'Toko Tanpa Nama',
      subdomain: store?.subdomain || '-',
      ownerName: store?.ownerName || 'Pemilik Tidak Diketahui',
      ownerEmail: store?.ownerEmail || '-',
      totalGenerations,
      successGenerations,
      failedGenerations,
      successRate: calculateSafePercentage(successGenerations, totalGenerations),
      totalCostIdr: costIdr,
      totalCostUsd: costUsd,
      totalTokens: tokens,
      creditsUsed: Math.round(Number(row.creditsUsed || 0)),
      creditBalance: store?.creditBalance ?? 0,
      lastActiveAt: row.lastActiveAt ? new Date(row.lastActiveAt).toISOString() : null,
    };
  });

  const summary: TopTenantsAiSummary = {
    totalTenants: tenants.length,
    totalCostIdr: totalPeriodCostIdr,
    totalCostUsd: Number(totalPeriodCostUsd.toFixed(4)),
    totalGenerations: totalPeriodGenerations,
    totalTokens: totalPeriodTokens,
  };

  return {
    summary,
    sortBy,
    order,
    limit,
    period: {
      days: options.days,
      year: options.year,
      month: options.month,
    },
    tenants,
  };
}
