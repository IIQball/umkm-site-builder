import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { POST } from '@/pages/api/webhooks/xendit';
import { transactionService } from '@/services/finance/transaction.service';
import { payoutService } from '@/services/finance/payout.service';
import { db } from '@/lib/db/client';

// Mock DB
vi.mock('@/lib/db/client', () => {
  const mockDb = {
    select: vi.fn(),
  };
  return { db: mockDb };
});

describe('Xendit Webhook API Route', () => {
  let mockProcessWebhook: Mock;
  let mockProcessDisbursementWebhook: Mock;
  const mockSelect = db.select as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    import.meta.env.XENDIT_WEBHOOK_SECRET = 'test_token';

    // Setup spies instead of global mocks to prevent mock pollution
    mockProcessWebhook = vi.spyOn(transactionService, 'processWebhook').mockResolvedValue({ status: 'success', message: 'Fulfillment complete' }) as unknown as Mock;
    mockProcessDisbursementWebhook = vi.spyOn(payoutService, 'processDisbursementWebhook').mockResolvedValue({ status: 'completed', message: 'Payout disbursement processed successfully' }) as unknown as Mock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 403 when x-callback-token header is missing', async () => {
    const request = new Request('http://localhost/api/webhooks/xendit', {
      method: 'POST',
      body: JSON.stringify({ external_id: 'INV-123' }),
    });

    const res = (await POST({ request, locals: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error.code).toBe('FORBIDDEN');
  });

  it('returns 403 when x-callback-token is invalid', async () => {
    const request = new Request('http://localhost/api/webhooks/xendit', {
      method: 'POST',
      headers: { 'x-callback-token': 'wrong_token' },
      body: JSON.stringify({ external_id: 'INV-123' }),
    });

    const res = (await POST({ request, locals: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(403);
  });

  it('delegates to payoutService when payload is a disbursement (COMPLETED)', async () => {
    const request = new Request('http://localhost/api/webhooks/xendit', {
      method: 'POST',
      headers: { 'x-callback-token': 'test_token' },
      body: JSON.stringify({
        id: 'disb_123',
        external_id: 'po_123',
        amount: 100000,
        status: 'COMPLETED',
      }),
    });

    mockSelect.mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([
          {
            id: 'po_123',
          },
        ]),
      }),
    });

    const res = (await POST({ request, locals: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(200);
    expect(mockProcessDisbursementWebhook).toHaveBeenCalledWith(
      expect.objectContaining({
        external_id: 'po_123',
        status: 'COMPLETED',
      })
    );
    expect(mockProcessWebhook).not.toHaveBeenCalled();
  });

  it('delegates to payoutService when payload is a disbursement (FAILED)', async () => {
    const request = new Request('http://localhost/api/webhooks/xendit', {
      method: 'POST',
      headers: { 'x-callback-token': 'test_token' },
      body: JSON.stringify({
        id: 'disb_123',
        external_id: 'po_123',
        amount: 100000,
        status: 'FAILED',
        failure_code: 'INVALID_DESTINATION',
      }),
    });

    mockSelect.mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([
          {
            id: 'po_123',
          },
        ]),
      }),
    });

    const res = (await POST({ request, locals: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(200);
    expect(mockProcessDisbursementWebhook).toHaveBeenCalledWith(
      expect.objectContaining({
        external_id: 'po_123',
        status: 'FAILED',
        failure_code: 'INVALID_DESTINATION',
      })
    );
    expect(mockProcessWebhook).not.toHaveBeenCalled();
  });

  it('delegates to transactionService when payload is a normal invoice', async () => {
    const request = new Request('http://localhost/api/webhooks/xendit', {
      method: 'POST',
      headers: { 'x-callback-token': 'test_token' },
      body: JSON.stringify({
        id: 'inv_123',
        external_id: 'INV-user1-12345',
        amount: 100000,
        status: 'PAID',
      }),
    });

    mockSelect.mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    });

    const res = (await POST({ request, locals: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(200);
    expect(mockProcessWebhook).toHaveBeenCalledWith(
      expect.objectContaining({
        external_id: 'INV-user1-12345',
        status: 'PAID',
      })
    );
    expect(mockProcessDisbursementWebhook).not.toHaveBeenCalled();
  });
});
