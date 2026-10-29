process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://mock:mock@localhost:5432/mock';

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET } from '@/pages/api/admin/ai/cost-trends';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { getAiCostTrends } from '@/services/ai/cost-trends.service';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedAdmin: vi.fn(),
}));

vi.mock('@/services/ai/cost-trends.service', () => ({
  getAiCostTrends: vi.fn(),
}));

describe('Admin AI Cost Trends API Endpoint', () => {
  const mockGetAuthUser = getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedAdmin = isAuthorizedAdmin as unknown as Mock;
  const mockGetTrends = getAiCostTrends as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/ai/cost-trends', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetAuthUser.mockResolvedValue(null);

      const request = new Request('http://localhost/api/admin/ai/cost-trends');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.ok).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('returns 403 when user is not an authorized admin', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'usr_tenant', role: 'tenant' });
      mockIsAuthorizedAdmin.mockReturnValue(false);

      const request = new Request('http://localhost/api/admin/ai/cost-trends');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error.message).toBe('Admin access required');
    });

    it('returns 200 with cost trends data for authorized admin', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'adm_1', role: 'admin' });
      mockIsAuthorizedAdmin.mockReturnValue(true);

      const mockData = {
        period: {
          days: 14,
          startDate: '2026-10-08',
          endDate: '2026-10-21',
        },
        summary: {
          totalSpentIdr: 150000,
          totalSpentUsd: 9.38,
          monthlyDepositLimitIdr: 1000000,
          monthlyDepositLimitUsd: 62.5,
          remainingDepositIdr: 850000,
          remainingDepositUsd: 53.12,
          budgetUsedPercentage: 15.0,
          costPerPercentUsageIdr: 10000,
          costPerPercentUsageUsd: 0.63,
          averageDailyCostIdr: 10714,
          peakDailyCostIdr: 35000,
          totalTokens: 125000,
          totalExecutions: 28,
          days: 14,
        },
        dailyTrends: [
          {
            date: '2026-10-21',
            label: '21 Okt',
            costIdr: 25000,
            costUsd: 1.56,
            tokens: 12000,
            executionCount: 5,
            successCount: 5,
            failedCount: 0,
          },
        ],
      };

      mockGetTrends.mockResolvedValue(mockData);

      const request = new Request('http://localhost/api/admin/ai/cost-trends?days=14');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data).toEqual(mockData);
      expect(mockGetTrends).toHaveBeenCalledWith({
        days: 14,
        depositLimitOverrideIdr: undefined,
      });
    });

    it('passes custom days and depositLimit query params to service', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'superadm_1', role: 'superadmin' });
      mockIsAuthorizedAdmin.mockReturnValue(true);
      mockGetTrends.mockResolvedValue({ summary: {}, dailyTrends: [] });

      const request = new Request('http://localhost/api/admin/ai/cost-trends?days=7&depositLimit=2000000');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      expect(mockGetTrends).toHaveBeenCalledWith({
        days: 7,
        depositLimitOverrideIdr: 2000000,
      });
    });

    it('correctly parses range presets (7d, 30d, and month)', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'superadm_1', role: 'superadmin' });
      mockIsAuthorizedAdmin.mockReturnValue(true);
      mockGetTrends.mockResolvedValue({ summary: {}, dailyTrends: [] });

      // 7d preset
      const req7d = new Request('http://localhost/api/admin/ai/cost-trends?range=7d');
      await GET({ request: req7d, params: {} } as unknown as Parameters<typeof GET>[0]);
      expect(mockGetTrends).toHaveBeenCalledWith({
        days: 7,
        depositLimitOverrideIdr: undefined,
      });

      // 30d preset
      const req30d = new Request('http://localhost/api/admin/ai/cost-trends?range=30d');
      await GET({ request: req30d, params: {} } as unknown as Parameters<typeof GET>[0]);
      expect(mockGetTrends).toHaveBeenCalledWith({
        days: 30,
        depositLimitOverrideIdr: undefined,
      });

      // month preset
      const expectedMonthDays = Math.max(1, new Date().getDate());
      const reqMonth = new Request('http://localhost/api/admin/ai/cost-trends?range=month');
      await GET({ request: reqMonth, params: {} } as unknown as Parameters<typeof GET>[0]);
      expect(mockGetTrends).toHaveBeenCalledWith({
        days: expectedMonthDays,
        depositLimitOverrideIdr: undefined,
      });
    });
  });
});
