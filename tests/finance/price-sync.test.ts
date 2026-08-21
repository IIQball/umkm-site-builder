import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { POST as createDraftPost, PATCH as submitDraftPatch } from '@/pages/api/templates/draft';
import { POST as templatePurchasePost } from '@/pages/api/transactions/template-purchase';
import { transactionService } from '@/services/finance/transaction.service';
import { db } from '@/lib/db/client';
import { xenditClient } from '@/lib/finance/xendit';
import * as authLib from '@/lib/auth';

// Mock DB
vi.mock('@/lib/db/client', () => {
  const mockDb = {
    insert: vi.fn(),
    update: vi.fn(),
    select: vi.fn(),
    query: {
      templates: {
        findFirst: vi.fn(),
      },
      userTemplates: {
        findFirst: vi.fn(),
      },
    },
  };
  return { db: mockDb, getDb: () => mockDb };
});

// Mock Xendit
vi.mock('@/lib/finance/xendit', () => ({
  xenditClient: {
    createInvoice: vi.fn(),
    getInvoice: vi.fn(),
    verifyWebhookSignature: vi.fn(),
  },
}));

// Mock Auth
vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedDesigner: vi.fn(),
  isDesigner: vi.fn((u) => !!u && (u.role === 'designer' || u.role === 'admin' || u.role === 'superadmin')),
  isActive: vi.fn((u) => !!u && u.status === 'active'),
  isAdmin: vi.fn((u) => !!u && (u.role === 'admin' || u.role === 'superadmin')),
  isAuthorizedAdmin: vi.fn((u) => !!u && u.status === 'active' && (u.role === 'admin' || u.role === 'superadmin')),
  getRedirectUrlForRole: vi.fn((role) => role === 'designer' ? '/designer/templates' : (role === 'admin' || role === 'superadmin' ? '/admin' : '/dashboard')),
  auth: { api: { getSession: vi.fn() } },
}));

describe('Finance Price Sync & Purchase Flow (Zero 100x Multiplier)', () => {
  let mockDb: {
    insert: Mock;
    update: Mock;
    select: Mock;
    query: {
      templates: { findFirst: Mock };
      userTemplates: { findFirst: Mock };
    };
  };

  const mockUser = {
    id: 'usr_designer_1',
    name: 'Designer One',
    email: 'designer@example.com',
    role: 'designer',
    status: 'active',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockDb = db as unknown as typeof mockDb;
    (authLib.getAuthenticatedUser as unknown as Mock).mockResolvedValue(mockUser);
    (authLib.isAuthorizedDesigner as unknown as Mock).mockReturnValue(true);
  });

  describe('1. Input & Database Storage Synchronization', () => {
    it('should save template price as exact IDR integer 50000 without 100x multiplication on create draft', async () => {
      let insertedValues: { price?: number } = {};

      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockImplementation((val) => {
          insertedValues = val as { price?: number };
          return {
            returning: vi.fn().mockResolvedValue([{ id: 'tpl_123', ...val }]),
          };
        }),
      });

      const request = new Request('http://localhost:4321/api/templates/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Template Batik Modern',
          description: 'Desain elegan untuk toko kain',
          price: 50000,
        }),
      });

      const res = (await createDraftPost({
        request,
        params: {},
      } as unknown as Parameters<typeof createDraftPost>[0])) as Response;

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(insertedValues).toBeDefined();
      expect(insertedValues.price).toBe(50000);
      expect(insertedValues.price).not.toBe(5000000);
    });

    it('should update template price as exact IDR integer 50000 on submit patch', async () => {
      let updatedValues: { price?: number } = {};

      mockDb.update.mockReturnValueOnce({
        set: vi.fn().mockImplementation((val) => {
          updatedValues = val as { price?: number };
          return {
            where: vi.fn().mockReturnValue({
              returning: vi.fn().mockResolvedValue([{ id: 'tpl_123', ...val }]),
            }),
          };
        }),
      });

      const request = new Request('http://localhost:4321/api/templates/draft?templateId=tpl_123', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Template Batik Modern',
          price: 50000,
          config: {
            theme: {},
            sections: [],
          },
        }),
      });

      const res = (await submitDraftPatch({
        request,
        params: {},
      } as unknown as Parameters<typeof submitDraftPatch>[0])) as Response;

      expect(res.status).toBe(200);
      expect(updatedValues).toBeDefined();
      expect(updatedValues.price).toBe(50000);
      expect(updatedValues.price).not.toBe(5000000);
    });
  });

  describe('2. Template Purchase Transaction Initiation', () => {
    it('should create Xendit invoice and transaction record with exact IDR 50000', async () => {
      mockDb.query.templates.findFirst.mockResolvedValueOnce({
        id: 'tpl_123',
        name: 'Template Batik Modern',
        price: 50000,
        status: 'approved',
      });

      mockDb.query.userTemplates.findFirst.mockResolvedValueOnce(null);

      (xenditClient.createInvoice as Mock).mockResolvedValueOnce({
        id: 'xend_inv_123',
        invoiceNum: 'INV-usr_designer_1-999',
        invoiceUrl: 'https://checkout.xendit.co/web/123',
      });

      let insertedTx: { amount?: number; type?: string; templateId?: string } = {};
      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockImplementation((val) => {
          insertedTx = val as { amount?: number; type?: string; templateId?: string };
          return Promise.resolve();
        }),
      });

      const request = new Request('http://localhost:4321/api/transactions/template-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', host: 'localhost:4321' },
        body: JSON.stringify({ templateId: 'tpl_123' }),
      });

      const res = (await templatePurchasePost({
        request,
        params: {},
      } as unknown as Parameters<typeof templatePurchasePost>[0])) as Response;

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);

      // Verify Xendit invoice amount
      expect(xenditClient.createInvoice).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 50000,
          description: 'Pembelian Template: Template Batik Modern',
        })
      );

      // Verify DB transaction record amount
      expect(insertedTx).toBeDefined();
      expect(insertedTx.amount).toBe(50000);
      expect(insertedTx.type).toBe('template_purchase');
      expect(insertedTx.templateId).toBe('tpl_123');
    });
  });

  describe('3. Webhook Commission & Wallet Fulfillment', () => {
    it('should calculate 30% platform fee and 70% designer commission based on 50000 IDR base', async () => {
      // 1. Existing pending transaction with amount 50000
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'txn_tpl_50k',
              userId: 'buyer_1',
              type: 'template_purchase',
              templateId: 'tpl_123',
              amount: 50000,
              status: 'pending',
              externalId: 'INV-buyer_1-123',
            },
          ]),
        }),
      });

      // Update tx status to success
      mockDb.update.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
      });

      // Insert userTemplate
      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockResolvedValue(undefined),
      });

      // Select template info
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 'tpl_123', name: 'Template Batik Modern', designerId: 'designer_batik' },
            ]),
          }),
        }),
      });

      // Select platform fee settings (default 30%)
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ platformFeePercentage: 30 }]),
        }),
      });

      // Insert commission
      let insertedCommission: { totalAmount?: number; platformFee?: number; designerAmount?: number } = {};
      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockImplementation((val) => {
          insertedCommission = val as { totalAmount?: number; platformFee?: number; designerAmount?: number };
          return Promise.resolve();
        }),
      });

      // Select existing designer wallet
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 'w_batik', designerId: 'designer_batik', balance: 0 },
            ]),
          }),
        }),
      });

      // Update wallet balance
      mockDb.update.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
      });

      // Insert wallet mutation
      let insertedMutation: { amount?: number; balanceAfter?: number } = {};
      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockImplementation((val) => {
          insertedMutation = val as { amount?: number; balanceAfter?: number };
          return {
            returning: vi.fn().mockResolvedValue([val]),
          };
        }),
      });

      const result = await transactionService.processWebhook({
        id: 'x_hook_50k',
        external_id: 'INV-buyer_1-123',
        amount: 50000,
        status: 'PAID',
        paid: true,
      });

      expect(result.status).toBe('success');

      // Verify commission calculation from 50000 IDR base
      expect(insertedCommission).toBeDefined();
      expect(insertedCommission.totalAmount).toBe(50000);
      expect(insertedCommission.platformFee).toBe(15000); // 30% of 50,000
      expect(insertedCommission.designerAmount).toBe(35000); // 70% of 50,000

      // Verify wallet credit
      expect(insertedMutation).toBeDefined();
      expect(insertedMutation.amount).toBe(35000);
      expect(insertedMutation.balanceAfter).toBe(35000);
    });
  });
});
