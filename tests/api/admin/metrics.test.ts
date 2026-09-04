import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET } from '@/pages/api/admin/metrics';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { db } from '@/db/index';

// Mock auth helpers
vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedAdmin: vi.fn(),
}));

// Mock DB client
vi.mock('@/db/index', () => {
  const mockDb = {
    select: vi.fn(),
  };
  return { db: mockDb, transactions: {}, activityLogs: {}, templates: {}, payoutRequests: {}, users: {} };
});

describe('Admin Metrics API Endpoint', () => {
  const mockGetAuthUser = getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedAdmin = isAuthorizedAdmin as unknown as Mock;
  const mockSelect = db.select as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/metrics', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetAuthUser.mockResolvedValue(null);

      const request = new Request('http://localhost/api/admin/metrics');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.ok).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('returns 403 when user is not an authorized admin', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'usr_1', role: 'tenant' });
      mockIsAuthorizedAdmin.mockReturnValue(false);

      const request = new Request('http://localhost/api/admin/metrics');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error.message).toBe('Admin access required');
    });

    it('returns 200 with calculated metrics', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'admin_1', role: 'admin' });
      mockIsAuthorizedAdmin.mockReturnValue(true);

      mockSelect
        .mockReturnValueOnce({
          from: vi.fn().mockResolvedValue([{ count: 150 }]),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([{ total: 15000000 }]),
          }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockResolvedValue([{ count: 320 }]),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockResolvedValue([{ count: 45 }]),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([{ count: 2 }]),
          }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([{ count: 1 }]),
          }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            leftJoin: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([{ id: 'tx_1', amount: 500000 }]),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            leftJoin: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([{ id: 'log_1', action: 'LOGIN' }]),
              }),
            }),
          }),
        });

      const request = new Request('http://localhost/api/admin/metrics');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data).toEqual({
        totalTransactions: 150,
        totalRevenue: 15000000,
        totalActivityLogs: 320,
        uniqueActiveUsers: 45,
        pendingTemplates: 2,
        pendingPayouts: 1,
        recentTransactions: [{ id: 'tx_1', amount: 500000 }],
        recentActivities: [{ id: 'log_1', action: 'LOGIN' }],
      });
    });
  });
});
