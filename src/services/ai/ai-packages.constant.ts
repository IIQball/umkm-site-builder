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
    qualityLabel: 'Standar & HD Studio',
    isPopular: false,
    recommendedRole: 'Pemula & Eksplorasi Awal',
    benefits: [
      '6 Kredit AI (hingga 6 desain standar / 3 HD studio)',
      'Akses bebas model Standar (1 kredit) & HD Studio (2 kredit)',
      'Akses generator logo toko, kemasan 3D, dan poster',
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
    qualityLabel: 'Standar & HD Studio',
    isPopular: true,
    badgeText: 'Paling Populer • Nilai Terbaik',
    recommendedRole: 'Katalog Produk & Promosi Aktif',
    benefits: [
      '12 Kredit AI (hingga 12 desain standar / 6 HD studio)',
      'Akses bebas model Standar (1 kredit) & HD Studio (2 kredit)',
      'Detail tekstur 3D fotorealistis & tata cahaya studio',
      'Hemat 17% (Rp 2.083 per kredit)',
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
    qualityLabel: 'Standar & HD Studio',
    isPopular: false,
    badgeText: 'Hemat 33% • Volume Terbesar',
    recommendedRole: 'Skala Penuh & Kebutuhan Tinggi',
    benefits: [
      '30 Kredit AI (hingga 30 desain standar / 15 HD studio)',
      'Akses bebas model Standar (1 kredit) & HD Studio (2 kredit)',
      'Biaya per kredit paling murah (Rp 1.666/kredit - Hemat 33%)',
      'Prioritas kecepatan sintesis visual maksimal',
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

