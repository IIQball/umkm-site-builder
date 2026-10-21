import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET } from '@/pages/api/admin/ai/logs';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { getAiLogs } from '@/services/ai/monitoring.service';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedAdmin: vi.fn(),
}));

vi.mock('@/services/ai/monitoring.service', () => ({
  getAiLogs: vi.fn(),
}));

describe('Admin AI Logs API Endpoint', () => {
  const mockGetAuthUser = getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedAdmin = isAuthorizedAdmin as unknown as Mock;
  const mockGetAiLogs = getAiLogs as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/ai/logs', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetAuthUser.mockResolvedValue(null);

      const request = new Request('http://localhost/api/admin/ai/logs');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.ok).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('returns 403 when user is not an authorized admin', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'usr_1', role: 'tenant' });
      mockIsAuthorizedAdmin.mockReturnValue(false);

      const request = new Request('http://localhost/api/admin/ai/logs');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error.message).toBe('Admin access required');
    });

    it('parses isTesting=true filter and pagination params correctly', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'admin_1', role: 'superadmin' });
      mockIsAuthorizedAdmin.mockReturnValue(true);

      const mockResponse = {
        logs: [
          {
            id: 'log_test_1',
            isTesting: true,
            featureType: 'logo',
            modelUsed: 'gpt-image-2.5-sunburst',
            sizeRatio: '1:1',
            qualityTier: 'standard',
            promptFinal: 'A modern coffee shop logo',
            inputTokens: 120,
            outputTokens: 450,
            creditsDeducted: 1,
            costUsd: 0.04,
            costIdr: 650,
            cloudinaryUrl: 'https://cloudinary.com/test.png',
            status: 'success',
            errorMessage: null,
            createdAt: '2026-10-20T10:00:00.000Z',
            storeName: 'Test Store',
            userName: 'Admin Tester',
          },
        ],
        pagination: {
          total: 1,
          page: 2,
          limit: 10,
          totalPages: 1,
        },
      };

      mockGetAiLogs.mockResolvedValue(mockResponse);

      const request = new Request(
        'http://localhost/api/admin/ai/logs?isTesting=true&page=2&limit=10&status=success&featureType=logo&search=coffee'
      );
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data).toEqual(mockResponse);

      expect(mockGetAiLogs).toHaveBeenCalledWith({
        isTesting: true,
        page: 2,
        limit: 10,
        status: 'success',
        featureType: 'logo',
        search: 'coffee',
      });
    });

    it('parses isTesting=false and handles default pagination fallback', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'admin_1', role: 'admin' });
      mockIsAuthorizedAdmin.mockReturnValue(true);

      mockGetAiLogs.mockResolvedValue({
        logs: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
      });

      const request = new Request('http://localhost/api/admin/ai/logs?isTesting=false');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      expect(mockGetAiLogs).toHaveBeenCalledWith({
        isTesting: false,
        page: 1,
        limit: 10,
        status: undefined,
        featureType: undefined,
        search: undefined,
      });
    });

    it('passes isTesting as undefined when parameter is omitted', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'admin_1', role: 'superadmin' });
      mockIsAuthorizedAdmin.mockReturnValue(true);

      mockGetAiLogs.mockResolvedValue({
        logs: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
      });

      const request = new Request('http://localhost/api/admin/ai/logs');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      expect(mockGetAiLogs).toHaveBeenCalledWith({
        isTesting: undefined,
        page: 1,
        limit: 10,
        status: undefined,
        featureType: undefined,
        search: undefined,
      });
    });
  });
});
