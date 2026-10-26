import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { db } from '@/lib/db/client';
import {
  calculateSafePercentage,
  buildDateConditions,
  getTopTenantsAi,
} from '@/services/ai/top-tenants.service';

vi.mock('@/lib/db/client', () => ({
  db: {
    select: vi.fn(),
  },
}));

describe('Top Tenants AI Service', () => {
  const mockSelect = db.select as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateSafePercentage (Zero-Division Safeguards)', () => {
    it('calculates percentage accurately with standard numbers', () => {
      expect(calculateSafePercentage(8, 10)).toBe(80);
      expect(calculateSafePercentage(1, 3)).toBe(33.3);
    });

    it('returns 0 when denominator is 0 (prevents division by zero)', () => {
      expect(calculateSafePercentage(5, 0)).toBe(0);
    });

    it('returns 0 when numerator is 0 or negative', () => {
      expect(calculateSafePercentage(0, 10)).toBe(0);
      expect(calculateSafePercentage(-5, 10)).toBe(0);
    });

    it('returns 0 when inputs are invalid, NaN or Infinity', () => {
      expect(calculateSafePercentage(NaN, 10)).toBe(0);
      expect(calculateSafePercentage(5, NaN)).toBe(0);
      expect(calculateSafePercentage(Infinity, 10)).toBe(0);
      expect(calculateSafePercentage(5, Infinity)).toBe(0);
    });
  });

  describe('buildDateConditions', () => {
    it('creates days condition when days param is provided', () => {
      const conditions = buildDateConditions({ days: 7 });
      expect(conditions.length).toBe(1);
    });

    it('creates year-month condition when both year and month are provided', () => {
      const conditions = buildDateConditions({ year: 2026, month: 10 });
      expect(conditions.length).toBe(2);
    });

    it('creates full year condition when month is all or omitted', () => {
      const conditions = buildDateConditions({ year: 2026, month: 'all' });
      expect(conditions.length).toBe(2);
    });

    it('returns empty array when no date options specified', () => {
      const conditions = buildDateConditions({});
      expect(conditions.length).toBe(0);
    });
  });

  describe('getTopTenantsAi', () => {
    it('returns empty list and zeroes summary when no generation records exist', async () => {
      mockSelect.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            groupBy: () => ({
              orderBy: () => ({
                limit: () => Promise.resolve([]),
              }),
            }),
          }),
        }),
      });

      const res = await getTopTenantsAi({ limit: 10 });

      expect(res.tenants).toEqual([]);
      expect(res.summary.totalTenants).toBe(0);
      expect(res.summary.totalCostIdr).toBe(0);
      expect(res.summary.totalGenerations).toBe(0);
    });

    it('aggregates top tenants, maps store metadata, and assigns correct rankings', async () => {
      // 1. Aggregated log rows
      mockSelect.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            groupBy: () => ({
              orderBy: () => ({
                limit: () =>
                  Promise.resolve([
                    {
                      tenantId: 'store-1',
                      totalGenerations: 20,
                      successGenerations: 18,
                      failedGenerations: 2,
                      totalCostIdr: 50000,
                      totalCostUsd: 3.125,
                      totalTokens: 15000,
                      creditsUsed: 20,
                      lastActiveAt: new Date('2026-10-25T10:00:00Z'),
                    },
                    {
                      tenantId: 'store-2',
                      totalGenerations: 10,
                      successGenerations: 10,
                      failedGenerations: 0,
                      totalCostIdr: 25000,
                      totalCostUsd: 1.56,
                      totalTokens: 7500,
                      creditsUsed: 10,
                      lastActiveAt: new Date('2026-10-24T12:00:00Z'),
                    },
                  ]),
              }),
            }),
          }),
        }),
      });

      // 2. Joined store, owner, and credit info
      mockSelect.mockReturnValueOnce({
        from: () => ({
          leftJoin: () => ({
            leftJoin: () => ({
              where: () =>
                Promise.resolve([
                  {
                    storeId: 'store-1',
                    storeName: 'Kopi Kenangan UMKM',
                    subdomain: 'kopikenangan',
                    ownerName: 'Budi Santoso',
                    ownerEmail: 'budi@example.com',
                    creditBalance: 15,
                  },
                  {
                    storeId: 'store-2',
                    storeName: 'Bakso Super Lezat',
                    subdomain: 'baksosuper',
                    ownerName: 'Siti Aminah',
                    ownerEmail: 'siti@example.com',
                    creditBalance: 5,
                  },
                ]),
            }),
          }),
        }),
      });

      const res = await getTopTenantsAi({ limit: 10, sortBy: 'cost' });

      expect(res.tenants.length).toBe(2);
      expect(res.tenants[0].rank).toBe(1);
      expect(res.tenants[0].tenantId).toBe('store-1');
      expect(res.tenants[0].storeName).toBe('Kopi Kenangan UMKM');
      expect(res.tenants[0].subdomain).toBe('kopikenangan');
      expect(res.tenants[0].successRate).toBe(90);
      expect(res.tenants[0].creditBalance).toBe(15);

      expect(res.tenants[1].rank).toBe(2);
      expect(res.tenants[1].tenantId).toBe('store-2');
      expect(res.tenants[1].successRate).toBe(100);

      expect(res.summary.totalTenants).toBe(2);
      expect(res.summary.totalCostIdr).toBe(75000);
      expect(res.summary.totalGenerations).toBe(30);
      expect(res.summary.totalTokens).toBe(22500);
    });

    it('handles stores with missing store rows gracefully with fallback labels', async () => {
      mockSelect.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            groupBy: () => ({
              orderBy: () => ({
                limit: () =>
                  Promise.resolve([
                    {
                      tenantId: 'deleted-store',
                      totalGenerations: 5,
                      successGenerations: 5,
                      failedGenerations: 0,
                      totalCostIdr: 10000,
                      totalCostUsd: 0.625,
                      totalTokens: 2000,
                      creditsUsed: 5,
                      lastActiveAt: null,
                    },
                  ]),
              }),
            }),
          }),
        }),
      });

      mockSelect.mockReturnValueOnce({
        from: () => ({
          leftJoin: () => ({
            leftJoin: () => ({
              where: () => Promise.resolve([]),
            }),
          }),
        }),
      });

      const res = await getTopTenantsAi();
      expect(res.tenants.length).toBe(1);
      expect(res.tenants[0].storeName).toBe('Toko Tanpa Nama');
      expect(res.tenants[0].subdomain).toBe('-');
      expect(res.tenants[0].ownerName).toBe('Pemilik Tidak Diketahui');
      expect(res.tenants[0].lastActiveAt).toBeNull();
    });
  });

  describe('topMerchants.helpers', () => {
    it('returns podium badge variants correctly for ranks 1, 2, 3, and default', async () => {
      const { getRankBadgeInfo } = await import('@/components/admin/ai/topMerchants.helpers');
      expect(getRankBadgeInfo(1)).toEqual({ label: '#1', variant: 'warning' });
      expect(getRankBadgeInfo(2)).toEqual({ label: '#2', variant: 'slate' });
      expect(getRankBadgeInfo(3)).toEqual({ label: '#3', variant: 'orange' });
      expect(getRankBadgeInfo(4)).toEqual({ label: '#4', variant: 'secondary' });
      expect(getRankBadgeInfo(10)).toEqual({ label: '#10', variant: 'secondary' });
    });

    it('returns semantic success rate variants correctly', async () => {
      const { getSuccessRateVariant } = await import('@/components/admin/ai/topMerchants.helpers');
      expect(getSuccessRateVariant(95)).toBe('success');
      expect(getSuccessRateVariant(90)).toBe('success');
      expect(getSuccessRateVariant(85)).toBe('info');
      expect(getSuccessRateVariant(79)).toBe('warning');
    });

    it('formats tokens compactly with formatCompactTokens', async () => {
      const { formatCompactTokens } = await import('@/components/admin/ai/topMerchants.helpers');
      expect(formatCompactTokens(0)).toBe('0');
      expect(formatCompactTokens(-10)).toBe('0');
      expect(formatCompactTokens(500)).toBe('500');
      expect(formatCompactTokens(1500)).toBe('1.5k');
      expect(formatCompactTokens(2500000)).toBe('2.5M');
    });
  });
});

