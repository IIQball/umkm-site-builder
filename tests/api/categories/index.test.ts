import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { APIContext } from 'astro';
import { GET, POST, PATCH, DELETE } from '../../../src/pages/api/categories/index';
import { db } from '../../../src/db';

vi.mock('../../../src/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    query: {
      storeCategories: {
        findFirst: vi.fn(),
      },
    },
  },
}));

vi.mock('../../../src/lib/auth', () => ({
  getAuthenticatedUser: vi.fn().mockResolvedValue({ id: 'u1', role: 'tenant', status: 'active' }),
  canManageStore: (
    user: { id?: string; role?: string; status?: string } | null,
    store: { userId?: string; registeredBy?: string | null } | null
  ) => {
    if (!user || user.status !== 'active') return false;
    if (user.role === 'superadmin') return true;
    if (user.role === 'tenant') return store?.userId === user.id;
    if (user.role === 'admin') return store?.registeredBy === user.id;
    return false;
  },
}));

describe('Categories API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (db.update as unknown as Mock).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    });
  });

  it('GET returns categories for store', async () => {
    const mockCategories = [{ id: '1', name: 'Test' }];
    (db.select as unknown as Mock).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(mockCategories),
      }),
    });

    const request = new Request('http://localhost/api/categories?storeId=store-1');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;
    const response = (await GET(context)) as Response;
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, data: mockCategories });
  });

  it('POST creates a category', async () => {
    (db.select as unknown as Mock).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 's1', userId: 'u1' }]),
        }),
      }),
    });
    // No existing slug conflict
    (db.query.storeCategories.findFirst as unknown as Mock).mockResolvedValue(null);
    (db.insert as unknown as Mock).mockReturnValue({
      values: vi.fn().mockResolvedValue({}),
    });

    const request = new Request('http://localhost/api/categories', {
      method: 'POST',
      body: JSON.stringify({ storeId: 's1', name: 'New', slug: 'new' }),
    });
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;
    const response = (await POST(context)) as Response;

    expect(response.status).toBe(201);
  });

  it('PATCH updates a category', async () => {
    (db.select as unknown as Mock).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 's1', userId: 'u1' }]),
        }),
      }),
    });
    // findFirst for current category
    (db.query.storeCategories.findFirst as unknown as Mock)
      .mockResolvedValueOnce({ id: '1', storeId: 's1', slug: 'old' }) // current cat
      .mockResolvedValueOnce(null); // no slug conflict

    (db.update as unknown as Mock).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    });

    const request = new Request('http://localhost/api/categories', {
      method: 'PATCH',
      body: JSON.stringify({ id: '1', name: 'Updated', slug: 'up' }),
    });
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;
    const response = (await PATCH(context)) as Response;

    expect(response.status).toBe(200);
  });

  it('DELETE soft deletes a category', async () => {
    (db.select as unknown as Mock).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 's1', userId: 'u1' }]),
        }),
      }),
    });
    // findFirst returns the category to delete
    (db.query.storeCategories.findFirst as unknown as Mock).mockResolvedValue({
      id: '1',
      storeId: 's1',
      slug: 'test-slug',
    });

    (db.update as unknown as Mock).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    });

    const request = new Request('http://localhost/api/categories?id=1', {
      method: 'DELETE',
    });
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;
    const response = (await DELETE(context)) as Response;

    expect(response.status).toBe(200);
  });
});
