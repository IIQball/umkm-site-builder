import { describe, it, expect, vi } from 'vitest';
import { GET } from '@/pages/api/directory/search';

type MockQueryBuilder = {
  from: () => MockQueryBuilder;
  leftJoin: () => MockQueryBuilder;
  where: () => MockQueryBuilder;
  orderBy: () => MockQueryBuilder;
  limit: () => MockQueryBuilder;
  offset: () => Promise<unknown[]>;
  then: (resolve: (val: unknown[]) => void) => void;
};

vi.mock('@/db', () => ({
  db: {
    select: vi.fn((fields: Record<string, unknown> | undefined) => {
      const isCount = fields && fields.count;
      const obj = {} as MockQueryBuilder;
      obj.from = vi.fn(() => obj);
      obj.leftJoin = vi.fn(() => obj);
      obj.where = vi.fn(() => obj);
      obj.orderBy = vi.fn(() => obj);
      obj.limit = vi.fn(() => obj);
      obj.offset = vi.fn(() => Promise.resolve(isCount ? [{ count: 1 }] : []));
      obj.then = (resolve: (val: unknown[]) => void) => resolve(isCount ? [{ count: 1 }] : []);
      return obj;
    })
  }
}));

describe('Directory Search API', () => {
  it('should validate query parameters', async () => {
    const res = (await GET({
      request: new Request('http://localhost:4321/api/directory/search?page=-1'),
      params: {},
    } as unknown as Parameters<typeof GET>[0])) as Response;

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return successfully when valid parameters are provided', async () => {
    const res = (await GET({
      request: new Request('http://localhost:4321/api/directory/search?page=1&limit=10'),
      params: {},
    } as unknown as Parameters<typeof GET>[0])) as Response;

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data).toEqual([]);
    expect(body.meta.total).toBe(1);
  });

  it('should support category filter', async () => {
    const res = (await GET({
      request: new Request('http://localhost:4321/api/directory/search?category=kuliner-makanan'),
      params: {},
    } as unknown as Parameters<typeof GET>[0])) as Response;

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
