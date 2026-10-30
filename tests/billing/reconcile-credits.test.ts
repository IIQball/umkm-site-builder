import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import {
  calculateCreditsFromInvoice,
  reconcileTenantCredits,
  reconcileAllCredits,
} from '@/lib/billing/reconcile-credits';
import { db } from '@/lib/db/client';

vi.mock('@/lib/db/client', () => {
  const mockDb = {
    select: vi.fn(),
  };
  return { db: mockDb, getDb: () => mockDb };
});

describe('Credit Ledger Reconciliation Script (reconcile-credits)', () => {
  let mockDb: { select: Mock };

  beforeEach(() => {
    vi.clearAllMocks();
    mockDb = db as unknown as typeof mockDb;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('calculateCreditsFromInvoice', () => {
    it('uses metadata.credits when provided', () => {
      const credits = calculateCreditsFromInvoice({
        amount: 50000,
        metadata: { credits: 45 },
      });
      expect(credits).toBe(45);
    });

    it('maps standard packages: 15,000 -> 6 credits', () => {
      expect(calculateCreditsFromInvoice({ amount: 15000 })).toBe(6);
    });

    it('maps standard packages: 25,000 -> 12 credits', () => {
      expect(calculateCreditsFromInvoice({ amount: 25000 })).toBe(12);
    });

    it('maps standard packages: 50,000 -> 30 credits', () => {
      expect(calculateCreditsFromInvoice({ amount: 50000 })).toBe(30);
    });

    it('falls back to default formula for non-standard amount', () => {
      expect(calculateCreditsFromInvoice({ amount: 100000 })).toBe(20);
    });
  });

  describe('reconcileTenantCredits', () => {
    it('reconciles tenant with perfectly balanced records', async () => {
      // 1. mock tenantAiCredits query
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: 'cred_1',
                tenantId: 'store_1',
                userId: 'user_1',
                balance: 14,
                totalPurchased: 18,
                totalUsed: 6,
              },
            ]),
          }),
        }),
      });

      // 2. mock store query
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 'store_1', name: 'Warung Bu Siti', userId: 'user_1' },
            ]),
          }),
        }),
      });

      // 3. mock user owner query
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { email: 'siti@warung.id' },
            ]),
          }),
        }),
      });

      // 4. mock successful transactions query (15k + 25k -> 6 + 12 = 18 credits)
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'tx_1',
              externalId: 'INV-001',
              amount: 15000,
              status: 'success',
              paymentChannel: 'QRIS',
              createdAt: new Date('2026-08-01'),
            },
            {
              id: 'tx_2',
              externalId: 'INV-002',
              amount: 25000,
              status: 'success',
              paymentChannel: 'BCA',
              createdAt: new Date('2026-08-05'),
            },
          ]),
        }),
      });

      const result = await reconcileTenantCredits('store_1', mockDb as unknown as typeof db);

      expect(result.tenantId).toBe('store_1');
      expect(result.storeName).toBe('Warung Bu Siti');
      expect(result.ownerEmail).toBe('siti@warung.id');
      expect(result.totalPaidAmount).toBe(40000);
      expect(result.totalPaidAmountFormatted).toContain('40.000');
      expect(result.calculatedPurchasedCredits).toBe(18);
      expect(result.totalPurchasedInDb).toBe(18);
      expect(result.currentBalance).toBe(14);
      expect(result.discrepancy).toBe(0);
      expect(result.isBalanced).toBe(true);
      expect(result.successfulInvoicesCount).toBe(2);
      expect(result.invoices[0].amountFormatted).toContain('15.000');
    });

    it('detects discrepancy when DB purchased credits does not match paid invoices', async () => {
      // 1. mock tenantAiCredits query
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: 'cred_2',
                tenantId: 'store_2',
                userId: 'user_2',
                balance: 10,
                totalPurchased: 10, // In db it's 10, but invoice says 30
                totalUsed: 2,
              },
            ]),
          }),
        }),
      });

      // 2. mock store query
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 'store_2', name: 'Kopi Kenangan', userId: 'user_2' },
            ]),
          }),
        }),
      });

      // 3. mock user owner query
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { email: 'owner@kopi.id' },
            ]),
          }),
        }),
      });

      // 4. mock successful transactions query (50k -> 30 credits)
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'tx_3',
              externalId: 'INV-003',
              amount: 50000,
              status: 'success',
              paymentChannel: 'MANDIRI',
              createdAt: new Date('2026-08-10'),
            },
          ]),
        }),
      });

      const result = await reconcileTenantCredits('store_2', mockDb as unknown as typeof db);

      expect(result.calculatedPurchasedCredits).toBe(30);
      expect(result.totalPurchasedInDb).toBe(10);
      expect(result.discrepancy).toBe(20);
      expect(result.isBalanced).toBe(false);
    });
  });

  describe('reconcileAllCredits', () => {
    it('aggregates reports across all tenant credit accounts', async () => {
      // 1. mock all tenantAiCredits
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockResolvedValue([
          { tenantId: 'store_a' },
          { tenantId: 'store_b' },
        ]),
      });

      // Setup queries for store_a
      // creditRecord
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ tenantId: 'store_a', userId: 'u_a', balance: 6, totalPurchased: 6, totalUsed: 2 }]),
          }),
        }),
      });
      // store
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'store_a', name: 'Store A', userId: 'u_a' }]),
          }),
        }),
      });
      // user
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ email: 'a@store.id' }]),
          }),
        }),
      });
      // tx
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            { id: 'tx_a', externalId: 'INV-A', amount: 15000, status: 'success', paymentChannel: 'QRIS', createdAt: new Date() },
          ]),
        }),
      });

      // Setup queries for store_b
      // creditRecord
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ tenantId: 'store_b', userId: 'u_b', balance: 2, totalPurchased: 0, totalUsed: 0 }]),
          }),
        }),
      });
      // store
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'store_b', name: 'Store B', userId: 'u_b' }]),
          }),
        }),
      });
      // user
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ email: 'b@store.id' }]),
          }),
        }),
      });
      // tx (no transactions, 0 credits -> balanced since 0 === 0)
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const report = await reconcileAllCredits(mockDb as unknown as typeof db);

      expect(report.totalTenantsChecked).toBe(2);
      expect(report.balancedTenantsCount).toBe(2);
      expect(report.discrepantTenantsCount).toBe(0);
      expect(report.totalRevenueIdr).toBe(15000);
      expect(report.totalRevenueIdrFormatted).toContain('15.000');
      expect(report.totalCreditsPurchased).toBe(6);
    });
  });
});
