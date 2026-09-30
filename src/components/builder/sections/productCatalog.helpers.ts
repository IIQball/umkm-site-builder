import type { ProductItem } from '@/types';
import { formatIDR } from '@/lib/currency';
import { getEffectiveWhatsAppNumber, generateWhatsAppLink } from '@/lib/whatsapp';

export const IMAGE_SUPPORTED_CATALOG_PRESETS = [
  'grid_standard',
  'carousel_scroll',
  'list_compact',
  'masonry_catalog',
  'bento_product_spotlight',
  'split_category_sidebar',
  'compact_mini_cards',
  'lookbook_gallery',
  'flash_sale_countdown',
  'interactive_filter_tabs',
  'quick_buy_whatsapp_direct',
  'bundle_package_tiers',
  'single_product_deep_focus',
  'badge_stock_scarcity',
  'seasonal_hampers_gift',
  'before_after_product_effect',
  'digital_download_catalog',
  'customer_review_paired_card',
] as const;

export function isCatalogImageSupported(preset: string): boolean {
  return (IMAGE_SUPPORTED_CATALOG_PRESETS as readonly string[]).includes(preset);
}

export const formatRupiah = formatIDR;

export const getCleanWaNumber = getEffectiveWhatsAppNumber;

export function buildWhatsAppOrderLink(waNumber: string, productName: string, price: number | string): string {
  const cleanPhone = getEffectiveWhatsAppNumber(waNumber);
  const text = `Halo, saya ingin memesan: ${productName} (${formatIDR(price)}). Mohon info ketersediaan stok & rekening. Terima kasih!`;
  return generateWhatsAppLink(cleanPhone, text);
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
}

export const DEFAULT_CATALOG_CATEGORIES: CatalogCategory[] = [
  { id: 'cat_makanan', name: 'Makanan & Snack', slug: 'makanan' },
  { id: 'cat_minuman', name: 'Minuman Segar', slug: 'minuman' },
  { id: 'cat_kriya', name: 'Kriya & Oleh-Oleh', slug: 'kriya' },
];

export const DEFAULT_DEMO_PRODUCTS: ProductItem[] = [
  {
    id: 'prod_1',
    name: 'Produk Unggulan 1',
    price: 50000,
    badge: 'Terlaris',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60',
    description: 'Deskripsi lengkap mengenai keunggulan, kualitas, atau manfaat utama produk Anda.',
    categoryId: 'cat_makanan',
    category: { id: 'cat_makanan', name: 'Makanan & Snack', slug: 'makanan' },
    categoryName: 'Makanan & Snack',
  },
  {
    id: 'prod_2',
    name: 'Produk Unggulan 2',
    price: 65000,
    badge: 'Spesial',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60',
    description: 'Bahan berkualitas premium yang diproses secara higienis untuk menjaga mutu terbaik.',
    categoryId: 'cat_minuman',
    category: { id: 'cat_minuman', name: 'Minuman Segar', slug: 'minuman' },
    categoryName: 'Minuman Segar',
  },
  {
    id: 'prod_3',
    name: 'Produk Unggulan 3',
    price: 80000,
    badge: 'Favorit',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60',
    description: 'Pilihan favorit pelanggan setia dengan cita rasa dan kemasan eksklusif.',
    categoryId: 'cat_kriya',
    category: { id: 'cat_kriya', name: 'Kriya & Oleh-Oleh', slug: 'kriya' },
    categoryName: 'Kriya & Oleh-Oleh',
  },
];

export const getBadgeColorClass = (color: string): string => {
  switch (color) {
    case 'emerald': return 'bg-emerald-500 text-white shadow-xs dark:bg-emerald-600';
    case 'amber': return 'bg-amber-500 text-white shadow-xs dark:bg-amber-600';
    case 'blue': return 'bg-blue-600 text-white shadow-xs dark:bg-blue-500';
    case 'violet': return 'bg-violet-600 text-white shadow-xs dark:bg-violet-500';
    case 'slate': return 'bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900';
    case 'rose':
    default: return 'bg-rose-500 text-white shadow-xs dark:bg-rose-600';
  }
};

export const getCardPresetClass = (preset: string): string => {
  switch (preset) {
    case 'minimal_bordered':
      return 'bg-card border border-light shadow-none hover:border-slate-400 dark:hover:border-slate-600';
    case 'flat_filled':
      return 'bg-nested/80 border-0 shadow-none hover:bg-nested';
    case 'horizontal':
      return 'bg-card border border-light shadow-xs hover:shadow-md';
    case 'elevated_shadow':
    default:
      return 'bg-card border border-light/60 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all';
  }
};
