import { db } from '@/lib/db/client';
import { aiGenerationLogs, aiDepositHistory } from '@/db/schema';
import { sql, gte, count } from 'drizzle-orm';
import { getActiveExchangeRate } from './cost-calculator.service';
import type {
  AiCostTrendsData,
  AiDailyCostPoint,
  AiCostTrendsSummary,
} from '@/types/admin/ai-cost-trends.types';

const INDONESIAN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

/**
 * Calculates budget used percentage against monthly deposit limit.
 * Completely immune to division by zero and invalid values.
 */
export function calculateBudgetUsedPercentage(
  totalSpent: number,
  depositLimit: number
): number {
  if (
    !depositLimit ||
    depositLimit <= 0 ||
    !Number.isFinite(depositLimit) ||
    !totalSpent ||
    totalSpent <= 0 ||
    !Number.isFinite(totalSpent)
  ) {
    return 0;
  }
  const percentage = (totalSpent / depositLimit) * 100;
  return Number.isFinite(percentage) ? Number(percentage.toFixed(2)) : 0;
}

/**
 * Calculates cost / price per 1% quota usage.
 * Safeguarded against division by zero.
 */
export function calculateCostPerPercentUsage(
  totalSpent: number,
  budgetUsedPercentage: number,
  depositLimit?: number
): number {
  if (
    budgetUsedPercentage > 0 &&
    totalSpent > 0 &&
    Number.isFinite(totalSpent) &&
    Number.isFinite(budgetUsedPercentage)
  ) {
    const cost = totalSpent / budgetUsedPercentage;
    return Number.isFinite(cost) ? Number(cost.toFixed(2)) : 0;
  }

  if (depositLimit && depositLimit > 0 && Number.isFinite(depositLimit)) {
    const cost = depositLimit / 100;
    return Number.isFinite(cost) ? Number(cost.toFixed(2)) : 0;
  }

  return 0;
}

/**
 * Pads a continuous daily array of trend points for a given window,
 * ensuring no gaps even when days have zero executions.
 */
export function buildDailyTrendPoints(
  startDate: Date,
  days: number,
  aggregatedMap: Map<string, Partial<AiDailyCostPoint>>
): AiDailyCostPoint[] {
  const points: AiDailyCostPoint[] = [];

  for (let i = 0; i < days; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const label = `${dd} ${INDONESIAN_MONTHS[current.getMonth()]}`;

    const existing = aggregatedMap.get(dateStr);

    points.push({
      date: dateStr,
      label,
      costIdr: Math.round(Number(existing?.costIdr || 0)),
      costUsd: Number((existing?.costUsd || 0).toFixed(4)),
      tokens: Math.round(Number(existing?.tokens || 0)),
      executionCount: Math.round(Number(existing?.executionCount || 0)),
      successCount: Math.round(Number(existing?.successCount || 0)),
      failedCount: Math.round(Number(existing?.failedCount || 0)),
    });
  }

  return points;
}

export interface GetAiCostTrendsOptions {
  days?: number;
  depositLimitOverrideIdr?: number;
}

/**
 * Fetches daily AI expenses, aggregates monthly budget vs usage,
 * and computes 1% quota price metrics.
 */
export async function getAiCostTrends(
  options: GetAiCostTrendsOptions = {}
): Promise<AiCostTrendsData> {
  const days = Math.max(1, Math.min(90, options.days || 14));
  const now = new Date();

  // Normalize startDate and startOfMonth to start of day (midnight)
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1), 0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  const [dailyRows, monthlySpentRow, depositRows, activeExchangeRate] = await Promise.all([
    // 1. Grouped daily generation costs
    db
      .select({
        date: sql<string>`to_char(${aiGenerationLogs.createdAt}, 'YYYY-MM-DD')`.as('date'),
        costIdr: sql<number>`coalesce(sum(${aiGenerationLogs.costIdr}), 0)`.mapWith(Number),
        costUsd: sql<number>`coalesce(sum(${aiGenerationLogs.costUsd}), 0)`.mapWith(Number),
        tokens: sql<number>`coalesce(sum(${aiGenerationLogs.inputTokens} + ${aiGenerationLogs.outputTokens}), 0)`.mapWith(Number),
        executionCount: count(aiGenerationLogs.id),
        successCount: sql<number>`count(case when ${aiGenerationLogs.status} = 'success' then 1 end)`.mapWith(Number),
        failedCount: sql<number>`count(case when ${aiGenerationLogs.status} = 'failed' then 1 end)`.mapWith(Number),
      })
      .from(aiGenerationLogs)
      .where(gte(aiGenerationLogs.createdAt, startDate))
      .groupBy(sql`to_char(${aiGenerationLogs.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${aiGenerationLogs.createdAt}, 'YYYY-MM-DD')`),

    // 2. Spent in current month
    db
      .select({
        monthlySpentIdr: sql<number>`coalesce(sum(${aiGenerationLogs.costIdr}), 0)`.mapWith(Number),
        monthlySpentUsd: sql<number>`coalesce(sum(${aiGenerationLogs.costUsd}), 0)`.mapWith(Number),
      })
      .from(aiGenerationLogs)
      .where(gte(aiGenerationLogs.createdAt, startOfMonth)),

    // 3. Deposit history: current month & all-time
    db
      .select({
        thisMonthDepositIdr: sql<number>`coalesce(sum(case when ${aiDepositHistory.createdAt} >= ${startOfMonth} then ${aiDepositHistory.amountIdr} else 0 end), 0)`.mapWith(Number),
        thisMonthDepositUsd: sql<number>`coalesce(sum(case when ${aiDepositHistory.createdAt} >= ${startOfMonth} then ${aiDepositHistory.amountUsd} else 0 end), 0)`.mapWith(Number),
        allTimeDepositIdr: sql<number>`coalesce(sum(${aiDepositHistory.amountIdr}), 0)`.mapWith(Number),
        allTimeDepositUsd: sql<number>`coalesce(sum(${aiDepositHistory.amountUsd}), 0)`.mapWith(Number),
      })
      .from(aiDepositHistory),

    getActiveExchangeRate(),
  ]);

  const monthSpent = monthlySpentRow[0];
  const deposits = depositRows[0];

  const totalSpentIdr = Math.round(Number(monthSpent?.monthlySpentIdr || 0));
  const totalSpentUsd = Number((monthSpent?.monthlySpentUsd || 0).toFixed(4));

  // Determine monthly deposit limit:
  // 1) Explicit override if provided
  // 2) Deposits in current month
  // 3) Fallback to all-time deposits if this month has no deposit yet
  let monthlyDepositLimitIdr = options.depositLimitOverrideIdr || 0;
  let monthlyDepositLimitUsd = 0;

  if (monthlyDepositLimitIdr <= 0) {
    if (deposits?.thisMonthDepositIdr && deposits.thisMonthDepositIdr > 0) {
      monthlyDepositLimitIdr = deposits.thisMonthDepositIdr;
      monthlyDepositLimitUsd = deposits.thisMonthDepositUsd;
    } else {
      monthlyDepositLimitIdr = deposits?.allTimeDepositIdr || 0;
      monthlyDepositLimitUsd = deposits?.allTimeDepositUsd || 0;
    }
  } else {
    monthlyDepositLimitUsd = Number((monthlyDepositLimitIdr / (activeExchangeRate || 16000)).toFixed(4));
  }

  // Budget calculations with 0-division guards
  const budgetUsedPercentage = calculateBudgetUsedPercentage(totalSpentIdr, monthlyDepositLimitIdr);
  const costPerPercentUsageIdr = calculateCostPerPercentUsage(totalSpentIdr, budgetUsedPercentage, monthlyDepositLimitIdr);
  const costPerPercentUsageUsd = Number((costPerPercentUsageIdr / (activeExchangeRate || 16000)).toFixed(4));

  const remainingDepositIdr = Math.max(0, monthlyDepositLimitIdr - totalSpentIdr);
  const remainingDepositUsd = Math.max(0, Number((monthlyDepositLimitUsd - totalSpentUsd).toFixed(4)));

  // Map daily rows to continuous date array
  const rowMap = new Map<string, Partial<AiDailyCostPoint>>();
  for (const row of dailyRows) {
    if (row.date) {
      rowMap.set(row.date, row);
    }
  }

  const dailyTrends = buildDailyTrendPoints(startDate, days, rowMap);

  // Aggregate statistics across trend points
  let peakDailyCostIdr = 0;
  let totalPeriodTokens = 0;
  let totalPeriodExecutions = 0;

  for (const pt of dailyTrends) {
    if (pt.costIdr > peakDailyCostIdr) {
      peakDailyCostIdr = pt.costIdr;
    }
    totalPeriodTokens += pt.tokens;
    totalPeriodExecutions += pt.executionCount;
  }

  const totalPeriodSpentIdr = dailyTrends.reduce((acc, p) => acc + p.costIdr, 0);
  const averageDailyCostIdr = days > 0 ? Math.round(totalPeriodSpentIdr / days) : 0;

  const summary: AiCostTrendsSummary = {
    totalSpentIdr,
    totalSpentUsd,
    monthlyDepositLimitIdr,
    monthlyDepositLimitUsd,
    remainingDepositIdr,
    remainingDepositUsd,
    budgetUsedPercentage,
    costPerPercentUsageIdr,
    costPerPercentUsageUsd,
    averageDailyCostIdr,
    peakDailyCostIdr,
    totalTokens: totalPeriodTokens,
    totalExecutions: totalPeriodExecutions,
    days,
  };

  const endDate = new Date(startDate.getTime() + (days - 1) * 86400000);

  return {
    period: {
      days,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    },
    summary,
    dailyTrends,
  };
}
