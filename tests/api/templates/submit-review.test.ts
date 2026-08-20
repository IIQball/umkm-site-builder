import { describe, it, expect } from 'vitest';
import { POST } from '@/pages/api/templates/submit-review';

describe('POST /api/templates/submit-review', () => {
  it('should return 400 when templateId is missing', async () => {
    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
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

  it('should return 404 when template does not exist', async () => {
    const request = new Request('http://localhost:4321/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_nonexistent_999999' }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('NOT_FOUND');
  });
});
