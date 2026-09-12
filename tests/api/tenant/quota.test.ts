import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { APIContext } from 'astro';
import { GET } from '../../../src/pages/api/tenant/quota';
import { db } from '../../../src/db';

vi.mock('../../../src/db', () => ({
  db: {
    select: vi.fn(),
  },
}));

vi.mock('../../../src/lib/auth', () => ({
  getAuthenticatedUser: vi.fn().mockResolvedValue({ id: 'u1', role: 'tenant', status: 'active' }),
}));

describe('Tenant Quota API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET returns quota count for store', async () => {
    // Mock store
    const mockStore = [{ id: 's1', userId: 'u1' }];
    
    // Mock products count
    const mockProductCount = [{ count: 6 }];
    
    // Mock category count
    const mockCategoryCount = [{ count: 2 }];

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
          where: vi.fn().mockResolvedValue(mockProductCount),
        }),
      })
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockCategoryCount),
        }),
      });

    (db.select as unknown as Mock) = selectMock;

    const request = new Request('http://localhost/api/tenant/quota');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;
    
    const response = (await GET(context)) as Response;
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ok: true,
      data: {
        products: 6,
        categories: 2
      }
    });
  });

  it('GET returns 404 if store not found', async () => {
    // Mock no store
    const mockStore: { id: string, userId: string }[] = [];
    
    const selectMock = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue(mockStore),
        }),
      }),
    });

    (db.select as unknown as Mock) = selectMock;

    const request = new Request('http://localhost/api/tenant/quota');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;
    
    const response = (await GET(context)) as Response;
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.ok).toBe(false);
    expect(data.error.message).toBe('Toko tidak ditemukan');
  });
});
