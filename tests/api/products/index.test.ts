import { describe, it, expect, vi, beforeEach } from 'vitest';
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
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockProducts),
        }),
      });

      const request = new Request('http://localhost/api/products?storeId=store-1');
      const response = (await GET({ request, url: new URL(request.url) } as any)) as Response;
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.data).toEqual(mockProducts);
    });

    it('returns error if storeId is missing', async () => {
      const request = new Request('http://localhost/api/products');
      const response = (await GET({ request, url: new URL(request.url) } as any)) as Response;
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.ok).toBe(false);
    });
  });

  describe('POST /api/products', () => {
    it('creates a new product', async () => {
      (db.insert as any).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 'new-id' }]),
        }),
      });

      const formData = new FormData();
      formData.append('storeId', 's1');
      formData.append('categoryId', 'c1');
      formData.append('name', 'New Product');
      formData.append('slug', 'new-product');
      formData.append('basePrice', '10000');

      const request = new Request('http://localhost/api/products', {
        method: 'POST',
        body: formData,
      });
      const response = (await POST({ request, url: new URL(request.url) } as any)) as Response;
      
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.ok).toBe(true);
    });
  });

  describe('PUT /api/products/[id]', () => {
    it('updates a product using JSON', async () => {
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ id: '1', imageUrls: [] }]),
        }),
      });

      (db.update as any).mockReturnValue({
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
      
      const response = (await PUT({ request, params: { id: '1' } } as any)) as Response;
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
    });
  });

  describe('DELETE /api/products/[id]', () => {
    it('soft deletes a product', async () => {
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ id: '1', imageUrls: [] }]),
        }),
      });
      (db.update as any).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: '1' }]),
          }),
        }),
      });

      const request = new Request('http://localhost/api/products/1', {
        method: 'DELETE',
      });
      
      const response = (await DELETE({ request, params: { id: '1' } } as any)) as Response;
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
    });
  });
});
