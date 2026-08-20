import { describe, it, expect } from 'vitest';
import { GET } from '@/pages/api/templates/index';

describe('GET /api/templates', () => {
  it('should return 200 and a list of public templates', async () => {
    const res = (await GET({
      request: new Request('http://localhost:4321/api/templates'),
      params: {},
    } as unknown as Parameters<typeof GET>[0])) as Response;

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });
});
