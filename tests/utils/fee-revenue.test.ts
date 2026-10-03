import { describe, it, expect } from 'vitest';
import { calculateFeeRevenueGrowth } from '@/components/admin/growth/feeRevenue.helpers';

describe('Fee Revenue Helper Functions', () => {
  const refDate = new Date('2026-10-15T12:00:00Z');

  it('handles empty records without errors and defaults to 12 months (Januari-Desember)', () => {
    const result = calculateFeeRevenueGrowth([], refDate);
    expect(result.totalRevenue).toBe(0);
    expect(result.thisMonthRevenue).toBe(0);
    expect(result.lastMonthRevenue).toBe(0);
    expect(result.growthPercentage).toBe(0);
    expect(result.points).toHaveLength(12);
    expect(result.points[0].label).toBe('Januari');
    expect(result.points[11].label).toBe('Desember');
    expect(result.points.every((p) => p.cumulative === 0)).toBe(true);
    expect(result.svgLinePath).toContain('M');
    expect(result.svgWidth).toBe(850);
    expect(result.svgHeight).toBe(280);
    expect(result.filterMode).toBe('month');
  });

  it('correctly aggregates fee revenue within calendar year and before 2026', () => {
    const records = [
      { amount: 15000, createdAt: '2025-01-10T00:00:00Z' },
      { amount: 10000, createdAt: '2026-09-10T00:00:00Z' },
      { amount: 25000, createdAt: '2026-10-05T00:00:00Z' },
    ];
    const result = calculateFeeRevenueGrowth(records, refDate);
    expect(result.totalRevenue).toBe(50000);
    // Jan 2026 starts with prior cumulative of 15000
    expect(result.points[0].cumulative).toBe(15000);
    // Sept has +10000
    expect(result.lastMonthRevenue).toBe(10000);
    // Oct has +25000
    expect(result.thisMonthRevenue).toBe(25000);
    // Oct cumulative = 50000
    expect(result.points[9].cumulative).toBe(50000);
    // Growth from 10k to 25k is +150%
    expect(result.growthPercentage).toBe(150);
  });

  it('switches to daily points 1..31 when specific month is selected', () => {
    const records = [
      { amount: 15000, createdAt: '2026-09-25T00:00:00Z' },
      { amount: 20000, createdAt: '2026-10-05T00:00:00Z' },
      { amount: 30000, createdAt: '2026-10-18T00:00:00Z' },
    ];
    const result = calculateFeeRevenueGrowth(records, { year: 2026, month: 10 });
    expect(result.filterMode).toBe('day');
    expect(result.points).toHaveLength(31);
    expect(result.points[0].label).toBe('1');
    expect(result.points[30].label).toBe('31');
    // Prior cumulative before Oct 1 = 15000
    expect(result.points[0].cumulative).toBe(15000);
    // On Oct 5, +20000 -> cumulative = 35000
    expect(result.points[4].cumulative).toBe(35000);
    expect(result.points[4].amount).toBe(20000);
    // On Oct 18, +30000 -> cumulative = 65000
    expect(result.points[17].cumulative).toBe(65000);
    expect(result.points[17].amount).toBe(30000);
    expect(result.periodLabel).toBe('Oktober 2026');
  });
});
