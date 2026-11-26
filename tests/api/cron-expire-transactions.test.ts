import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { APIContext } from 'astro';
import { POST, GET } from '@/pages/api/cron/expire-transactions';
import { transactionService } from '@/services/finance';

describe('Cron: Expire Stale Transactions Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = 'super-secret-cron-token';
    vi.spyOn(transactionService, 'expireStalePendingTransactions').mockImplementation(async () => ({
      expiredCount: 0,
      expiredIds: [],
      cutoffDate: new Date().toISOString(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects request with missing cron secret header', async () => {
    const request = new Request('http://localhost:4321/api/cron/expire-transactions', {
      method: 'POST',
    });

    const response = await POST({ request } as unknown as APIContext);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it('rejects request with invalid cron secret', async () => {
    const request = new Request('http://localhost:4321/api/cron/expire-transactions', {
      method: 'POST',
      headers: {
        'x-cron-secret': 'wrong-token',
      },
    });

    const response = await POST({ request } as unknown as APIContext);
    expect(response.status).toBe(401);
  });

  it('accepts request with valid x-cron-secret header', async () => {
    vi.spyOn(transactionService, 'expireStalePendingTransactions').mockResolvedValueOnce({
      expiredCount: 3,
      expiredIds: ['tx_1', 'tx_2', 'tx_3'],
      cutoffDate: new Date().toISOString(),
    });

    const request = new Request('http://localhost:4321/api/cron/expire-transactions', {
      method: 'POST',
      headers: {
        'x-cron-secret': 'super-secret-cron-token',
      },
    });

    const response = await POST({ request } as unknown as APIContext);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.expiredCount).toBe(3);
    expect(transactionService.expireStalePendingTransactions).toHaveBeenCalledWith(24);
  });

  it('accepts request with Authorization Bearer header', async () => {
    vi.spyOn(transactionService, 'expireStalePendingTransactions').mockResolvedValueOnce({
      expiredCount: 0,
      expiredIds: [],
      cutoffDate: new Date().toISOString(),
    });

    const request = new Request('http://localhost:4321/api/cron/expire-transactions', {
      method: 'POST',
      headers: {
        authorization: 'Bearer super-secret-cron-token',
      },
    });

    const response = await POST({ request } as unknown as APIContext);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.expiredCount).toBe(0);
  });

  it('supports GET with query param ?secret=...', async () => {
    vi.spyOn(transactionService, 'expireStalePendingTransactions').mockResolvedValueOnce({
      expiredCount: 1,
      expiredIds: ['tx_old'],
      cutoffDate: new Date().toISOString(),
    });

    const request = new Request('http://localhost:4321/api/cron/expire-transactions?secret=super-secret-cron-token', {
      method: 'GET',
    });

    const response = await GET({ request } as unknown as APIContext);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.expiredCount).toBe(1);
  });
});
