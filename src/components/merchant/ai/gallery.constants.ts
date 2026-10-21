import type { BadgeVariant } from '@/components/tokens/colors';

export interface GalleryCategoryTab {
  id: string;
  label: string;
  description: string;
}

export const GALLERY_CATEGORY_TABS: GalleryCategoryTab[] = [
  { id: 'all', label: 'Semua Aset', description: 'Seluruh riwayat visual yang telah dibuat' },
  { id: 'logo', label: 'Logo Toko', description: 'Identitas logo minimalis dan tajam' },
  { id: 'packaging_mockup', label: 'Kemasan Produk', description: 'Mockup 3D kemasan pouch, box, & bowl' },
  { id: 'product_poster', label: 'Poster Promosi', description: 'Poster tipografi katalog kuliner' },
];

export interface AiAssetItem {
  id: string;
  featureType: 'logo' | 'packaging_mockup' | 'product_poster';
  modelUsed: string;
  sizeRatio?: string | null;
  promptFinal: string;
  cloudinaryUrl: string;
  creditsDeducted: number;
  createdAt: string | Date;
}

export function getFeatureTypeBadgeConfig(featureType: string): {
  label: string;
  variant: BadgeVariant;
} {
  switch (featureType) {
    case 'logo':
      return { label: 'Logo Toko', variant: 'primary' };
    case 'packaging_mockup':
      return { label: 'Kemasan Produk', variant: 'orange' };
    case 'product_poster':
      return { label: 'Poster Promosi', variant: 'indigo' };
    default:
      return { label: 'Visual AI', variant: 'slate' };
  }
}
