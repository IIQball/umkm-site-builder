import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { DELETE } from '@/pages/api/designer/templates/draft';
import { db } from '@/lib/db/client';
import * as authLib from '@/lib/auth';

type DeleteContext = Parameters<typeof DELETE>[0];

vi.mock('@/lib/db/client', () => {
  const mockDeleteWhere = vi.fn().mockResolvedValue(undefined);
  const mockDb = {
    query: {
      templates: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
    delete: vi.fn(() => ({
      where: mockDeleteWhere,
    })),
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
  auth: { api: { getSession: vi.fn() } },
}));

describe('DELETE /api/designer/templates/draft', () => {
  const mockGetAuthUser = authLib.getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedDesigner = authLib.isAuthorizedDesigner as unknown as Mock;
  const mockFindFirst = db.query.templates.findFirst as unknown as Mock;
  const mockFindMany = db.query.templates.findMany as unknown as Mock;
  const mockDelete = db.delete as unknown as Mock;

  const mockUser = {
    id: 'designer_1',
    role: 'designer',
    status: 'active',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when unauthenticated', async () => {
    mockGetAuthUser.mockResolvedValue(null);
    mockIsAuthorizedDesigner.mockReturnValue(false);

    const request = new Request('http://localhost:4321/api/designer/templates/draft?templateId=tpl_1', {
      method: 'DELETE',
    });

    const res = (await DELETE({ request, params: {} } as unknown as DeleteContext)) as Response;
    expect(res.status).toBe(401);
  });

  it('should hard delete a single draft template', async () => {
    mockGetAuthUser.mockResolvedValue(mockUser);
    mockIsAuthorizedDesigner.mockReturnValue(true);
    mockFindFirst.mockResolvedValue({
      id: 'tpl_1',
      designerId: 'designer_1',
      status: 'draft',
    });

    const request = new Request('http://localhost:4321/api/designer/templates/draft?templateId=tpl_1', {
      method: 'DELETE',
    });

    const res = (await DELETE({ request, params: {} } as unknown as DeleteContext)) as Response;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockDelete).toHaveBeenCalled();
  });

  it('should hard delete multiple draft templates in batch', async () => {
    mockGetAuthUser.mockResolvedValue(mockUser);
    mockIsAuthorizedDesigner.mockReturnValue(true);
    mockFindMany.mockResolvedValue([
      { id: 'tpl_1', designerId: 'designer_1', status: 'draft' },
      { id: 'tpl_2', designerId: 'designer_1', status: 'draft' },
    ]);

    const request = new Request('http://localhost:4321/api/designer/templates/draft', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateIds: ['tpl_1', 'tpl_2'] }),
    });

    const res = (await DELETE({ request, params: {} } as unknown as DeleteContext)) as Response;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.deletedCount).toBe(2);
    expect(mockDelete).toHaveBeenCalled();
  });

  it('should reject non-owner or non-draft templates', async () => {
    mockGetAuthUser.mockResolvedValue(mockUser);
    mockIsAuthorizedDesigner.mockReturnValue(true);
    mockFindFirst.mockResolvedValue({
      id: 'tpl_1',
      designerId: 'other_designer',
      status: 'draft',
    });

    const request = new Request('http://localhost:4321/api/designer/templates/draft?templateId=tpl_1', {
      method: 'DELETE',
    });

    const res = (await DELETE({ request, params: {} } as unknown as DeleteContext)) as Response;
    expect(res.status).toBe(403);
  });
});
