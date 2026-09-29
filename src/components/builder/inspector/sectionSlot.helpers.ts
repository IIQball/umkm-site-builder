/**
 * Helper dan konstanta untuk pengelolaan slot elemen pada tab Tata Letak.
 */

import {
  getDefaultHeroSlots,
  getHeroSlotLabel,
  getEffectiveHeroElementOrder,
  getHeroSplitVisualSlot,
  isHeroVisualOnLeft,
  getHeroSlotDirection,
  getHeroShowcaseSlot,
  HERO_SHOWCASE_SLOTS,
} from '../sections/hero/heroLayout.helpers';
import {
  getDefaultFeaturesSlots,
  getFeaturesSlotLabel,
  getEffectiveFeaturesElementOrder,
  getFeaturesSplitSlot,
  isFeaturesVisualOnLeft,
  getFeaturesSlotDirection,
  isFeaturesSplitLayout,
} from '../sections/features/featuresLayout.helpers';

export function getAddedSlotDefaultProps(slot: string, sectionType?: string): Record<string, unknown> {
  if (slot === 'badge') return { badge: sectionType === 'features' ? 'FITUR UNGGULAN' : 'PROMO SPESIAL', badgeText: sectionType === 'features' ? 'Keunggulan Layanan Kami' : 'Promo Spesial UMKM' };
  if (slot === 'cta' || slot === 'cta_btn') return { ctaText: sectionType === 'features' ? 'Hubungi Kami Langsung' : 'Lihat Katalog', ctaLink: '#products' };
  if (slot === 'image') return {
    imageUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80',
  };
  if (slot === 'subtitle') return { subtitle: 'Produk berkualitas dengan harga terjangkau dan pelayanan terpercaya.' };
  if (slot === 'title') return { title: sectionType === 'features' ? 'Kenapa Memilih Produk UMKM Kami?' : 'Selamat datang di toko kami' };
  return {};
}

export {
  getDefaultHeroSlots,
  getHeroSlotLabel,
  getEffectiveHeroElementOrder,
  getHeroSplitVisualSlot,
  isHeroVisualOnLeft,
  getHeroSlotDirection,
  getHeroShowcaseSlot,
  HERO_SHOWCASE_SLOTS,
  getDefaultFeaturesSlots,
  getFeaturesSlotLabel,
  getEffectiveFeaturesElementOrder,
  getFeaturesSplitSlot,
  isFeaturesVisualOnLeft,
  getFeaturesSlotDirection,
  isFeaturesSplitLayout,
};

export const DEFAULT_SLOTS_BY_SECTION: Record<string, string[]> = {
  hero: ['badge', 'title', 'subtitle', 'cta', 'image'],
  features: ['badge', 'title', 'subtitle', 'feature_cards'],
  product_catalog: ['badge', 'title', 'subtitle', 'catalog_grid'],
  testimonials: ['badge', 'title', 'subtitle', 'testimonials_grid'],
  faq: ['badge', 'title', 'subtitle', 'faq_list'],
  google_maps: ['badge', 'title', 'subtitle', 'map_view'],
  footer: ['brand_bio', 'contact_info', 'navigation_links', 'copyright'],
};

export const SLOT_LABELS: Record<string, string> = {
  // Baris Header
  announcement_bar: 'Bar Pengumuman Promo',
  navbar: 'Bilah Navigasi Utama',
  contact_bar: 'Bar Info Kontak & Jam Buka',
  delivery_bar: 'Bar Layanan Pesan Antar',
  countdown_bar: 'Bar Hitung Mundur Flash Sale',

  // Elemen Bilah Navigasi
  logo: 'Logo & Brand Toko',
  nav_links: 'Menu Navigasi',
  cta: 'Tombol WhatsApp (CTA)',
  search_bar: 'Bilah Pencarian Produk',
  store_badges: 'Lencana Legalitas (BPOM / Halal)',

  // Slot Seksi Standar & Hero
  badge: 'Lencana Promo & Kategori',
  title: 'Judul Utama (Heading H1)',
  subtitle: 'Subjudul & Deskripsi',
  image: 'Gambar Visual Utama',
  terminal: 'Kotak Kode Terminal',
  booking_card: 'Formulir Reservasi',
  stat_counter: 'Metrik Statistik Angka',
  trust_badges: 'Lencana Sertifikasi / Jaminan',
  contrast_card: 'Kartu Pendaftaran Kuota',
  product_cards: 'Dua Kartu Produk Bundling',
  floating_cards: 'Kartu Keunggulan Melayang',
  social_proof: 'Avatar Komunitas & Rating',
  chat_simulation: 'Simulasi Balon Chat WA',
  email_capture: 'Formulir Input Email / WA',
  category_pills: 'Filter Kategori Kapsul',
  cta_btn: 'Tombol Aksi (CTA)',
  features_grid: 'Daftar Kartu Fitur',
  feature_cards: 'Grid Kartu Fitur (3 Kolom)',
  feature_rows: 'Daftar Baris Fitur',
  ribbon_bar: 'Pita Baris Fitur (Ribbon 64px)',
  bento_spotlight: 'Kartu Sorotan Utama (Span 8)',
  bento_cards: 'Kartu Fitur Pendukung (Span 4)',
  zigzag_items: 'Baris Zigzag Bergantian',
  tab_nav: 'Bilah Pilihan Tab (Tab Bar)',
  tab_card: 'Kartu Detail Tab Aktif',
  accordion_list: 'Daftar Akordeon Fitur',
  scroll_cards: 'Daftar Kartu Fitur Mengalir',
  icon_matrix: 'Matriks Ubin Ikon Kompak',
  before_card: 'Kartu Sebelum (Produk Pasaran)',
  after_card: 'Kartu Sesudah (Solusi Dapur Kami)',
  catalog_grid: 'Grid Produk Katalog',
  testimonials_grid: 'Daftar Kartu Testimoni',
  faq_list: 'Daftar Pertanyaan FAQ',
  map_view: 'Tampilan Peta Lokasi',
  brand_bio: 'Profil & Deskripsi Toko',
  contact_info: 'Kontak & Jam Buka',
  navigation_links: 'Menu Navigasi Footer',
  copyright: 'Teks Hak Cipta',
};

