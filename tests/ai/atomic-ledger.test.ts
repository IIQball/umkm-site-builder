import { describe, it, expect, mock, spyOn, beforeEach, afterEach, type Mock } from 'bun:test';
import type OpenAI from 'openai';
import { POST as handleDepositPost } from '@/pages/api/admin/ai/deposits';
import { POST as handleGeneratePost } from '@/pages/api/ai/generate';
import { getAuthenticatedUser, isAuthorizedSuperAdmin } from '@/lib/auth';
import { db } from '@/db';
import { setOpenAIClientForTesting, resetOpenAIClient } from '@/lib/openai';
import { cloudinary } from '@/lib/cloudinary.server';

mock.module('@/lib/auth', () => ({
  getAuthenticatedUser: mock(),
  isAuthorizedSuperAdmin: mock(),
  isAuthorizedAdmin: mock(),
}));

mock.module('@/db', () => ({
  db: {
    select: mock(),
    insert: mock(),
    transaction: mock(),
  },
}));

type DepositContext = Parameters<typeof handleDepositPost>[0];
type GenerateContext = Parameters<typeof handleGeneratePost>[0];

interface RecordedLogPayload {
  id?: string;
  isTesting?: boolean;
  creditsDeducted?: number;
  modelUsed?: string;
  status?: string;
  featureType?: string;
}

const TINY_B64_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

describe('Atomic Ledger & AI Generation Integration (bun:test)', () => {
  const mockGetAuthUser = getAuthenticatedUser as unknown as Mock;
  const mockIsSuperAdmin = isAuthorizedSuperAdmin as unknown as Mock;
  const mockSelect = db.select as unknown as Mock;
  const mockInsert = db.insert as unknown as Mock;
  const mockTransaction = db.transaction as unknown as Mock;

  let mockGenerate: ReturnType<typeof mock>;
  let mockEdit: ReturnType<typeof mock>;
  let mockOpenAiClient: OpenAI;

  const mockStoreAndTier = ({
    balance = 2,
    packageTier = null as string | null,
    userId = 'tenant_1',
    storeId = 'store_1',
    exchangeRate = 16200,
  } = {}) => {
    // 1. stores
    mockSelect.mockReturnValueOnce({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([{ id: storeId, userId }]) }) }),
    });

    // 2. storeQuotaPurchases in resolveStoreAiModel
    mockSelect.mockReturnValueOnce({
      from: () => ({
        leftJoin: () => ({
          where: () => ({
            orderBy: () => ({
              limit: () =>
                Promise.resolve(
                  packageTier
                    ? [
                        {
                          id: 'pur_1',
                          packageId: `pkg_${packageTier.toLowerCase()}`,
                          packageName: `Paket ${packageTier}`,
                          packageSlug: `paket-${packageTier.toLowerCase()}`,
                        },
                      ]
                    : []
                ),
            }),
          }),
        }),
      }),
    });

    // 3. tenantAiCredits in resolveStoreAiModel
    mockSelect.mockReturnValueOnce({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve([{ id: 'cred_1', balance, totalPurchased: packageTier ? 1 : 0 }]),
        }),
      }),
    });

    // 4. tenantAiCredits in generate.ts credit check
    mockSelect.mockReturnValueOnce({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([{ id: 'cred_1', balance }]) }) }),
    });

    // 5. aiDepositHistory in calculateCost
    mockSelect.mockReturnValueOnce({
      from: () => ({ orderBy: () => ({ limit: () => Promise.resolve([{ exchangeRate }]) }) }),
    });
  };

  const mockInsufficientCredit = (packageTier: string | null = null, balance = 0) => {
    mockSelect.mockReturnValueOnce({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([{ id: 'store_1', userId: 'tenant_1' }]) }) }),
    });

    mockSelect.mockReturnValueOnce({
      from: () => ({
        leftJoin: () => ({
          where: () => ({
            orderBy: () => ({
              limit: () =>
                Promise.resolve(
                  packageTier
                    ? [
                        {
                          id: 'pur_1',
                          packageId: `pkg_${packageTier.toLowerCase()}`,
                          packageName: `Paket ${packageTier}`,
                          packageSlug: `paket-${packageTier.toLowerCase()}`,
                        },
                      ]
                    : []
                ),
            }),
          }),
        }),
      }),
    });

    mockSelect.mockReturnValueOnce({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve([{ id: 'cred_1', balance, totalPurchased: packageTier ? 1 : 0 }]),
        }),
      }),
    });

    mockSelect.mockReturnValueOnce({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([{ id: 'cred_1', balance }]) }) }),
    });
  };

  const mockSuperadminTesting = ({
    packageTier = null as string | null,
    userId = 'super_1',
    storeId = 'store_1',
    exchangeRate = 16200,
    storeExistsInDb = true,
    explicitStoreLookup = false,
  } = {}) => {
    if (storeExistsInDb) {
      mockSelect.mockReturnValueOnce({
        from: () => ({ where: () => ({ limit: () => Promise.resolve([{ id: storeId, userId }]) }) }),
      });
    } else {
      mockSelect.mockReturnValueOnce({
        from: () => ({ where: () => ({ limit: () => Promise.resolve([]) }) }),
      });
      if (explicitStoreLookup) {
        mockSelect.mockReturnValueOnce({
          from: () => ({ where: () => ({ limit: () => Promise.resolve([]) }) }),
        });
      }
    }

    mockSelect.mockReturnValueOnce({
      from: () => ({
        leftJoin: () => ({
          where: () => ({
            orderBy: () => ({
              limit: () =>
                Promise.resolve(
                  packageTier
                    ? [
                        {
                          id: 'pur_1',
                          packageId: `pkg_${packageTier.toLowerCase()}`,
                          packageName: `Paket ${packageTier}`,
                          packageSlug: `paket-${packageTier.toLowerCase()}`,
                        },
                      ]
                    : []
                ),
            }),
          }),
        }),
      }),
    });

    mockSelect.mockReturnValueOnce({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve([{ id: 'cred_1', balance: 5, totalPurchased: packageTier ? 1 : 0 }]),
        }),
      }),
    });

    mockSelect.mockReturnValueOnce({
      from: () => ({ orderBy: () => ({ limit: () => Promise.resolve([{ exchangeRate }]) }) }),
    });
  };

  beforeEach(() => {
    mockGetAuthUser.mockReset();
    mockIsSuperAdmin.mockReset();
    mockSelect.mockReset();
    mockInsert.mockReset();
    mockTransaction.mockReset();

    mockGenerate = mock();
    mockEdit = mock();
    mockOpenAiClient = {
      images: {
        generate: mockGenerate,
        edit: mockEdit,
      },
    } as unknown as OpenAI;
    setOpenAIClientForTesting(mockOpenAiClient);
  });

  afterEach(() => {
    resetOpenAIClient();
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

      const mockReturning = mock().mockResolvedValue([mockInserted]);
      const mockValues = mock().mockReturnValue({ returning: mockReturning });
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

    it('returns 400 when prompt is empty or whitespace only', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant', status: 'active' });
      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '    ' }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error.message).toContain('Prompt wajib diisi');
    });

    it('returns 400 when mockup feature is requested without product image', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant', status: 'active' });
      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureType: 'packaging_mockup',
          prompt: 'Packaging mockup for organic coffee pouch',
        }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error.message).toContain('Gambar produk wajib disertakan untuk fitur mockup');
    });

    it('returns 400 when image buffer strictly exceeds 4 MB payload limit', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant', status: 'active' });
      const oversizedB64 = Buffer.alloc(4 * 1024 * 1024 + 10).toString('base64');
      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureType: 'packaging_mockup',
          prompt: 'Coffee pouch mockup',
          image: oversizedB64,
        }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error.message).toContain('Ukuran gambar referensi melebihi batas 4 MB');
    });

    it('returns 404 when merchant store is not found in database', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_no_store', role: 'tenant', status: 'active' });
      mockSelect.mockReturnValueOnce({
        from: () => ({ where: () => ({ limit: () => Promise.resolve([]) }) }),
      });

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Minimalist logo' }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.error.message).toContain('Toko merchant tidak ditemukan');
    });

    it('returns 402 when credit balance is insufficient before AI call', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant', status: 'active' });
      mockInsufficientCredit(null, 0);

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

    it('rejects with HTTP 402 when store has only 1 credit but tries to run sunburst model (Reguler tier needs 2 credits)', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant', status: 'active' });
      mockInsufficientCredit('Reguler', 1);

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Logo kopi premium' }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(402);
      const json = await res.json();
      expect(json.ok).toBe(false);
      expect(json.error.message).toContain('Kredit AI tidak mencukupi');
      expect(mockGenerate).not.toHaveBeenCalled();
      expect(mockTransaction).not.toHaveBeenCalled();
    });

    it('handles request concurrency race condition: rejects with 402 when balance drops during atomic update', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant', status: 'active' });
      mockStoreAndTier({ balance: 2, packageTier: 'Hemat' });

      // Simulate concurrent update conflict where atomic returning returns empty
      const mockTx = {
        update: mock().mockReturnValue({
          set: mock().mockReturnValue({
            where: mock().mockReturnValue({
              returning: mock().mockResolvedValue([]), // Empty: race condition lost!
            }),
          }),
        }),
        insert: mock(),
      };
      mockTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockTx));

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Logo coffee concurrent' }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(402);
      const json = await res.json();
      expect(json.error.message).toContain('Kredit AI tidak mencukupi saat pemotongan');
      expect(mockGenerate).not.toHaveBeenCalled();
    });

    it('executes atomic transaction successfully deducting 1 credit for flare model (Hemat/Trial)', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant', status: 'active' });
      mockStoreAndTier({ balance: 2, packageTier: 'Hemat' });

      mockGenerate.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 150, output_tokens: 600 },
      });

      spyOn(cloudinary.uploader, 'upload').mockResolvedValueOnce({
        public_id: 'pinoka/logos/logo_1',
        secure_url: 'https://res.cloudinary.com/pinoka/logo.png',
        bytes: 1024,
      } as unknown as Awaited<ReturnType<typeof cloudinary.uploader.upload>>);

      const mockTx = {
        update: mock().mockReturnValue({
          set: mock().mockReturnValue({
            where: mock().mockReturnValue({
              returning: mock().mockResolvedValue([{ id: 'cred_1', balance: 1 }]),
            }),
          }),
        }),
        insert: mock().mockReturnValue({
          values: mock().mockReturnValue({
            returning: mock().mockResolvedValue([{ id: 'log_abc123' }]),
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
          options: { quality: 'medium', size: '1024x1024' },
        }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.remainingCredits).toBe(1);
      expect(json.data.creditsDeducted).toBe(1);
      expect(json.data.modelUsed).toBe('gpt-image-2.5-flare');
      expect(json.data.imageUrl).toBe('https://res.cloudinary.com/pinoka/logo.png');
      expect(mockTx.update).toHaveBeenCalled();
      expect(mockTx.insert).toHaveBeenCalled();
    });

    it('executes atomic transaction successfully deducting 2 credits for sunburst model (Reguler/Juragan)', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant', status: 'active' });
      mockStoreAndTier({ balance: 5, packageTier: 'Reguler' });

      mockGenerate.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 300, output_tokens: 800 },
      });

      spyOn(cloudinary.uploader, 'upload').mockResolvedValueOnce({
        public_id: 'pinoka/logos/logo_2',
        secure_url: 'https://res.cloudinary.com/pinoka/logo2.png',
        bytes: 2048,
      } as unknown as Awaited<ReturnType<typeof cloudinary.uploader.upload>>);

      const mockTx = {
        update: mock().mockReturnValue({
          set: mock().mockReturnValue({
            where: mock().mockReturnValue({
              returning: mock().mockResolvedValue([{ id: 'cred_1', balance: 3 }]),
            }),
          }),
        }),
        insert: mock().mockReturnValue({
          values: mock().mockReturnValue({
            returning: mock().mockResolvedValue([{ id: 'log_sunburst123' }]),
          }),
        }),
      };
      mockTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockTx));

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureType: 'logo',
          prompt: 'Exclusive jewelry logo',
        }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.remainingCredits).toBe(3);
      expect(json.data.creditsDeducted).toBe(2);
      expect(json.data.modelUsed).toBe('gpt-image-2.5-sunburst');
      expect(mockTx.update).toHaveBeenCalled();
      expect(mockTx.insert).toHaveBeenCalled();
    });

    it('executes product mockup generation with base64 data URL and size ratio', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant', status: 'active' });
      mockStoreAndTier({ balance: 5, packageTier: 'Reguler' });

      mockEdit.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 250, output_tokens: 750 },
      });

      spyOn(cloudinary.uploader, 'upload').mockResolvedValueOnce({
        public_id: 'pinoka/mockups/mockup_1',
        secure_url: 'https://res.cloudinary.com/pinoka/mockups/mockup_1.webp',
        bytes: 4096,
      } as unknown as Awaited<ReturnType<typeof cloudinary.uploader.upload>>);

      let insertedLog: Partial<RecordedLogPayload> = {};
      const mockTx = {
        update: mock().mockReturnValue({
          set: mock().mockReturnValue({
            where: mock().mockReturnValue({
              returning: mock().mockResolvedValue([{ id: 'cred_1', balance: 3 }]),
            }),
          }),
        }),
        insert: mock().mockReturnValue({
          values: mock().mockImplementation((val: RecordedLogPayload) => {
            insertedLog = val;
            return {
              returning: mock().mockResolvedValue([{ id: 'log_mockup_1', ...val }]),
            };
          }),
        }),
      };
      mockTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockTx));

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureType: 'packaging_mockup',
          prompt: 'Matte black coffee packaging mockup',
          image: `data:image/png;base64,${TINY_B64_PNG}`,
          options: { size: '1024x1536' },
        }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.imageUrl).toContain('mockup_1.webp');
      expect(insertedLog.featureType).toBe('packaging_mockup');
      expect(mockEdit).toHaveBeenCalled();
    });

    it('parses multipart/form-data payload correctly and executes generation', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_form', role: 'tenant', status: 'active' });
      mockStoreAndTier({ balance: 3, packageTier: 'Trial', userId: 'tenant_form' });

      mockGenerate.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 100, output_tokens: 500 },
      });

      spyOn(cloudinary.uploader, 'upload').mockResolvedValueOnce({
        public_id: 'pinoka/logos/logo_form',
        secure_url: 'https://res.cloudinary.com/pinoka/logo_form.png',
        bytes: 1024,
      } as unknown as Awaited<ReturnType<typeof cloudinary.uploader.upload>>);

      const mockTx = {
        update: mock().mockReturnValue({
          set: mock().mockReturnValue({
            where: mock().mockReturnValue({
              returning: mock().mockResolvedValue([{ id: 'cred_1', balance: 2 }]),
            }),
          }),
        }),
        insert: mock().mockReturnValue({
          values: mock().mockReturnValue({
            returning: mock().mockResolvedValue([{ id: 'log_form_1' }]),
          }),
        }),
      };
      mockTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockTx));

      const formData = new FormData();
      formData.append('featureType', 'logo');
      formData.append('prompt', 'Warung Soto Lamongan logo');
      formData.append('quality', 'high');
      formData.append('size', '1024x1024');

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        body: formData,
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.ok).toBe(true);
    });

    it('parses multipart/form-data with image file for packaging_mockup generation', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_form', role: 'tenant', status: 'active' });
      mockStoreAndTier({ balance: 5, packageTier: 'Reguler', userId: 'tenant_form' });

      mockEdit.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 150, output_tokens: 450 },
      });

      spyOn(cloudinary.uploader, 'upload').mockResolvedValueOnce({
        public_id: 'pinoka/mockups/mockup_form',
        secure_url: 'https://res.cloudinary.com/pinoka/mockup_form.webp',
        bytes: 2048,
      } as unknown as Awaited<ReturnType<typeof cloudinary.uploader.upload>>);

      const mockTx = {
        update: mock().mockReturnValue({
          set: mock().mockReturnValue({
            where: mock().mockReturnValue({
              returning: mock().mockResolvedValue([{ id: 'cred_1', balance: 3 }]),
            }),
          }),
        }),
        insert: mock().mockReturnValue({
          values: mock().mockReturnValue({
            returning: mock().mockResolvedValue([{ id: 'log_mockup_form' }]),
          }),
        }),
      };
      mockTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockTx));

      const formData = new FormData();
      formData.append('featureType', 'packaging_mockup');
      formData.append('prompt', 'Pouch mockup with custom label');
      formData.append('quality', 'medium');
      formData.append('size', '1024x1024');
      formData.append('image', new Blob([Buffer.from(TINY_B64_PNG, 'base64')], { type: 'image/png' }), 'pouch.png');

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        body: formData,
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.imageUrl).toContain('mockup_form.webp');
      expect(mockEdit).toHaveBeenCalled();
    });

    it('allows superadmin with isTesting flag to execute AI without deducting credits and logs audit entry with isTesting true', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'super_1', role: 'superadmin', status: 'active' });
      mockIsSuperAdmin.mockReturnValue(true);
      mockSuperadminTesting({ packageTier: 'Juragan', userId: 'super_1' });

      mockGenerate.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 200, output_tokens: 500 },
      });

      spyOn(cloudinary.uploader, 'upload').mockResolvedValueOnce({
        public_id: 'pinoka/logos/test_logo',
        secure_url: 'https://res.cloudinary.com/pinoka/test_logo.png',
        bytes: 1024,
      } as unknown as Awaited<ReturnType<typeof cloudinary.uploader.upload>>);

      let auditLogVal: Partial<RecordedLogPayload> = {};
      const mockTx = {
        update: mock(),
        insert: mock().mockReturnValue({
          values: mock().mockImplementation((val: RecordedLogPayload) => {
            auditLogVal = val;
            return {
              returning: mock().mockResolvedValue([{ id: 'log_test_audit', ...val }]),
            };
          }),
        }),
      };
      mockTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockTx));

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureType: 'logo',
          prompt: 'Superadmin test prompt',
          isTesting: true,
        }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.isTesting).toBe(true);
      expect(json.data.creditsDeducted).toBe(0);
      expect(mockTx.update).not.toHaveBeenCalled();
      expect(mockTx.insert).toHaveBeenCalled();
      expect(auditLogVal.isTesting).toBe(true);
      expect(auditLogVal.creditsDeducted).toBe(0);
      expect(auditLogVal.status).toBe('success');
    });

    it('handles superadmin testing fallback when superadmin has no store: falls back to explicitStoreId or store_superadmin_test', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'super_no_store', role: 'superadmin', status: 'active' });
      mockIsSuperAdmin.mockReturnValue(true);
      mockSuperadminTesting({
        userId: 'super_no_store',
        storeExistsInDb: false,
        explicitStoreLookup: true,
      });

      mockGenerate.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 100, output_tokens: 200 },
      });

      spyOn(cloudinary.uploader, 'upload').mockResolvedValueOnce({
        public_id: 'pinoka/logos/fallback_test',
        secure_url: 'https://res.cloudinary.com/pinoka/fallback_test.png',
        bytes: 1024,
      } as unknown as Awaited<ReturnType<typeof cloudinary.uploader.upload>>);

      const mockTx = {
        update: mock(),
        insert: mock().mockReturnValue({
          values: mock().mockReturnValue({
            returning: mock().mockResolvedValue([{ id: 'log_fallback_test' }]),
          }),
        }),
      };
      mockTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockTx));

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Fallback store test prompt',
          isTesting: true,
          storeId: 'explicit_store_target',
        }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(201);
    });

    it('prevents non-superadmin payload tampering: ignores isTesting flag from regular merchant and deducts credits normally', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_tamper_1', role: 'tenant', status: 'active' });
      mockStoreAndTier({ balance: 5, packageTier: 'Reguler', userId: 'tenant_tamper_1' });

      mockGenerate.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 300, output_tokens: 800 },
      });

      spyOn(cloudinary.uploader, 'upload').mockResolvedValueOnce({
        public_id: 'pinoka/logos/tamper_logo',
        secure_url: 'https://res.cloudinary.com/pinoka/tamper.png',
        bytes: 1024,
      } as unknown as Awaited<ReturnType<typeof cloudinary.uploader.upload>>);

      let recordedLogPayload: Partial<RecordedLogPayload> = {};
      const mockTx = {
        update: mock().mockReturnValue({
          set: mock().mockReturnValue({
            where: mock().mockReturnValue({
              returning: mock().mockResolvedValue([{ id: 'cred_1', balance: 3 }]),
            }),
          }),
        }),
        insert: mock().mockReturnValue({
          values: mock().mockImplementation((val: RecordedLogPayload) => {
            recordedLogPayload = val;
            return {
              returning: mock().mockResolvedValue([{ id: 'log_tamper_123', ...val }]),
            };
          }),
        }),
      };
      mockTransaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => callback(mockTx));

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureType: 'logo',
          prompt: 'Attempted credit bypass logo',
          isTesting: true,
        }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.ok).toBe(true);

      expect(json.data.isTesting).toBe(false);
      expect(json.data.creditsDeducted).toBe(2);
      expect(json.data.remainingCredits).toBe(3);
      expect(mockTx.update).toHaveBeenCalled();
      expect(mockTx.insert).toHaveBeenCalled();
      expect(recordedLogPayload.isTesting).toBe(false);
      expect(recordedLogPayload.creditsDeducted).toBe(2);
      expect(recordedLogPayload.modelUsed).toBe('gpt-image-2.5-sunburst');
    });

    it('rolls back database transaction and does not leak credits when third-party API fails (Rollback Idempotency)', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant', status: 'active' });
      mockStoreAndTier({ balance: 2, packageTier: null });

      mockGenerate.mockRejectedValueOnce(new Error('OpenAI 503 Service Unavailable'));

      let creditDeductedInDb = false;
      const mockTx = {
        update: mock().mockImplementation(() => {
          creditDeductedInDb = true;
          return {
            set: mock().mockReturnValue({
              where: mock().mockReturnValue({
                returning: mock().mockResolvedValue([{ id: 'cred_1', balance: 1 }]),
              }),
            }),
          };
        }),
        insert: mock(),
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

    it('wraps unexpected database error inside transaction with status 500', async () => {
      mockGetAuthUser.mockResolvedValue({ id: 'tenant_1', role: 'tenant', status: 'active' });
      mockStoreAndTier({ balance: 2, packageTier: 'Trial' });

      mockTransaction.mockImplementation(async () => {
        throw new Error('Database transaction lock conflict');
      });

      const request = new Request('http://localhost/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Logo cafe' }),
      });

      const res = (await handleGeneratePost({ request, params: {} } as unknown as GenerateContext)) as Response;
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error.message).toContain('Gagal memproses generasi AI: Database transaction lock conflict');
    });
  });
});
