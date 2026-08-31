import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { APIContext } from 'astro';
import { GET } from '@/pages/api/storefront/catalog';
import { db } from '@/lib/db/client';
import type { Mock } from 'vitest';

vi.mock('@/lib/db/client', () => ({
  db: {
    query: {
      stores: { findFirst: vi.fn() },
      products: { findMany: vi.fn() },
      storeCategories: { findMany: vi.fn() }
    }
  }
}));

const mockFindStore = db.query.stores.findFirst as unknown as Mock;
const mockFindProducts = db.query.products.findMany as unknown as Mock;
const mockFindCategories = db.query.storeCategories.findMany as unknown as Mock;

describe('GET /api/storefront/catalog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if subdomain is missing', async () => {
    const request = new Request('http://localhost/api/storefront/catalog');
    const response = (await GET({ request } as unknown as APIContext)) as Response;
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 404 if store is not found', async () => {
    const request = new Request('http://localhost/api/storefront/catalog?subdomain=unknown');
    mockFindStore.mockResolvedValue(undefined);
    const response = (await GET({ request } as unknown as APIContext)) as Response;
    expect(response.status).toBe(404);
  });

  it('should return products and categories', async () => {
    const request = new Request('http://localhost/api/storefront/catalog?subdomain=mystore');
    
    mockFindStore.mockResolvedValue({ id: 'store-1', subdomain: 'mystore' });
    mockFindProducts.mockResolvedValue([
      { id: 'p-1', name: 'Product 1' }
    ]);
    mockFindCategories.mockResolvedValue([
      { id: 'c-1', name: 'Cat 1' }
    ]);
    
    const response = (await GET({ request } as unknown as APIContext)) as Response;
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.products).toHaveLength(1);
    expect(data.data.categories).toHaveLength(1);
  });
});
