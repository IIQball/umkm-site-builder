import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { APIContext } from 'astro';
import { POST } from '../../../src/pages/api/analytics/track';

vi.mock('../../../src/services/analytics.service', () => ({
  trackEvent: vi.fn(),
}));

import { trackEvent } from '../../../src/services/analytics.service';

function makeContext(body: unknown): APIContext {
  const request = new Request('http://localhost/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { request } as unknown as APIContext;
}

describe('Analytics Track API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 if storeId missing', async () => {
    const ctx = makeContext({ eventType: 'store_view' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.ok).toBe(false);
  });

  it('returns 400 if eventType missing', async () => {
    const ctx = makeContext({ storeId: 'store-1' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.ok).toBe(false);
  });

  it('returns 400 if eventType is invalid', async () => {
    const ctx = makeContext({ storeId: 'store-1', eventType: 'invalid' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.ok).toBe(false);
  });

  it('successfully tracks store_view event', async () => {
    (trackEvent as Mock).mockResolvedValue({
      storeId: 'store-1',
      eventType: 'store_view',
      totalViews: 1,
      totalWaClicks: 0,
    });

    const ctx = makeContext({ storeId: 'store-1', eventType: 'store_view' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.data.eventType).toBe('store_view');
    expect(data.data.totalViews).toBe(1);
  });

  it('successfully tracks wa_click event', async () => {
    (trackEvent as Mock).mockResolvedValue({
      storeId: 'store-1',
      eventType: 'wa_click',
      totalViews: 5,
      totalWaClicks: 1,
    });

    const ctx = makeContext({ storeId: 'store-1', eventType: 'wa_click' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.data.eventType).toBe('wa_click');
    expect(data.data.totalWaClicks).toBe(1);
  });

  it('returns 404 if store not found', async () => {
    const { AppError } = await import('../../../src/lib/utils/api-handler');
    (trackEvent as Mock).mockRejectedValue(
      new AppError('Toko tidak ditemukan', 404, undefined, 'STORE_NOT_FOUND')
    );

    const ctx = makeContext({ storeId: 'store-nonexistent', eventType: 'store_view' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.ok).toBe(false);
  });
});
