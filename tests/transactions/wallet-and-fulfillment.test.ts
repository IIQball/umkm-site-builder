import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import {
  calculateCommission,
  DEFAULT_PLATFORM_FEE_PERCENTAGE,
  creditWallet,
  debitWallet,
  getDesignerWalletSummary,
  transactionService,
} from '@/services';
import { db } from '@/lib/db/client';

vi.mock('@/lib/db/client', () => {
  const mockDb = { select: vi.fn(), insert: vi.fn(), update: vi.fn() };
  return { db: mockDb, getDb: () => mockDb };
});

vi.mock('@/lib/finance/xendit', () => ({
  xenditClient: { createInvoice: vi.fn(), getInvoice: vi.fn(), verifyWebhookSignature: vi.fn() },
}));

describe('Financial Engine & Ledger Service', () => {
  let mockDb: { select: Mock; insert: Mock; update: Mock };

  beforeEach(() => {
    vi.clearAllMocks();
    mockDb = db as unknown as typeof mockDb;
  });

  describe('Dynamic Commission Service (calculateCommission)', () => {
    it('should calculate 30% platform fee and 70% designer payout with default fallback', async () => {
      mockDb.select.mockReturnValueOnce({ from: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([]) }) });

      const totalAmount = 100000;
      const result = await calculateCommission(totalAmount, mockDb as unknown as typeof db);

      expect(result.platformFeePercentage).toBe(DEFAULT_PLATFORM_FEE_PERCENTAGE);
      expect(result.platformFee).toBe(30000);
      expect(result.designerAmount).toBe(70000);
      expect(result.platformFee + result.designerAmount).toBe(totalAmount);
    });

    it('should calculate commission dynamically based on platformSettings table', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([{ platformFeePercentage: 20 }]) }),
      });

      const totalAmount = 150000;
      const result = await calculateCommission(totalAmount, mockDb as unknown as typeof db);

      expect(result.platformFeePercentage).toBe(20);
      expect(result.platformFee).toBe(30000);
      expect(result.designerAmount).toBe(120000);
    });

    it('should handle integer rounding properly for odd amounts', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([{ platformFeePercentage: 30 }]) }),
      });

      const totalAmount = 99999;
      const result = await calculateCommission(totalAmount, mockDb as unknown as typeof db);

      expect(result.platformFee).toBe(30000);
      expect(result.designerAmount).toBe(69999);
      expect(result.platformFee + result.designerAmount).toBe(totalAmount);
    });
  });

  describe('Wallet & Ledger Service', () => {
    describe('creditWallet', () => {
      it('should create wallet if not exists and credit amount with balanceAfter', async () => {
        mockDb.select.mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([]) }) }),
        });
        mockDb.insert.mockReturnValueOnce({
          values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: 'w_123', designerId: 'd1', balance: 0 }]) }),
        });
        mockDb.update.mockReturnValueOnce({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }) });
        mockDb.insert.mockReturnValueOnce({
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: 'wmut_1', walletId: 'w_123', type: 'CREDIT', amount: 50000, balanceAfter: 50000 }]),
          }),
        });

        const result = await creditWallet({ designerId: 'd1', amount: 50000, description: 'Topup', referenceId: 'ref_1' });
        expect(result.walletId).toBe('w_123');
        expect(result.balanceAfter).toBe(50000);
        expect(result.mutation.type).toBe('CREDIT');
      });

      it('should add to existing balance and record CREDIT mutation', async () => {
        mockDb.select.mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([{ id: 'w_123', designerId: 'd1', balance: 50000 }]) }) }),
        });
        mockDb.update.mockReturnValueOnce({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }) });
        mockDb.insert.mockReturnValueOnce({
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: 'wmut_2', walletId: 'w_123', type: 'CREDIT', amount: 30000, balanceAfter: 80000 }]),
          }),
        });

        const result = await creditWallet({ designerId: 'd1', amount: 30000, description: 'Commission', referenceId: 'txn_1' });
        expect(result.balanceAfter).toBe(80000);
      });
    });

    describe('debitWallet', () => {
      it('should debit amount when balance is sufficient', async () => {
        mockDb.select.mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([{ id: 'w_123', designerId: 'd1', balance: 100000 }]) }) }),
        });
        mockDb.update.mockReturnValueOnce({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }) });
        mockDb.insert.mockReturnValueOnce({
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: 'wmut_3', walletId: 'w_123', type: 'DEBIT', amount: 40000, balanceAfter: 60000 }]),
          }),
        });

        const result = await debitWallet({ designerId: 'd1', amount: 40000, description: 'Payout', referenceId: 'p1' });
        expect(result.balanceAfter).toBe(60000);
      });

      it('should throw INSUFFICIENT_BALANCE when balance is lower than amount', async () => {
        mockDb.select.mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([{ id: 'w_123', designerId: 'd1', balance: 25000 }]) }) }),
        });

        await expect(debitWallet({ designerId: 'd1', amount: 50000, description: 'Payout' })).rejects.toThrow('Saldo tidak mencukupi untuk melakukan transaksi');
      });
    });

    describe('getDesignerWalletSummary', () => {
      it('should return 0 balance when wallet does not exist', async () => {
        mockDb.select.mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([]) }) }),
        });

        const summary = await getDesignerWalletSummary('designer_unknown', mockDb as unknown as typeof db);
        expect(summary.balance).toBe(0);
        expect(summary.mutations).toEqual([]);
      });

      it('should return wallet balance and mutations ordered descending', async () => {
        mockDb.select.mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([{ id: 'w_123', designerId: 'd1', balance: 75000 }]) }) }),
        });
        const mockMutations = [
          { id: 'm_2', walletId: 'w_123', type: 'CREDIT', amount: 50000, balanceAfter: 75000, description: 'C2', referenceId: 't2', createdAt: new Date() },
          { id: 'm_1', walletId: 'w_123', type: 'CREDIT', amount: 25000, balanceAfter: 25000, description: 'C1', referenceId: 't1', createdAt: new Date() },
        ];
        mockDb.select.mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ orderBy: vi.fn().mockResolvedValue(mockMutations) }) }),
        });

        const summary = await getDesignerWalletSummary('d1', mockDb as unknown as typeof db);
        expect(summary.balance).toBe(75000);
        expect(summary.mutations.length).toBe(2);
        expect(summary.mutations[0].id).toBe('m_2');
      });
    });
  });

  describe('Post-Payment Fulfillment (TransactionService)', () => {
    it('should ignore webhook if transaction is already marked success (idempotency)', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([{ id: 'txn_1', status: 'success' }]) }),
      });

      const result = await transactionService.processWebhook({ id: 'x_1', external_id: 'INV-1', amount: 100000, status: 'PAID', paid: true });
      expect(result.status).toBe('ignored');
      expect(result.message).toBe('Already processed');
    });

    it('should fulfill template_purchase transaction by recording userTemplate, commission, and wallet credit', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([{ id: 'txn_tpl', userId: 'u1', type: 'template_purchase', templateId: 'tpl_1', amount: 100000, status: 'pending' }]) }),
      });
      mockDb.update.mockReturnValueOnce({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }) });
      mockDb.insert.mockReturnValueOnce({ values: vi.fn().mockResolvedValue(undefined) });
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([{ id: 'tpl_1', name: 'Food Template', designerId: 'd_chef' }]) }) }),
      });
      mockDb.select.mockReturnValueOnce({ from: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([{ platformFeePercentage: 30 }]) }) });
      mockDb.insert.mockReturnValueOnce({ values: vi.fn().mockResolvedValue(undefined) });
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([{ id: 'w_chef', designerId: 'd_chef', balance: 0 }]) }) }),
      });
      mockDb.update.mockReturnValueOnce({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }) });
      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: 'wm_1', walletId: 'w_chef', type: 'CREDIT', amount: 70000, balanceAfter: 70000 }]) }),
      });

      const result = await transactionService.processWebhook({ id: 'x_inv', external_id: 'INV-tpl', amount: 100000, status: 'PAID', paid: true });
      expect(result.status).toBe('success');
      expect(result.message).toBe('Webhook processed successfully');
    });

    it('should fulfill admin assisted template_purchase transaction by crediting both designer and admin wallet', async () => {
      // 1. Query transaction in processWebhook
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'txn_assisted_1',
              userId: 'tenant_1',
              type: 'template_purchase',
              templateId: 'tpl_1',
              amount: 55000,
              adminFee: 5000,
              assistedBy: 'admin_1',
              status: 'pending',
            },
          ]),
        }),
      });

      // 2. Update transaction status to success
      mockDb.update.mockReturnValueOnce({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }) });

      // 3. Insert userTemplates
      mockDb.insert.mockReturnValueOnce({ values: vi.fn().mockResolvedValue(undefined) });

      // 4. Query template info
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'tpl_1', name: 'Coffee Template', designerId: 'd_barista' }]),
          }),
        }),
      });

      // 5. Query platformSettings for calculateCommission (30% fee)
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([{ platformFeePercentage: 30 }]) }),
      });

      // 6. Insert commissions
      let recordedCommission: Record<string, unknown> = {};
      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockImplementation((val) => {
          recordedCommission = val;
          return Promise.resolve(undefined);
        }),
      });

      // 7. Credit designer wallet
      // 7a. Get designer wallet
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'w_barista', userId: 'd_barista', balance: 0 }]),
          }),
        }),
      });
      // 7b. Update designer wallet
      mockDb.update.mockReturnValueOnce({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }) });
      // 7c. Insert designer wallet mutation
      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 'wm_d', walletId: 'w_barista', type: 'CREDIT', amount: 35000, balanceAfter: 35000 }]),
        }),
      });

      // 8. Credit admin wallet
      // 8a. Get admin wallet
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'w_admin', userId: 'admin_1', balance: 10000 }]),
          }),
        }),
      });
      // 8b. Update admin wallet
      let recordedAdminWalletUpdate: Record<string, unknown> = {};
      mockDb.update.mockReturnValueOnce({
        set: vi.fn().mockImplementation((val) => {
          recordedAdminWalletUpdate = val;
          return { where: vi.fn().mockResolvedValue(undefined) };
        }),
      });
      // 8c. Insert admin wallet mutation
      let recordedAdminMutation: Record<string, unknown> = {};
      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockImplementation((val) => {
          recordedAdminMutation = val;
          return {
            returning: vi.fn().mockResolvedValue([
              { id: 'wm_admin', walletId: 'w_admin', type: 'CREDIT', amount: 5000, balanceAfter: 15000 },
            ]),
          };
        }),
      });

      const result = await transactionService.processWebhook({
        id: 'x_inv_assisted',
        external_id: 'INV-assisted-1',
        amount: 55000,
        status: 'PAID',
        paid: true,
      });

      expect(result.status).toBe('success');
      expect(result.message).toBe('Webhook processed successfully');

      // Verify Commission recording:
      // Base amount = 55000 - 5000 = 50000. 30% platform fee = 15000, designer = 35000, admin = 5000
      expect(recordedCommission.totalAmount).toBe(55000);
      expect(recordedCommission.platformFee).toBe(15000);
      expect(recordedCommission.designerAmount).toBe(35000);
      expect(recordedCommission.adminAmount).toBe(5000);
      expect(recordedCommission.adminId).toBe('admin_1');

      // Verify Admin Wallet Credit:
      expect(recordedAdminWalletUpdate.balance).toBe(15000);
      expect(recordedAdminMutation.amount).toBe(5000);
      expect(recordedAdminMutation.description).toBe('Fee Pendampingan Pembelian Template');
      expect(recordedAdminMutation.type).toBe('CREDIT');
    });
  });
});
