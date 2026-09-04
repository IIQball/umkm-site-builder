import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { createXenditDisbursement, processDisbursementWebhook } from '@/services/finance/payout.service';
import { xenditClient } from '@/lib/finance/xendit';
import { db } from '@/lib/db/client';
import { payoutRequests, wallets, walletMutations } from '@/db/schema';

// Mock DB client
vi.mock('@/lib/db/client', () => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    transaction: vi.fn(),
  };
  return { db: mockDb };
});

// Mock Xendit client
vi.mock('@/lib/finance/xendit', () => {
  return {
    xenditClient: {
      createDisbursement: vi.fn(),
    },
  };
});

describe('Payout Service (Xendit Payouts & Webhook processing)', () => {
  const mockSelect = db.select as unknown as Mock;
  const mockUpdate = db.update as unknown as Mock;
  const mockTransaction = db.transaction as unknown as Mock;
  const mockCreateDisbursement = xenditClient.createDisbursement as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createXenditDisbursement', () => {
    it('creates xendit disbursement and updates payoutRequests', async () => {
      // 1. Mock select payout request
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: 'po_123',
                amount: 100000,
                bankAccountId: 'ba_123',
              },
            ]),
          }),
        }),
      });

      // 2. Mock select bank account
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: 'ba_123',
                bankName: 'BCA',
                accountNumber: '1234567',
                accountHolder: 'John Doe',
              },
            ]),
          }),
        }),
      });

      // 3. Mock Xendit disbursement call
      mockCreateDisbursement.mockResolvedValueOnce({
        id: 'disb_xendit_123',
        externalId: 'po_123',
        status: 'PENDING',
      });

      // 4. Mock update payoutRequests
      mockUpdate.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'po_123',
            },
          ]),
        }),
      });

      await createXenditDisbursement('po_123');

      expect(mockCreateDisbursement).toHaveBeenCalledWith({
        externalId: 'po_123',
        amount: 100000,
        bankCode: 'BCA',
        accountHolderName: 'John Doe',
        accountNumber: '1234567',
        description: 'Penarikan Dana Desainer - po_123',
      });

      expect(mockUpdate).toHaveBeenCalledWith(payoutRequests);
    });

    it('records error message on Xendit API failure', async () => {
      // 1. Mock select payout request
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: 'po_123',
                amount: 100000,
                bankAccountId: 'ba_123',
              },
            ]),
          }),
        }),
      });

      // 2. Mock select bank account
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: 'ba_123',
                bankName: 'BCA',
                accountNumber: '1234567',
                accountHolder: 'John Doe',
              },
            ]),
          }),
        }),
      });

      // 3. Mock Xendit failure
      mockCreateDisbursement.mockRejectedValueOnce(new Error('API failure'));

      // 4. Mock update payoutRequests
      mockUpdate.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      await expect(createXenditDisbursement('po_123')).rejects.toThrow('API failure');
      expect(mockUpdate).toHaveBeenCalledWith(payoutRequests);
    });
  });

  describe('processDisbursementWebhook', () => {
    it('sets payout request status to completed on SUCCESS status', async () => {
      // 1. Mock select payout request
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: 'po_123',
                amount: 100000,
                status: 'processing',
              },
            ]),
          }),
        }),
      });

      // 2. Mock update payoutRequests
      mockUpdate.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      await processDisbursementWebhook({
        payoutRequestId: 'po_123',
        status: 'SUCCESS',
      });

      expect(mockUpdate).toHaveBeenCalledWith(payoutRequests);
    });

    it('sets status to rejected and rolls back wallet balance on FAILED status', async () => {
      // 1. Mock select payout request
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                id: 'po_123',
                amount: 100000,
                status: 'processing',
                designerId: 'des_123',
              },
            ]),
          }),
        }),
      });

      // 2. Mock transaction execution
      const mockTx = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([]),
          }),
        }),
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([
                {
                  id: 'w_123',
                  balance: 50000,
                  availableBalance: 50000,
                },
              ]),
            }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockResolvedValue([]),
        }),
      };

      mockTransaction.mockImplementationOnce(async (cb: (tx: unknown) => Promise<unknown>) => {
        return cb(mockTx);
      });

      await processDisbursementWebhook({
        payoutRequestId: 'po_123',
        status: 'FAILED',
        failureCode: 'INSUFFICIENT_GATEWAY_BALANCE',
      });

      // Assert status was updated to rejected on payout request
      expect(mockTx.update).toHaveBeenCalledWith(payoutRequests);
      // Assert wallet update was triggered
      expect(mockTx.update).toHaveBeenCalledWith(wallets);
      // Assert wallet mutation was inserted
      expect(mockTx.insert).toHaveBeenCalledWith(walletMutations);
    });
  });
});
