import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET, POST, DELETE, PATCH } from '@/pages/api/designer/bank-account';
import { db } from '@/lib/db/client';
import * as authLib from '@/lib/auth';

vi.mock('@/lib/db/client', () => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    query: {
      bankAccounts: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
  };
  return { db: mockDb, getDb: () => mockDb };
});

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedDesigner: vi.fn(),
}));

describe('Designer Bank Account API Endpoint', () => {
  const mockGetAuthUser = authLib.getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedDesigner = authLib.isAuthorizedDesigner as unknown as Mock;
  const mockSelect = db.select as unknown as Mock;
  const mockInsert = db.insert as unknown as Mock;
  const mockUpdate = db.update as unknown as Mock;
  const mockDelete = db.delete as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/designer/bank-account', () => {
    it('returns 401 when unauthorized', async () => {
      mockGetAuthUser.mockResolvedValue(null);
      mockIsAuthorizedDesigner.mockReturnValue(false);

      const request = new Request('http://localhost/api/designer/bank-account');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.ok).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('returns bank accounts list and primary account if configured', async () => {
      const mockUser = { id: 'usr_1', role: 'designer', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockUser);
      mockIsAuthorizedDesigner.mockReturnValue(true);

      const mockRecord = {
        id: 'ba_1',
        userId: 'usr_1',
        bankCode: 'BCA',
        bankName: 'BCA',
        accountNumber: '1234567890',
        accountHolder: 'John Doe',
        isPrimary: true,
        isVerified: true,
        createdAt: new Date(),
      };

      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue([mockRecord]),
          }),
        }),
      });

      const request = new Request('http://localhost/api/designer/bank-account');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data.accounts).toHaveLength(1);
      expect(body.data.accounts[0].accountNumber).toBe('1234567890');
      expect(body.data.primaryAccount.id).toBe('ba_1');
    });

    it('returns null if no bank accounts configured', async () => {
      const mockUser = { id: 'usr_1', role: 'designer', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockUser);
      mockIsAuthorizedDesigner.mockReturnValue(true);

      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const request = new Request('http://localhost/api/designer/bank-account');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data).toBeNull();
    });
  });

  describe('POST /api/designer/bank-account', () => {
    it('returns 401 when unauthorized', async () => {
      mockGetAuthUser.mockResolvedValue(null);
      mockIsAuthorizedDesigner.mockReturnValue(false);

      const request = new Request('http://localhost/api/designer/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: 'BCA',
          accountNumber: '1234567890',
          accountHolder: 'John Doe',
        }),
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.ok).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('returns 400 validation error when input is invalid', async () => {
      const mockUser = { id: 'usr_1', role: 'designer', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockUser);
      mockIsAuthorizedDesigner.mockReturnValue(true);

      const request = new Request('http://localhost/api/designer/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: 'B', // too short
          accountNumber: 'abc', // not digits
          accountHolder: '',
        }),
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.ok).toBe(false);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    it('adds a new bank account successfully', async () => {
      const mockUser = { id: 'usr_1', role: 'designer', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockUser);
      mockIsAuthorizedDesigner.mockReturnValue(true);

      // designers profile check
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ userId: 'usr_1' }]),
          }),
        }),
      });

      // existing bankAccounts check (0 accounts)
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const newRecord = {
        id: 'ba_test',
        userId: 'usr_1',
        bankCode: 'BCA',
        bankName: 'BCA',
        accountNumber: '1234567890',
        accountHolder: 'John Doe',
        isPrimary: true,
        isVerified: true,
        createdAt: new Date(),
      };

      mockInsert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([newRecord]),
        }),
      });

      const request = new Request('http://localhost/api/designer/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankCode: 'BCA',
          bankName: 'BCA',
          accountNumber: '1234567890',
          accountHolder: 'John Doe',
        }),
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data.accountNumber).toBe('1234567890');
      expect(body.data.isPrimary).toBe(true);
    });

    it('rejects adding a 4th bank account (max 3 accounts)', async () => {
      const mockUser = { id: 'usr_1', role: 'designer', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockUser);
      mockIsAuthorizedDesigner.mockReturnValue(true);

      // designers profile check
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ userId: 'usr_1' }]),
          }),
        }),
      });

      // existing accounts (already 3 accounts!)
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            { id: '1', bankCode: 'BCA', accountNumber: '11111' },
            { id: '2', bankCode: 'BNI', accountNumber: '22222' },
            { id: '3', bankCode: 'BRI', accountNumber: '33333' },
          ]),
        }),
      });

      const request = new Request('http://localhost/api/designer/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankCode: 'MANDIRI',
          bankName: 'Bank Mandiri',
          accountNumber: '44444444',
          accountHolder: 'John Doe',
        }),
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.ok).toBe(false);
      expect(body.error.message).toContain('Maksimal 3 rekening');
    });

    it('rejects adding duplicate bank account', async () => {
      const mockUser = { id: 'usr_1', role: 'designer', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockUser);
      mockIsAuthorizedDesigner.mockReturnValue(true);

      // designers profile check
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ userId: 'usr_1' }]),
          }),
        }),
      });

      // existing accounts with same bank and account number
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            { id: '1', bankCode: 'BCA', accountNumber: '1234567890' },
          ]),
        }),
      });

      const request = new Request('http://localhost/api/designer/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankCode: 'BCA',
          bankName: 'BCA',
          accountNumber: '1234567890',
          accountHolder: 'John Doe',
        }),
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.ok).toBe(false);
      expect(body.error.message).toContain('sudah terdaftar');
    });
  });

  describe('DELETE /api/designer/bank-account', () => {
    it('deletes an account and reassigns primary if needed', async () => {
      const mockUser = { id: 'usr_1', role: 'designer', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockUser);
      mockIsAuthorizedDesigner.mockReturnValue(true);

      // Find account to delete
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'ba_1', isPrimary: true, userId: 'usr_1' }]),
          }),
        }),
      });

      // Delete call
      mockDelete.mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      });

      // Remaining accounts check
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{ id: 'ba_2' }]),
            }),
          }),
        }),
      });

      mockUpdate.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({}),
        }),
      });

      const request = new Request('http://localhost/api/designer/bank-account?id=ba_1', {
        method: 'DELETE',
      });
      const res = (await DELETE({ request, params: {} } as unknown as Parameters<typeof DELETE>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data.success).toBe(true);
    });
  });

  describe('PATCH /api/designer/bank-account', () => {
    it('sets an account as primary', async () => {
      const mockUser = { id: 'usr_1', role: 'designer', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockUser);
      mockIsAuthorizedDesigner.mockReturnValue(true);

      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'ba_2', userId: 'usr_1', isPrimary: false }]),
          }),
        }),
      });

      mockUpdate.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({}),
        }),
      });

      const updatedRecord = {
        id: 'ba_2',
        userId: 'usr_1',
        bankCode: 'BCA',
        bankName: 'BCA',
        accountNumber: '99887766',
        accountHolder: 'John Doe',
        isPrimary: true,
        isVerified: true,
        createdAt: new Date(),
      };

      mockUpdate.mockReturnValueOnce({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([updatedRecord]),
          }),
        }),
      });

      const request = new Request('http://localhost/api/designer/bank-account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'ba_2' }),
      });
      const res = (await PATCH({ request, params: {} } as unknown as Parameters<typeof PATCH>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data.isPrimary).toBe(true);
    });
  });
});
