import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET as getTransactionStatus } from '@/pages/api/public/transactions/status/[invoiceId]';
import { transactionService } from '@/services';

describe('Admin Merchant Template Purchase & Checkout Flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/public/transactions/status/[invoiceId]', () => {
    it('returns 400 when invoiceId is missing', async () => {
      const res = await getTransactionStatus({
        params: {},
        request: new Request('http://localhost:4321/api/public/transactions/status/'),
      } as unknown as Parameters<typeof getTransactionStatus>[0]);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.ok).toBe(false);
      expect(data.error.message).toContain('Missing invoice ID');
    });

    it('returns 404 when transaction is not found', async () => {
      vi.spyOn(transactionService, 'getTransactionDetails').mockResolvedValue(null);

      const res = await getTransactionStatus({
        params: { invoiceId: 'INV-NONEXISTENT' },
        request: new Request('http://localhost:4321/api/public/transactions/status/INV-NONEXISTENT'),
      } as unknown as Parameters<typeof getTransactionStatus>[0]);

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.ok).toBe(false);
      expect(data.error.message).toContain('Transaction not found');
    });

    it('returns transaction details including adminFee and baseAmount for assisted purchases', async () => {
      vi.spyOn(transactionService, 'getTransactionDetails').mockResolvedValue({
        id: 'txn_123',
        userId: 'tenant_1',
        type: 'template_purchase',
        externalId: 'INV-tenant_1-12345',
        amount: 55000,
        adminFee: 5000,
        status: 'pending',
        paymentChannel: 'QRIS',
        assistedBy: 'admin_1',
        createdAt: new Date(),
      });
      vi.spyOn(transactionService, 'getInvoiceUrl').mockResolvedValue('https://checkout.xendit.co/web/inv_123');

      const res = await getTransactionStatus({
        params: { invoiceId: 'INV-tenant_1-12345' },
        request: new Request('http://localhost:4321/api/public/transactions/status/INV-tenant_1-12345'),
      } as unknown as Parameters<typeof getTransactionStatus>[0]);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(data.data.invoiceId).toBe('INV-tenant_1-12345');
      expect(data.data.amount).toBe(55000);
      expect(data.data.adminFee).toBe(5000);
      expect(data.data.baseAmount).toBe(50000);
      expect(data.data.paymentUrl).toBe('https://checkout.xendit.co/web/inv_123');
    });

    it('returns baseAmount equal to amount when adminFee is 0', async () => {
      vi.spyOn(transactionService, 'getTransactionDetails').mockResolvedValue({
        id: 'txn_direct',
        userId: 'tenant_direct',
        type: 'template_purchase',
        externalId: 'INV-tenant_direct-999',
        amount: 75000,
        adminFee: 0,
        status: 'success',
        paymentChannel: 'BCA',
        createdAt: new Date(),
      });

      const res = await getTransactionStatus({
        params: { invoiceId: 'INV-tenant_direct-999' },
        request: new Request('http://localhost:4321/api/public/transactions/status/INV-tenant_direct-999'),
      } as unknown as Parameters<typeof getTransactionStatus>[0]);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(data.data.amount).toBe(75000);
      expect(data.data.adminFee).toBe(0);
      expect(data.data.baseAmount).toBe(75000);
    });
  });
});
