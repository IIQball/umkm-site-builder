/**
 * Payment service tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { paymentService } from '@/lib/payments/service';
import type { PaymentInitiateInput } from '@/types/payments';

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

describe('PaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('formatCurrency', () => {
    it('should format amount to IDR currency', () => {
      const formatted = paymentService.formatCurrency(10000000); // 100,000 IDR in cents
      expect(formatted).toContain('100');
      expect(formatted).toContain('Rp'); // IDR symbol or text
    });

    it('should handle zero amount', () => {
      const formatted = paymentService.formatCurrency(0);
      expect(formatted).toBeDefined();
    });

    it('should handle large amounts', () => {
      const formatted = paymentService.formatCurrency(999999999900); // 9,999,999,999 IDR
      expect(formatted).toBeDefined();
    });
  });

  describe('initiatePayment', () => {
    it('should validate amount matches ACTIVATION_FEE_IDR', async () => {
      const input: PaymentInitiateInput = {
        amount: 50000, // Wrong amount
        type: 'activation_fee',
      };

      await expect(
        paymentService.initiatePayment('user_123', input, 'http://localhost:3000')
      ).rejects.toThrow(/Invalid amount/);
    });

    it('should require templateId for template_purchase', async () => {
      const input: PaymentInitiateInput = {
        amount: 50000,
        type: 'template_purchase',
      };

      // This should fail validation in the schema, but service should handle gracefully
      await expect(
        paymentService.initiatePayment('user_123', input, 'http://localhost:3000')
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
        paymentService.processWebhook(payload)
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
      await paymentService.processWebhook(payload);
      await expect(
        paymentService.processWebhook(payload)
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
        paymentService.processWebhook(payload)
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
        paymentService.processWebhook(payload)
      ).resolves.toBeUndefined();
    });
  });

  describe('getPaymentDetails', () => {
    it('should return null for non-existent payment', async () => {
      const result = await paymentService.getPaymentDetails('nonexistent');
      expect(result).toBeNull();
    });
  });
});
