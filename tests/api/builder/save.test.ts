import { describe, it, expect } from 'vitest';
import { POST } from '@/pages/api/builder/save';

describe('POST /api/builder/save', () => {
  it('should return 401 when request has no auth session', async () => {
    const request = new Request('http://localhost:4321/api/builder/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Template' }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 401 for body with Zod issues when unauthenticated', async () => {
    const request = new Request('http://localhost:4321/api/builder/save?templateId=tpl_test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: -50, // would be invalid, but auth check fires first
      }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    // Auth guard fires before validation
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });
});
