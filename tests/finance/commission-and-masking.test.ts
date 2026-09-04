import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { formatPriceInput, parsePriceInput, formatIDR, formatCurrency } from '@/lib/utils/format';
import { calculateCommission } from '@/services/finance/commission.service';
import { creditWallet, debitWallet, getDesignerWalletSummary } from '@/services/finance/wallet.service';
import { db } from '@/lib/db/client';

interface WalletUpdatePayload {
  balance?: number;
  availableBalance?: number;
  updatedAt?: Date;
}

interface MutationInsertPayload {
  type?: 'CREDIT' | 'DEBIT';
  amount?: number;
  balanceAfter?: number;
  description?: string;
  referenceId?: string;
}

// Mock DB
vi.mock('@/lib/db/client', () => {
  const mockDb = {
    insert: vi.fn(),
    update: vi.fn(),
    select: vi.fn(),
  };
  return { db: mockDb, getDb: () => mockDb };
});

describe('Finance Commission Engine & Input Masking Suite', () => {
  let mockDb: {
    insert: Mock;
    update: Mock;
    select: Mock;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockDb = db as unknown as typeof mockDb;
  });

  describe('1. Price Input Masking and Unmasking Helpers', () => {
    it('should format raw numeric integer or string into thousand-separated IDR string', () => {
      expect(formatPriceInput(50000)).toBe('50.000');
      expect(formatPriceInput('50000')).toBe('50.000');
      expect(formatPriceInput(5000000)).toBe('5.000.000');
      expect(formatPriceInput(0)).toBe('0');
      expect(formatPriceInput('')).toBe('');
      expect(formatPriceInput(null)).toBe('');
      expect(formatPriceInput(undefined)).toBe('');
    });

    it('should clean non-digits when formatting messy inputs', () => {
      expect(formatPriceInput('Rp 50.000,00')).toBe('5.000.000');
      expect(formatPriceInput('abc 75000 xyz')).toBe('75.000');
    });

    it('should parse formatted string into pure integer without multipliers', () => {
      expect(parsePriceInput('50.000')).toBe(50000);
      expect(parsePriceInput('5.000.000')).toBe(5000000);
      expect(parsePriceInput('150.000')).toBe(150000);
      expect(parsePriceInput('0')).toBe(0);
      expect(parsePriceInput('')).toBe(0);
      expect(parsePriceInput(null)).toBe(0);
      expect(parsePriceInput(undefined)).toBe(0);
    });

    it('should ensure parsed price is non-negative integer', () => {
      expect(parsePriceInput(-50000)).toBe(50000); // stripped non-digits -> 50000
      expect(parsePriceInput('50.000,55')).toBe(5000055);
    });

    it('should format pure integer IDR currency directly without /100 division', () => {
      expect(formatIDR(8400000)).toContain('8.400.000');
      expect(formatIDR(4000000)).toContain('4.000.000');
      expect(formatIDR(400000)).toContain('400.000');
      expect(formatIDR(0)).toContain('0');
      expect(formatIDR(BigInt(8400000))).toContain('8.400.000');
      expect(formatCurrency(8400000)).toContain('8.400.000');
    });
  });

  describe('2. Dynamic Commission Calculation Engine', () => {
    it('should calculate 20% platform fee and 80% net designer payout on Rp 50.000', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ platformFeePercentage: 20 }]),
        }),
      });

      const result = await calculateCommission(50000);
      expect(result.platformFeePercentage).toBe(20);
      expect(result.platformFee).toBe(10000);
      expect(result.designerAmount).toBe(40000);
      expect(result.platformFee + result.designerAmount).toBe(50000);
    });

    it('should calculate 20% platform fee and 80% net designer payout on Rp 5.000.000', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ platformFeePercentage: 20 }]),
        }),
      });

      const result = await calculateCommission(5000000);
      expect(result.platformFeePercentage).toBe(20);
      expect(result.platformFee).toBe(1000000);
      expect(result.designerAmount).toBe(4000000);
      expect(result.platformFee + result.designerAmount).toBe(5000000);
    });

    it('should calculate 10% platform fee and 90% net designer payout on Rp 250.000', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ platformFeePercentage: 10 }]),
        }),
      });

      const result = await calculateCommission(250000);
      expect(result.platformFeePercentage).toBe(10);
      expect(result.platformFee).toBe(25000);
      expect(result.designerAmount).toBe(225000);
      expect(result.platformFee + result.designerAmount).toBe(250000);
    });

    it('should calculate 30% platform fee default fallback when settings table is empty', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      });

      const result = await calculateCommission(100000);
      expect(result.platformFeePercentage).toBe(30);
      expect(result.platformFee).toBe(30000);
      expect(result.designerAmount).toBe(70000);
    });

    it('should properly round odd amounts to integer currency units', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ platformFeePercentage: 15 }]),
        }),
      });

      // 15% of 99,999 = 14999.85 -> 15000
      const result = await calculateCommission(99999);
      expect(result.platformFee).toBe(15000);
      expect(result.designerAmount).toBe(84999);
      expect(result.platformFee + result.designerAmount).toBe(99999);
    });
  });

  describe('3. Wallet Balance Mutation and Ledger Persistence', () => {
    it('should record CREDIT mutation with exact net designer earnings', async () => {
      // Mock existing wallet
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 'w_des_1', designerId: 'des_1', balance: 100000 },
            ]),
          }),
        }),
      });

      // Mock wallet update
      let updatedBalance: WalletUpdatePayload = null as unknown as WalletUpdatePayload;
      mockDb.update.mockReturnValueOnce({
        set: vi.fn().mockImplementation((val) => {
          updatedBalance = val;
          return {
            where: vi.fn().mockResolvedValue(undefined),
          };
        }),
      });

      // Mock wallet mutation insert
      let insertedMutation: MutationInsertPayload = null as unknown as MutationInsertPayload;
      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockImplementation((val) => {
          insertedMutation = val;
          return {
            returning: vi.fn().mockResolvedValue([val]),
          };
        }),
      });

      const creditResult = await creditWallet({
        designerId: 'des_1',
        amount: 40000,
        description: 'Komisi Penjualan Template: Modern Bakery',
        referenceId: 'txn_12345',
      });

      expect(creditResult.balanceAfter).toBe(140000);
      expect(updatedBalance?.balance).toBe(140000);
      expect(insertedMutation).toBeDefined();
      expect(insertedMutation?.type).toBe('CREDIT');
      expect(insertedMutation?.amount).toBe(40000);
      expect(insertedMutation?.balanceAfter).toBe(140000);
      expect(insertedMutation?.description).toBe('Komisi Penjualan Template: Modern Bakery');
      expect(insertedMutation?.referenceId).toBe('txn_12345');
    });

    it('should reject non-positive credit amounts', async () => {
      await expect(
        creditWallet({
          designerId: 'des_1',
          amount: 0,
          description: 'Invalid credit',
        })
      ).rejects.toThrow('Nominal transaksi harus lebih dari 0');
    });

    it('should debit wallet balance and record DEBIT mutation accurately', async () => {
      // Mock existing wallet
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 'w_des_2', designerId: 'des_2', balance: 200000 },
            ]),
          }),
        }),
      });

      // Mock wallet update
      mockDb.update.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      });

      // Mock mutation insert
      let insertedMutation: MutationInsertPayload = null as unknown as MutationInsertPayload;
      mockDb.insert.mockReturnValueOnce({
        values: vi.fn().mockImplementation((val) => {
          insertedMutation = val;
          return {
            returning: vi.fn().mockResolvedValue([val]),
          };
        }),
      });

      const debitResult = await debitWallet({
        designerId: 'des_2',
        amount: 50000,
        description: 'Penarikan Dana Payout',
        referenceId: 'payout_1',
      });

      expect(debitResult.balanceAfter).toBe(150000);
      expect(insertedMutation?.type).toBe('DEBIT');
      expect(insertedMutation?.amount).toBe(50000);
      expect(insertedMutation?.balanceAfter).toBe(150000);
    });

    it('should throw INSUFFICIENT_BALANCE when debit exceeds wallet balance', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 'w_des_3', designerId: 'des_3', balance: 30000 },
            ]),
          }),
        }),
      });

      await expect(
        debitWallet({
          designerId: 'des_3',
          amount: 50000,
          description: 'Payout attempt',
        })
      ).rejects.toThrow('Saldo tidak mencukupi untuk melakukan transaksi');
    });

    it('should get designer wallet summary with 0 fallback if no wallet exists', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const summary = await getDesignerWalletSummary('des_new');
      expect(summary.designerId).toBe('des_new');
      expect(summary.balance).toBe(0);
      expect(summary.walletId).toBeNull();
      expect(summary.mutations).toEqual([]);
    });
  });
});
