/**
 * Helper SSOT tata letak section katalog produk.
 * Menjaga sinkronisasi urutan elemen antara Canvas, Tab Tata Letak, dan Panel Lapisan.
 * 1 Produk = 1 Elemen Mandiri.
 */

import type { ProductItem } from '@/types';
import { DEFAULT_DEMO_PRODUCTS } from '../productCatalog.helpers';

export const CATALOG_PRESET_SLOTS: Record<string, string[]> = {
  grid_standard: ['badge', 'title', 'subtitle'],
  compact_mini_cards: ['badge', 'title', 'subtitle'],
  quick_buy_whatsapp_direct: ['badge', 'title', 'subtitle'],
  badge_stock_scarcity: ['badge', 'title', 'subtitle'],
  interactive_filter_tabs: ['badge', 'title', 'subtitle', 'catalog_categories'],
  carousel_scroll: ['badge', 'title', 'subtitle'],
  list_compact: ['badge', 'title', 'subtitle'],
  masonry_catalog: ['badge', 'title', 'subtitle'],
  bento_product_spotlight: ['badge', 'title', 'subtitle'],
  split_category_sidebar: ['badge', 'title', 'subtitle', 'catalog_sidebar'],
  price_table_view: ['badge', 'title', 'subtitle', 'catalog_price_rows'],
  lookbook_gallery: ['badge', 'title', 'subtitle'],
  flash_sale_countdown: ['badge', 'title', 'subtitle', 'catalog_timer'],
  bundle_package_tiers: ['badge', 'title', 'subtitle', 'catalog_bundle_tier', 'catalog_cta'],
  single_product_deep_focus: ['badge', 'title', 'subtitle', 'product_image_0', 'product_desc', 'catalog_cta'],
  seasonal_hampers_gift: ['badge', 'title', 'subtitle'],
  before_after_product_effect: ['badge', 'title', 'subtitle'],
  digital_download_catalog: ['badge', 'title', 'subtitle'],
  customer_review_paired_card: ['badge', 'title', 'subtitle'],
  minimal_accordion_catalog: ['badge', 'title', 'subtitle', 'catalog_price_rows'],
};

/**
 * Urutan slot default spesifik untuk tiap preset tata letak katalog produk.
 * Tiap produk dibuat sebagai elemen mandiri (1 produk = 1 elemen).
 */
export function getDefaultCatalogSlots(preset: string, products?: ProductItem[]): string[] {
  const prods = (Array.isArray(products) && products.length > 0 ? products : DEFAULT_DEMO_PRODUCTS) as ProductItem[];
  const baseSlots = CATALOG_PRESET_SLOTS[preset] || ['badge', 'title', 'subtitle'];
  const slots: string[] = [...baseSlots];

  // Tiap produk adalah elemen mandiri
  prods.forEach((_, idx) => {
    slots.push(`product_item_${idx}`);
  });

  return slots;
}

/**
 * Label Bahasa Indonesia baku untuk tiap slot elemen katalog.
 */
export function getCatalogSlotLabel(slot: string, _preset?: string, products?: ProductItem[]): string {
  switch (slot) {
    case 'badge':
      return 'Lencana & Tagline';
    case 'title':
      return 'Judul Utama (H2)';
    case 'subtitle':
      return 'Deskripsi Subjudul';
    case 'catalog_sidebar':
      return 'Bilah Filter Kategori';
    case 'catalog_categories':
      return 'Tab Filter Kategori';
    case 'catalog_timer':
      return 'Hitung Mundur Flash Sale';
    case 'catalog_bundle_tier':
      return 'Pilihan Paket Bundling';
    case 'catalog_cta':
      return 'Tombol Pesan WhatsApp';
    case 'product_image_0':
      return 'Foto Produk Utama';
    case 'product_desc':
      return 'Deskripsi Manfaat Produk Unggulan';
    case 'catalog_price_rows':
      return 'Daftar / Tabel Harga';
    case 'catalog_grid':
      return 'Daftar Produk';
    default: {
      if (slot.startsWith('product_item_')) {
        const idx = parseInt(slot.replace('product_item_', ''), 10);
        const prods = (Array.isArray(products) && products.length > 0 ? products : DEFAULT_DEMO_PRODUCTS) as ProductItem[];
        const prod = prods[idx];
        if (prod?.name) {
          return `Produk #${idx + 1}: ${prod.name}`;
        }
        return `Produk #${idx + 1}`;
      }
      if (slot.startsWith('product_image_')) {
        const idx = parseInt(slot.replace('product_image_', ''), 10);
        return `Foto Produk #${idx + 1}`;
      }
      return slot;
    }
  }
}

/**
 * Normalisasi legacy slot katalog (catalog_grid -> product_item_0, 1, ...)
 */
function normalizeLegacyCatalogSlot(slot: string, prods: ProductItem[]): string[] {
  if (slot === 'catalog_grid') {
    return prods.map((_, i) => `product_item_${i}`);
  }
  return [slot];
}

/**
 * Menghasilkan urutan slot elemen katalog efektif yang selalu sinkron dan sesuai preset.
 */
export function getEffectiveCatalogElementOrder(
  preset: string,
  rawOrder?: unknown,
  products?: ProductItem[],
  catalogPreset?: string
): string[] {
  const prods = (Array.isArray(products) && products.length > 0 ? products : DEFAULT_DEMO_PRODUCTS) as ProductItem[];
  const defaultSlots = getDefaultCatalogSlots(preset, prods);

  if (!Array.isArray(rawOrder) || rawOrder.length === 0) {
    return [...defaultSlots];
  }

  // Jika preset sama atau tidak didefinisikan
  const isSamePreset = !catalogPreset || catalogPreset === preset;
  if (isSamePreset) {
    const expanded: string[] = [];
    for (const s of rawOrder as string[]) {
      for (const norm of normalizeLegacyCatalogSlot(s, prods)) {
        if (defaultSlots.includes(norm) && !expanded.includes(norm)) {
          expanded.push(norm);
        }
      }
    }

    // Pastikan produk baru yang belum tercatat di rawOrder otomatis ditambahkan
    for (let i = 0; i < prods.length; i++) {
      const prodSlot = `product_item_${i}`;
      if (defaultSlots.includes(prodSlot) && !expanded.includes(prodSlot)) {
        expanded.push(prodSlot);
      }
    }

    return expanded.length > 0 ? expanded : [...defaultSlots];
  }

  // Jika baru ganti layout, adaptasikan slot yang cocok
  const rawList = rawOrder as string[];
  const valid = rawList.filter((s) => defaultSlots.includes(s));
  for (const s of defaultSlots) {
    if (!valid.includes(s)) valid.push(s);
  }
  return valid;
}
