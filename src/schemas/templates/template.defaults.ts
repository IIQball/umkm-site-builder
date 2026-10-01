import type { TemplateTheme, TemplateSection, TemplateConfig } from './template.schema'

export const CURRENT_SCHEMA_VERSION = 1

export const DEFAULT_TEMPLATE_THEME: TemplateTheme = {
  primaryColor: '#36C6FD',
  fontFamily: 'Inter, sans-serif',
  colors: {
    primary: '#36C6FD',
    secondary: '#FC018B',
    accent: '#9A00DD',
    background: '#ffffff',
    surface: '#f8fafc',
    textPrimary: '#0f172a',
    textMuted: '#64748b'
  },
  typography: {
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    h1: { fontSize: '42px', lineHeight: '1.2', fontWeight: '700' },
    h2: { fontSize: '26px', lineHeight: '1.25', fontWeight: '700' },
    h3: { fontSize: '20px', lineHeight: '1.3', fontWeight: '600' },
    body: { fontSize: '16px', lineHeight: '1.6', fontWeight: '400' },
    caption: { fontSize: '10px', lineHeight: '1.5', fontWeight: '400' }
  },
  buttons: {
    borderRadius: '8px',
    primary: {
      backgroundColor: '#36C6FD',
      textColor: '#ffffff',
      borderColor: 'transparent',
      hoverBg: '#00A3EF',
      hoverText: '#ffffff'
    },
    secondary: {
      backgroundColor: 'transparent',
      textColor: '#0f172a',
      borderColor: '#cbd5e1',
      hoverBg: '#f8fafc',
      hoverText: '#0f172a'
    },
    outline: {
      backgroundColor: 'transparent',
      textColor: '#0f172a',
      borderColor: '#cbd5e1',
      hoverBg: '#f8fafc',
      hoverText: '#0f172a'
    },
    tertiary: {
      backgroundColor: 'transparent',
      textColor: '#334155',
      borderColor: 'transparent',
      hoverBg: 'transparent',
      hoverText: '#0f172a'
    }
  },
  layout: {
    maxWidth: '1200px',
    horizontalMarginDesktop: '32px',
    horizontalMarginTablet: '24px',
    horizontalMarginMobile: '16px'
  }
}

export const DEFAULT_TEMPLATE_SECTIONS: TemplateSection[] = [
  {
    id: 'section-1',
    type: 'header_announcement',
    layoutPreset: 'default_split',
    props: {
      showAnnouncement: true,
      announcementText: 'Diskon 20% khusus hari ini',
      announcementAlign: 'center',
      announcementBgColor: 'var(--theme-primary, #36C6FD)',
      announcementTextColor: '#ffffff',
      announcementPaddingY: '8px',
      logoType: 'image_text',
      logoText: 'Toko UMKM',
      logoImageUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100',
      logoImageHeight: 40,
      logoTypographyToken: 'h3',
      logoTextColor: 'var(--theme-text-primary, #0f172a)',
      navLinks: ['Beranda', 'Produk', 'Tentang', 'Kontak'],
      navGap: '16px',
      navTypographyToken: 'body',
      navTextTransform: 'none',
      navColor: 'var(--theme-text-muted, #64748b)',
      navHoverColor: 'var(--theme-primary, #36C6FD)',
    },
    styles: {
      bgColorToken: 'surface',
      textColorToken: 'text_primary',
      padding: '0px',
      display: 'block',
    },
  },
  {
    id: 'section-2',
    type: 'hero',
    layoutPreset: 'split_left_text',
    props: {
      tagName: 'h1',
      title: 'Selamat datang di toko kami',
      subtitle: 'Produk berkualitas dengan harga terjangkau',
      imageUrl: '',
      ctaText: 'Lihat Katalog',
      ctaLink: '#catalog',
    },
    styles: {
      bgColorToken: 'background',
      textColorToken: 'text_primary',
      padding: '0px',
      textAlign: 'center',
    },
  },
  {
    id: 'section-3',
    type: 'features',
    layoutPreset: 'grid_3_cards',
    props: {
      features: [
        {
          icon: 'shield',
          title: 'Toko Terpercaya',
          description: 'Dipercaya oleh ribuan pelanggan',
        },
        {
          icon: 'truck',
          title: 'Pengiriman Cepat',
          description: 'Gratis ongkos kirim untuk pembelian tertentu',
        },
        {
          icon: 'award',
          title: 'Produk Berkualitas',
          description: 'Garansi kualitas atau uang kembali',
        },
      ],
    },
    styles: {
      bgColorToken: 'surface',
      textColorToken: 'text_primary',
      display: 'grid',
      gap: '24px',
      padding: '0px',
    },
  },
  {
    id: 'section-4',
    type: 'product_catalog',
    layoutPreset: 'grid_standard',
    props: {
      title: 'Katalog Produk Pilihan',
      subtitle: 'Pilih produk terbaik kami dengan jaminan kualitas dan kemudahan pemesanan.',
      badgeText: 'Produk Unggulan',
      products: [
        {
          id: 'prod_1',
          name: 'Produk Unggulan 1',
          price: 50000,
          badge: 'Terlaris',
          imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60',
          description: 'Deskripsi lengkap mengenai keunggulan, kualitas, atau manfaat utama produk Anda.',
        },
        {
          id: 'prod_2',
          name: 'Produk Unggulan 2',
          price: 65000,
          badge: 'Spesial',
          imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60',
          description: 'Bahan berkualitas premium yang diproses secara higienis untuk menjaga mutu terbaik.',
        },
        {
          id: 'prod_3',
          name: 'Produk Unggulan 3',
          price: 80000,
          badge: 'Favorit',
          imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60',
          description: 'Pilihan favorit pelanggan setia dengan cita rasa dan kemasan eksklusif.',
        },
      ],
    },
    styles: { bgColorToken: 'background', textColorToken: 'text_primary', display: 'grid', gap: '24px', padding: '0px' },
  },
  {
    id: 'section-5',
    type: 'testimonials',
    layoutPreset: 'masonry_grid',
    props: {
      badgeText: 'Ulasan Pembeli',
      title: 'Kata Mereka yang Sudah Mencoba',
      subtitle: 'Kepuasan rasa dan kualitas produk adalah prioritas utama kami.',
      testimonials: [
        {
          id: 'testi_1',
          customerName: 'Ibu Dian Sastro',
          rating: 5,
          comment: 'Roti sisirnya wangi butter banget, empuknya tahan sampai 3 hari tanpa seret di tenggorokan. Selalu pesan buat sarapan keluarga.',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
          role: 'Pelanggan Setia • Banyuwangi',
          verified: true,
          verifiedText: 'Pembeli Terverifikasi',
        },
        {
          id: 'testi_2',
          customerName: 'Mas Dimas Pratama',
          rating: 5,
          comment: 'Kopi Ijen roastingannya presisi medium dark, crema tebal waktu dibuat espresso. Cocok banget nemenin kerja santai.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          role: 'Penikmat Kopi • Malang',
          verified: true,
          verifiedText: 'Pembeli Terverifikasi',
        },
        {
          id: 'testi_3',
          customerName: 'Ibu Hj. Mariam',
          rating: 5,
          comment: 'Pelayanan katering syukuran kemarin sangat memuaskan. Nasi kotak datang tepat waktu dan bumbunya benar-benar gurih meresap.',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          role: 'Pemesanan 150 Porsi • Jember',
          verified: true,
          verifiedText: 'Pembeli Terverifikasi',
        },
      ],
    },
    styles: { bgColorToken: 'surface', textColorToken: 'text_primary', display: 'grid', gap: '24px', padding: '0px' },
  },
  {
    id: 'section-6',
    type: 'faq',
    layoutPreset: 'accordion_single_col',
    props: {
      badgeText: 'Pusat Bantuan & FAQ',
      title: 'Pertanyaan Sering Diajukan',
      subtitle: 'Temukan jawaban cepat atas pertanyaan seputar pemesanan, produk, dan pengiriman kami.',
      faqs: [
        {
          id: 'faq_1',
          question: 'Berapa lama estimasi pengiriman?',
          answer: 'Pesanan diproses 1x24 jam. Pengiriman reguler tiba dalam 2-4 hari kerja.',
          category: 'Pengiriman',
        },
        {
          id: 'faq_2',
          question: 'Metode pembayaran apa saja yang didukung?',
          answer: 'Transfer bank, QRIS semua e-wallet, dan COD bayar di tempat.',
          category: 'Pembayaran',
        },
        {
          id: 'faq_3',
          question: 'Apakah produk dijamin bergaransi?',
          answer: 'Semua produk 100% original dengan garansi penggantian baru jika paket tiba rusak.',
          category: 'Garansi',
        },
      ],
    },
    styles: { bgColorToken: 'background', textColorToken: 'text_primary', padding: '0px' },
  },
  {
    id: 'section-7',
    type: 'google_maps',
    layoutPreset: 'fullwidth_map',
    props: {
      markerTitle: 'Lokasi Toko Kami',
      address: 'Jl. Merdeka Barat No. 12, Gambir, Jakarta Pusat',
      zoom: 15,
      mapHeight: '400px',
      mapQuery: 'Monas Jakarta',
      addressTitle: 'Lokasi Toko Kami',
      addressDetail: 'Jl. Merdeka Barat No. 12, Gambir, Jakarta Pusat',
    },
    styles: { bgColorToken: 'surface', textColorToken: 'text_primary', padding: '0px' },
  },
  {
    id: 'section-8',
    type: 'footer',
    layoutPreset: 'multi_column',
    props: {
      whatsappNumber: '',
      address: '',
      copyrightText: '© 2026 Toko Kami. Semua hak dilindungi.',
    },
    styles: { bgColorToken: 'surface', textColorToken: 'text_primary', padding: '0px', textAlign: 'center' },
  },
];

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  theme: DEFAULT_TEMPLATE_THEME,
  sections: DEFAULT_TEMPLATE_SECTIONS,
};
