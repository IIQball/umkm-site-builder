import { describe, it, expect, vi } from 'vitest';
import { GET } from '@/pages/api/directory/search';

vi.mock('@/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          orderBy: vi.fn(() => ({
            limit: vi.fn(() => ({
              offset: vi.fn().mockResolvedValue([])
            }))
          }))
        }))
      }))
    }))
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
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });
});
