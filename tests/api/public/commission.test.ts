import { describe, it, expect } from 'vitest';
import { GET } from '@/pages/api/public/commission';
import { getPlatformFeePercentage } from '@/services/finance';

describe('GET /api/settings/commission', () => {
  it('should return 200 and dynamic commission percentages', async () => {
    const res = (await GET({
      request: new Request('http://localhost:4321/api/settings/commission'),
      params: {},
    } as unknown as Parameters<typeof GET>[0])) as Response;

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.success).toBe(true);
    expect(typeof body.data.platformFeePercentage).toBe('number');
    expect(typeof body.data.designerPercentage).toBe('number');
    expect(body.data.platformFeePercentage + body.data.designerPercentage).toBe(100);
  });

  it('getPlatformFeePercentage should return a number (30 fallback)', async () => {
    const fee = await getPlatformFeePercentage();
    expect(typeof fee).toBe('number');
    expect(fee).toBeGreaterThanOrEqual(0);
    expect(fee).toBeLessThanOrEqual(100);
  });
});
