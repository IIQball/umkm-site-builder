import { db } from '@/db';
import { storeQuotaPurchases, storeQuotaPackages, tenantAiCredits } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { FLARE_AI_MODEL, SUNBURST_AI_MODEL } from './cost-calculator.service';

export type StoreAiModel = 'gpt-image-2.5-flare' | 'gpt-image-2.5-sunburst';

export interface ResolvedStoreAiModel {
  model: StoreAiModel;
  requiredCredits: number;
  creditsRequired: number;
  tier: 'trial' | 'hemat' | 'reguler' | 'juragan' | 'fallback';
  packageName?: string;
}

/**
 * Resolves the appropriate AI model and credit requirement for a store based on its purchase history and tier.
 *
 * Tiering Rules:
 * - Paket Trial / Belum Beli and Paket Hemat -> gpt-image-2.5-flare (1 credit)
 * - Paket Reguler and Paket Juragan -> gpt-image-2.5-sunburst (2 credits)
 * - Fallback to gpt-image-2.5-flare (1 credit) if store data or history is not found
 */
export async function resolveStoreAiModel(storeId: string): Promise<ResolvedStoreAiModel> {
  if (!storeId) {
    return {
      model: FLARE_AI_MODEL,
      requiredCredits: 1,
      creditsRequired: 1,
      tier: 'fallback',
    };
  }

  try {
    // 1. Cek riwayat pembelian kuota toko terbaru (store_quota_purchases)
    const purchases = await db
      .select({
        id: storeQuotaPurchases.id,
        packageId: storeQuotaPurchases.packageId,
        packageName: storeQuotaPackages.name,
        packageSlug: storeQuotaPackages.slug,
        createdAt: storeQuotaPurchases.createdAt,
      })
      .from(storeQuotaPurchases)
      .leftJoin(storeQuotaPackages, eq(storeQuotaPurchases.packageId, storeQuotaPackages.id))
      .where(eq(storeQuotaPurchases.storeId, storeId))
      .orderBy(desc(storeQuotaPurchases.createdAt))
      .limit(1);

    const latestPurchase = purchases?.[0];

    // 2. Cek tenant_ai_credits untuk verifikasi keberadaan toko / status trial
    const credits = await db
      .select({
        id: tenantAiCredits.id,
        balance: tenantAiCredits.balance,
        totalPurchased: tenantAiCredits.totalPurchased,
      })
      .from(tenantAiCredits)
      .where(eq(tenantAiCredits.tenantId, storeId))
      .limit(1);

    const creditRecord = credits?.[0];

    // Jika storeId sama sekali tidak memiliki catatan transaksi dan tidak ada data kredit
    if (!creditRecord && !latestPurchase) {
      return {
        model: FLARE_AI_MODEL,
        requiredCredits: 1,
        creditsRequired: 1,
        tier: 'fallback',
      };
    }

    if (latestPurchase) {
      const name = (latestPurchase.packageName || '').toLowerCase();
      const slug = (latestPurchase.packageSlug || '').toLowerCase();
      const pkgId = (latestPurchase.packageId || '').toLowerCase();

      // Paket Reguler dan Paket Juragan -> gpt-image-2.5-sunburst (2 kredit)
      if (name.includes('juragan') || slug.includes('juragan') || pkgId.includes('juragan') || name.includes('sultan') || slug.includes('sultan')) {
        return {
          model: SUNBURST_AI_MODEL,
          requiredCredits: 2,
          creditsRequired: 2,
          tier: 'juragan',
          packageName: latestPurchase.packageName ?? 'Paket Juragan',
        };
      }

      if (
        name.includes('reguler') ||
        slug.includes('reguler') ||
        pkgId.includes('reguler') ||
        name.includes('regular') ||
        slug.includes('regular') ||
        pkgId.includes('pro')
      ) {
        return {
          model: SUNBURST_AI_MODEL,
          requiredCredits: 2,
          creditsRequired: 2,
          tier: 'reguler',
          packageName: latestPurchase.packageName ?? 'Paket Reguler',
        };
      }

      // Paket Hemat -> gpt-image-2.5-flare (1 kredit)
      if (name.includes('hemat') || slug.includes('hemat') || pkgId.includes('hemat') || name.includes('basic') || slug.includes('basic')) {
        return {
          model: FLARE_AI_MODEL,
          requiredCredits: 1,
          creditsRequired: 1,
          tier: 'hemat',
          packageName: latestPurchase.packageName ?? 'Paket Hemat',
        };
      }

      // Paket Trial -> gpt-image-2.5-flare (1 kredit)
      if (name.includes('trial') || slug.includes('trial') || pkgId.includes('trial')) {
        return {
          model: FLARE_AI_MODEL,
          requiredCredits: 1,
          creditsRequired: 1,
          tier: 'trial',
          packageName: latestPurchase.packageName ?? 'Paket Trial',
        };
      }
    }

    // Default: Paket Trial / Belum Beli -> gpt-image-2.5-flare (1 kredit)
    return {
      model: FLARE_AI_MODEL,
      requiredCredits: 1,
      creditsRequired: 1,
      tier: 'trial',
      packageName: 'Paket Trial / Belum Beli',
    };
  } catch {
    return {
      model: FLARE_AI_MODEL,
      requiredCredits: 1,
      creditsRequired: 1,
      tier: 'fallback',
    };
  }
}
