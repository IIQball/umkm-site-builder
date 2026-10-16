import { describe, it, expect } from 'vitest';
import {
  INDONESIAN_MONTHS,
  getPeriodBounds,
  filterByPeriod,
  computeAvailableYears,
} from '@/lib/utils/format';

describe('Period Filter Utilities', () => {
  it('should have 12 Indonesian months', () => {
    expect(INDONESIAN_MONTHS).toHaveLength(12);
    expect(INDONESIAN_MONTHS[0]).toBe('Januari');
    expect(INDONESIAN_MONTHS[11]).toBe('Desember');
  });

  describe('getPeriodBounds', () => {
    it('should return full year bounds when month is all', () => {
      const { start, end } = getPeriodBounds(2026, 'all');
      expect(start.getFullYear()).toBe(2026);
      expect(start.getMonth()).toBe(0);
      expect(start.getDate()).toBe(1);

      expect(end.getFullYear()).toBe(2026);
      expect(end.getMonth()).toBe(11);
      expect(end.getDate()).toBe(31);
    });

    it('should return month bounds when a specific month is selected', () => {
      const { start, end } = getPeriodBounds(2026, 2); // February
      expect(start.getFullYear()).toBe(2026);
      expect(start.getMonth()).toBe(1); // 0-indexed month for Feb
      expect(start.getDate()).toBe(1);

      expect(end.getFullYear()).toBe(2026);
      expect(end.getMonth()).toBe(1);
      expect(end.getDate()).toBe(28); // 2026 is non-leap year
    });
  });

  describe('filterByPeriod', () => {
    const items = [
      { id: '1', date: '2026-01-15T10:00:00Z' },
      { id: '2', date: '2026-02-10T10:00:00Z' },
      { id: '3', date: '2025-12-30T23:59:59Z' },
      { id: '4', date: null },
    ];

    it('should filter items for full year 2026', () => {
      const res = filterByPeriod(items, 2026, 'all', (i) => i.date);
      expect(res.map((i) => i.id)).toEqual(['1', '2']);
    });

    it('should filter items for a specific month in 2026', () => {
      const res = filterByPeriod(items, 2026, 2, (i) => i.date);
      expect(res.map((i) => i.id)).toEqual(['2']);
    });

    it('should handle items with null date gracefully', () => {
      const res = filterByPeriod(items, 2024, 'all', (i) => i.date);
      expect(res).toHaveLength(0);
    });
  });

  describe('computeAvailableYears', () => {
    it('should compute distinct descending years and include current year', () => {
      const currentYear = new Date().getFullYear();
      const items = [
        { date: '2023-05-10' },
        { date: '2024-08-20' },
        { date: `${currentYear}-01-01` },
      ];
      const years = computeAvailableYears(items, (i) => i.date);
      expect(years[0]).toBe(currentYear);
      expect(years).toContain(2023);
      expect(years).toContain(2024);
      expect(years).toContain(currentYear);
    });
  });
});
