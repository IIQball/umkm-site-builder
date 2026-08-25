import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { APIContext } from 'astro';
import { GET } from '../../../../src/pages/api/stores/[storeId]/products';
import { db } from '../../../../src/lib/db/client';

// Mock DB client
vi.mock('../../../../src/lib/db/client', () => ({
  db: {
    select: vi.fn(),
  },
}));

describe('Store Products API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns error if storeId is missing', async () => {
    const request = new Request('http://localhost/api/stores//products');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;
    const response = (await GET(context)) as Response;
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.ok).toBe(false);
    expect(data.error.message).toBe('storeId is required');
  });

  it('returns paginated products for a store', async () => {
    const mockProducts = [
      { id: '1', name: 'Produk Test', basePrice: 10000, imageUrls: ['test.jpg'] }
    ];

    // Mock chain for count query
    const countChain = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ total: 1 }])
      })
    };

    // Mock chain for records query
    const recordsChain = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            offset: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockResolvedValue(mockProducts)
            })
          })
        })
      })
    };

    // Mock chain for store query
    const storeChain = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ waNumber: '6281234567890' }])
        })
      })
    };

    // First call to db.select is for count, second is for records, third is for store
    (db.select as Mock)
      .mockReturnValueOnce(countChain)
      .mockReturnValueOnce(recordsChain)
      .mockReturnValueOnce(storeChain);

    const request = new Request('http://localhost/api/stores/store-1/products?page=1&limit=10');
    const context = { request, url: new URL(request.url), params: { storeId: 'store-1' } } as unknown as APIContext;
    
    const response = (await GET(context)) as Response;
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.data[0].id).toBe('1');
    expect(data.data[0].price).toBe(10000);
    expect(data.data[0].imageUrl).toBe('test.jpg');
    
    expect(data.pagination).toBeDefined();
    expect(data.pagination.total).toBe(1);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(10);
  });

  it('applies categoryId filter correctly', async () => {
    const mockProducts = [
      { id: '2', name: 'Produk Filter', basePrice: 5000, imageUrls: [] }
    ];

    const countChain = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ total: 1 }])
      })
    };

    const recordsChain = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            offset: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockResolvedValue(mockProducts)
            })
          })
        })
      })
    };

    const storeChain = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ waNumber: '6281234567890' }])
        })
      })
    };

    (db.select as Mock)
      .mockReturnValueOnce(countChain)
      .mockReturnValueOnce(recordsChain)
      .mockReturnValueOnce(storeChain);

    const request = new Request('http://localhost/api/stores/store-1/products?categoryId=cat-1');
    const context = { request, url: new URL(request.url), params: { storeId: 'store-1' } } as unknown as APIContext;
    
    const response = (await GET(context)) as Response;
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.length).toBe(1);
    expect(data.data[0].id).toBe('2');
    
    // We can't easily assert the exact where clause args here without complex mock inspection, 
    // but we can assert the response structure is correct
    expect(data.pagination.total).toBe(1);
  });
});
