import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET, POST } from '@/pages/api/designer/bank-account';
import { db } from '@/lib/db/client';
import * as authLib from '@/lib/auth';

vi.mock('@/lib/db/client', () => {
  const mockDb = {
    query: {
      bankAccounts: {
        findFirst: vi.fn(),
      },
    },
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
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
  const mockFindFirst = db.query.bankAccounts.findFirst as unknown as Mock;
  const mockSelect = db.select as unknown as Mock;
  const mockInsert = db.insert as unknown as Mock;
  const mockUpdate = db.update as unknown as Mock;

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
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('returns bank account data if configured', async () => {
      const mockUser = { id: 'usr_1', role: 'designer', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockUser);
      mockIsAuthorizedDesigner.mockReturnValue(true);

      const mockRecord = {
        id: 'ba_1',
        designerId: 'usr_1',
        bankName: 'BCA',
        accountNumber: '123456',
        accountHolder: 'John Doe',
      };
      mockFindFirst.mockResolvedValue(mockRecord);

      const request = new Request('http://localhost/api/designer/bank-account');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data).toEqual(mockRecord);
    });

    it('returns null if not configured', async () => {
      const mockUser = { id: 'usr_1', role: 'designer', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockUser);
      mockIsAuthorizedDesigner.mockReturnValue(true);
      mockFindFirst.mockResolvedValue(undefined);

      const request = new Request('http://localhost/api/designer/bank-account');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
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
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('returns 400 validation error when input is invalid', async () => {
      const mockUser = { id: 'usr_1', role: 'designer', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockUser);
      mockIsAuthorizedDesigner.mockReturnValue(true);
      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ userId: 'usr_1' }]),
          }),
        }),
      });

      const request = new Request('http://localhost/api/designer/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: 'B', // too short
          accountNumber: 'abc', // not only digits
          accountHolder: '', // empty
        }),
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    it('inserts a new bank account record if none exists', async () => {
      const mockUser = { id: 'usr_1', role: 'designer', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockUser);
      mockIsAuthorizedDesigner.mockReturnValue(true);

      // designers check returns existing profile
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ userId: 'usr_1' }]),
          }),
        }),
      });

      // bankAccounts check returns empty
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const newRecord = {
        id: 'ba_test',
        designerId: 'usr_1',
        bankName: 'BCA',
        accountNumber: '1234567890',
        accountHolder: 'John Doe',
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
          bankName: 'BCA',
          accountNumber: '1234567890',
          accountHolder: 'John Doe',
        }),
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data).toEqual(newRecord);
    });

    it('updates an existing bank account record', async () => {
      const mockUser = { id: 'usr_1', role: 'designer', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockUser);
      mockIsAuthorizedDesigner.mockReturnValue(true);

      // designers check returns existing profile
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ userId: 'usr_1' }]),
          }),
        }),
      });

      // bankAccounts check returns existing
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'ba_1' }]),
          }),
        }),
      });

      const updatedRecord = {
        id: 'ba_1',
        designerId: 'usr_1',
        bankName: 'Mandiri',
        accountNumber: '987654321',
        accountHolder: 'John Updated',
      };
      mockUpdate.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([updatedRecord]),
          }),
        }),
      });

      const request = new Request('http://localhost/api/designer/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: 'Mandiri',
          accountNumber: '987654321',
          accountHolder: 'John Updated',
        }),
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data).toEqual(updatedRecord);
    });
  });
});
