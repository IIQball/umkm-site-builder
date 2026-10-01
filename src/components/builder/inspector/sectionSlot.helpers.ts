/**
 * Helper dan konstanta untuk pengelolaan slot elemen pada tab Tata Letak.
 */

import type { FAQItem } from '@/types';
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
  getAllowedFeaturesSlots,
  getFeaturesSlotLabel,
  getEffectiveFeaturesElementOrder,
  getFeaturesSplitSlot,
  isFeaturesVisualOnLeft,
  getFeaturesSlotDirection,
  isFeaturesSplitLayout,
} from '../sections/features/featuresLayout.helpers';
import {
  getDefaultCatalogSlots,
  getAllowedCatalogSlots,
  getCatalogSlotLabel,
  getEffectiveCatalogElementOrder,
} from '../sections/catalog/catalogLayout.helpers';
import {
  getDefaultTestimonialsSlots,
  getTestimonialsSlotLabel,
  getEffectiveTestimonialsElementOrder,
} from '../sections/testimonials/testimonialsLayout.helpers';
import {
  getDefaultFaqSlots,
  getAllowedFaqSlots,
  getFaqSlotLabel,
  getEffectiveFaqElementOrder,
} from '../sections/faq/faqLayout.helpers';
import {
  getDefaultMapsSlots,
  getAllowedMapsSlots,
  getMapsSlotLabel,
  getEffectiveMapsElementOrder,
} from '../sections/maps/mapsLayout.helpers';
import {
  getDefaultFooterSlots,
  getAllowedFooterSlots,
  getFooterSlotLabel,
  getEffectiveFooterElementOrder,
} from '../sections/footer/footerLayout.helpers';

export function getAddedSlotDefaultProps(slot: string, sectionType?: string): Record<string, unknown> {
  if (slot === 'badge') return { badge: sectionType === 'features' ? 'FITUR UNGGULAN' : sectionType === 'testimonials' ? 'ULASAN PEMBELI' : 'PROMO SPESIAL', badgeText: sectionType === 'features' ? 'Keunggulan Layanan Kami' : sectionType === 'testimonials' ? 'Ulasan Pembeli' : 'Promo Spesial UMKM' };
  if (slot === 'cta' || slot === 'cta_btn') return { ctaText: sectionType === 'features' ? 'Hubungi Kami Langsung' : 'Lihat Katalog', ctaLink: '#products' };
  if (slot === 'image') return {
    imageUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80',
  };
  if (slot === 'subtitle') return { subtitle: sectionType === 'testimonials' ? 'Kepuasan rasa dan kualitas produk adalah prioritas utama kami.' : 'Produk berkualitas dengan harga terjangkau dan pelayanan terpercaya.' };
  if (slot === 'title') return { title: sectionType === 'features' ? 'Kenapa Memilih Produk UMKM Kami?' : sectionType === 'testimonials' ? 'Kata Mereka yang Sudah Mencoba' : 'Selamat datang di toko kami' };
  if (slot === 'bento_promo') return { bentoPromoTitle: 'Diskon Pembeli Pertama', bentoPromoHighlight: 'Potongan 25%', bentoPromoSubtitle: 'Klaim voucher di WhatsApp sekarang' };
  if (slot === 'bento_review') return { bentoReviewStars: 5, bentoReviewText: '"Bahan sangat halus dan adem, motifnya khas dan tidak pasaran."', bentoReviewAuthor: '- Pelanggan Terverifikasi' };
  if (slot === 'stat_counter') return { stats: [{ value: '10.000+', label: 'Pelanggan Puas' }, { value: '100%', label: 'Bahan Alami' }, { value: '24 Jam', label: 'Layanan Pengiriman' }] };
  if (slot === 'trust_badges') return { trustBadges: [{ title: 'Garansi 100% Uang Kembali' }, { title: 'Terdaftar Resmi BPOM' }, { title: 'Sertifikasi Halal MUI' }] };
  if (slot === 'contrast_card') return { contrastBadgeText: 'BATCH PRODUKSI #4', contrastTitleText: 'Sisa Kuota Terbatas', contrastDescText: 'Pesanan ditutup otomatis jika kuota harian habis.' };
  if (slot === 'product_cards') return { selectedProductIndex1: 0, selectedProductIndex2: 1 };
  if (slot === 'floating_cards') return { floatingCards: [{ title: 'Bahan Premium Lokal' }, { title: 'Tanpa Pengawet Buatan' }, { title: 'Kirim Cepat Se-Indonesia' }] };
  if (slot === 'social_proof') return { socialProofStars: 5, socialProofText: 'Dipercaya oleh 5.000+ pelanggan di seluruh Indonesia' };
  if (slot === 'chat_simulation') return { chatMessages: [{ sender: 'customer', text: 'Halo kak, produk ini masih ready stock?' }, { sender: 'store', text: 'Halo kak! Masih ready stock dan bisa langsung dikirim hari ini ya kak.' }] };
  if (slot === 'terminal') return { terminalFile: 'pesanan.ts', terminalCmd1: 'pilih_paket --menu=spesial', terminalRes1: '✓ Paket Terpilih: Paket Hemat UMKM', terminalCmd2: 'kirim_ke_whatsapp()', terminalRes2: '▶ Mengalihkan ke WhatsApp Official...' };
  if (slot === 'catalog_timer') return { flashSaleEndDate: new Date(Date.now() + 86400000).toISOString() };
  if (slot === 'product_desc') return { productDescription: 'Dibuat dengan bahan pilihan berkualitas tinggi.' };
  if (slot === 'maps_cta_button') return { ctaText: 'Navigasi Maps' };
  if (slot === 'footer_newsletter') return { newsletterTitle: 'Dapatkan Info Promo Langsung di HP', newsletterButtonText: 'Daftar Promo' };
  if (slot === 'footer_floating_cta') return { floatingCtaTitle: 'Ingin Pesan Menu Hari Ini?', floatingCtaButtonText: 'Chat Sekarang' };
  if (slot === 'footer_status_badge') return { statusBadgeText: 'TOKO BUKA', statusBadgeSubtext: 'Siap Menerima Pesanan' };
  if (slot === 'faq_cs_card') return { csTitle: 'Butuh Bantuan Langsung?', csButtonText: 'Chat CS Toko' };
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
  getAllowedFeaturesSlots,
  getFeaturesSlotLabel,
  getEffectiveFeaturesElementOrder,
  getFeaturesSplitSlot,
  isFeaturesVisualOnLeft,
  getFeaturesSlotDirection,
  isFeaturesSplitLayout,
  getDefaultCatalogSlots,
  getAllowedCatalogSlots,
  getCatalogSlotLabel,
  getEffectiveCatalogElementOrder,
  getDefaultTestimonialsSlots,
  getTestimonialsSlotLabel,
  getEffectiveTestimonialsElementOrder,
  getDefaultFaqSlots,
  getAllowedFaqSlots,
  getFaqSlotLabel,
  getEffectiveFaqElementOrder,
  getDefaultMapsSlots,
  getAllowedMapsSlots,
  getMapsSlotLabel,
  getEffectiveMapsElementOrder,
  getDefaultFooterSlots,
  getAllowedFooterSlots,
  getFooterSlotLabel,
  getEffectiveFooterElementOrder,
};

export const DEFAULT_SLOTS_BY_SECTION: Record<string, string[]> = {
  hero: ['badge', 'title', 'subtitle', 'cta', 'image'],
  features: ['badge', 'title', 'subtitle', 'feature_cards'],
  product_catalog: ['badge', 'title', 'subtitle', 'catalog_grid'],
  testimonials: ['badge', 'title', 'subtitle', 'testi_item_0', 'testi_item_1', 'testi_item_2'],
  faq: ['badge', 'title', 'subtitle', 'faq_item_0', 'faq_item_1', 'faq_item_2', 'faq_item_3'],
  google_maps: ['badge', 'title', 'subtitle', 'maps_iframe', 'maps_info_card', 'maps_cta_button'],
  footer: ['footer_brand', 'footer_contact', 'footer_navigation', 'footer_copyright'],
};

export function getSectionDefaultSlots(section: {
  type: string;
  layoutPreset?: string;
  props?: Record<string, unknown>;
  styles?: Record<string, unknown>;
}): string[] {
  const preset =
    (section.layoutPreset as string) ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    '';
  if (section.type === 'hero') return getDefaultHeroSlots(preset || 'split_left_text');
  if (section.type === 'features') return getDefaultFeaturesSlots(preset || 'grid_3_cards');
  if (section.type === 'product_catalog') return getDefaultCatalogSlots(preset || 'grid_standard');
  if (section.type === 'testimonials') return getDefaultTestimonialsSlots(preset || 'masonry_grid');
  if (section.type === 'faq') return getDefaultFaqSlots(preset || 'accordion_single_col', section.props?.faqs as FAQItem[] | undefined);
  if (section.type === 'google_maps') return getDefaultMapsSlots(preset || 'fullwidth_map', typeof section.props?.branchMode === 'string' ? section.props.branchMode : undefined);
  if (section.type === 'footer') return getDefaultFooterSlots(preset || 'multi_column');
  return DEFAULT_SLOTS_BY_SECTION[section.type] || ['badge', 'title', 'subtitle', 'image', 'cta'];
}

export const SLOT_LABELS: Record<string, string> = {
  // Baris Header
  announcement_bar: 'Bar Pengumuman Promo',
  navbar: 'Bilah Navigasi Utama',
  contact_bar: 'Bar Kontak & Jam Buka',
  delivery_bar: 'Bar Layanan Pesan Antar',
  countdown_bar: 'Bar Hitung Mundur Promo',

  // Elemen Bilah Navigasi
  logo: 'Logo & Brand Toko',
  nav_links: 'Menu Navigasi Toko',
  cta: 'Tombol Pesan WhatsApp (CTA)',
  search_bar: 'Bilah Pencarian Produk',
  store_badges: 'Lencana Legalitas (BPOM / Halal)',

  // Slot Seksi Standar & Hero
  badge: 'Lencana Promo & Kategori',
  title: 'Judul Utama (H1)',
  subtitle: 'Subjudul & Deskripsi',
  image: 'Gambar Utama (Showcase)',
  terminal: 'Kotak Kode Terminal',
  booking_card: 'Formulir Reservasi',
  stat_counter: 'Metrik Statistik Angka',
  trust_badges: 'Lencana Sertifikasi / Jaminan',
  contrast_card: 'Kartu Pendaftaran Kuota',
  product_cards: 'Dua Kartu Produk Bundling',
  floating_cards: 'Kartu Keunggulan Melayang',
  social_proof: 'Avatar Komunitas & Rating',
  chat_simulation: 'Simulasi Balon Chat WA',
  bento_promo: 'Ubin Teks Promo',
  bento_review: 'Ubin Rating & Ulasan',
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
  map_view: 'Bingkai Peta Interaktif (Google Maps)',
  maps_branch_selector: 'Bilah Tab Cabang Gerai (Maks 5)',
  maps_iframe: 'Bingkai Peta Interaktif (Google Maps)',
  maps_info_card: 'Kartu Informasi Gerai & Alamat',
  maps_cta_button: 'Tombol Petunjuk Arah (Navigasi)',
  maps_hours_card: 'Bilah Status Jam Buka Toko',
  maps_directions_card: 'Kartu Panduan Rute & Parkir',
  brand_bio: 'Profil & Deskripsi Toko',
  contact_info: 'Kontak & Jam Buka',
  navigation_links: 'Menu Navigasi Footer',
  copyright: 'Teks Hak Cipta',
  footer_brand: 'Profil & Identitas Toko',
  footer_contact: 'Kontak & Jam Operasional',
  footer_navigation: 'Menu Navigasi Footer',
  footer_copyright: 'Hak Cipta & Powered by Pinoka',
  footer_floating_cta: 'Banner Penawaran (Floating CTA)',
  footer_newsletter: 'Formulir Langganan Promo WA',
  footer_status_badge: 'Bilah Status Operasional Toko',
  footer_mini_map: 'Bingkai Peta Mini Lokasi (Kanan)',
  footer_socials: 'Ubin Tautan Media Sosial',
};

