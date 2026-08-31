import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance, type Mock } from 'vitest';
import { transactionService } from '@/services';
import type { TransactionInitiateInput } from '@/types';
import { db } from '@/lib/db/client';
import { xenditClient } from '@/lib/finance/xendit';

// Mock xenditClient
vi.mock('@/lib/finance/xendit', () => ({
  xenditClient: {
    createInvoice: vi.fn(),
    getInvoice: vi.fn(),
    verifyWebhookSignature: vi.fn(),
  },
}));

// Mock database - must mock before any imports
vi.mock('@/lib/db/client', () => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    query: {
      transactions: {
        findMany: vi.fn(),
      },
      templates: {
        findMany: vi.fn(),
      },
    },
  };
  return { db: mockDb, getDb: () => mockDb };
});

describe('TransactionService', () => {
  let mockDb: {
    select: Mock;
    insert: Mock;
    update: Mock;
    query: {
      transactions: {
        findMany: Mock;
      },
      templates: {
        findMany: Mock;
      },
    };
  };
  let consoleErrorSpy: MockInstance;
  let consoleWarnSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDb = db as unknown as typeof mockDb;
    
    // Reset mocks to clear any leftover mockReturnValueOnce queues
    mockDb.select.mockReset();
    mockDb.insert.mockReset();
    mockDb.update.mockReset();
    mockDb.query.transactions.findMany.mockReset();
    mockDb.query.templates.findMany.mockReset();

    // Suppress console output during tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Setup default mock chain for select
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    // Setup default mock chain for insert
    mockDb.insert.mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    });

    // Setup default mock chain for update
    mockDb.update.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('formatCurrency', () => {
    it('should format amount to IDR currency', () => {
      const formatted = transactionService.formatCurrency(100000); // 100,000 IDR
      expect(formatted).toContain('100');
      expect(formatted).toContain('Rp'); // IDR symbol or text
    });

    it('should handle zero amount', () => {
      const formatted = transactionService.formatCurrency(0);
      expect(formatted).toBeDefined();
    });

    it('should handle large amounts', () => {
      const formatted = transactionService.formatCurrency(999999999900); // 9,999,999,999 IDR
      expect(formatted).toBeDefined();
    });
  });

  describe('initiateTransaction', () => {
    it('should create template_purchase transaction successfully', async () => {
      const input: TransactionInitiateInput = {
        amount: 50000,
        type: 'template_purchase',
        templateId: 'tpl_123',
        storeId: 'store_123',
      };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'user_123', email: 'user@example.com' }]),
          }),
        }),
      });

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      (xenditClient.createInvoice as Mock).mockResolvedValueOnce({
        id: 'xendit_123',
        invoiceNum: 'INV-user_123-123456',
        invoiceUrl: 'https://xendit.co/invoices/xyz',
      });

      const result = await transactionService.initiateTransaction('user_123', input, 'http://localhost:3000');
      expect(result).toBeDefined();
      expect(result.invoiceId).toBe('INV-user_123-123456');
      expect(result.paymentUrl).toBe('https://xendit.co/invoices/xyz');
    });

    it('should reject if payment already in progress', async () => {
      const input: TransactionInitiateInput = {
        amount: 50000,
        type: 'template_purchase',
        templateId: 'tpl_123',
      };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'user_123', email: 'user@example.com' }]),
          }),
        }),
      });

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ id: 'txn_prev', status: 'pending' }]),
        }),
      });

      await expect(
        transactionService.initiateTransaction('user_123', input, 'http://localhost:3000')
      ).rejects.toThrow(/Payment already in progress/);
    });
  });

  describe('processWebhook', () => {
    it('should handle webhook for PAID status', async () => {
      const payload = {
        id: 'xendit_123',
        external_id: 'INV-user_123-123456',
        amount: 100000,
        paid_amount: 100000,
        status: 'PAID',
        paid: true,
      };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'txn_123',
              status: 'pending',
            },
          ]),
        }),
      });

      const result = await transactionService.processWebhook(payload);
      expect(result.status).toBe('success');
    });

    it('should be idempotent for same transaction', async () => {
      const payload = {
        id: 'xendit_123',
        external_id: 'INV-user_123-123456',
        amount: 100000,
        paid_amount: 100000,
        status: 'PAID',
        paid: true,
      };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'txn_123',
              status: 'success',
            },
          ]),
        }),
      });

      const result = await transactionService.processWebhook(payload);
      expect(result.status).toBe('ignored');
      expect(result.message).toBe('Already processed');
    });

    it('should handle PENDING status', async () => {
      const payload = {
        id: 'xendit_456',
        external_id: 'INV-user_456-456789',
        amount: 100000,
        paid_amount: 0,
        status: 'PENDING',
        paid: false,
      };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'txn_456',
              status: 'pending',
            },
          ]),
        }),
      });

      const result = await transactionService.processWebhook(payload);
      expect(result.status).toBe('success');
    });

    it('should handle FAILED status', async () => {
      const payload = {
        id: 'xendit_789',
        external_id: 'INV-user_789-789012',
        amount: 100000,
        paid_amount: 0,
        status: 'FAILED',
        paid: false,
      };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'txn_789',
              status: 'pending',
            },
          ]),
        }),
      });

      const result = await transactionService.processWebhook(payload);
      expect(result.status).toBe('success');
    });

    it('should handle EXPIRED status', async () => {
      const payload = {
        id: 'xendit_expired',
        external_id: 'INV-user_exp-123456',
        amount: 100000,
        paid_amount: 0,
        status: 'EXPIRED',
        paid: false,
      };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'txn_expired',
              status: 'pending',
            },
          ]),
        }),
      });

      const result = await transactionService.processWebhook(payload);
      expect(result.status).toBe('success');
    });

    it('should gracefully handle unknown transaction (idempotent)', async () => {
      const payload = {
        id: 'xendit_unknown',
        external_id: 'INV-unknown-999999',
        amount: 100000,
        paid_amount: 0,
        status: 'PENDING',
        paid: false,
      };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const result = await transactionService.processWebhook(payload);
      expect(result.status).toBe('not_found');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Webhook received for unknown transaction')
      );
    });
  });

  describe('getTransactionDetails', () => {
    it('should return null for non-existent transaction', async () => {
      const result = await transactionService.getTransactionDetails('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('getTenantOrders', () => {
    it('should query tenant template purchase transactions with template relation', async () => {
      const mockOrders = [
        {
          id: 'txn_1',
          userId: 'user_123',
          type: 'template_purchase',
          amount: 50000,
          status: 'paid',
          template: { id: 'tmpl_1', name: 'Warung Kopi Theme' },
          createdAt: new Date(),
        },
      ];

      mockDb.query.transactions.findMany.mockResolvedValueOnce(mockOrders);

      const orders = await transactionService.getTenantOrders('user_123');
      expect(orders).toHaveLength(1);
      expect(orders[0].id).toBe('txn_1');
      expect(orders[0].template?.name).toBe('Warung Kopi Theme');
      expect(mockDb.query.transactions.findMany).toHaveBeenCalled();
    });
  });

  describe('getDesignerIncomingOrders', () => {
    it('should return empty array if designer has no templates', async () => {
      mockDb.query.templates.findMany.mockResolvedValueOnce([]);

      const orders = await transactionService.getDesignerIncomingOrders('designer_999');
      expect(orders).toEqual([]);
      expect(mockDb.query.templates.findMany).toHaveBeenCalled();
      expect(mockDb.query.transactions.findMany).not.toHaveBeenCalled();
    });

    it('should query transactions for templates owned by the designer', async () => {
      mockDb.query.templates.findMany.mockResolvedValueOnce([
        { id: 'tmpl_1' },
        { id: 'tmpl_2' },
      ]);

      const mockIncomingOrders = [
        {
          id: 'txn_100',
          userId: 'tenant_1',
          type: 'template_purchase',
          amount: 100000,
          status: 'paid',
          templateId: 'tmpl_1',
          template: { id: 'tmpl_1', name: 'Resto Theme', price: 100000 },
          user: { id: 'tenant_1', name: 'Budi Tenant', email: 'budi@tenant.id' },
          commission: { id: 'comm_1', totalAmount: 100000, designerAmount: 70000, platformFee: 30000, transactionId: 'txn_100', designerId: 'designer_1', templateId: 'tmpl_1', createdAt: new Date() },
          createdAt: new Date(),
        },
      ];

      mockDb.query.transactions.findMany.mockResolvedValueOnce(mockIncomingOrders);

      const orders = await transactionService.getDesignerIncomingOrders('designer_1');
      expect(orders).toHaveLength(1);
      expect(orders[0].id).toBe('txn_100');
      expect(orders[0].template?.name).toBe('Resto Theme');
      expect(orders[0].user?.email).toBe('budi@tenant.id');
      expect(orders[0].commission?.designerAmount).toBe(70000);
      expect(mockDb.query.transactions.findMany).toHaveBeenCalled();
    });
  });
});


