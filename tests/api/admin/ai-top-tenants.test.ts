import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET } from '@/pages/api/admin/ai/top-tenants';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { getTopTenantsAi } from '@/services/ai/top-tenants.service';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedAdmin: vi.fn(),
}));

vi.mock('@/services/ai/top-tenants.service', () => ({
  getTopTenantsAi: vi.fn(),
}));

describe('Admin AI Top Tenants API Endpoint', () => {
  const mockGetAuthUser = getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedAdmin = isAuthorizedAdmin as unknown as Mock;
  const mockGetTopTenants = getTopTenantsAi as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/ai/top-tenants', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetAuthUser.mockResolvedValue(null);

      const request = new Request('http://localhost/api/admin/ai/top-tenants');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.ok).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('returns 403 when user is not an authorized admin', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'usr_tenant', role: 'tenant' });
      mockIsAuthorizedAdmin.mockReturnValue(false);

      const request = new Request('http://localhost/api/admin/ai/top-tenants');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error.message).toBe('Admin access required');
    });

    it('returns 200 with top tenants ranking data for authorized admin', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'adm_1', role: 'superadmin' });
      mockIsAuthorizedAdmin.mockReturnValue(true);

      const mockData = {
        summary: {
          totalTenants: 1,
          totalCostIdr: 50000,
          totalCostUsd: 3.12,
          totalGenerations: 20,
          totalTokens: 15000,
        },
        sortBy: 'cost',
        order: 'desc',
        limit: 10,
        period: {},
        tenants: [
          {
            rank: 1,
            tenantId: 'store-1',
            storeName: 'Toko Kopi Makmur',
            subdomain: 'kopimakmur',
            ownerName: 'Budi',
            ownerEmail: 'budi@gmail.com',
            totalGenerations: 20,
            successGenerations: 19,
            failedGenerations: 1,
            successRate: 95,
            totalCostIdr: 50000,
            totalCostUsd: 3.12,
            totalTokens: 15000,
            creditsUsed: 20,
            creditBalance: 10,
            lastActiveAt: '2026-10-25T10:00:00.000Z',
          },
        ],
      };

      mockGetTopTenants.mockResolvedValue(mockData);

      const request = new Request('http://localhost/api/admin/ai/top-tenants?limit=10&sortBy=cost');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data.tenants.length).toBe(1);
      expect(body.data.tenants[0].storeName).toBe('Toko Kopi Makmur');
      expect(mockGetTopTenants).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          sortBy: 'cost',
          order: 'desc',
        })
      );
    });

    it('parses days, year, month, and isTesting query parameters accurately', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'adm_1', role: 'admin' });
      mockIsAuthorizedAdmin.mockReturnValue(true);
      mockGetTopTenants.mockResolvedValue({ tenants: [], summary: {} });

      const request = new Request(
        'http://localhost/api/admin/ai/top-tenants?days=30&year=2026&month=10&isTesting=true&sortBy=generations&order=asc&limit=25'
      );
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      expect(mockGetTopTenants).toHaveBeenCalledWith({
        limit: 25,
        sortBy: 'generations',
        order: 'asc',
        days: 30,
        year: 2026,
        month: 10,
        isTesting: true,
      });
    });
  });
});
