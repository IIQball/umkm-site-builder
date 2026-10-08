import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { POST, templateSubmitLimiter } from '@/pages/api/designer/templates/submit-review';
import { db } from '@/lib/db/client';
import * as authLib from '@/lib/auth';

vi.mock('@/lib/db/client', () => {
  const mockDb = {
    query: {
      templates: { findFirst: vi.fn() },
      users: { findMany: vi.fn().mockResolvedValue([{ id: 'sup-1' }]) },
    },
    update: vi.fn(),
    insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) }),
    select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([{ id: 'sup-1' }]) }) }) }),
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

describe('POST /api/templates/submit-review', () => {
  const mockGetAuthUser = authLib.getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedDesigner = authLib.isAuthorizedDesigner as unknown as Mock;
  const mockFindFirst = db.query.templates.findFirst as unknown as Mock;
  const mockUpdate = db.update as unknown as Mock;

  const setDesignerAuth = (id = 'designer_owner', name = 'Owner Designer') => {
    mockGetAuthUser.mockResolvedValue({ id, name, email: `${id}@example.com`, role: 'designer', status: 'active' });
    mockIsAuthorizedDesigner.mockReturnValue(true);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    templateSubmitLimiter.reset();
  });

  it('should return 401 when user is not authenticated or not authorized designer', async () => {
    mockGetAuthUser.mockResolvedValue(null);
    mockIsAuthorizedDesigner.mockReturnValue(false);

    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_123' }),
    });

    const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 400 when templateId is missing', async () => {
    setDesignerAuth('designer_1');

    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 404 when template does not exist', async () => {
    setDesignerAuth('designer_1');
    mockFindFirst.mockResolvedValue(null);

    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_nonexistent' }),
    });

    const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('should return 403 when designer is not the owner of the template', async () => {
    setDesignerAuth('designer_other', 'Other Designer');
    mockFindFirst.mockResolvedValue({ id: 'tpl_123', designerId: 'designer_owner', config: { theme: {}, sections: [] } });

    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_123' }),
    });

    const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('FORBIDDEN');
  });

  it('should successfully submit template for review', async () => {
    setDesignerAuth('designer_owner');
    const validTemplate = {
      id: 'tpl_123',
      designerId: 'designer_owner',
      status: 'draft',
      config: {
        theme: { primaryColor: '#000000', fontFamily: 'Inter' },
        sections: [{ id: 'sec_1', type: 'hero', order: 0, content: { title: 'Hero' } }],
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

    const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.status).toBe('pending');
    expect(body.redirectUrl).toBe('/builder/preview/tpl_123');
  });

  it('should successfully resubmit a rejected template with revisionNotes', async () => {
    setDesignerAuth('designer_owner');
    const rejectedTemplate = {
      id: 'tpl_123',
      designerId: 'designer_owner',
      status: 'rejected',
      revisionCount: 1,
      config: {
        theme: { primaryColor: '#000000', fontFamily: 'Inter' },
        sections: [{ id: 'sec_1', type: 'hero', order: 0, content: { title: 'Fixed Hero' } }],
      },
    };

    mockFindFirst.mockResolvedValue(rejectedTemplate);
    mockUpdate.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ ...rejectedTemplate, status: 'pending', revisionCount: 2 }]),
        }),
      }),
    });

    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: 'tpl_123',
        revisionNotes: 'Memperbaiki tata letak hero dan kontras warna sesuai arahan kurator',
      }),
    });

    const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.status).toBe('pending');
  });

  it('should reject resubmission when max revisions limit is exceeded', async () => {
    setDesignerAuth('designer_owner');
    const exceededTemplate = {
      id: 'tpl_123',
      designerId: 'designer_owner',
      status: 'rejected',
      revisionCount: 3,
      config: {
        theme: { primaryColor: '#000000', fontFamily: 'Inter' },
        sections: [{ id: 'sec_1', type: 'hero', order: 0, content: { title: 'Hero' } }],
      },
    };

    mockFindFirst.mockResolvedValue(exceededTemplate);

    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: 'tpl_123',
        revisionNotes: 'Mencoba revisi lagi ke-4 kali',
      }),
    });

    const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.message).toContain('Batas maksimal pengajuan revisi');
  });

  it('should return 429 when designer rate limit is exceeded', async () => {
    setDesignerAuth('designer_spam');
    const rateLimitKey = 'submit-review:designer_spam';
    for (let i = 0; i < 10; i++) {
      templateSubmitLimiter.check(rateLimitKey);
    }

    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_123' }),
    });

    const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.message).toContain('Batas pengajuan kurasi tercapai');
  });
});
