import { describe, it, expect, vi, beforeEach } from 'vitest';
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

describe('Categories API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET returns categories for store', async () => {
    const mockCategories = [{ id: '1', name: 'Test' }];
    (db.select as any).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(mockCategories),
      }),
    });

    const request = new Request('http://localhost/api/categories?storeId=store-1');
    const response = (await GET({ request } as any)) as Response;
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockCategories);
  });

  it('POST creates a category', async () => {
    // No existing slug conflict
    (db.query.storeCategories.findFirst as any).mockResolvedValue(null);
    (db.insert as any).mockReturnValue({
      values: vi.fn().mockResolvedValue({}),
    });

    const request = new Request('http://localhost/api/categories', {
      method: 'POST',
      body: JSON.stringify({ storeId: 's1', name: 'New', slug: 'new' }),
    });
    const response = (await POST({ request } as any)) as Response;

    expect(response.status).toBe(201);
  });

  it('PATCH updates a category', async () => {
    // findFirst for current category
    (db.query.storeCategories.findFirst as any)
      .mockResolvedValueOnce({ id: '1', storeId: 's1', slug: 'old' })  // current cat
      .mockResolvedValueOnce(null);  // no slug conflict

    (db.update as any).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    });

    const request = new Request('http://localhost/api/categories', {
      method: 'PATCH',
      body: JSON.stringify({ id: '1', name: 'Updated', slug: 'up' }),
    });
    const response = (await PATCH({ request } as any)) as Response;

    expect(response.status).toBe(200);
  });

  it('DELETE soft deletes a category', async () => {
    // findFirst returns the category to delete
    (db.query.storeCategories.findFirst as any).mockResolvedValue({
      id: '1',
      slug: 'test-slug',
    });

    (db.update as any).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    });

    const request = new Request('http://localhost/api/categories?id=1', {
      method: 'DELETE',
    });
    const response = (await DELETE({ request } as any)) as Response;

    expect(response.status).toBe(200);
  });
});
