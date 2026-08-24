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
    mockProcessDisbursementWebhook = vi.spyOn(payoutService, 'processDisbursementWebhook').mockResolvedValue(undefined) as unknown as Mock;
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
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('FORBIDDEN');
  });

  it('delegates to payoutService when payload is a disbursement (COMPLETED)', async () => {
    // 1. Mock DB select to return a payoutRequest
    mockSelect.mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 'po_123' }]),
        }),
      }),
    });

    const request = new Request('http://localhost/api/webhooks/xendit', {
      method: 'POST',
      headers: {
        'x-callback-token': 'test_token',
      },
      body: JSON.stringify({
        id: 'disb_123',
        external_id: 'po_123',
        status: 'COMPLETED',
        amount: 4200000,
      }),
    });

    // Temporarily set webhook secret environment
    import.meta.env.XENDIT_WEBHOOK_SECRET = 'test_token';

    const res = (await POST({ request, locals: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
    expect(mockProcessDisbursementWebhook).toHaveBeenCalledWith({
      payoutRequestId: 'po_123',
      status: 'COMPLETED',
      failureCode: undefined,
    });
  });

  it('delegates to payoutService when payload is a disbursement (FAILED)', async () => {
    // 1. Mock DB select to return a payoutRequest
    mockSelect.mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 'po_123' }]),
        }),
      }),
    });

    const request = new Request('http://localhost/api/webhooks/xendit', {
      method: 'POST',
      headers: {
        'x-callback-token': 'test_token',
      },
      body: JSON.stringify({
        id: 'disb_123',
        external_id: 'po_123',
        status: 'FAILED',
        failure_code: 'INSUFFICIENT_BALANCE',
        amount: 4200000,
      }),
    });

    // Temporarily set webhook secret environment
    import.meta.env.XENDIT_WEBHOOK_SECRET = 'test_token';

    const res = (await POST({ request, locals: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
    expect(mockProcessDisbursementWebhook).toHaveBeenCalledWith({
      payoutRequestId: 'po_123',
      status: 'FAILED',
      failureCode: 'INSUFFICIENT_BALANCE',
    });
  });

  it('delegates to transactionService when payload is a normal invoice', async () => {
    // 1. Mock DB select to return empty (not a payoutRequest)
    mockSelect.mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    // 2. Mock transactionService success
    mockProcessWebhook.mockResolvedValueOnce({
      status: 'success',
      message: 'Fulfillment complete',
    });

    const request = new Request('http://localhost/api/webhooks/xendit', {
      method: 'POST',
      headers: {
        'x-callback-token': 'test_token',
      },
      body: JSON.stringify({
        id: 'x_123',
        external_id: 'INV-123',
        amount: 100000,
        status: 'PAID',
      }),
    });

    import.meta.env.XENDIT_WEBHOOK_SECRET = 'test_token';

    const res = (await POST({ request, locals: {} } as unknown as Parameters<typeof POST>[0])) as Response;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockProcessWebhook).toHaveBeenCalled();
  });
});
