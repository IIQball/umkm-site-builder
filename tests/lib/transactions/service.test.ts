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
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

describe('TransactionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
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
        amount: 50000, // Wrong amount
        type: 'store_registration',
        storeId: 'store_123',
      };

      await expect(
        transactionService.initiateTransaction('user_123', input, 'http://localhost:3000')
      ).rejects.toThrow(/Invalid amount/);
    });

    it('should require storeId for store_registration', async () => {
      const input: TransactionInitiateInput = {
        amount: 100000,
        type: 'store_registration',
      };

      // This should fail validation in the schema
      await expect(
        transactionService.initiateTransaction('user_123', input, 'http://localhost:3000')
      ).rejects.toThrow();
    });

    it('should require templateId for template_purchase', async () => {
      const input: TransactionInitiateInput = {
        amount: 50000,
        type: 'template_purchase',
      };

      // This should fail validation in the schema, but service should handle gracefully
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

      // Should not throw
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

      // Should not throw on second call
      await transactionService.processWebhook(payload);
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

      await expect(
        transactionService.processWebhook(payload)
      ).resolves.toBeUndefined();
    });
  });

  describe('getTransactionDetails', () => {
    it('should return null for non-existent transaction', async () => {
      const result = await transactionService.getTransactionDetails('nonexistent');
      expect(result).toBeNull();
    });
  });
});
