import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { POST } from '@/pages/api/templates/submit-review';
import { db } from '@/lib/db/client';
import * as authLib from '@/lib/auth';

vi.mock('@/lib/db/client', () => {
  const mockDb = {
    query: {
      templates: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn(),
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
  getRedirectUrlForRole: vi.fn((role) => role === 'designer' ? '/designer/templates' : (role === 'admin' || role === 'superadmin' ? '/admin' : '/dashboard')),
  auth: { api: { getSession: vi.fn() } },
}));

describe('POST /api/templates/submit-review', () => {
  const mockGetAuthUser = authLib.getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedDesigner = authLib.isAuthorizedDesigner as unknown as Mock;
  const mockFindFirst = db.query.templates.findFirst as unknown as Mock;
  const mockUpdate = db.update as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when user is not authenticated or not authorized designer', async () => {
    mockGetAuthUser.mockResolvedValue(null);
    mockIsAuthorizedDesigner.mockReturnValue(false);

    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_123' }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 400 when templateId is missing', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'designer_1',
      name: 'Designer 1',
      email: 'designer@example.com',
      role: 'designer',
      status: 'active',
    });
    mockIsAuthorizedDesigner.mockReturnValue(true);

    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 404 when template does not exist', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'designer_1',
      name: 'Designer 1',
      email: 'designer@example.com',
      role: 'designer',
      status: 'active',
    });
    mockIsAuthorizedDesigner.mockReturnValue(true);

    mockFindFirst.mockResolvedValue(null);

    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_nonexistent' }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('should return 403 when designer is not the owner of the template', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'designer_other',
      name: 'Other Designer',
      email: 'other@example.com',
      role: 'designer',
      status: 'active',
    });
    mockIsAuthorizedDesigner.mockReturnValue(true);

    mockFindFirst.mockResolvedValue({
      id: 'tpl_123',
      designerId: 'designer_owner',
      config: { theme: {}, sections: [] },
    });

    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_123' }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('FORBIDDEN');
  });

  it('should successfully submit template for review', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'designer_owner',
      name: 'Owner Designer',
      email: 'owner@example.com',
      role: 'designer',
      status: 'active',
    });
    mockIsAuthorizedDesigner.mockReturnValue(true);

    const validTemplate = {
      id: 'tpl_123',
      designerId: 'designer_owner',
      config: {
        theme: {
          primaryColor: '#000000',
          fontFamily: 'Inter',
        },
        sections: [
          {
            id: 'sec_1',
            type: 'hero',
            order: 0,
            content: {
              title: 'Hero Title',
              subtitle: 'Hero Subtitle',
            },
          },
        ],
      },
    };

    mockFindFirst.mockResolvedValue(validTemplate);
    mockUpdate.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ ...validTemplate, status: 'pending' }]),
        }),
      }),
    });

    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_123' }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.status).toBe('pending');
    expect(body.redirectUrl).toBe('/builder/preview/tpl_123');
  });
});
