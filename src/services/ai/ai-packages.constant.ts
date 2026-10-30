import type { CreditPackage } from '@/types/finance/wallet';
import { FLARE_AI_MODEL, SUNBURST_AI_MODEL } from './cost-calculator.service';

export interface AiCreditPackageConfig extends CreditPackage {
  tier: 'hemat' | 'reguler' | 'juragan';
  unitPrice: number;
  savingsPercent?: number;
  model: 'gpt-image-2.5-flare' | 'gpt-image-2.5-sunburst';
  qualityLabel: string;
  badgeText?: string;
  recommendedRole?: string;
}

export const AI_CREDIT_PACKAGES: readonly AiCreditPackageConfig[] = [
  {
    id: 'pkg-hemat',
    name: 'Paket Hemat',
    slug: 'paket-hemat',
    price: 15000,
    credits: 6,
    unitPrice: 2500,
    description: 'Paling hemat untuk pedagang baru yang ingin menguji coba visual produk & logo toko.',
    tier: 'hemat',
    model: FLARE_AI_MODEL,
    qualityLabel: 'Kualitas Standar',
    isPopular: false,
    recommendedRole: 'Pemula & Eksplorasi Awal',
    benefits: [
      '6 Kredit AI (cukup untuk 6 desain standar)',
      'Akses logo toko, kemasan, dan poster promosi',
      'Mesin visual gpt-image-2.5-flare (Standar)',
      'Proses sintesis instan (~5 detik)',
      'Lisensi komersial UMKM 100% bebas watermark',
    ],
  },
  {
    id: 'pkg-reguler',
    name: 'Paket Reguler',
    slug: 'paket-reguler',
    price: 25000,
    credits: 12,
    unitPrice: 2083,
    savingsPercent: 17,
    description: 'Pilihan favorit pedagang berkembang untuk foto produk katalog beresolusi tinggi.',
    tier: 'reguler',
    model: SUNBURST_AI_MODEL,
    qualityLabel: 'Kualitas HD Studio',
    isPopular: true,
    badgeText: 'Paling Populer • Nilai Terbaik',
    recommendedRole: 'Katalog Produk & Promosi Aktif',
    benefits: [
      '12 Kredit AI (setara 6 foto produk HD / 12 standar)',
      'Buka Kualitas HD Studio (gpt-image-2.5-sunburst)',
      'Detail tekstur 3D fotorealistis & tata cahaya studio',
      'Prioritas antrean generasi visual tanpa jeda',
      'Lisensi komersial UMKM 100% bebas watermark',
    ],
  },
  {
    id: 'pkg-juragan',
    name: 'Paket Juragan',
    slug: 'paket-juragan',
    price: 50000,
    credits: 30,
    unitPrice: 1666,
    savingsPercent: 33,
    description: 'Untuk merchant aktif dengan katalog produk banyak yang rutin posting promosi.',
    tier: 'juragan',
    model: SUNBURST_AI_MODEL,
    qualityLabel: 'Kualitas HD Studio Premium',
    isPopular: false,
    badgeText: 'Hemat 33% • Volume Terbesar',
    recommendedRole: 'Skala Penuh & Kebutuhan Tinggi',
    benefits: [
      '30 Kredit AI (setara 15 foto produk HD / 30 standar)',
      'Buka Kualitas HD Studio Penuh (Sunburst)',
      'Biaya per kredit paling murah (Rp 1.666/kredit)',
      'Prioritas kecepatan sintesis visual tercepat',
      'Lisensi komersial UMKM 100% bebas watermark',
    ],
  },
] as const;

/**
 * Returns all active AI credit packages.
 */
export function getAllCreditPackages(): AiCreditPackageConfig[] {
  return [...AI_CREDIT_PACKAGES];
}

/**
 * Finds a package by its unique id.
 */
export function getCreditPackageById(id: string): AiCreditPackageConfig | undefined {
  return AI_CREDIT_PACKAGES.find((pkg) => pkg.id === id);
}

/**
 * Finds a package by its nominal transaction amount in IDR.
 */
export function getCreditPackageByAmount(amount: number): AiCreditPackageConfig | undefined {
  return AI_CREDIT_PACKAGES.find((pkg) => pkg.price === amount);
}

/**
 * Finds a package by its tier slug.
 */
export function getCreditPackageByTier(tier: string): AiCreditPackageConfig | undefined {
  return AI_CREDIT_PACKAGES.find((pkg) => pkg.tier === tier || pkg.slug === tier);
}

