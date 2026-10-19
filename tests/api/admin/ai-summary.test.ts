import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET } from '@/pages/api/admin/ai/summary';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { getAiMonitoringSummary } from '@/services/ai/monitoring.service';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedAdmin: vi.fn(),
}));

vi.mock('@/services/ai/monitoring.service', () => ({
  getAiMonitoringSummary: vi.fn(),
}));

describe('Admin AI Summary API Endpoint', () => {
  const mockGetAuthUser = getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedAdmin = isAuthorizedAdmin as unknown as Mock;
  const mockGetSummary = getAiMonitoringSummary as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/ai/summary', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetAuthUser.mockResolvedValue(null);

      const request = new Request('http://localhost/api/admin/ai/summary');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.ok).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('returns 403 when user is not an authorized admin', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'usr_1', role: 'tenant' });
      mockIsAuthorizedAdmin.mockReturnValue(false);

      const request = new Request('http://localhost/api/admin/ai/summary');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error.message).toBe('Admin access required');
    });

    it('returns 200 with aggregated AI summary data for authorized admin', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'admin_1', role: 'superadmin' });
      mockIsAuthorizedAdmin.mockReturnValue(true);

      const mockSummaryData = {
        totalExecutions: 42,
        totalCostIdr: 27300,
        totalCostUsd: 1.68,
        totalInputTokens: 5460,
        totalOutputTokens: 18900,
        totalTokens: 24360,
        statusCounts: {
          success: 40,
          failed: 2,
          pending: 0,
          processing: 0,
        },
        successRate: 95.2,
      };

      mockGetSummary.mockResolvedValue(mockSummaryData);

      const request = new Request('http://localhost/api/admin/ai/summary');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data).toEqual(mockSummaryData);
      expect(mockGetSummary).toHaveBeenCalledTimes(1);
    });
  });
});
