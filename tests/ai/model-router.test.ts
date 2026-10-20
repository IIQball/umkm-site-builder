import { describe, it, expect, mock, beforeEach, type Mock } from 'bun:test';
import { db } from '@/db';
import { resolveStoreAiModel } from '@/services/ai/model-router.service';

mock.module('@/db', () => ({
  db: {
    select: mock(),
  },
}));

describe('AI Store Model Router Service (bun:test)', () => {
  const mockSelect = db.select as unknown as Mock;

  beforeEach(() => {
    mockSelect.mockReset();
  });

  const setupMockQueries = (
    purchaseRecord: Record<string, unknown> | null,
    creditRecord: Record<string, unknown> | null
  ) => {
    // 1. store_quota_purchases query with leftJoin
    mockSelect.mockReturnValueOnce({
      from: () => ({
        leftJoin: () => ({
          where: () => ({
            orderBy: () => ({
              limit: () => Promise.resolve(purchaseRecord ? [purchaseRecord] : []),
            }),
          }),
        }),
      }),
    });

    // 2. tenant_ai_credits query
    mockSelect.mockReturnValueOnce({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve(creditRecord ? [creditRecord] : []),
        }),
      }),
    });
  };

  describe('Paket Trial / Belum Beli -> gpt-image-2.5-flare (1 kredit)', () => {
    it('routes store with no quota purchases and default credits to flare (1 credit)', async () => {
      setupMockQueries(null, {
        id: 'cred_1',
        balance: 2,
        totalPurchased: 0,
      });

      const result = await resolveStoreAiModel('store_trial_1');

      expect(result.model).toBe('gpt-image-2.5-flare');
      expect(result.requiredCredits).toBe(1);
      expect(result.creditsRequired).toBe(1);
      expect(result.tier).toBe('trial');
    });

    it('routes explicit trial package purchase to flare (1 credit)', async () => {
      setupMockQueries(
        {
          id: 'pur_trial',
          packageId: 'pkg_trial',
          packageName: 'Paket Trial 7 Hari',
          packageSlug: 'paket-trial-7-hari',
        },
        { id: 'cred_trial', balance: 2, totalPurchased: 0 }
      );

      const result = await resolveStoreAiModel('store_trial_2');

      expect(result.model).toBe('gpt-image-2.5-flare');
      expect(result.requiredCredits).toBe(1);
      expect(result.tier).toBe('trial');
    });

    it('falls back to default trial flare when package name does not match any known keyword', async () => {
      setupMockQueries(
        {
          id: 'pur_custom',
          packageId: 'pkg_custom_99',
          packageName: 'Paket Ekstra Kustom',
          packageSlug: 'paket-ekstra-kustom',
        },
        { id: 'cred_custom', balance: 10, totalPurchased: 10 }
      );

      const result = await resolveStoreAiModel('store_custom_1');

      expect(result.model).toBe('gpt-image-2.5-flare');
      expect(result.requiredCredits).toBe(1);
      expect(result.tier).toBe('trial');
      expect(result.packageName).toBe('Paket Trial / Belum Beli');
    });
  });

  describe('Paket Hemat -> gpt-image-2.5-flare (1 kredit)', () => {
    it('routes Paket Hemat purchase to flare (1 credit)', async () => {
      setupMockQueries(
        {
          id: 'pur_hemat',
          packageId: 'pkg_hemat_basic',
          packageName: 'Paket Hemat UMKM',
          packageSlug: 'paket-hemat-umkm',
        },
        { id: 'cred_hemat', balance: 10, totalPurchased: 10 }
      );

      const result = await resolveStoreAiModel('store_hemat_1');

      expect(result.model).toBe('gpt-image-2.5-flare');
      expect(result.requiredCredits).toBe(1);
      expect(result.tier).toBe('hemat');
    });

    it('routes basic package slug to flare (1 credit)', async () => {
      setupMockQueries(
        {
          id: 'pur_basic',
          packageId: 'pkg_basic',
          packageName: 'Paket Basic 20 Produk',
          packageSlug: 'paket-basic',
        },
        { id: 'cred_basic', balance: 5, totalPurchased: 5 }
      );

      const result = await resolveStoreAiModel('store_basic_1');

      expect(result.model).toBe('gpt-image-2.5-flare');
      expect(result.requiredCredits).toBe(1);
      expect(result.tier).toBe('hemat');
    });
  });

  describe('Paket Reguler & Paket Juragan -> gpt-image-2.5-sunburst (2 kredit)', () => {
    it('routes Paket Reguler purchase to sunburst (2 credits)', async () => {
      setupMockQueries(
        {
          id: 'pur_reguler',
          packageId: 'pkg_reguler',
          packageName: 'Paket Reguler Bisnis',
          packageSlug: 'paket-reguler-bisnis',
        },
        { id: 'cred_reguler', balance: 25, totalPurchased: 25 }
      );

      const result = await resolveStoreAiModel('store_reguler_1');

      expect(result.model).toBe('gpt-image-2.5-sunburst');
      expect(result.requiredCredits).toBe(2);
      expect(result.tier).toBe('reguler');
    });

    it('routes package with pro in packageId to sunburst (2 credits)', async () => {
      setupMockQueries(
        {
          id: 'pur_pro',
          packageId: 'pkg_pro_unlimited',
          packageName: 'Paket Enterprise Special',
          packageSlug: 'enterprise-special',
        },
        { id: 'cred_pro', balance: 50, totalPurchased: 50 }
      );

      const result = await resolveStoreAiModel('store_pro_1');

      expect(result.model).toBe('gpt-image-2.5-sunburst');
      expect(result.requiredCredits).toBe(2);
      expect(result.tier).toBe('reguler');
    });

    it('routes Paket Juragan purchase to sunburst (2 credits)', async () => {
      setupMockQueries(
        {
          id: 'pur_juragan',
          packageId: 'pkg_juragan',
          packageName: 'Paket Juragan Sukses',
          packageSlug: 'paket-juragan-sukses',
        },
        { id: 'cred_juragan', balance: 100, totalPurchased: 100 }
      );

      const result = await resolveStoreAiModel('store_juragan_1');

      expect(result.model).toBe('gpt-image-2.5-sunburst');
      expect(result.requiredCredits).toBe(2);
      expect(result.tier).toBe('juragan');
    });

    it('routes Paket Sultan / Enterprise alias to sunburst (2 credits)', async () => {
      setupMockQueries(
        {
          id: 'pur_sultan',
          packageId: 'pkg_sultan',
          packageName: 'Paket Sultan 200 Produk',
          packageSlug: 'paket-sultan-200-produk',
        },
        { id: 'cred_sultan', balance: 50, totalPurchased: 50 }
      );

      const result = await resolveStoreAiModel('store_sultan_1');

      expect(result.model).toBe('gpt-image-2.5-sunburst');
      expect(result.requiredCredits).toBe(2);
      expect(result.tier).toBe('juragan');
    });
  });

  describe('Fallback Handling', () => {
    it('falls back to flare (1 credit) when storeId has no transaction or credit history', async () => {
      setupMockQueries(null, null);

      const result = await resolveStoreAiModel('store_non_existent');

      expect(result.model).toBe('gpt-image-2.5-flare');
      expect(result.requiredCredits).toBe(1);
      expect(result.tier).toBe('fallback');
    });

    it('falls back to flare (1 credit) when storeId is empty or invalid', async () => {
      const result = await resolveStoreAiModel('');

      expect(result.model).toBe('gpt-image-2.5-flare');
      expect(result.requiredCredits).toBe(1);
      expect(result.tier).toBe('fallback');
    });

    it('falls back safely to flare (1 credit) if database query throws an error', async () => {
      mockSelect.mockImplementationOnce(() => {
        throw new Error('Database connection lost');
      });

      const result = await resolveStoreAiModel('store_error');

      expect(result.model).toBe('gpt-image-2.5-flare');
      expect(result.requiredCredits).toBe(1);
      expect(result.tier).toBe('fallback');
    });
  });
});
