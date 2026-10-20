import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import type OpenAI from 'openai';
import { POST as handleDepositPost } from '@/pages/api/admin/ai/deposits';
import { POST as handleGeneratePost } from '@/pages/api/ai/generate';
import { getAuthenticatedUser, isAuthorizedSuperAdmin } from '@/lib/auth';
import { db } from '@/db';
import { setOpenAIClientForTesting, resetOpenAIClient } from '@/lib/openai';
import { cloudinary } from '@/lib/cloudinary.server';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedSuperAdmin: vi.fn(),
  isAuthorizedAdmin: vi.fn(),
}));

vi.mock('@/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    transaction: vi.fn(),
  },
}));

type DepositContext = Parameters<typeof handleDepositPost>[0];
type GenerateContext = Parameters<typeof handleGeneratePost>[0];

describe('Atomic Ledger & AI Generation Integration', () => {
  const mockGetAuthUser = getAuthenticatedUser as unknown as Mock;
  const mockIsSuperAdmin = isAuthorizedSuperAdmin as unknown as Mock;
  const mockSelect = db.select as unknown as Mock;
  const mockInsert = db.insert as unknown as Mock;
  const mockTransaction = db.transaction as unknown as Mock;

  let mockGenerate: ReturnType<typeof vi.fn>;
  let mockOpenAiClient: OpenAI;

  const mockStoreAndCredit = (balance: number) => {
    mockSelect
      .mockReturnValueOnce({
        from: () => ({ where: () => ({ limit: () => Promise.resolve([{ id: 'store_1', userId: 'tenant_1' }]) }) }),
      })
      .mockReturnValueOnce({
        from: () => ({ where: () => ({ limit: () => Promise.resolve([{ id: 'cred_1', balance }]) }) }),
      });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerate = vi.fn();
    mockOpenAiClient = {
      images: { generate: mockGenerate },
    } as unknown as OpenAI;
    setOpenAIClientForTesting(mockOpenAiClient);
  });

  afterEach(() => {
    resetOpenAIClient();
    vi.restoreAllMocks();
  });

  describe('Superadmin AI Deposit Mutation API (/api/admin/ai/deposits)', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuthUser.mockResolvedValue(null);
      const request = new Request('http://localhost/api/admin/ai/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountUsd: 10, amountIdr: 162500 }),
      });

      const res = (await handleDepositPost({ request, params: {} } as unknown as DepositContext)) as Response;
      expect(res.status).toBe(401);
    });

    it('returns 403 when user is not a superadmin', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'admin_1', role: 'admin', status: 'active' });
      mockIsSuperAdmin.mockReturnValue(false);

      const request = new Request('http://localhost/api/admin/ai/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountUsd: 10, amountIdr: 162500 }),
      });

      const res = (await handleDepositPost({ request, params: {} } as unknown as DepositContext)) as Response;
      expect(res.status).toBe(403);
    });

    it('rejects invalid or non-positive deposit amounts with 400', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'super_1', role: 'superadmin', status: 'active' });
      mockIsSuperAdmin.mockReturnValue(true);

      const request = new Request('http://localhost/api/admin/ai/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountUsd: -5, amountIdr: 0 }),
      });

      const res = (await handleDepositPost({ request, params: {} } as unknown as DepositContext)) as Response;
      expect(res.status).toBe(400);
    });

    it('calculates auto exchange rate correctly and stores deposit entry', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'super_1', role: 'superadmin', status: 'active' });
      mockIsSuperAdmin.mockReturnValue(true);

      const mockInserted = {
        id: 'dep_123',
        amountUsd: 10,
        amountIdr: 162540,
        exchangeRate: 16254,
        description: 'Monthly OpenAI Topup',
        createdBy: 'super_1',
      };

      const mockReturning = vi.fn().mockResolvedValue([mockInserted]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      mockInsert.mockReturnValue({ values: mockValues });

      const request = new Request('http://localhost/api/admin/ai/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountUsd: 10,
          amountIdr: 162540,
          description: 'Monthly OpenAI Topup',
        }),
      });

      const res = (await handleDepositPost({ request, params: {} } as unknown as DepositContext)) as Response;
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.exchangeRate).toBe(16254);
      expect(mockValues).toHaveBeenCalledWith(
        expect.objectContaining({
          amountUsd: 10,
          amountIdr: 162540,
          exchangeRate: 16254,
          createdBy: 'super_1',
        })
      );
    });
  });

  describe('Atomic AI Generation & Ledger (/api/ai/generate)', () => {
    it('returns 401 when merchant is not logged in', async () => {
      mockGetAuthUser.mockResolvedValue(null);
      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Logo warung kopi' }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(401);
    });

    it('returns 402/400 when credit balance is insufficient before AI call', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant' });
      mockStoreAndCredit(0);

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Logo modern coffee shop' }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(402);
      const json = await res.json();
      expect(json.ok).toBe(false);
      expect(json.error.message).toContain('Kredit AI tidak mencukupi');
      expect(mockGenerate).not.toHaveBeenCalled();
      expect(mockTransaction).not.toHaveBeenCalled();
    });

    it('executes atomic transaction successfully deducting 1 credit and recording log', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant' });
      mockStoreAndCredit(2);

      mockSelect.mockReturnValueOnce({
        from: () => ({ orderBy: () => ({ limit: () => Promise.resolve([{ exchangeRate: 16200 }]) }) }),
      });

      mockGenerate.mockResolvedValueOnce({
        data: [{ b64_json: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }],
        usage: { input_tokens: 150, output_tokens: 600 },
      });

      vi.spyOn(cloudinary.uploader, 'upload').mockResolvedValueOnce({
        public_id: 'pinoka/logos/logo_1',
        secure_url: 'https://res.cloudinary.com/pinoka/logo.png',
        bytes: 1024,
      } as unknown as Awaited<ReturnType<typeof cloudinary.uploader.upload>>);

      const mockTx = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              returning: vi.fn().mockResolvedValue([{ id: 'cred_1', balance: 1 }]),
            }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: 'log_abc123' }]),
          }),
        }),
      };
      mockTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockTx));

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureType: 'logo',
          prompt: 'Minimalist coffee shop logo',
        }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.remainingCredits).toBe(1);
      expect(json.data.imageUrl).toBe('https://res.cloudinary.com/pinoka/logo.png');
      expect(mockTx.update).toHaveBeenCalled();
      expect(mockTx.insert).toHaveBeenCalled();
    });

    it('rolls back database transaction and does not leak credits when third-party API fails', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant' });
      mockStoreAndCredit(2);

      mockGenerate.mockRejectedValueOnce(new Error('OpenAI 503 Service Unavailable'));

      let creditDeductedInDb = false;
      const mockTx = {
        update: vi.fn().mockImplementation(() => {
          creditDeductedInDb = true;
          return {
            set: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                returning: vi.fn().mockResolvedValue([{ id: 'cred_1', balance: 1 }]),
              }),
            }),
          };
        }),
        insert: vi.fn(),
      };

      mockTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        try {
          return await callback(mockTx);
        } catch (error) {
          creditDeductedInDb = false;
          throw error;
        }
      });

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureType: 'logo',
          prompt: 'Minimalist coffee shop logo',
        }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(500);
      expect(creditDeductedInDb).toBe(false);
      expect(mockTx.insert).not.toHaveBeenCalled();
    });
  });
});
