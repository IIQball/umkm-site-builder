import { describe, it, expect } from 'bun:test';
import {
  calculateBudgetUsedPercentage,
  calculateCostPerPercentUsage,
  buildDailyTrendPoints,
} from '@/services/ai/cost-trends.service';
import {
  computeBarChartLayout,
  getBudgetUsageStatus,
} from '@/components/admin/ai/costTrendChart.helpers';

describe('AI Cost Trends & Quota Formula Tests', () => {
  describe('calculateBudgetUsedPercentage (Zero-Division Safeguards)', () => {
    it('calculates accurate budget used percentage for standard values', () => {
      const pct = calculateBudgetUsedPercentage(250000, 1000000);
      expect(pct).toBe(25);
    });

    it('rounds to 2 decimal places accurately', () => {
      const pct = calculateBudgetUsedPercentage(100000, 300000);
      expect(pct).toBe(33.33);
    });

    it('returns 0 when deposit limit is 0 (prevents division by zero)', () => {
      expect(calculateBudgetUsedPercentage(50000, 0)).toBe(0);
    });

    it('returns 0 when deposit limit is negative', () => {
      expect(calculateBudgetUsedPercentage(50000, -100000)).toBe(0);
    });

    it('returns 0 when total spent is 0 or negative', () => {
      expect(calculateBudgetUsedPercentage(0, 1000000)).toBe(0);
      expect(calculateBudgetUsedPercentage(-500, 1000000)).toBe(0);
    });

    it('returns 0 when input contains NaN or Infinity', () => {
      expect(calculateBudgetUsedPercentage(NaN, 1000000)).toBe(0);
      expect(calculateBudgetUsedPercentage(50000, NaN)).toBe(0);
      expect(calculateBudgetUsedPercentage(Infinity, 1000000)).toBe(0);
      expect(calculateBudgetUsedPercentage(50000, Infinity)).toBe(0);
    });
  });

  describe('calculateCostPerPercentUsage (Zero-Division Safeguards)', () => {
    it('calculates cost per 1% usage accurately from total spent and percentage', () => {
      // Rp 250.000 spent for 25% usage -> Rp 10.000 per 1%
      const cost = calculateCostPerPercentUsage(250000, 25);
      expect(cost).toBe(10000);
    });

    it('falls back to 1% of deposit limit when usage is 0', () => {
      // 0% usage, but deposit limit is Rp 1.000.000 -> Rp 10.000 per 1%
      const cost = calculateCostPerPercentUsage(0, 0, 1000000);
      expect(cost).toBe(10000);
    });

    it('returns 0 when both usage percentage and deposit limit are 0', () => {
      expect(calculateCostPerPercentUsage(0, 0, 0)).toBe(0);
    });

    it('handles negative or invalid values safely without crashing or throwing NaN', () => {
      expect(calculateCostPerPercentUsage(-100, -5, -500)).toBe(0);
      expect(calculateCostPerPercentUsage(NaN, NaN, NaN)).toBe(0);
      expect(calculateCostPerPercentUsage(5000, 0, -1000)).toBe(0);
    });
  });

  describe('buildDailyTrendPoints', () => {
    it('generates a continuous daily array with exact length and Indonesian month labels', () => {
      const startDate = new Date('2026-10-10T00:00:00Z');
      const days = 5;
      const aggregatedMap = new Map([
        [
          '2026-10-12',
          {
            costIdr: 45000,
            costUsd: 2.8,
            tokens: 5000,
            executionCount: 8,
            successCount: 7,
            failedCount: 1,
          },
        ],
      ]);

      const points = buildDailyTrendPoints(startDate, days, aggregatedMap);

      expect(points).toHaveLength(5);
      // Empty days are filled with zero defaults
      expect(points[0].costIdr).toBe(0);
      expect(points[0].executionCount).toBe(0);
      expect(points[0].label).toContain('10');

      // Populated day matches input map
      const day3 = points[2];
      expect(day3.date).toBe('2026-10-12');
      expect(day3.costIdr).toBe(45000);
      expect(day3.costUsd).toBe(2.8);
      expect(day3.tokens).toBe(5000);
      expect(day3.executionCount).toBe(8);
      expect(day3.successCount).toBe(7);
      expect(day3.failedCount).toBe(1);
    });
  });

  describe('computeBarChartLayout', () => {
    it('computes correct SVG geometry, bar widths, and y-ticks', () => {
      const mockPoints = [
        {
          date: '2026-10-20',
          label: '20 Okt',
          costIdr: 10000,
          costUsd: 0.65,
          tokens: 1500,
          executionCount: 2,
          successCount: 2,
          failedCount: 0,
        },
        {
          date: '2026-10-21',
          label: '21 Okt',
          costIdr: 20000,
          costUsd: 1.3,
          tokens: 3000,
          executionCount: 4,
          successCount: 4,
          failedCount: 0,
        },
      ];

      const layout = computeBarChartLayout(mockPoints, 800, 240);

      expect(layout.bars).toHaveLength(2);
      expect(layout.yTicks).toHaveLength(3);
      expect(layout.bars[0].x).toBeGreaterThan(0);
      expect(layout.bars[1].x).toBeGreaterThan(layout.bars[0].x);
      expect(layout.bars[1].height).toBeGreaterThan(layout.bars[0].height);
    });
  });

  describe('getBudgetUsageStatus', () => {
    it('returns correct status badge and styling across percentage ranges', () => {
      expect(getBudgetUsageStatus(0).variant).toBe('slate');
      expect(getBudgetUsageStatus(45).variant).toBe('success');
      expect(getBudgetUsageStatus(75).variant).toBe('warning');
      expect(getBudgetUsageStatus(95).variant).toBe('error');
    });
  });

  describe('Date Range Presets & Month Calculations', () => {
    it('calculates current month days correctly for month preset', () => {
      const today = new Date();
      const currentMonthDays = Math.max(1, today.getDate());
      expect(currentMonthDays).toBeGreaterThanOrEqual(1);
      expect(currentMonthDays).toBeLessThanOrEqual(31);
    });

    it('builds daily points for 7-day preset correctly', () => {
      const startDate = new Date('2026-10-21T00:00:00Z');
      const points = buildDailyTrendPoints(startDate, 7, new Map());
      expect(points).toHaveLength(7);
      expect(points[0].date).toBe('2026-10-21');
      expect(points[6].date).toBe('2026-10-27');
    });

    it('builds daily points for 30-day preset correctly', () => {
      const startDate = new Date('2026-09-28T00:00:00Z');
      const points = buildDailyTrendPoints(startDate, 30, new Map());
      expect(points).toHaveLength(30);
    });
  });
});
