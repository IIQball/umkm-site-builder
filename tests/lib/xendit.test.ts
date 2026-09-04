/**
 * Xendit client tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import { XenditClient } from '@/lib/finance/xendit';
import crypto from 'node:crypto';

describe('XenditClient', () => {
  let client: XenditClient;
  let mockFetch: MockInstance;
  let consoleErrorSpy: MockInstance;
  let consoleWarnSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new XenditClient();
    mockFetch = vi.spyOn(globalThis, 'fetch') as unknown as MockInstance;
    
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}) as unknown as MockInstance;
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {}) as unknown as MockInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('verifyWebhookSignature', () => {
    it('should verify valid webhook signature', () => {
      const secret = 'test-secret';
      const payload = JSON.stringify({ id: 'inv_123', amount: 100000 });
      const signature = crypto
          .createHmac('sha256', secret)
          .update(payload)
          .digest('hex');

      // Temporarily override the secret for testing using type-safe casting without 'any'
      const clientWithSecret = client as unknown as { webhookSecret: string };
      const originalSecret = clientWithSecret.webhookSecret;
      clientWithSecret.webhookSecret = secret;

      const isValid = client.verifyWebhookSignature(payload, signature);
      expect(isValid).toBe(true);

      clientWithSecret.webhookSecret = originalSecret;
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

      const clientWithSecret = client as unknown as { webhookSecret: string };
      const originalSecret = clientWithSecret.webhookSecret;
      clientWithSecret.webhookSecret = secret;

      // Tamper with payload
      const tamperedPayload = JSON.stringify({ id: 'inv_123', amount: 200000 });
      const isValid = client.verifyWebhookSignature(tamperedPayload, signature);
      expect(isValid).toBe(false);

      clientWithSecret.webhookSecret = originalSecret;
    });
  });

  describe('createInvoice', () => {
    it('should call Xendit API with correct parameters', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        redirected: false,
        statusText: 'OK',
        type: 'basic' as const,
        url: '',
        clone: () => ({} as Response),
        body: null,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        formData: async () => new FormData(),
        text: async () => '',
        json: async () => ({
          id: 'xendit_inv_123',
          external_id: 'INV-user_123-123456',
          invoice_url: 'https://xendit.co/invoices/xyz',
          status: 'PENDING',
          amount: 100000,
          paid_amount: 0,
          currency: 'IDR',
        }),
      } as Response;

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
        status: 400,
        headers: new Headers(),
        redirected: false,
        statusText: 'Bad Request',
        type: 'basic' as const,
        url: '',
        clone: () => ({} as Response),
        body: null,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        formData: async () => new FormData(),
        text: async () => '',
        json: async () => ({
          error_code: 'INVALID_REQUEST',
          message: 'Invalid request',
        }),
      } as Response;

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
        status: 200,
        headers: new Headers(),
        redirected: false,
        statusText: 'OK',
        type: 'basic' as const,
        url: '',
        clone: () => ({} as Response),
        body: null,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        formData: async () => new FormData(),
        text: async () => '',
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
      } as Response;

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
        headers: new Headers(),
        redirected: false,
        statusText: 'Not Found',
        type: 'basic' as const,
        url: '',
        clone: () => ({} as Response),
        body: null,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        formData: async () => new FormData(),
        text: async () => '',
        json: async () => ({
          error_code: 'NOT_FOUND',
          message: 'Invoice not found',
        }),
      } as Response;

      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(
        client.getInvoice('nonexistent')
      ).rejects.toThrow('Invoice not found');
    });
  });
});
