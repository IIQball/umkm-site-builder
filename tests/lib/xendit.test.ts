/**
 * Xendit client tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { XenditClient } from '@/lib/xendit';
import crypto from 'crypto';

describe('XenditClient', () => {
  let client: XenditClient;
  let mockFetch: any;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new XenditClient();
    mockFetch = vi.spyOn(global, 'fetch' as any);
  });

  describe('verifyWebhookSignature', () => {
    it('should verify valid webhook signature', () => {
      const secret = 'test-secret';
      const payload = JSON.stringify({ id: 'inv_123', amount: 100000 });
      const signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      // Temporarily override the secret for testing
      const originalSecret = (client as any).webhookSecret;
      (client as any).webhookSecret = secret;

      const isValid = client.verifyWebhookSignature(payload, signature);
      expect(isValid).toBe(true);

      (client as any).webhookSecret = originalSecret;
    });

    it('should reject invalid webhook signature', () => {
      const payload = JSON.stringify({ id: 'inv_123', amount: 100000 });
      const invalidSignature = 'invalid_signature_12345';

      const isValid = client.verifyWebhookSignature(payload, invalidSignature);
      expect(isValid).toBe(false);
    });

    it('should reject tampered payload', () => {
      const secret = 'test-secret';
      const payload = JSON.stringify({ id: 'inv_123', amount: 100000 });
      const signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const originalSecret = (client as any).webhookSecret;
      (client as any).webhookSecret = secret;

      // Tamper with payload
      const tamperedPayload = JSON.stringify({ id: 'inv_123', amount: 200000 });
      const isValid = client.verifyWebhookSignature(tamperedPayload, signature);
      expect(isValid).toBe(false);

      (client as any).webhookSecret = originalSecret;
    });
  });

  describe('createInvoice', () => {
    it('should call Xendit API with correct parameters', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          id: 'xendit_inv_123',
          external_id: 'INV-user_123-123456',
          invoice_url: 'https://xendit.co/invoices/xyz',
          status: 'PENDING',
          amount: 100000,
          paid_amount: 0,
          currency: 'IDR',
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await client.createInvoice({
        invoiceNum: 'INV-user_123-123456',
        amount: 100000,
        payerEmail: 'user@example.com',
        description: 'Account Activation',
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        successRedirectUrl: 'http://localhost:3000/checkout/success',
        failureRedirectUrl: 'http://localhost:3000/checkout/failed',
      });

      expect(result).toBeDefined();
      expect(result.id).toBe('xendit_inv_123');
      expect(result.status).toBe('PENDING');
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle Xendit API errors', async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({
          error_code: 'INVALID_REQUEST',
          message: 'Invalid request',
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(
        client.createInvoice({
          invoiceNum: 'INV-user_123-123456',
          amount: 100000,
          payerEmail: 'user@example.com',
          description: 'Account Activation',
          expiryDate: new Date(),
          successRedirectUrl: 'http://localhost:3000/checkout/success',
          failureRedirectUrl: 'http://localhost:3000/checkout/failed',
        })
      ).rejects.toThrow('Xendit API error');
    });
  });

  describe('getInvoice', () => {
    it('should fetch invoice from Xendit', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          id: 'xendit_inv_123',
          external_id: 'INV-user_123-123456',
          invoice_url: 'https://xendit.co/invoices/xyz',
          status: 'PAID',
          amount: 100000,
          paid_amount: 100000,
          currency: 'IDR',
          paid: true,
          paid_at: '2026-08-18T04:29:05Z',
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await client.getInvoice('INV-user_123-123456');

      expect(result).toBeDefined();
      expect(result.status).toBe('PAID');
      expect(result.paid).toBe(true);
    });

    it('should handle 404 not found', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: async () => ({
          error_code: 'NOT_FOUND',
          message: 'Invoice not found',
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(
        client.getInvoice('nonexistent')
      ).rejects.toThrow('Invoice not found');
    });
  });
});
