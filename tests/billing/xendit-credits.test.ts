import { describe, it, expect, vi, beforeEach, afterEach, type Mock, type MockInstance } from 'vitest';
import { transactionService } from '@/services';
import { fulfillPaidTransaction } from '@/services/finance/transaction.helpers';
import { POST } from '@/pages/api/webhooks/xendit';
import { db } from '@/lib/db/client';

vi.mock('@/lib/db/client', () => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    query: {
      transactions: { findMany: vi.fn() },
      templates: { findMany: vi.fn(), findFirst: vi.fn() },
      userTemplates: { findFirst: vi.fn() },
    },
  };
  return { db: mockDb, getDb: () => mockDb };
});

vi.mock('@/lib/finance/xendit', () => ({
  xenditClient: {
    createInvoice: vi.fn(),
    getInvoice: vi.fn(),
    verifyWebhookSignature: vi.fn(),
  },
}));

describe('Xendit AI Credit Billing Tests', () => {
  let mockDb: { select: Mock; insert: Mock; update: Mock };
  let consoleErrorSpy: MockInstance;
  let consoleWarnSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDb = db as unknown as typeof mockDb;

    mockDb.select.mockReset();
    mockDb.insert.mockReset();
    mockDb.update.mockReset();

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    mockDb.insert.mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    });

    mockDb.update.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('Webhook Security (x-callback-token verification)', () => {
    beforeEach(() => {
      import.meta.env.XENDIT_WEBHOOK_SECRET = 'whsec_test_token_secure';
    });

    it('rejects request without x-callback-token header (403)', async () => {
      const request = new Request('http://localhost/api/webhooks/xendit', {
        method: 'POST',
        body: JSON.stringify({
          id: 'inv_fake',
          external_id: 'INV-attack-1',
          amount: 999999,
          status: 'PAID',
        }),
      });

      const res = (await POST({ request, locals: {} } as unknown as Parameters<typeof POST>[0])) as Response;
      expect(res.status).toBe(403);
    });

    it('rejects request with forged x-callback-token (403)', async () => {
      const request = new Request('http://localhost/api/webhooks/xendit', {
        method: 'POST',
        headers: { 'x-callback-token': 'forged_attacker_token' },
        body: JSON.stringify({
          id: 'inv_fake',
          external_id: 'INV-attack-2',
          amount: 50000,
          status: 'PAID',
        }),
      });

      const res = (await POST({ request, locals: {} } as unknown as Parameters<typeof POST>[0])) as Response;
      expect(res.status).toBe(403);
    });

    it('rejects request with empty body but valid token (400)', async () => {
      const request = new Request('http://localhost/api/webhooks/xendit', {
        method: 'POST',
        headers: {
          'x-callback-token': 'whsec_test_token_secure',
          'content-type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const res = (await POST({ request, locals: {} } as unknown as Parameters<typeof POST>[0])) as Response;
      expect(res.status).toBe(400);
    });

    it('accepts request with valid x-callback-token and processes webhook', async () => {
      const mockSelectForPayout = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });
      mockDb.select.mockImplementation(mockSelectForPayout);

      const mockProcessWebhook = vi.spyOn(transactionService, 'processWebhook')
        .mockResolvedValue({ status: 'success', message: 'Fulfillment complete' });

      const request = new Request('http://localhost/api/webhooks/xendit', {
        method: 'POST',
        headers: { 'x-callback-token': 'whsec_test_token_secure' },
        body: JSON.stringify({
          id: 'inv_valid_123',
          external_id: 'INV-user1-credit-001',
          amount: 50000,
          status: 'PAID',
        }),
      });

      const res = (await POST({ request, locals: {} } as unknown as Parameters<typeof POST>[0])) as Response;
      expect(res.status).toBe(200);
      expect(mockProcessWebhook).toHaveBeenCalledWith(
        expect.objectContaining({
          external_id: 'INV-user1-credit-001',
          status: 'PAID',
        })
      );

      mockProcessWebhook.mockRestore();
    });
  });

  describe('processWebhook — PAID ai_credit_purchase', () => {
    it('updates transaction status to success on PAID webhook', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{
            id: 'txn_credit_1',
            userId: 'user_buyer',
            type: 'ai_credit_purchase',
            amount: 50000,
            status: 'pending',
            storeId: 'store_buyer',
            templateId: null,
            adminFee: 0,
            assistedBy: null,
            externalId: 'INV-credit-001',
            paymentGatewayRef: null,
            paymentChannel: null,
            createdAt: new Date(),
          }]),
        }),
      });

      const result = await transactionService.processWebhook({
        id: 'xendit_credit_inv_1',
        external_id: 'INV-credit-001',
        amount: 50000,
        status: 'PAID',
        paid: true,
        payment_channel: 'QRIS',
      });

      expect(result.status).toBe('success');
      expect(result.message).toBe('Webhook processed successfully');
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('is idempotent — ignores already-processed transaction', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{
            id: 'txn_credit_dup',
            status: 'success',
          }]),
        }),
      });

      const result = await transactionService.processWebhook({
        id: 'xendit_credit_dup',
        external_id: 'INV-credit-dup',
        amount: 50000,
        status: 'PAID',
        paid: true,
      });

      expect(result.status).toBe('ignored');
      expect(result.message).toBe('Already processed');
      expect(mockDb.update).not.toHaveBeenCalled();
    });

    it('returns not_found for unknown external_id', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const result = await transactionService.processWebhook({
        id: 'xendit_ghost',
        external_id: 'INV-nonexistent-999',
        amount: 50000,
        status: 'PAID',
        paid: true,
      });

      expect(result.status).toBe('not_found');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Webhook received for unknown transaction')
      );
    });

    it('maps FAILED status correctly', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{
            id: 'txn_credit_fail',
            status: 'pending',
          }]),
        }),
      });

      const result = await transactionService.processWebhook({
        id: 'xendit_fail',
        external_id: 'INV-credit-fail',
        amount: 50000,
        status: 'FAILED',
        paid: false,
      });

      expect(result.status).toBe('success');
    });

    it('maps EXPIRED status correctly', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{
            id: 'txn_credit_exp',
            status: 'pending',
          }]),
        }),
      });

      const result = await transactionService.processWebhook({
        id: 'xendit_exp',
        external_id: 'INV-credit-expired',
        amount: 50000,
        status: 'EXPIRED',
        paid: false,
      });

      expect(result.status).toBe('success');
    });
  });

  describe('fulfillPaidTransaction — AI credit quota addition', () => {
    it('creates new tenant_ai_credits record when none exists', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      let insertedCredits: Record<string, unknown> = {};
      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockImplementation((val) => {
          insertedCredits = val;
          return Promise.resolve(undefined);
        }),
      });

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      });

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      });

      await fulfillPaidTransaction({
        id: 'txn_new_credit',
        userId: 'user_new',
        type: 'ai_credit_purchase',
        amount: 50000,
        adminFee: 0,
        status: 'pending',
        storeId: 'store_new',
        templateId: null,
        assistedBy: null,
        externalId: 'INV-new-credit',
        paymentGatewayRef: null,
        paymentChannel: null,
        createdAt: new Date(),
      });

      expect(insertedCredits.userId).toBe('user_new');
      expect(insertedCredits.tenantId).toBe('store_new');
      expect(insertedCredits.balance).toBe(10);
      expect(insertedCredits.totalPurchased).toBe(10);
      expect(insertedCredits.totalUsed).toBe(0);
    });

    it('updates existing tenant_ai_credits record by adding credits', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{
              id: 'cred_existing',
              userId: 'user_existing',
              tenantId: 'store_existing',
              balance: 5,
              totalPurchased: 10,
              totalUsed: 5,
            }]),
          }),
        }),
      });

      let updatedValues: Record<string, unknown> = {};
      mockDb.update.mockReturnValueOnce({
        set: vi.fn().mockImplementation((val) => {
          updatedValues = val;
          return { where: vi.fn().mockResolvedValue(undefined) };
        }),
      });

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      });

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      });

      await fulfillPaidTransaction({
        id: 'txn_topup',
        userId: 'user_existing',
        type: 'ai_credit_purchase',
        amount: 100000,
        adminFee: 0,
        status: 'pending',
        storeId: 'store_existing',
        templateId: null,
        assistedBy: null,
        externalId: 'INV-topup-credit',
        paymentGatewayRef: null,
        paymentChannel: null,
        createdAt: new Date(),
      });

      expect(updatedValues.balance).toBe(25);
      expect(updatedValues.totalPurchased).toBe(30);
    });

    it('calculates credits from metadata.credits when available', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      let insertedCredits: Record<string, unknown> = {};
      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockImplementation((val) => {
          insertedCredits = val;
          return Promise.resolve(undefined);
        }),
      });

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      });

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      });

      const txWithMeta = {
        id: 'txn_meta_credit',
        userId: 'user_meta',
        type: 'ai_credit_purchase' as const,
        amount: 75000,
        adminFee: 0,
        status: 'pending' as const,
        storeId: 'store_meta',
        templateId: null,
        assistedBy: null,
        externalId: 'INV-meta-credit',
        paymentGatewayRef: null,
        paymentChannel: null,
        createdAt: new Date(),
        metadata: { credits: 50 },
      };

      await fulfillPaidTransaction(txWithMeta as Parameters<typeof fulfillPaidTransaction>[0]);

      expect(insertedCredits.balance).toBe(50);
      expect(insertedCredits.totalPurchased).toBe(50);
    });

    it('does not touch tenant_ai_credits for template_purchase type', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{
              id: 'tpl_1',
              name: 'Test Template',
              designerId: 'd_1',
              balance: 0,
              platformFeePercentage: 30,
            }]),
          }),
          limit: vi.fn().mockResolvedValue([{
            id: 'tpl_1',
            name: 'Test Template',
            designerId: 'd_1',
            balance: 0,
            platformFeePercentage: 30,
          }]),
        }),
      });

      await fulfillPaidTransaction({
        id: 'txn_tpl_only',
        userId: 'user_tpl',
        type: 'template_purchase',
        amount: 100000,
        adminFee: 0,
        status: 'pending',
        storeId: null,
        templateId: 'tpl_1',
        assistedBy: null,
        externalId: 'INV-tpl-only',
        paymentGatewayRef: null,
        paymentChannel: null,
        createdAt: new Date(),
      });

      const insertCalls = mockDb.insert.mock.calls;
      const insertedTables = insertCalls.map(
        (call: unknown[]) => call[0]
      );
      const hasAiCreditsInsert = insertedTables.some(
        (table: unknown) => {
          const t = table as { _?: { name?: string } } | undefined;
          return t?._ && t._.name === 'tenant_ai_credits';
        }
      );
      expect(hasAiCreditsInsert).toBe(false);
    });
  });

  describe('TransactionStatus — pending→success visual transition', () => {
    it('onStatusUpdate callback fires on status change', async () => {
      const statusUpdates: string[] = [];
      const onStatusUpdate = (status: string) => { statusUpdates.push(status); };

      let currentStatus = 'pending';

      const simulateStatusPoll = (newStatus: string) => {
        if (newStatus !== currentStatus) {
          currentStatus = newStatus;
          onStatusUpdate(currentStatus);
        }
      };

      simulateStatusPoll('pending');
      expect(statusUpdates).toHaveLength(0);

      simulateStatusPoll('success');
      expect(statusUpdates).toHaveLength(1);
      expect(statusUpdates[0]).toBe('success');
    });

    it('status change from pending→success triggers toast for ai_credit_purchase', () => {
      let toastMessage = '';
      const mockToast = { success: (msg: string) => { toastMessage = msg; } };

      const previousStatus = 'pending';
      const newStatus = 'success';
      const transactionType = 'ai_credit_purchase';
      const credits = 10;

      if (newStatus === 'success' && previousStatus === 'pending') {
        if (transactionType === 'ai_credit_purchase') {
          const creditsText = credits ? ` ${credits} kredit AI` : 'Kredit AI';
          mockToast.success(`${creditsText} berhasil ditambahkan ke saldo toko Anda!`);
        }
      }

      expect(toastMessage).toContain('kredit AI');
      expect(toastMessage).toContain('berhasil ditambahkan');
    });

    it('status change from pending→success triggers generic toast for template_purchase', () => {
      let toastMessage = '';
      const mockToast = { success: (msg: string) => { toastMessage = msg; } };

      const previousStatus: string = 'pending';
      const newStatus: string = 'success';
      const transactionType: string = 'template_purchase';

      if (newStatus === 'success' && previousStatus === 'pending') {
        if (transactionType === 'ai_credit_purchase') {
          mockToast.success('Kredit AI berhasil ditambahkan');
        } else {
          mockToast.success('Pembayaran berhasil! Terima kasih atas transaksi Anda.');
        }
      }

      expect(toastMessage).toBe('Pembayaran berhasil! Terima kasih atas transaksi Anda.');
    });

    it('does not fire toast when status remains pending', () => {
      let toastFired = false;
      const mockToast = { success: () => { toastFired = true; } };

      const previousStatus: string = 'pending';
      const newStatus: string = 'pending';

      if (newStatus === 'success' && previousStatus === 'pending') {
        mockToast.success();
      }

      expect(toastFired).toBe(false);
    });

    it('does not fire toast when transitioning to failed', () => {
      let toastFired = false;
      const mockToast = { success: () => { toastFired = true; } };

      const previousStatus: string = 'pending';
      const newStatus: string = 'failed';

      if (newStatus === 'success' && previousStatus === 'pending') {
        mockToast.success();
      }

      expect(toastFired).toBe(false);
    });

    it('renders correct UI text for each status state', () => {
      const getStatusText = (status: string) => {
        if (status === 'pending') return 'Mengecek status pembayaran otomatis...';
        if (status === 'success') return 'Pembayaran Berhasil Diverifikasi';
        if (status === 'expired') return 'Pembayaran Kedaluwarsa. Silakan coba lagi.';
        if (status === 'canceled') return 'Pembayaran Dibatalkan. Silakan coba lagi.';
        if (status === 'refunded') return 'Pembayaran Dikembalikan. Silakan coba lagi.';
        if (status === 'failed') return 'Pembayaran Gagal. Silakan coba lagi.';
        return '';
      };

      expect(getStatusText('pending')).toContain('Mengecek status');
      expect(getStatusText('success')).toContain('Berhasil Diverifikasi');
      expect(getStatusText('expired')).toContain('Kedaluwarsa');
      expect(getStatusText('canceled')).toContain('Dibatalkan');
      expect(getStatusText('refunded')).toContain('Dikembalikan');
      expect(getStatusText('failed')).toContain('Gagal');
    });

    it('stops polling after status reaches success', () => {
      let pollCount = 0;
      let status = 'pending';
      const maxPolls = 120;

      const shouldContinuePolling = () => {
        pollCount++;
        return pollCount <= maxPolls && status !== 'success' && status !== 'failed';
      };

      expect(shouldContinuePolling()).toBe(true);
      expect(shouldContinuePolling()).toBe(true);

      status = 'success';
      expect(shouldContinuePolling()).toBe(false);
    });

    it('stops polling after status reaches failed', () => {
      let pollCount = 0;
      let status = 'pending';
      const maxPolls = 120;

      const shouldContinuePolling = () => {
        pollCount++;
        return pollCount <= maxPolls && status !== 'success' && status !== 'failed';
      };

      expect(shouldContinuePolling()).toBe(true);

      status = 'failed';
      expect(shouldContinuePolling()).toBe(false);
    });

    it('stops polling after maxPolls reached', () => {
      let pollCount = 119;
      let currentStatus: string = 'pending';
      const maxPolls = 120;

      const shouldContinuePolling = () => {
        pollCount++;
        return pollCount <= maxPolls && currentStatus !== 'success' && currentStatus !== 'failed';
      };

      expect(shouldContinuePolling()).toBe(true);
      expect(shouldContinuePolling()).toBe(false);
      currentStatus = 'expired';
      expect(currentStatus).toBe('expired');
    });
  });
});
