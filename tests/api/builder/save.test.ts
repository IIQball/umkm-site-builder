import { describe, it, expect } from 'vitest';
import { POST } from '@/pages/api/builder/save';

describe('POST /api/builder/save', () => {
  it('should return 400 when templateId is missing', async () => {
    const request = new Request('http://localhost:4321/api/builder/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Template' }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('INVALID_REQUEST');
  });

  it('should return 400 when body fails Zod validation', async () => {
    const request = new Request('http://localhost:4321/api/builder/save?templateId=tpl_test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: -50, // invalid negative price
      }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });
});
