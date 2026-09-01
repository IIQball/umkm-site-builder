import type { TemplateTheme, TemplateSection, TemplateConfig } from './template.schema';

export const CURRENT_SCHEMA_VERSION = 1;

export const DEFAULT_TEMPLATE_THEME: TemplateTheme = {
  primaryColor: '#3b82f6',
  fontFamily: 'Inter, sans-serif',
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    textPrimary: '#0f172a',
    textMuted: '#64748b',
  },
  typography: {
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    h1: { fontSize: '42px', lineHeight: '1.2', fontWeight: '700' },
    h2: { fontSize: '26px', lineHeight: '1.25', fontWeight: '700' },
    h3: { fontSize: '20px', lineHeight: '1.3', fontWeight: '600' },
    body: { fontSize: '16px', lineHeight: '1.6', fontWeight: '400' },
    caption: { fontSize: '10px', lineHeight: '1.5', fontWeight: '400' },
  },
  buttons: {
    borderRadius: '8px',
    primary: {
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderColor: 'transparent',
      hoverBg: '#2563eb',
      hoverText: '#ffffff',
    },
    secondary: {
      backgroundColor: '#f1f5f9',
      textColor: '#0f172a',
      borderColor: 'transparent',
      hoverBg: '#e2e8f0',
      hoverText: '#0f172a',
    },
    outline: {
      backgroundColor: 'transparent',
      textColor: '#3b82f6',
      borderColor: '#3b82f6',
      hoverBg: '#eff6ff',
      hoverText: '#2563eb',
    },
  },
  layout: {
    maxWidth: '1200px',
    horizontalMarginDesktop: '32px',
    horizontalMarginTablet: '24px',
    horizontalMarginMobile: '16px',
  },
};

export const DEFAULT_TEMPLATE_SECTIONS: TemplateSection[] = [
  {
    id: 'section-1',
    type: 'header_announcement',
    layoutPreset: 'default_split',
    props: {
      showAnnouncement: true,
      announcementText: 'Diskon 20% khusus hari ini',
      announcementAlign: 'center',
      announcementBgColor: 'var(--theme-primary, #2563eb)',
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
      navHoverColor: 'var(--theme-primary, #2563eb)',
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
      products: [],
    },
    styles: {
      bgColorToken: 'background',
      textColorToken: 'text_primary',
      display: 'grid',
      gap: '24px',
      padding: '0px',
    },
  },
  {
    id: 'section-5',
    type: 'testimonials',
    layoutPreset: 'masonry_grid',
    props: {
      testimonials: [
        {
          avatar: '',
          customerName: 'Pelanggan 1',
          rating: 5,
          comment: 'Produk sangat bagus dan pengiriman cepat!',
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
    id: 'section-6',
    type: 'faq',
    layoutPreset: 'accordion_single_col',
    props: {
      faqs: [
        {
          question: 'Berapa lama pengiriman?',
          answer: 'Pengiriman biasanya memakan waktu 1-3 hari kerja',
        },
        {
          question: 'Apakah ada garansi?',
          answer: 'Ya, semua produk kami memiliki garansi kepuasan pelanggan',
        },
      ],
    },
    styles: {
      bgColorToken: 'background',
      textColorToken: 'text_primary',
      padding: '0px',
    },
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
    styles: {
      bgColorToken: 'surface',
      textColorToken: 'text_primary',
      padding: '0px',
    },
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
    styles: {
      bgColorToken: 'surface',
      textColorToken: 'text_primary',
      padding: '0px',
      textAlign: 'center',
    },
  },
];

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  theme: DEFAULT_TEMPLATE_THEME,
  sections: DEFAULT_TEMPLATE_SECTIONS,
};
