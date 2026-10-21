import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { APIContext } from 'astro';
import { GET } from '../../../src/pages/api/tenant/ai/history';
import { db } from '../../../src/db';
import { getAuthenticatedUser } from '../../../src/lib/auth';

vi.mock('../../../src/db', () => ({
  db: {
    select: vi.fn(),
  },
}));

vi.mock('../../../src/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
}));

describe('Tenant AI History API - GET /api/tenant/ai/history', () => {
  const mockUser = { id: 'user_tenant_01', role: 'tenant', status: 'active' };
  const mockStore = [{ id: 'store_tenant_01' }];

  const mockLogItems = [
    {
      id: 'log_01',
      featureType: 'packaging_mockup',
      modelUsed: 'gpt-image-2.5-sunburst',
      sizeRatio: '1:1',
      promptFinal: '3D standing pouch coffee',
      cloudinaryUrl: 'https://res.cloudinary.com/demo/image/upload/sample1.webp',
      creditsDeducted: 1,
      createdAt: new Date('2026-10-20T10:00:00Z'),
    },
    {
      id: 'log_02',
      featureType: 'logo',
      modelUsed: 'gpt-image-2.5-sunburst',
      sizeRatio: '1:1',
      promptFinal: 'Minimalist coffee logo',
      cloudinaryUrl: 'https://res.cloudinary.com/demo/image/upload/sample2.webp',
      creditsDeducted: 1,
      createdAt: new Date('2026-10-19T14:30:00Z'),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when request is unauthenticated', async () => {
    (getAuthenticatedUser as unknown as Mock).mockResolvedValueOnce(null);

    const request = new Request('http://localhost/api/tenant/ai/history');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;

    const response = (await GET(context)) as Response;
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.error.message).toContain('login');
  });

  it('returns empty items array when tenant has not created a store yet', async () => {
    (getAuthenticatedUser as unknown as Mock).mockResolvedValueOnce(mockUser);

    const selectMock = vi.fn().mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    (db.select as unknown as Mock) = selectMock;

    const request = new Request('http://localhost/api/tenant/ai/history');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;

    const response = (await GET(context)) as Response;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data).toEqual({ items: [], total: 0 });
  });

  it('returns asset history successfully for the authenticated tenant store', async () => {
    (getAuthenticatedUser as unknown as Mock).mockResolvedValueOnce(mockUser);

    const selectMock = vi.fn()
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(mockStore),
          }),
        }),
      })
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue(mockLogItems),
          }),
        }),
      });
    (db.select as unknown as Mock) = selectMock;

    const request = new Request('http://localhost/api/tenant/ai/history');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;

    const response = (await GET(context)) as Response;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data.total).toBe(2);
    expect(body.data.items).toHaveLength(2);
    expect(body.data.items[0].id).toBe('log_01');
    expect(body.data.items[0].featureType).toBe('packaging_mockup');
  });

  it('filters by featureType query param when provided', async () => {
    (getAuthenticatedUser as unknown as Mock).mockResolvedValueOnce(mockUser);

    const logoItems = [mockLogItems[1]];
    const selectMock = vi.fn()
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(mockStore),
          }),
        }),
      })
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue(logoItems),
          }),
        }),
      });
    (db.select as unknown as Mock) = selectMock;

    const request = new Request('http://localhost/api/tenant/ai/history?featureType=logo');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;

    const response = (await GET(context)) as Response;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data.total).toBe(1);
    expect(body.data.items[0].featureType).toBe('logo');
  });

  it('handles database exceptions gracefully and returns 500 error', async () => {
    (getAuthenticatedUser as unknown as Mock).mockResolvedValueOnce(mockUser);

    const selectMock = vi.fn().mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockRejectedValue(new Error('Database connection failed')),
        }),
      }),
    });
    (db.select as unknown as Mock) = selectMock;

    const request = new Request('http://localhost/api/tenant/ai/history');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;

    const response = (await GET(context)) as Response;
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.ok).toBe(false);
    expect(body.error.message).toContain('Gagal mengambil riwayat');
  });
});
