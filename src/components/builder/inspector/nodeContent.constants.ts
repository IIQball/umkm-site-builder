export const getNodeLabel = (id: string): string => {
  switch (id) {
    case 'badge':
    case 'hero_badge': return 'Promo Badge';
    case 'title':
    case 'hero_title': return 'Judul Utama (H1)';
    case 'subtitle':
    case 'hero_subtitle': return 'Deskripsi Subtitle';
    case 'image':
    case 'hero_image':
    case 'hero_media': return 'Gambar Showcase';
    case 'cta':
    case 'hero_cta':
    case 'hero_cta_primary':
    case 'hero_cta_secondary': return 'Grup Tombol CTA';
    case 'hero_booking_card': return 'Form Reservasi / Booking';
    case 'hero_chat_simulation': return 'Simulasi Bubble Chat WA';
    case 'hero_stat_counter': return 'Metrik Statistik Angka';
    case 'hero_bento_promo': return 'Ubin Teks Promo';
    case 'hero_bento_image': return 'Ubin Gambar Showcase';
    case 'hero_bento_review': return 'Ubin Ulasan / Rating';
    case 'hero_pill_category': return 'Filter Kategori Pill';
    case 'hero_email_capture': return 'Form Email Input';
    case 'hero_social_proof': return 'Avatar Komunitas & Rating';
    case 'hero_founder_photo': return 'Foto Profil Pendiri';
    case 'announcement': return 'Announcement Bar';
    case 'logo': return 'Logo & Brand';
    case 'nav_links': return 'Navigation Menu';
    case 'header': return 'Section Header';
    case 'features_heading': return 'Judul & Subjudul Fitur';
    case 'features_image': return 'Gambar Ilustrasi Fitur';
    case 'catalog_header': return 'Judul & Subjudul Katalog';
    case 'catalog_categories':
    case 'catalog_sidebar': return 'Bilah Filter Kategori';
    case 'catalog_timer': return 'Kotak Timer Flash Sale';
    case 'catalog_bundle_tier': return 'Tiers Paket Hemat';
    case 'catalog_cta': return 'Tombol Pesan WhatsApp';
    case 'catalog_price_rows': return 'Baris Tabel / Daftar Harga';
    case 'product_desc': return 'Deskripsi & Manfaat Produk';
    case 'testimonials_header': return 'Judul & Subjudul Testimoni';
    case 'testi_spotlight_quote': return 'Kutipan Ulasan Utama';
    case 'testi_spotlight_author': return 'Identitas Pengulas';
    case 'testi_stats': return 'Skor Rating Agregat';
    case 'testi_split_reviews': return 'Daftar Ulasan Singkat';
    case 'testi_slider_track': return 'Track Slider Ulasan';
    case 'testi_logo_cloud': return 'Daftar Logo Kemitraan';
    case 'faq_header': return 'Judul & Subjudul FAQ';
    case 'faq_cs_card': return 'Kartu Bantuan CS WhatsApp';
    case 'faq_search_bar': return 'Bilah Pencarian FAQ';
    case 'faq_tabs': return 'Tab Kategori FAQ';
    case 'maps_header': return 'Judul & Badge Lokasi';
    case 'maps_iframe': return 'Frame Peta Interaktif';
    case 'maps_info_card': return 'Kartu Alamat & Kontak';
    case 'maps_hours_badge': return 'Bilah Status Jam Buka';
    case 'maps_branch_tabs': return 'Bilah Tab Cabang';
    case 'maps_cta_button': return 'Tombol Petunjuk Arah';
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
        return `Kartu Fitur #${isNaN(idx) ? 1 : idx + 1}`;
      }
      if (id.startsWith('item_')) {
        const idx = parseInt(id.replace('item_', ''), 10);
        return `Item #${isNaN(idx) ? 1 : idx + 1}`;
      }
      return id.startsWith('nav_') ? 'Navigation Menu' : id;
    }
  }
};

export const nodeTextColorOptions = [
  { value: '', label: 'Default (Tema)' },
  { value: 'var(--theme-text-primary, #0f172a)', label: 'Teks Utama (Text Primary)' },
  { value: 'var(--theme-text-muted, #64748b)', label: 'Teks Redup (Text Muted)' },
  { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand (Warna Utama)' },
  { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
  { value: '#ffffff', label: 'Putih Bersih (White)' },
];

export const nodeBgColorOptions = [
  { value: 'transparent', label: 'Transparan' },
  { value: 'var(--theme-bg, #ffffff)', label: 'Background Kanvas' },
  { value: 'var(--theme-surface, #f8fafc)', label: 'Surface / Card Background' },
  { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand' },
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
  { value: 'primary', label: 'Primary Brand (Solid)' },
  { value: 'secondary', label: 'Secondary Brand (Solid)' },
  { value: 'outline', label: 'Outline (Garis Tepi)' },
];

export const btnHeightOptions = [
  { value: '32px', label: '32px (Compact)' },
  { value: '40px', label: '40px (Normal)' },
  { value: '48px', label: '48px (Large)' },
  { value: '56px', label: '56px (Jumbo)' },
];
