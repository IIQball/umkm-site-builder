import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { APIContext } from 'astro';
import { PATCH } from '@/pages/api/products/[id]/stock';
import { db } from '@/db/index';
import * as auth from '@/lib/auth';

// Mock DB client
vi.mock('@/db/index', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
  products: { id: 'id' },
}));

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
}));

describe('PATCH /api/products/[id]/stock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates product stock status', async () => {
    (auth.getAuthenticatedUser as Mock).mockResolvedValue({ id: 'u1', role: 'tenant', status: 'active' });
    
    let selectCount = 0;
    (db.select as Mock).mockImplementation(() => {
      selectCount++;
      if (selectCount === 1) {
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{ id: '1', storeId: 's1', isAvailable: true }]),
            }),
          }),
        };
      }
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 's1', userId: 'u1' }]),
          }),
        }),
      };
    });

    (db.update as Mock).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ id: '1' }]),
      }),
    });

    const request = new Request('http://localhost/api/products/1/stock', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: false }),
    });

    const context = { request, params: { id: '1' } } as unknown as APIContext;
    const response = (await PATCH(context)) as Response;
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.data.isAvailable).toBe(false);
  });

  it('returns 401 if not logged in', async () => {
    (auth.getAuthenticatedUser as Mock).mockResolvedValue(null);

    const request = new Request('http://localhost/api/products/1/stock', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: false }),
    });

    const context = { request, params: { id: '1' } } as unknown as APIContext;
    const response = (await PATCH(context)) as Response;
    
    expect(response.status).toBe(401);
  });
});
