import type { ProductItem } from '@/types';

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

export function formatRupiah(amount: number | string): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount || 0).replace(/[^0-9.-]+/g, '')) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function getCleanWaNumber(rawPhone: string): string {
  let cleaned = (rawPhone || '').replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) cleaned = '62' + cleaned.slice(1);
  if (!cleaned.startsWith('62') && cleaned.length > 0) cleaned = '62' + cleaned;
  return cleaned || '6281234567890';
}

export function buildWhatsAppOrderLink(waNumber: string, productName: string, price: number | string): string {
  const cleanPhone = getCleanWaNumber(waNumber);
  const text = `Halo, saya ingin memesan: ${productName} (${formatRupiah(price)}). Mohon info ketersediaan stok & rekening. Terima kasih!`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export const DEFAULT_DEMO_PRODUCTS: ProductItem[] = [
  {
    name: 'Kopi Arabika Gayo Specialty 250g',
    price: 85000,
    badge: 'Terlaris',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    description: 'Biji kopi pilihan dipetik merah dari dataran tinggi Gayo Aceh.',
  },
  {
    name: 'Madu Hutan Alami Murni 500ml',
    price: 120000,
    badge: 'Organik',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    description: 'Madu murni mentah tanpa pemanasan, kaya antioksidan alami.',
  },
  {
    name: 'Keripik Tempe Renyah Gurih 200g',
    price: 25000,
    badge: 'Baru',
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
    description: 'Irisan tempe kedelai lokal renyah dengan bumbu ketumbar khas.',
  },
  {
    name: 'Sambal Cakalang Khas Nusantara',
    price: 45000,
    badge: 'Favorit',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    description: 'Suwiran ikan cakalang asap dengan pedas segar cabai rawit.',
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
