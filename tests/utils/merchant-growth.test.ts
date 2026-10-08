import { describe, it, expect } from 'vitest';
import { calculateMerchantGrowth } from '@/components/admin/growth/merchantGrowth.helpers';

describe('Merchant Growth Helper Functions', () => {
  const refDate = new Date('2026-10-15T12:00:00Z');

  it('handles empty records without errors and defaults to 12 months (Januari-Desember)', () => {
    const result = calculateMerchantGrowth([], refDate);
    expect(result.totalMerchants).toBe(0);
    expect(result.thisMonthNew).toBe(0);
    expect(result.lastMonthNew).toBe(0);
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

  it('correctly accounts for merchants registered before the calendar year and in October', () => {
    const records = [
      { id: '1', createdAt: '2025-01-10T00:00:00Z' },
      { id: '2', createdAt: '2026-10-02T00:00:00Z' },
    ];
    const result = calculateMerchantGrowth(records, refDate);
    expect(result.totalMerchants).toBe(2);
    // Jan 2026 starts with prior cumulative = 1
    expect(result.points[0].cumulative).toBe(1);
    // Month 9 (Oct 2026) has cumulative = 2
    expect(result.points[9].cumulative).toBe(2);
    expect(result.thisMonthNew).toBe(1);
  });

  it('computes growth percentage correctly between last month (Sep) and this month (Oct)', () => {
    const records = [
      { id: '1', createdAt: '2026-09-05T00:00:00Z' },
      { id: '2', createdAt: '2026-10-01T00:00:00Z' },
      { id: '3', createdAt: '2026-10-05T00:00:00Z' },
    ];
    const result = calculateMerchantGrowth(records, refDate);
    expect(result.lastMonthNew).toBe(1);
    expect(result.thisMonthNew).toBe(2);
    expect(result.growthPercentage).toBe(100); // 1 to 2 is 100% growth
    expect(result.isPositiveGrowth).toBe(true);
  });

  it('produces valid SVG paths and monotonically non-decreasing cumulative counts', () => {
    const records = [
      { id: '1', createdAt: '2026-06-15T00:00:00Z' },
      { id: '2', createdAt: '2026-07-20T00:00:00Z' },
      { id: '3', createdAt: '2026-10-10T00:00:00Z' },
    ];
    const result = calculateMerchantGrowth(records, refDate);
    expect(result.svgLinePath.startsWith('M')).toBe(true);
    expect(result.svgAreaPath.endsWith('Z')).toBe(true);

    for (let i = 1; i < result.points.length; i++) {
      expect(result.points[i].cumulative).toBeGreaterThanOrEqual(result.points[i - 1].cumulative);
    }
  });

  it('switches to daily points 1..31 when specific month is selected', () => {
    const records = [
      { id: '1', createdAt: '2026-09-30T00:00:00Z' },
      { id: '2', createdAt: '2026-10-05T00:00:00Z' },
      { id: '3', createdAt: '2026-10-12T00:00:00Z' },
    ];
    const result = calculateMerchantGrowth(records, { year: 2026, month: 10 });
    expect(result.filterMode).toBe('day');
    expect(result.points).toHaveLength(31); // October has 31 days
    expect(result.points[0].label).toBe('1');
    expect(result.points[30].label).toBe('31');
    // Before Oct 1, cumulative was 1
    expect(result.points[0].cumulative).toBe(1);
    // On Oct 5, +1 -> cumulative = 2
    expect(result.points[4].cumulative).toBe(2);
    expect(result.points[4].newCount).toBe(1);
    // On Oct 12, +1 -> cumulative = 3
    expect(result.points[11].cumulative).toBe(3);
    expect(result.points[11].newCount).toBe(1);
    expect(result.periodLabel).toBe('Oktober 2026');
  });
});
