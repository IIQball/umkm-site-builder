import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { transactionService } from '@/services/finance/transaction.service';
import { POST as purchaseTemplatePost } from '@/pages/api/tenant/transactions/template-purchase';
import { db } from '@/lib/db/client';
import * as authLib from '@/lib/auth';
import { xenditClient } from '@/lib/finance/xendit';
import { idempotencyManager } from '@/lib/finance/idempotency';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedDesigner: vi.fn().mockReturnValue(true),
}));

vi.mock('@/lib/finance/xendit', () => ({
  xenditClient: {
    createInvoice: vi.fn(),
    getInvoice: vi.fn(),
    createDisbursement: vi.fn(),
  },
}));

vi.mock('@/lib/db/client', () => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    query: {
      transactions: {
        findFirst: vi.fn(),
      },
      templates: {
        findFirst: vi.fn(),
      },
      userTemplates: {
        findFirst: vi.fn(),
      },
      bankAccounts: {
        findFirst: vi.fn(),
      },
      payoutRequests: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
  };
  return { db: mockDb, getDb: () => mockDb };
});

import { users } from '@/db/schema';

describe('Payment Idempotency System', () => {
  const mockGetAuthUser = authLib.getAuthenticatedUser as unknown as Mock;
  const mockDb = db as unknown as {
    select: Mock;
    insert: Mock;
    update: Mock;
    query: {
      templates: { findFirst: Mock };
      userTemplates: { findFirst: Mock };
      bankAccounts: { findFirst: Mock };
      payoutRequests: { findFirst: Mock };
    };
  };
  const mockCreateInvoice = xenditClient.createInvoice as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    idempotencyManager.clear();

    mockGetAuthUser.mockResolvedValue({
      id: 'user_1',
      name: 'Test Tenant',
      email: 'tenant@example.com',
      role: 'tenant',
      status: 'active',
    });

    mockDb.insert.mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    });

    // Distinguish queries: return user for users table, empty for transactions table
    mockDb.select.mockImplementation(() => ({
      from: vi.fn().mockImplementation((table) => ({
        where: vi.fn().mockImplementation(() => ({
          limit: vi.fn().mockImplementation(async () => {
            if (table === users) {
              return [{ id: 'user_1', email: 'tenant@example.com', name: 'Test Tenant' }];
            }
            return [];
          }),
        })),
      })),
    }));
  });

  describe('transactionService.purchaseTemplate with idempotencyKey', () => {
    it('creates invoice only once and returns existing data on duplicate idempotencyKey', async () => {
      mockDb.query.templates.findFirst.mockResolvedValue({
        id: 'tpl_premium',
        name: 'Super Template',
        price: 75000,
        status: 'approved',
      });
      mockDb.query.userTemplates.findFirst.mockResolvedValue(null);

      mockCreateInvoice.mockResolvedValue({
        id: 'inv_xendit_123',
        invoiceNum: 'INV-key_abc123',
        invoiceUrl: 'https://checkout.xendit.co/web/inv_xendit_123',
      });

      // First call
      const res1 = await transactionService.purchaseTemplate(
        'user_1',
        'tpl_premium',
        'http://localhost:3000',
        null,
        'key_abc123'
      );

      expect(res1.isFree).toBe(false);
      expect(res1.data?.externalId).toBe('INV-key_abc123');

      // Second call with same idempotencyKey
      const res2 = await transactionService.purchaseTemplate(
        'user_1',
        'tpl_premium',
        'http://localhost:3000',
        null,
        'key_abc123'
      );

      expect(res2.isFree).toBe(false);
      expect(res2.data?.externalId).toBe('INV-key_abc123');
      expect(res2.data?.invoiceUrl).toBe(res1.data?.invoiceUrl);

      // Xendit API must only be called ONCE
      expect(mockCreateInvoice).toHaveBeenCalledTimes(1);
    });

    it('safely deduplicates simultaneous concurrent double-clicks on template purchase', async () => {
      mockDb.query.templates.findFirst.mockResolvedValue({
        id: 'tpl_premium',
        name: 'Fast Click Template',
        price: 50000,
        status: 'approved',
      });
      mockDb.query.userTemplates.findFirst.mockResolvedValue(null);

      mockCreateInvoice.mockImplementation(async () => {
        // Simulate network latency on Xendit API
        await new Promise((r) => setTimeout(r, 40));
        return {
          id: 'inv_xendit_concurrent',
          invoiceNum: 'INV-concurrent_key',
          invoiceUrl: 'https://checkout.xendit.co/web/inv_concurrent',
        };
      });

      // Fire two concurrent requests
      const [res1, res2] = await Promise.all([
        transactionService.purchaseTemplate('user_1', 'tpl_premium', 'http://localhost:3000', null, 'concurrent_key'),
        transactionService.purchaseTemplate('user_1', 'tpl_premium', 'http://localhost:3000', null, 'concurrent_key'),
      ]);

      expect(res1.data?.externalId).toBe('INV-concurrent_key');
      expect(res2.data?.externalId).toBe('INV-concurrent_key');
      expect(mockCreateInvoice).toHaveBeenCalledTimes(1);
    });

    it('handles idempotent retries for free templates without error', async () => {
      mockDb.query.templates.findFirst.mockResolvedValue({
        id: 'tpl_free',
        name: 'Free Template',
        price: 0,
        status: 'approved',
        designerId: 'designer_1',
      });
      mockDb.query.userTemplates.findFirst.mockResolvedValueOnce(null);

      const res1 = await transactionService.purchaseTemplate(
        'user_1',
        'tpl_free',
        'http://localhost:3000',
        null,
        'free_key'
      );
      expect(res1.isFree).toBe(true);

      // Second call: user now owns template in DB
      mockDb.query.userTemplates.findFirst.mockResolvedValueOnce({ id: 'utpl_1' });
      const res2 = await transactionService.purchaseTemplate(
        'user_1',
        'tpl_free',
        'http://localhost:3000',
        null,
        'free_key'
      );
      expect(res2.isFree).toBe(true);
    });
  });

  describe('POST /api/tenant/transactions/template-purchase HTTP Route', () => {
    it('passes Idempotency-Key header to transaction service and deduplicates calls', async () => {
      mockDb.query.userTemplates.findFirst.mockReset();
      mockDb.query.userTemplates.findFirst.mockResolvedValue(null);

      mockDb.query.templates.findFirst.mockResolvedValue({
        id: 'tpl_premium',
        name: 'Route Template',
        price: 50000,
        status: 'approved',
      });

      mockCreateInvoice.mockResolvedValue({
        id: 'inv_xendit_route',
        invoiceNum: 'INV-route_key_1',
        invoiceUrl: 'https://checkout.xendit.co/web/route_key_1',
      });

      const makeRequest = () =>
        new Request('http://localhost:4321/api/tenant/transactions/template-purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': 'route_key_1',
          },
          body: JSON.stringify({ templateId: 'tpl_premium' }),
        });

      const res1 = await purchaseTemplatePost({
        request: makeRequest(),
        params: {},
      } as unknown as Parameters<typeof purchaseTemplatePost>[0]);
      expect(res1.status).toBe(200);
      const data1 = await res1.json();
      expect(data1.ok).toBe(true);
      expect(data1.data?.externalId).toBe('INV-route_key_1');

      const res2 = await purchaseTemplatePost({
        request: makeRequest(),
        params: {},
      } as unknown as Parameters<typeof purchaseTemplatePost>[0]);
      expect(res2.status).toBe(200);
      const data2 = await res2.json();
      expect(data2.ok).toBe(true);
      expect(data2.data.externalId).toBe('INV-route_key_1');

      expect(mockCreateInvoice).toHaveBeenCalledTimes(1);
    });
  });
});
