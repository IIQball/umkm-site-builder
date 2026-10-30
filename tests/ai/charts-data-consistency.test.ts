import { describe, it, expect } from 'bun:test';
import { formatIDR, formatNumber } from '@/lib/currency';
import {
  calculateBudgetUsedPercentage,
  calculateCostPerPercentUsage,
  buildDailyTrendPoints,
} from '@/services/ai/cost-trends.service';
import { computeBarChartLayout } from '@/components/admin/ai/costTrendChart.helpers';
import { buildDonutChartOptions } from '@/components/admin/ai/featureDistribution.helpers';
import { buildTenantChartOptions } from '@/components/tenant/ai/tenantUsageChart.helpers';
import { calculateSafePercentage } from '@/services/ai/top-tenants.service';
import type { AiFeatureDistributionItem } from '@/types/admin/ai-monitoring.types';

describe('H10 AI Analytics Charts & Database Consistency Audit', () => {
  // Mock dataset simulating raw rows in ai_generation_logs
  const rawAiGenerationLogs = [
    { id: 'log-1', tenantId: 'store-alpha', userId: 'user-alpha', featureType: 'logo' as const, status: 'success', costIdr: 12000, costUsd: 0.75, inputTokens: 1200, outputTokens: 3800, creditsDeducted: 1, isTesting: false, createdAt: new Date('2026-10-25T08:30:00Z') },
    { id: 'log-2', tenantId: 'store-alpha', userId: 'user-alpha', featureType: 'packaging_mockup' as const, status: 'success', costIdr: 25000, costUsd: 1.56, inputTokens: 2400, outputTokens: 7600, creditsDeducted: 2, isTesting: false, createdAt: new Date('2026-10-25T14:15:00Z') },
    { id: 'log-3', tenantId: 'store-beta', userId: 'user-beta', featureType: 'product_poster' as const, status: 'failed', costIdr: 0, costUsd: 0.0, inputTokens: 800, outputTokens: 0, creditsDeducted: 0, isTesting: false, createdAt: new Date('2026-10-26T09:00:00Z') },
    { id: 'log-4', tenantId: 'store-beta', userId: 'user-beta', featureType: 'logo' as const, status: 'success', costIdr: 13000, costUsd: 0.81, inputTokens: 1100, outputTokens: 3900, creditsDeducted: 1, isTesting: false, createdAt: new Date('2026-10-27T10:00:00Z') },
    { id: 'log-5', tenantId: 'store-gamma', userId: 'user-gamma', featureType: 'product_poster' as const, status: 'success', costIdr: 18000, costUsd: 1.12, inputTokens: 1500, outputTokens: 5500, creditsDeducted: 1, isTesting: false, createdAt: new Date('2026-10-27T16:45:00Z') },
  ];

  describe('1. Backend Data Consistency: Raw Rows vs Mathematical Aggregations', () => {
    it('accurately computes total executions, costs, and token consumption', () => {
      const rawTotalExecutions = rawAiGenerationLogs.length;
      const rawTotalCostIdr = rawAiGenerationLogs.reduce((acc, r) => acc + r.costIdr, 0);
      const rawTotalCostUsd = rawAiGenerationLogs.reduce((acc, r) => acc + r.costUsd, 0);
      const rawTotalTokens = rawAiGenerationLogs.reduce(
        (acc, r) => acc + r.inputTokens + r.outputTokens,
        0
      );
      const rawSuccessCount = rawAiGenerationLogs.filter((r) => r.status === 'success').length;
      const rawFailedCount = rawAiGenerationLogs.filter((r) => r.status === 'failed').length;

      expect(rawTotalExecutions).toBe(5);
      expect(rawTotalCostIdr).toBe(68000);
      expect(Number(rawTotalCostUsd.toFixed(2))).toBe(4.24);
      expect(rawTotalTokens).toBe(27800);
      expect(rawSuccessCount).toBe(4);
      expect(rawFailedCount).toBe(1);

      const successRate = Number(((rawSuccessCount / rawTotalExecutions) * 100).toFixed(1));
      expect(successRate).toBe(80.0);
    });

    it('aggregates feature distribution with exact percentage sums matching raw rows', () => {
      const featureKeys = ['logo', 'packaging_mockup', 'product_poster'] as const;
      const distributionItems: AiFeatureDistributionItem[] = featureKeys.map((type) => {
        const matching = rawAiGenerationLogs.filter((r) => r.featureType === type);
        const totalRequests = matching.length;
        const totalCostIdr = matching.reduce((acc, r) => acc + r.costIdr, 0);
        const totalCostUsd = matching.reduce((acc, r) => acc + r.costUsd, 0);
        const successRequests = matching.filter((r) => r.status === 'success').length;

        return {
          featureType: type,
          label: type === 'logo' ? 'Logo UMKM' : type === 'packaging_mockup' ? 'Kemasan Produk' : 'Poster Produk',
          totalRequests,
          successRequests,
          totalCostIdr,
          totalCostUsd,
          requestPercentage: 0,
          costPercentage: 0,
        };
      });

      const grandTotalRequests = distributionItems.reduce((acc, d) => acc + d.totalRequests, 0);
      const grandTotalCostIdr = distributionItems.reduce((acc, d) => acc + d.totalCostIdr, 0);

      expect(grandTotalRequests).toBe(5);
      expect(grandTotalCostIdr).toBe(68000);

      for (const item of distributionItems) {
        item.requestPercentage = Number(((item.totalRequests / grandTotalRequests) * 100).toFixed(1));
        item.costPercentage = Number(((item.totalCostIdr / grandTotalCostIdr) * 100).toFixed(1));
      }

      // Logo: 2 req (40.0%), Rp 25.000 (36.8%)
      const logoItem = distributionItems.find((d) => d.featureType === 'logo')!;
      expect(logoItem.totalRequests).toBe(2);
      expect(logoItem.totalCostIdr).toBe(25000);
      expect(logoItem.requestPercentage).toBe(40.0);
      expect(logoItem.costPercentage).toBe(36.8);

      // Packaging: 1 req (20.0%), Rp 25.000 (36.8%)
      const packItem = distributionItems.find((d) => d.featureType === 'packaging_mockup')!;
      expect(packItem.totalRequests).toBe(1);
      expect(packItem.totalCostIdr).toBe(25000);
      expect(packItem.requestPercentage).toBe(20.0);
      expect(packItem.costPercentage).toBe(36.8);

      // Poster: 2 req (40.0%), Rp 18.000 (26.5%)
      const posterItem = distributionItems.find((d) => d.featureType === 'product_poster')!;
      expect(posterItem.totalRequests).toBe(2);
      expect(posterItem.totalCostIdr).toBe(18000);
      expect(posterItem.requestPercentage).toBe(40.0);
      expect(posterItem.costPercentage).toBe(26.5);

      // Sum of request percentages: 40 + 20 + 40 = 100%
      const totalRequestPct = distributionItems.reduce((acc, d) => acc + d.requestPercentage, 0);
      expect(totalRequestPct).toBe(100.0);

      // Sum of cost percentages: 36.8 + 36.8 + 26.5 = 100.1% (within rounding margin 0.1%)
      const totalCostPct = distributionItems.reduce((acc, d) => acc + d.costPercentage, 0);
      expect(Math.abs(totalCostPct - 100.0)).toBeLessThanOrEqual(0.2);
    });

    it('aggregates tenant rankings strictly matching tenant grouped raw rows', () => {
      const tenantIds = ['store-alpha', 'store-beta', 'store-gamma'];
      const tenantAggregates = tenantIds.map((id) => {
        const tenantLogs = rawAiGenerationLogs.filter((r) => r.tenantId === id);
        const totalGenerations = tenantLogs.length;
        const successGenerations = tenantLogs.filter((r) => r.status === 'success').length;
        const totalCostIdr = tenantLogs.reduce((acc, r) => acc + r.costIdr, 0);
        const totalTokens = tenantLogs.reduce((acc, r) => acc + r.inputTokens + r.outputTokens, 0);
        const creditsUsed = tenantLogs.reduce((acc, r) => acc + r.creditsDeducted, 0);

        return {
          tenantId: id,
          totalGenerations,
          successGenerations,
          successRate: calculateSafePercentage(successGenerations, totalGenerations),
          totalCostIdr,
          totalTokens,
          creditsUsed,
        };
      });

      // Sort by cost desc
      tenantAggregates.sort((a, b) => b.totalCostIdr - a.totalCostIdr);

      // Alpha should be #1 with Rp 37.000 (12.000 + 25.000)
      expect(tenantAggregates[0].tenantId).toBe('store-alpha');
      expect(tenantAggregates[0].totalCostIdr).toBe(37000);
      expect(tenantAggregates[0].totalGenerations).toBe(2);
      expect(tenantAggregates[0].successRate).toBe(100);
      expect(tenantAggregates[0].creditsUsed).toBe(3);

      // Gamma should be #2 with Rp 18.000
      expect(tenantAggregates[1].tenantId).toBe('store-gamma');
      expect(tenantAggregates[1].totalCostIdr).toBe(18000);
      expect(tenantAggregates[1].totalGenerations).toBe(1);

      // Beta should be #3 with Rp 13.000 (13.000 + 0)
      expect(tenantAggregates[2].tenantId).toBe('store-beta');
      expect(tenantAggregates[2].totalCostIdr).toBe(13000);
      expect(tenantAggregates[2].totalGenerations).toBe(2);
      expect(tenantAggregates[2].successRate).toBe(50); // 1 success out of 2
    });
  });

  describe('2. Frontend Precision: Rupiah Formatting, Percentages & Geometry', () => {
    it('formats exact Rupiah values with formatIDR without truncation or loss of precision', () => {
      expect(formatIDR(0)).toBe('Rp 0');
      expect(formatIDR(1500)).toBe('Rp 1.500');
      expect(formatIDR(25400)).toBe('Rp 25.400');
      expect(formatIDR(1450000)).toBe('Rp 1.450.000');
      expect(formatIDR(25000000)).toBe('Rp 25.000.000');
      expect(formatIDR(1500000000)).toBe('Rp 1.500.000.000');
    });

    it('formats numbers with formatNumber accurately', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(5)).toBe('5');
      expect(formatNumber(12500)).toBe('12.500');
      expect(formatNumber(1000000)).toBe('1.000.000');
    });

    it('calculates budget percentage and cost per 1% usage with high precision', () => {
      // Rp 150.000 spent out of Rp 1.000.000 limit -> 15.00%
      const pct = calculateBudgetUsedPercentage(150000, 1000000);
      expect(pct).toBe(15);

      const costPerPct = calculateCostPerPercentUsage(150000, pct);
      expect(costPerPct).toBe(10000);
      expect(formatIDR(costPerPct)).toBe('Rp 10.000');

      // Edge case: spent 0 -> 0% and fallback to 1% deposit limit
      const zeroPct = calculateBudgetUsedPercentage(0, 500000);
      expect(zeroPct).toBe(0);
      const fallbackCost = calculateCostPerPercentUsage(0, 0, 500000);
      expect(fallbackCost).toBe(5000);
      expect(formatIDR(fallbackCost)).toBe('Rp 5.000');
    });

    it('builds continuous daily points with no gaps and exact date labels', () => {
      const startDate = new Date('2026-10-25T00:00:00Z');
      const aggregatedMap = new Map([
        [
          '2026-10-25',
          { costIdr: 37000, costUsd: 2.31, tokens: 15000, executionCount: 2, successCount: 2, failedCount: 0 },
        ],
        [
          '2026-10-27',
          { costIdr: 31000, costUsd: 1.93, tokens: 12000, executionCount: 2, successCount: 2, failedCount: 0 },
        ],
      ]);

      const points = buildDailyTrendPoints(startDate, 3, aggregatedMap);

      expect(points).toHaveLength(3);
      expect(points[0].date).toBe('2026-10-25');
      expect(points[0].costIdr).toBe(37000);
      expect(points[0].executionCount).toBe(2);

      // Middle day (2026-10-26) should be cleanly padded with 0
      expect(points[1].date).toBe('2026-10-26');
      expect(points[1].costIdr).toBe(0);
      expect(points[1].executionCount).toBe(0);

      // Third day
      expect(points[2].date).toBe('2026-10-27');
      expect(points[2].costIdr).toBe(31000);
    });

    it('computes bar chart layout with strictly positive dimensions and bounded coordinates', () => {
      const points = [
        { date: '2026-10-25', label: '25 Okt', costIdr: 37000, costUsd: 2.31, tokens: 15000, executionCount: 2, successCount: 2, failedCount: 0 },
        { date: '2026-10-26', label: '26 Okt', costIdr: 0, costUsd: 0, tokens: 0, executionCount: 0, successCount: 0, failedCount: 0 },
        { date: '2026-10-27', label: '27 Okt', costIdr: 31000, costUsd: 1.93, tokens: 12000, executionCount: 2, successCount: 2, failedCount: 0 },
      ];

      const layout = computeBarChartLayout(points, 800, 240);

      expect(layout.bars).toHaveLength(3);
      expect(layout.bars[0].height).toBeGreaterThan(0);
      expect(layout.bars[1].height).toBe(0); // 0 cost = 0 height
      expect(layout.bars[2].height).toBeGreaterThan(0);
      expect(layout.bars[0].x).toBeLessThan(layout.bars[1].x);
      expect(layout.bars[1].x).toBeLessThan(layout.bars[2].x);

      // yTicks contains max, mid, and 0
      expect(layout.yTicks).toHaveLength(3);
      expect(layout.yTicks[2].label).toBe('Rp 0');
    });

    it('builds donut chart options with custom tooltip rendering and noData fallback', () => {
      const distribution: AiFeatureDistributionItem[] = [
        { featureType: 'logo', label: 'Logo UMKM', totalRequests: 2, successRequests: 2, totalCostIdr: 25000, totalCostUsd: 1.56, requestPercentage: 50, costPercentage: 50 },
        { featureType: 'packaging_mockup', label: 'Kemasan Produk', totalRequests: 2, successRequests: 2, totalCostIdr: 25000, totalCostUsd: 1.56, requestPercentage: 50, costPercentage: 50 },
      ];

      const options = buildDonutChartOptions(distribution, 4, 50000, 'cost');

      expect(options.chart?.type).toBe('donut');
      expect(options.series).toEqual([25000, 25000]);
      expect(options.labels).toEqual(['Logo UMKM', 'Kemasan Produk']);
      expect(options.noData?.text).toBe('Belum ada data biaya');

      // Test tooltip custom formatter
      const tooltipFormatter = options.tooltip?.custom as ((opts: { seriesIndex: number }) => string) | undefined;
      expect(tooltipFormatter).toBeDefined();
      const tooltipHtml = tooltipFormatter ? tooltipFormatter({ seriesIndex: 0 }) : '';
      expect(tooltipHtml).toContain('Logo UMKM');
      expect(tooltipHtml).toContain('Rp 25.000');
    });

    it('builds tenant usage chart options with valid bar options, theme tokens, and data labels', () => {
      const dailyPoints = [
        { date: '2026-10-23', label: '23 Okt', dayName: 'Jum', fullLabel: 'Jumat, 23 Okt 2026', creditsUsed: 3, generationsCount: 3 },
        { date: '2026-10-24', label: '24 Okt', dayName: 'Sab', fullLabel: 'Sabtu, 24 Okt 2026', creditsUsed: 0, generationsCount: 0 },
        { date: '2026-10-25', label: '25 Okt', dayName: 'Min', fullLabel: 'Minggu, 25 Okt 2026', creditsUsed: 5, generationsCount: 4 },
      ];

      const options = buildTenantChartOptions(dailyPoints);

      expect(options.chart?.type).toBe('bar');
      const seriesList = options.series as Array<{ data: number[] }> | undefined;
      expect(seriesList?.[0]?.data).toEqual([3, 0, 5]);
      expect(options.xaxis?.categories).toEqual(['Jum 23', 'Sab 24', 'Min 25']);
      expect(options.noData?.text).toBe('Belum ada data pemakaian');

      // Tooltip y-formatter checks
      const yConfig = options.tooltip?.y as { formatter?: (val: number, opts?: { dataPointIndex: number }) => string } | undefined;
      const yFormatter = yConfig?.formatter;
      expect(yFormatter).toBeDefined();
      expect(yFormatter ? yFormatter(3, { dataPointIndex: 0 }) : '').toBe('3 kredit (3 visual)');
      expect(yFormatter ? yFormatter(0, { dataPointIndex: 1 }) : '').toBe('0 kredit (0 visual)');
    });
  });
});
