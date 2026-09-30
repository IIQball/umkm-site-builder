import { getFeaturesSlotLabel } from '../sections/features/featuresLayout.helpers';
import { getCatalogSlotLabel } from '../sections/catalog/catalogLayout.helpers';

export const getNodeLabel = (id: string, sectionType?: string, preset?: string): string => {
  if (sectionType === 'features') {
    if (id === 'features_heading' || id === 'header') {
      return preset === 'banner_inline_bar' ? 'Judul Ringkas Ribbon' : 'Judul Utama (Heading)';
    }
    if (id === 'features_image') return getFeaturesSlotLabel('image', preset);
    const label = getFeaturesSlotLabel(id, preset);
    if (label !== id) return label;
  }

  if (sectionType === 'product_catalog') {
    if (id === 'catalog_header' || id === 'header') {
      return 'Judul & Subjudul Katalog';
    }
    const label = getCatalogSlotLabel(id, preset);
    if (label !== id) return label;
  }

  switch (id) {
    // Header Section Nodes
    case 'announcement':
    case 'announcement_bar': return 'Bar Pengumuman Promo';
    case 'contact_bar': return 'Bar Kontak & Jam Buka';
    case 'delivery_bar': return 'Bar Layanan Pesan Antar';
    case 'countdown_bar': return 'Bar Hitung Mundur Promo';
    case 'store_badges': return 'Lencana Legalitas (BPOM / Halal)';
    case 'search_bar': return 'Bilah Pencarian Produk';
    case 'logo':
    case 'header_logo': return 'Logo & Brand Toko';
    case 'nav_links':
    case 'header_nav': return 'Menu Navigasi Toko';
    case 'header': return 'Kepala Halaman (Header)';
    case 'header_cta': return 'Tombol Pesan WhatsApp (CTA)';

    // Hero Section Nodes
    case 'badge':
    case 'hero_badge': return 'Lencana Promo & Kategori';
    case 'title':
    case 'hero_title': return 'Judul Utama (H1)';
    case 'subtitle':
    case 'hero_subtitle': return 'Subjudul & Deskripsi';
    case 'image':
    case 'hero_image':
    case 'hero_media': return 'Gambar Utama (Showcase)';
    case 'hero_founder_photo': return 'Foto Profil Pendiri';
    case 'cta':
    case 'hero_cta':
    case 'hero_cta_primary':
    case 'hero_cta_secondary':
      return sectionType === 'header_announcement' ? 'Tombol Pesan WhatsApp (CTA)' : 'Tombol Aksi (CTA)';
    case 'terminal':
    case 'hero_terminal': return 'Kotak Kode Terminal';
    case 'stat_counter':
    case 'hero_stat_counter': return 'Metrik Statistik Angka';
    case 'trust_badges':
    case 'hero_trust_badges': return 'Lencana Sertifikasi / Jaminan';
    case 'contrast_card':
    case 'hero_contrast_card': return 'Kartu Pendaftaran Kuota';
    case 'product_cards':
    case 'hero_product_cards': return 'Dua Kartu Produk Bundling';
    case 'floating_cards':
    case 'hero_floating_cards': return 'Kartu Keunggulan Melayang';
    case 'social_proof':
    case 'hero_social_proof': return 'Avatar Komunitas & Rating';
    case 'chat_simulation':
    case 'hero_chat_simulation': return 'Simulasi Balon Chat WA';
    case 'hero_booking_card': return 'Formulir Reservasi';
    case 'hero_bento_promo': return 'Ubin Teks Promo';
    case 'hero_bento_image': return 'Ubin Gambar Showcase';
    case 'hero_bento_review': return 'Ubin Rating & Ulasan';
    case 'hero_pill_category': return 'Filter Kategori Kapsul';
    case 'hero_email_capture': return 'Formulir Input Email / WA';

    // Features Section Nodes
    case 'features_heading': return 'Judul Utama (Heading)';
    case 'features_image': return 'Gambar Ilustrasi Fitur';
    case 'feature_cards': return 'Grid Kartu Fitur (3 Kolom)';
    case 'feature_rows': return 'Daftar Baris Fitur';
    case 'ribbon_bar': return 'Pita Baris Fitur (Ribbon 64px)';
    case 'bento_spotlight': return 'Kartu Sorotan Utama (Span 8)';
    case 'bento_cards': return 'Kartu Fitur Pendukung (Span 4)';
    case 'zigzag_items': return 'Baris Zigzag Bergantian';
    case 'tab_nav': return 'Bilah Pilihan Tab (Tab Bar)';
    case 'tab_card': return 'Kartu Detail Tab Aktif';
    case 'accordion_list': return 'Daftar Akordeon Fitur';
    case 'scroll_cards': return 'Daftar Kartu Fitur Mengalir';
    case 'icon_matrix': return 'Matriks Ubin Ikon Kompak';
    case 'before_card': return 'Kartu Sebelum (Produk Pasaran)';
    case 'after_card': return 'Kartu Sesudah (Solusi Dapur Kami)';
    case 'features_grid': return 'Daftar Kartu Fitur';

    // Catalog Section Nodes
    case 'catalog_header': return 'Judul & Subjudul Katalog';
    case 'catalog_categories':
    case 'catalog_sidebar': return 'Bilah Filter Kategori';
    case 'catalog_timer': return 'Kotak Timer Flash Sale';
    case 'catalog_bundle_tier': return 'Tiers Paket Hemat';
    case 'catalog_cta': return 'Tombol Pesan WhatsApp';
    case 'catalog_price_rows': return 'Baris Tabel / Daftar Harga';
    case 'product_desc': return 'Deskripsi & Manfaat Produk';

    // Testimonials Section Nodes
    case 'testimonials_header': return 'Judul & Subjudul Testimoni';
    case 'testi_spotlight_quote': return 'Kutipan Ulasan Utama';
    case 'testi_spotlight_author': return 'Identitas Pengulas';
    case 'testi_stats': return 'Skor Rating Agregat';
    case 'testi_split_reviews': return 'Daftar Ulasan Singkat';
    case 'testi_slider_track': return 'Track Slider Ulasan';
    case 'testi_logo_cloud': return 'Daftar Logo Kemitraan';

    // FAQ Section Nodes
    case 'faq_header': return 'Judul & Subjudul FAQ';
    case 'faq_cs_card': return 'Kartu Bantuan CS WhatsApp';
    case 'faq_search_bar': return 'Bilah Pencarian FAQ';
    case 'faq_tabs': return 'Tab Kategori FAQ';

    // Maps Section Nodes
    case 'maps_header': return 'Judul & Badge Lokasi';
    case 'maps_iframe': return 'Frame Peta Interaktif';
    case 'maps_info_card': return 'Kartu Alamat & Kontak';
    case 'maps_hours_badge': return 'Bilah Status Jam Buka';
    case 'maps_branch_tabs': return 'Bilah Tab Cabang';
    case 'maps_cta_button': return 'Tombol Petunjuk Arah';

    // Footer Section Nodes
    case 'footer_brand':
    case 'footer_brand_logo': return 'Identitas & Logo Brand';
    case 'footer_contact': return 'Kontak & Alamat Toko';
    case 'footer_navigation': return 'Menu Navigasi Footer';
    case 'footer_floating_cta': return 'Banner Penawaran (CTA)';
    case 'footer_newsletter': return 'Form Langganan Promo WA';
    case 'footer_status_badge': return 'Bilah Status Toko Buka';
    case 'footer_mini_map': return 'Peta Mini Lokasi Toko';
    case 'footer_socials': return 'Ubin Tautan Sosial Media';
    case 'footer_copyright': return 'Baris Hak Cipta (Copyright)';

    default: {
      if (id.startsWith('faq_item_')) {
        const idx = parseInt(id.replace('faq_item_', ''), 10);
        return `Tanya Jawab #${isNaN(idx) ? 1 : idx + 1}`;
      }
      if (id.startsWith('testi_avatar_')) {
        const idx = parseInt(id.replace('testi_avatar_', ''), 10);
        return `Foto Avatar #${isNaN(idx) ? 1 : idx + 1}`;
      }
      if (id.startsWith('testi_logo_')) {
        const idx = parseInt(id.replace('testi_logo_', ''), 10);
        return `Logo Mitra #${isNaN(idx) ? 1 : idx + 1}`;
      }
      if (id.startsWith('testi_item_')) {
        const idx = parseInt(id.replace('testi_item_', ''), 10);
        return `Kartu Ulasan #${isNaN(idx) ? 1 : idx + 1}`;
      }
      if (id.startsWith('product_image_')) {
        const idx = parseInt(id.replace('product_image_', ''), 10);
        return `Foto Produk #${isNaN(idx) ? 1 : idx + 1}`;
      }
      if (id.startsWith('product_item_')) {
        const idx = parseInt(id.replace('product_item_', ''), 10);
        return `Kartu Produk #${isNaN(idx) ? 1 : idx + 1}`;
      }
      if (id.startsWith('feature_item_')) {
        const idx = parseInt(id.replace('feature_item_', ''), 10);
        return `Kartu Keunggulan #${isNaN(idx) ? 1 : idx + 1}`;
      }
      if (id.startsWith('item_')) {
        const idx = parseInt(id.replace('item_', ''), 10);
        return `Item #${isNaN(idx) ? 1 : idx + 1}`;
      }
      return id.startsWith('nav_') ? 'Menu Navigasi Toko' : id;
    }
  }
};

export const nodeTextColorOptions = [
  { value: '', label: 'Default (Tema)' },
  { value: 'var(--theme-text-primary, #0f172a)', label: 'Teks Utama (Text Primary)' },
  { value: 'var(--theme-text-muted, #64748b)', label: 'Teks Redup (Text Muted)' },
  { value: 'var(--theme-primary, var(--color-primary))', label: 'Primary Brand (Warna Utama)' },
  { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
  { value: '#ffffff', label: 'Putih Bersih (White)' },
];

export const nodeBgColorOptions = [
  { value: 'transparent', label: 'Transparan' },
  { value: 'var(--theme-bg, #ffffff)', label: 'Background Kanvas' },
  { value: 'var(--theme-surface, #f8fafc)', label: 'Surface / Card Background' },
  { value: 'var(--theme-primary, var(--color-primary))', label: 'Primary Brand' },
  { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
];

export const nodeMarginOptions = [
  { value: '0px', label: '0px (Tanpa Jarak)' },
  { value: '8px', label: '8px (Ketat)' },
  { value: '16px', label: '16px (Normal)' },
  { value: '24px', label: '24px (Renggang)' },
  { value: '32px', label: '32px (Lebar)' },
  { value: '48px', label: '48px (Sangat Lebar)' },
];

export const btnVariantOptions = [
  { value: 'primary', label: 'Primary (Warna Penuh)' },
  { value: 'secondary', label: 'Secondary (Outline / Garis Tepi)' },
  { value: 'tertiary', label: 'Tertiary (Teks Garis Bawah)' },
  { value: 'outline', label: 'Outline (Garis Tepi)' },
];

export const btnHeightOptions = [
  { value: '32px', label: '32px (Compact)' },
  { value: '40px', label: '40px (Normal)' },
  { value: '48px', label: '48px (Large)' },
  { value: '56px', label: '56px (Jumbo)' },
];
