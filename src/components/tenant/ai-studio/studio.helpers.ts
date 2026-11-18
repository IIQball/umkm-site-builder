import { apiFetch } from '@/lib/api/parse-response';
import type { AiAssetItem } from './gallery.constants';
import type { AiLogoInput } from '@/lib/validators/ai-logo';
import type { AiPackagingInput } from '@/lib/validators/ai-packaging';
import type { AiPosterInput } from '@/lib/validators/ai-poster';
import type { AiStudioGeneratePayload } from './studio.types';

export interface CreditBalanceData {
  balance: number;
  totalPurchased: number;
  tier: string;
  packageName: string;
}

export function getCreditStatusStyle(balance: number) {
  if (balance <= 0) {
    return { badge: 'bg-error/10 text-error border-error/25 hover:bg-error/20', subtext: 'text-error/80' };
  }
  if (balance <= 2) {
    return { badge: 'bg-warning/10 text-warning border-warning/25 hover:bg-warning/20', subtext: 'text-warning/80' };
  }
  return { badge: 'bg-success/10 text-success border-success/25 hover:bg-success/20', subtext: 'text-success/80' };
}

export async function fetchCreditBalanceApi(storeId: string): Promise<CreditBalanceData | null> {
  if (!storeId) return null;
  try {
    const res = await apiFetch<{
      balance?: number;
      totalPurchased?: number;
      tier?: string;
      packageName?: string;
    }>(`/api/tenant/ai-credit/${storeId}`);

    if (res.success && res.data) {
      const balance = typeof res.data.balance === 'number' ? res.data.balance : 0;
      const totalPurchased = typeof res.data.totalPurchased === 'number' ? res.data.totalPurchased : 0;
      return {
        balance,
        totalPurchased,
        tier: res.data.tier || 'trial',
        packageName: res.data.packageName || (totalPurchased > 0 ? 'Paket Aktif' : 'Belum Ada Paket Aktif'),
      };
    }
  } catch {
    // Offline fallback
  }
  return null;
}

export async function fetchAssetHistoryApi(): Promise<AiAssetItem[]> {
  try {
    const res = await apiFetch<AiAssetItem[] | { items?: AiAssetItem[] }>('/api/tenant/ai/history');
    if (res.success && res.data) {
      return Array.isArray(res.data) ? res.data : (res.data.items || []);
    }
  } catch {
    // Offline fallback
  }
  return [];
}

export function buildLogoPayload(d: AiLogoInput): AiStudioGeneratePayload {
  return {
    featureType: 'logo',
    prompt: `Logo for ${d.storeName}, category: ${d.businessCategory || 'general'}, concept: ${d.conceptType || d.visualStyle || 'pictorial_symbol'}.`,
    storeName: d.storeName,
    visualStyle: d.visualStyle,
    conceptType: d.conceptType,
    businessCategory: d.businessCategory,
    logoText: d.logoText,
    lockupType: d.lockupType,
    fontFamily: d.fontFamily,
    colorPalette: d.colorPalette.join(', '),
    hasBackground: d.hasBackground,
    backgroundColor: d.backgroundColor,
    qualityTier: d.qualityTier,
    focalSubject: d.focalSubject,
  };
}

export function buildPackagingPayload(d: AiPackagingInput): AiStudioGeneratePayload {
  return {
    featureType: 'packaging_mockup',
    prompt: `Commercial 3D mockup of ${d.packagingType.replace('_', ' ')} with label "${d.productLabel}".`,
    packagingType: d.packagingType,
    productLabel: d.productLabel,
    presentationStyle: d.presentationStyle,
    image: d.referenceImageBase64,
    qualityTier: d.qualityTier,
  };
}

export function buildPosterPayload(d: AiPosterInput): AiStudioGeneratePayload {
  const style = d.posterStyle || d.backgroundMood || 'vietnam_editorial';
  return {
    featureType: 'product_poster',
    prompt: `Appetizing poster for "${d.productName || 'Product'}" with headline "${d.titleText}"${d.subText ? `, tagline: "${d.subText}"` : ''}, style: ${style.replace('_', ' ')}.`,
    productName: d.productName,
    titleText: d.titleText,
    subText: d.subText,
    posterStyle: style,
    image: d.referenceImageBase64,
    size: d.sizeRatio === '2:3' ? '1024x1536' : '1024x1024',
    qualityTier: d.qualityTier,
  };
}
