/**
 * Transaction service tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { transactionService } from '@/services/transaction.service';
import type { TransactionInitiateInput } from '@/types/transactions';

// Mock xenditClient
vi.mock('@/lib/xendit', () => ({
  xenditClient: {
    createInvoice: vi.fn(),
    getInvoice: vi.fn(),
    verifyWebhookSignature: vi.fn(),
  },
}));

// Mock database
vi.mock('@/lib/db/client', () => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  };
  return { db: mockDb };
});

describe('TransactionService', () => {
  let mockDb: any;
  let consoleErrorSpy: any;
  let consoleWarnSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDb = require('@/lib/db/client').db;
    
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
      const formatted = transactionService.formatCurrency(10000000); // 100,000 IDR in cents
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
    it('should validate amount matches STORE_REGISTRATION_FEE_IDR', async () => {
      const input: TransactionInitiateInput = {
        amount: 50000,
        type: 'store_registration',
        storeId: 'store_123',
      };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'user_123', email: 'user@example.com' }]),
          }),
        }),
      });

      await expect(
        transactionService.initiateTransaction('user_123', input, 'http://localhost:3000')
      ).rejects.toThrow(/Invalid amount/);
    });

    it('should allow store_registration without storeId (per US-02)', async () => {
      const input: TransactionInitiateInput = {
        amount: 100000,
        type: 'store_registration',
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

      const mockXendit = require('@/lib/xendit').xenditClient;
      mockXendit.createInvoice.mockResolvedValueOnce({
        id: 'xendit_123',
        invoiceNum: 'INV-user_123-123456',
        invoiceUrl: 'https://xendit.co/invoices/xyz',
      });

      const result = await transactionService.initiateTransaction('user_123', input, 'http://localhost:3000');
      expect(result).toBeDefined();
      expect(result.invoiceId).toBe('INV-user_123-123456');
    });

    it('should require templateId for template_purchase (per US-09)', async () => {
      const input: TransactionInitiateInput = {
        amount: 50000,
        type: 'template_purchase',
      };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'user_123', email: 'user@example.com' }]),
          }),
        }),
      });

      await expect(
        transactionService.initiateTransaction('user_123', input, 'http://localhost:3000')
      ).rejects.toThrow();
    });

    it('should require storeId for template_purchase (per US-09)', async () => {
      const input: TransactionInitiateInput = {
        amount: 50000,
        type: 'template_purchase',
        templateId: 'template_123',
      };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'user_123', email: 'user@example.com' }]),
          }),
        }),
      });

      await expect(
        transactionService.initiateTransaction('user_123', input, 'http://localhost:3000')
      ).rejects.toThrow();
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

      await expect(
        transactionService.processWebhook(payload)
      ).resolves.toBeUndefined();
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

      await transactionService.processWebhook(payload);

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

      await expect(
        transactionService.processWebhook(payload)
      ).resolves.toBeUndefined();
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

      await expect(
        transactionService.processWebhook(payload)
      ).resolves.toBeUndefined();
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

      await expect(
        transactionService.processWebhook(payload)
      ).resolves.toBeUndefined();
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

      await expect(
        transactionService.processWebhook(payload)
      ).resolves.toBeUndefined();
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

      await expect(
        transactionService.processWebhook(payload)
      ).resolves.toBeUndefined();

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
});


