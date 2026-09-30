import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET, POST, DELETE } from '@/pages/api/admin/bank-account';
import { db } from '@/lib/db/client';
import * as authLib from '@/lib/auth';

vi.mock('@/lib/db/client', () => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  return { db: mockDb, getDb: () => mockDb };
});

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedAdmin: vi.fn(),
}));

describe('Admin Bank Account API Endpoint', () => {
  const mockGetAuthUser = authLib.getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedAdmin = authLib.isAuthorizedAdmin as unknown as Mock;
  const mockSelect = db.select as unknown as Mock;
  const mockInsert = db.insert as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/bank-account', () => {
    it('returns 401 when unauthorized or not admin', async () => {
      mockGetAuthUser.mockResolvedValue(null);
      mockIsAuthorizedAdmin.mockReturnValue(false);

      const request = new Request('http://localhost/api/admin/bank-account');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.ok).toBe(false);
    });

    it('returns bank accounts for authorized admin', async () => {
      const mockAdmin = { id: 'adm_1', role: 'admin', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockAdmin);
      mockIsAuthorizedAdmin.mockReturnValue(true);

      const mockRecord = {
        id: 'ba_admin_1',
        userId: 'adm_1',
        bankCode: 'BCA',
        bankName: 'BCA',
        accountNumber: '9988776655',
        accountHolder: 'Admin Official',
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

      const request = new Request('http://localhost/api/admin/bank-account');
      const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data.accounts).toHaveLength(1);
      expect(body.data.primaryAccount.accountHolder).toBe('Admin Official');
    });
  });

  describe('POST /api/admin/bank-account', () => {
    it('allows admin to register a bank account (up to 3)', async () => {
      const mockAdmin = { id: 'adm_1', role: 'admin', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockAdmin);
      mockIsAuthorizedAdmin.mockReturnValue(true);

      // designers check
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ userId: 'adm_1' }]),
          }),
        }),
      });

      // existing accounts (0)
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const newRecord = {
        id: 'ba_adm_new',
        userId: 'adm_1',
        bankCode: 'BRI',
        bankName: 'Bank BRI',
        accountNumber: '5566778899',
        accountHolder: 'Admin Official',
        isPrimary: true,
        isVerified: true,
        createdAt: new Date(),
      };

      mockInsert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([newRecord]),
        }),
      });

      const request = new Request('http://localhost/api/admin/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankCode: 'BRI',
          bankName: 'Bank BRI',
          accountNumber: '5566778899',
          accountHolder: 'Admin Official',
        }),
      });
      const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data.accountNumber).toBe('5566778899');
    });
  });

  describe('DELETE /api/admin/bank-account', () => {
    it('deletes an admin bank account', async () => {
      const mockAdmin = { id: 'adm_1', role: 'admin', status: 'active' };
      mockGetAuthUser.mockResolvedValue(mockAdmin);
      mockIsAuthorizedAdmin.mockReturnValue(true);

      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 'ba_adm_1', isPrimary: false, userId: 'adm_1' }]),
          }),
        }),
      });

      const mockDelete = db.delete as unknown as Mock;
      mockDelete.mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      });

      const request = new Request('http://localhost/api/admin/bank-account?id=ba_adm_1', {
        method: 'DELETE',
      });
      const res = (await DELETE({ request, params: {} } as unknown as Parameters<typeof DELETE>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.data.success).toBe(true);
    });
  });
});
