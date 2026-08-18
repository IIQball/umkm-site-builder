import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../src/pages/api/categories/index';
import { db } from '../src/db/index';

// Mock DB and Auth
vi.mock('@/db', () => ({
  db: {
    query: {
      stores: { findFirst: vi.fn() },
      productCategories: { findMany: vi.fn(), findFirst: vi.fn() },
    },
    insert: vi.fn(() => ({ 
      values: vi.fn(() => Promise.resolve()) 
    })),
    update: vi.fn(() => ({ 
      set: vi.fn(() => ({ 
        where: vi.fn(() => ({ 
          returning: vi.fn(() => Promise.resolve([])) 
        })) 
      })) 
    })),
  },
  productCategories: { id: 'id', name: 'name', description: 'description', storeId: 'store_id', deletedAt: 'deleted_at' },
  stores: { id: 'id', userId: 'user_id', deletedAt: 'deleted_at' }
}));

vi.mock('@/lib/auth/session', () => ({
  requireSession: vi.fn(() => ({ userId: 'user_123', role: 'tenant' })),
}));

describe('Categories API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET should return categories for valid store', async () => {
    const mockStore = { id: 'store_1' };
    const mockCategories = [{ id: 'cat_1', name: 'Food' }];
    
    (db.query.stores.findFirst as any).mockResolvedValue(mockStore);
    (db.query.productCategories.findMany as any).mockResolvedValue(mockCategories);

    const res = (await GET({ 
      request: new Request('http://localhost/api/categories'),
      cookies: { get: () => ({ value: 'valid' }) }
    } as any)) as Response;
    
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.data).toEqual(mockCategories);
  });

  it('POST should create category', async () => {
    const mockStore = { id: 'store_1' };
    (db.query.stores.findFirst as any).mockResolvedValue(mockStore);

    const res = (await POST({
      request: new Request('http://localhost/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name: 'Coffee', description: 'Best beans' }),
      }),
      cookies: { get: () => ({ value: 'valid' }) }
    } as any)) as Response;

    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.ok).toBe(true);
    expect(data.data.name).toBe('Coffee');
  });
});
