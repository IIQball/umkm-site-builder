import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET } from '@/pages/api/admin/ai/feature-distribution';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { getAiFeatureDistribution } from '@/services/ai/monitoring.service';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedAdmin: vi.fn(),
}));

vi.mock('@/services/ai/monitoring.service', () => ({
  getAiFeatureDistribution: vi.fn(),
}));

describe('Admin AI Feature Distribution API Endpoint', () => {
  const mockGetAuthUser = getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedAdmin = isAuthorizedAdmin as unknown as Mock;
  const mockGetDistribution = getAiFeatureDistribution as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/ai/feature-distribution', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetAuthUser.mockResolvedValue(null);

      const request = new Request('http://localhost/api/admin/ai/feature-distribution');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.ok).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('returns 403 when user is not an authorized admin', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'usr_1', role: 'tenant' });
      mockIsAuthorizedAdmin.mockReturnValue(false);

      const request = new Request('http://localhost/api/admin/ai/feature-distribution');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error.message).toBe('Admin access required');
    });

    it('returns 200 with aggregated feature distribution data for authorized admin', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'admin_1', role: 'superadmin' });
      mockIsAuthorizedAdmin.mockReturnValue(true);

      const mockDistributionData = {
        totalRequests: 100,
        totalCostIdr: 150000,
        totalCostUsd: 9.0,
        distribution: [
          {
            featureType: 'logo',
            label: 'Logo UMKM',
            totalRequests: 50,
            successRequests: 48,
            totalCostIdr: 50000,
            totalCostUsd: 3.0,
            requestPercentage: 50.0,
            costPercentage: 33.3,
          },
          {
            featureType: 'packaging_mockup',
            label: 'Kemasan Produk',
            totalRequests: 30,
            successRequests: 28,
            totalCostIdr: 60000,
            totalCostUsd: 3.6,
            requestPercentage: 30.0,
            costPercentage: 40.0,
          },
          {
            featureType: 'product_poster',
            label: 'Poster Produk',
            totalRequests: 20,
            successRequests: 20,
            totalCostIdr: 40000,
            totalCostUsd: 2.4,
            requestPercentage: 20.0,
            costPercentage: 26.7,
          },
        ],
      };

      mockGetDistribution.mockResolvedValue(mockDistributionData);

      const request = new Request('http://localhost/api/admin/ai/feature-distribution?year=2026&month=10');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data).toEqual(mockDistributionData);
      expect(mockGetDistribution).toHaveBeenCalledWith({ year: 2026, month: 10 });
    });
  });
});
