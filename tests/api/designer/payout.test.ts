import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET, POST } from '@/pages/api/designer/payout';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import { calculateEligibleBalance, createXenditDisbursement } from '@/services/finance';
import { db } from '@/lib/db/client';

// Mock auth helpers
vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedDesigner: vi.fn(),
}));

// Mock DB client
vi.mock('@/lib/db/client', () => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    transaction: vi.fn(),
    query: {
      bankAccounts: {
        findFirst: vi.fn(),
      },
      payoutRequests: {
        findMany: vi.fn(),
      },
    },
  };
  return { db: mockDb };
});

// Mock finance services
vi.mock('@/services/finance', () => ({
  calculateEligibleBalance: vi.fn(),
  createXenditDisbursement: vi.fn(),
}));

describe('Designer Payout Request API Endpoints', () => {
  const mockGetAuthUser = getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedDesigner = isAuthorizedDesigner as unknown as Mock;
  const mockCalculateEligibleBalance = calculateEligibleBalance as unknown as Mock;
  const mockCreateXenditDisbursement = createXenditDisbursement as unknown as Mock;
  const mockFindFirstBankAccount = db.query.bankAccounts.findFirst as unknown as Mock;
  const mockFindManyPayoutRequests = db.query.payoutRequests.findMany as unknown as Mock;
  const mockSelect = db.select as unknown as Mock;
  const mockTransaction = db.transaction as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateXenditDisbursement.mockResolvedValue(undefined);
  });

  describe('GET /api/designer/payout', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetAuthUser.mockResolvedValue(null);

      const request = new Request('http://localhost/api/designer/payout');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('returns 401 when user is not an authorized designer', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'usr_1', role: 'tenant' });
      mockIsAuthorizedDesigner.mockReturnValue(false);

      const request = new Request('http://localhost/api/designer/payout');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(401);
    });

    it('returns 200 with payout history and minPayoutLimit', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'usr_1', role: 'designer' });
      mockIsAuthorizedDesigner.mockReturnValue(true);

      const mockPayouts = [
        {
          id: 'po_1',
          amount: 50000,
          status: 'processing',
          createdAt: new Date(),
          bankAccount: { bankName: 'BCA', accountNumber: '12345' },
        },
      ];
      mockFindManyPayoutRequests.mockResolvedValue(mockPayouts);

      // Mock select for platform settings (payoutMinimumBalance)
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ payoutMinimumBalance: 75000 }]),
        }),
      });

      const request = new Request('http://localhost/api/designer/payout');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.payouts[0].id).toBe('po_1');
      expect(body.data.payouts[0].amount).toBe(50000);
      expect(body.data.payouts[0].status).toBe('processing');
      expect(body.data.payouts[0].createdAt).toBe(mockPayouts[0].createdAt.toISOString());
      expect(body.data.minPayoutLimit).toBe(75000);
    });
  });

  describe('POST /api/designer/payout', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetAuthUser.mockResolvedValue(null);

      const request = new Request('http://localhost/api/designer/payout', {
        method: 'POST',
        body: JSON.stringify({ amount: 50000, bankAccountId: 'bank_1' }),
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(401);
    });

    it('returns 400 when bank account is not found or does not belong to designer', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'usr_1', role: 'designer' });
      mockIsAuthorizedDesigner.mockReturnValue(true);
      mockFindFirstBankAccount.mockResolvedValue(null); // not found

      const request = new Request('http://localhost/api/designer/payout', {
        method: 'POST',
        body: JSON.stringify({ amount: 50000, bankAccountId: 'bank_invalid' }),
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.message).toBe('Rekening bank tidak ditemukan');
    });

    it('returns 400 when amount is less than payoutMinimumBalance', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'usr_1', role: 'designer' });
      mockIsAuthorizedDesigner.mockReturnValue(true);
      mockFindFirstBankAccount.mockResolvedValue({ id: 'bank_1', bankName: 'BCA' });

      // Mock select for platform settings
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ payoutMinimumBalance: 100000 }]),
        }),
      });

      const request = new Request('http://localhost/api/designer/payout', {
        method: 'POST',
        body: JSON.stringify({ amount: 50000, bankAccountId: 'bank_1' }), // 50000 < 100000
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.message).toContain('Nominal penarikan minimal');
    });

    it('returns 400 when amount exceeds eligible balance', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'usr_1', role: 'designer' });
      mockIsAuthorizedDesigner.mockReturnValue(true);
      mockFindFirstBankAccount.mockResolvedValue({ id: 'bank_1', bankName: 'BCA' });

      // Mock select for platform settings
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ payoutMinimumBalance: 50000 }]),
        }),
      });

      // Mock eligible balance = 40000
      mockCalculateEligibleBalance.mockResolvedValue(40000);

      const request = new Request('http://localhost/api/designer/payout', {
        method: 'POST',
        body: JSON.stringify({ amount: 50000, bankAccountId: 'bank_1' }), // 50000 > 40000
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.message).toBe('Saldo tersedia tidak mencukupi untuk melakukan penarikan');
    });

    it('returns 200 and performs atomic database transaction when amount is valid', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'usr_1', role: 'designer' });
      mockIsAuthorizedDesigner.mockReturnValue(true);
      mockFindFirstBankAccount.mockResolvedValue({ id: 'bank_1', bankName: 'BCA', accountNumber: '12345' });

      // Mock select for platform settings
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ payoutMinimumBalance: 50000 }]),
        }),
      });

      // Mock eligible balance = 100000
      mockCalculateEligibleBalance.mockResolvedValue(100000);

      // Mock transaction execution
      const mockResult = { id: 'po_123', amount: 50000, status: 'processing' };
      mockTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        const mockTx = {
          select: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([{ id: 'w_1', balance: 200000, availableBalance: 100000 }]),
              }),
            }),
          }),
          update: vi.fn().mockReturnValue({
            set: vi.fn().mockReturnValue({
              where: vi.fn().mockResolvedValue(undefined),
            }),
          }),
          insert: vi.fn().mockReturnValue({
            values: vi.fn().mockReturnValue({
              returning: vi.fn().mockResolvedValue([mockResult]),
            }),
          }),
        };
        return await callback(mockTx);
      });

      const request = new Request('http://localhost/api/designer/payout', {
        method: 'POST',
        body: JSON.stringify({ amount: 50000, bankAccountId: 'bank_1' }),
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data).toEqual(mockResult);
    });
  });
});
