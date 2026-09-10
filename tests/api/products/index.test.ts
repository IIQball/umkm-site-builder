import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { APIContext } from 'astro';
import { GET, POST } from '../../../src/pages/api/products/index';
import { PUT, DELETE } from '../../../src/pages/api/products/[id]';
import { db } from '../../../src/lib/db/client';

// Mock DB client
vi.mock('../../../src/lib/db/client', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

describe('Products API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('returns products for a store', async () => {
      const mockProducts = [{ id: '1', name: 'Produk Test' }];
      (db.select as Mock).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue(mockProducts),
          }),
        }),
      });

      const request = new Request('http://localhost/api/products?storeId=store-1');
      const context = { request, url: new URL(request.url) } as unknown as APIContext;
      const response = (await GET(context)) as Response;
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.data).toEqual(mockProducts);
    });

    it('returns error if storeId is missing', async () => {
      const request = new Request('http://localhost/api/products');
      const context = { request, url: new URL(request.url) } as unknown as APIContext;
      const response = (await GET(context)) as Response;
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.ok).toBe(false);
    });
  });

  describe('POST /api/products', () => {
    it('creates a new product', async () => {
      (db.select as Mock).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 's1', userId: 'u1' }]),
          }),
        }),
      });

      (db.insert as Mock).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 'new-id' }]),
        }),
      });

      (db.update as Mock).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({}),
        }),
      });

      const request = new Request('http://localhost/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: 's1',
          categoryId: 'c1',
          name: 'New Product',
          slug: 'new-product',
          basePrice: 10000,
          imageUrls: ['https://res.cloudinary.com/test/image.webp'],
        }),
      });

      const locals = {
        user: { id: 'u1', role: 'tenant', status: 'active', email: 'test@example.com' },
      };

      const context = { request, locals, url: new URL(request.url) } as unknown as APIContext;
      const response = (await POST(context)) as Response;

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.ok).toBe(true);
    });
  });

  describe('PUT /api/products/[id]', () => {
    it('updates a product using JSON', async () => {
      let selectCount = 0;
      (db.select as Mock).mockImplementation(() => {
        selectCount++;
        if (selectCount === 1) {
          return {
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockResolvedValue([{ id: '1', storeId: 's1', imageUrls: [] }]),
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
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: '1' }]),
          }),
        }),
      });

      const request = new Request('http://localhost/api/products/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: false }),
      });

      const context = { request, locals: { user: { id: 'u1', role: 'tenant', status: 'active' } }, params: { id: '1' } } as unknown as APIContext;
      const response = (await PUT(context)) as Response;
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
    });
  });

  describe('DELETE /api/products/[id]', () => {
    it('soft deletes a product', async () => {
      let selectCount = 0;
      (db.select as Mock).mockImplementation(() => {
        selectCount++;
        if (selectCount === 1) {
          return {
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockResolvedValue([{ id: '1', storeId: 's1', imageUrls: [] }]),
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
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: '1' }]),
          }),
        }),
      });

      const request = new Request('http://localhost/api/products/1', {
        method: 'DELETE',
      });

      const context = { request, locals: { user: { id: 'u1', role: 'tenant', status: 'active' } }, params: { id: '1' } } as unknown as APIContext;
      const response = (await DELETE(context)) as Response;
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
    });
  });
});
