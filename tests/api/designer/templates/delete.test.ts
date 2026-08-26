import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { DELETE as singleDeleteHandler } from '@/pages/api/designer/templates/draft';
import { POST as batchDeleteHandler } from '@/pages/api/designer/templates/batch-delete';
import { db } from '@/lib/db/client';
import * as authLib from '@/lib/auth';

vi.mock('@/lib/db/client', () => {
  const mockDb = {
    query: {
      templates: {
        findFirst: vi.fn(),
      },
    },
    select: vi.fn(),
    delete: vi.fn(),
  };
  return { db: mockDb, getDb: () => mockDb };
});

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedDesigner: vi.fn(),
  isDesigner: vi.fn((u) => !!u && (u.role === 'designer' || u.role === 'admin' || u.role === 'superadmin')),
  isActive: vi.fn((u) => !!u && u.status === 'active'),
  isAdmin: vi.fn((u) => !!u && (u.role === 'admin' || u.role === 'superadmin')),
  isAuthorizedAdmin: vi.fn((u) => !!u && u.status === 'active' && (u.role === 'admin' || u.role === 'superadmin')),
  getRedirectUrlForRole: vi.fn((role) => role === 'designer' ? '/designer/wallet' : '/dashboard'),
  auth: { api: { getSession: vi.fn() } },
}));

describe('Designer Template Deletion Endpoints', () => {
  const mockGetAuthUser = authLib.getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedDesigner = authLib.isAuthorizedDesigner as unknown as Mock;
  const mockFindFirst = db.query.templates.findFirst as unknown as Mock;
  const mockDelete = db.delete as unknown as Mock;
  const mockSelect = db.select as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('DELETE /api/designer/templates/draft (Single Hard Delete)', () => {
    it('should return 401 when user is not authenticated or not authorized designer', async () => {
      mockGetAuthUser.mockResolvedValue(null);
      mockIsAuthorizedDesigner.mockReturnValue(false);

      const request = new Request('http://localhost:4321/api/designer/templates/draft?templateId=tpl_123', {
        method: 'DELETE',
      });

      const res = (await singleDeleteHandler({
        request,
        params: {},
      } as unknown as Parameters<typeof singleDeleteHandler>[0])) as Response;

      expect(res.status).toBe(401);
    });

    it('should return 400 when templateId is missing', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'user_des_1', role: 'designer', status: 'active' });
      mockIsAuthorizedDesigner.mockReturnValue(true);

      const request = new Request('http://localhost:4321/api/designer/templates/draft', {
        method: 'DELETE',
      });

      const res = (await singleDeleteHandler({
        request,
        params: {},
      } as unknown as Parameters<typeof singleDeleteHandler>[0])) as Response;

      expect(res.status).toBe(400);
    });

    it('should return 404 when template is not found', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'user_des_1', role: 'designer', status: 'active' });
      mockIsAuthorizedDesigner.mockReturnValue(true);
      mockFindFirst.mockResolvedValue(null);

      const request = new Request('http://localhost:4321/api/designer/templates/draft?templateId=tpl_not_found', {
        method: 'DELETE',
      });

      const res = (await singleDeleteHandler({
        request,
        params: {},
      } as unknown as Parameters<typeof singleDeleteHandler>[0])) as Response;

      expect(res.status).toBe(404);
    });

    it('should return 403 when designer does not own the template', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'user_des_1', role: 'designer', status: 'active' });
      mockIsAuthorizedDesigner.mockReturnValue(true);
      mockFindFirst.mockResolvedValue({
        id: 'tpl_123',
        designerId: 'other_designer',
        status: 'draft',
      });

      const request = new Request('http://localhost:4321/api/designer/templates/draft?templateId=tpl_123', {
        method: 'DELETE',
      });

      const res = (await singleDeleteHandler({
        request,
        params: {},
      } as unknown as Parameters<typeof singleDeleteHandler>[0])) as Response;

      expect(res.status).toBe(403);
    });

    it('should return 200 and hard delete draft template successfully', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'user_des_1', role: 'designer', status: 'active' });
      mockIsAuthorizedDesigner.mockReturnValue(true);
      mockFindFirst.mockResolvedValue({
        id: 'tpl_123',
        designerId: 'user_des_1',
        status: 'draft',
      });
      mockDelete.mockReturnValue({
        where: vi.fn().mockResolvedValue([{ id: 'tpl_123' }]),
      });

      const request = new Request('http://localhost:4321/api/designer/templates/draft?id=tpl_123', {
        method: 'DELETE',
      });

      const res = (await singleDeleteHandler({
        request,
        params: {},
      } as unknown as Parameters<typeof singleDeleteHandler>[0])) as Response;

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(mockDelete).toHaveBeenCalled();
    });
  });

  describe('POST /api/designer/templates/batch-delete (Bulk Delete)', () => {
    it('should return 401 when unauthorized', async () => {
      mockGetAuthUser.mockResolvedValue(null);
      mockIsAuthorizedDesigner.mockReturnValue(false);

      const request = new Request('http://localhost:4321/api/designer/templates/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateIds: ['tpl_1', 'tpl_2'] }),
      });

      const res = (await batchDeleteHandler({
        request,
        params: {},
      } as unknown as Parameters<typeof batchDeleteHandler>[0])) as Response;

      expect(res.status).toBe(401);
    });

    it('should return 400 when templateIds is empty', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'user_des_1', role: 'designer', status: 'active' });
      mockIsAuthorizedDesigner.mockReturnValue(true);

      const request = new Request('http://localhost:4321/api/designer/templates/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateIds: [] }),
      });

      const res = (await batchDeleteHandler({
        request,
        params: {},
      } as unknown as Parameters<typeof batchDeleteHandler>[0])) as Response;

      expect(res.status).toBe(400);
    });

    it('should return 200 and batch delete selected templates', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'user_des_1', role: 'designer', status: 'active' });
      mockIsAuthorizedDesigner.mockReturnValue(true);

      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            { id: 'tpl_1', status: 'draft' },
            { id: 'tpl_2', status: 'rejected' },
          ]),
        }),
      });

      mockDelete.mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 'tpl_1' }, { id: 'tpl_2' }]),
        }),
      });

      const request = new Request('http://localhost:4321/api/designer/templates/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateIds: ['tpl_1', 'tpl_2'] }),
      });

      const res = (await batchDeleteHandler({
        request,
        params: {},
      } as unknown as Parameters<typeof batchDeleteHandler>[0])) as Response;

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.count).toBe(2);
    });
  });
});
