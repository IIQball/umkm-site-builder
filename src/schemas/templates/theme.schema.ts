import { z } from 'zod';

export const TypographyScaleItemSchema = z.object({
  fontSize: z.string(),
  fontWeight: z.string().optional(),
});

export const TemplateThemeSchema = z.object({
  colors: z
    .object({
      primary: z.string().default('#3b82f6'),
      secondary: z.string().default('#64748b'),
      accent: z.string().default('#f59e0b'),
      background: z.string().default('#ffffff'),
      surface: z.string().default('#f8fafc'),
      textPrimary: z.string().default('#0f172a'),
      textMuted: z.string().default('#64748b'),
    })
    .default({
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc',
      textPrimary: '#0f172a',
      textMuted: '#64748b',
    }),
  typography: z
    .object({
      fontFamily: z.string().default('Inter, sans-serif'),
      bodyFont: z.string().optional().default('Inter, sans-serif'),
      headingFont: z.string().default('"Plus Jakarta Sans", sans-serif'),
      scale: z
        .object({
          h1: z.string().default('42px'),
          h2: z.string().default('26px'),
          h3: z.string().default('20px'),
          body: z.string().default('16px'),
          caption: z.string().default('10px'),
        })
        .default({
          h1: '42px',
          h2: '26px',
          h3: '20px',
          body: '16px',
          caption: '10px',
        }),
      h1: TypographyScaleItemSchema.optional().default({ fontSize: '42px', fontWeight: '700' }),
      h2: TypographyScaleItemSchema.optional().default({ fontSize: '26px', fontWeight: '700' }),
      h3: TypographyScaleItemSchema.optional().default({ fontSize: '20px', fontWeight: '600' }),
      body: TypographyScaleItemSchema.optional().default({ fontSize: '16px', fontWeight: '400' }),
      caption: TypographyScaleItemSchema.optional().default({ fontSize: '10px', fontWeight: '400' }),
    })
    .default({
      fontFamily: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      headingFont: '"Plus Jakarta Sans", sans-serif',
      scale: {
        h1: '42px',
        h2: '26px',
        h3: '20px',
        body: '16px',
        caption: '10px',
      },
      h1: { fontSize: '42px', fontWeight: '700' },
      h2: { fontSize: '26px', fontWeight: '700' },
      h3: { fontSize: '20px', fontWeight: '600' },
      body: { fontSize: '16px', fontWeight: '400' },
      caption: { fontSize: '10px', fontWeight: '400' },
    }),
  buttons: z
    .object({
      borderRadius: z.string().default('8px'),
      paddingY: z.string().default('10px'),
      paddingX: z.string().default('20px'),
      fontSize: z.string().default('14px'),
      fontWeight: z.string().default('600'),
    })
    .default({
      borderRadius: '8px',
      paddingY: '10px',
      paddingX: '20px',
      fontSize: '14px',
      fontWeight: '600',
    }),
  layout: z
    .object({
      maxWidth: z.string().default('1200px'),
      sectionGap: z.string().default('48px'),
      borderRadius: z.string().default('16px'),
      horizontalMarginDesktop: z.string().optional().default('32px'),
      horizontalMarginTablet: z.string().optional().default('24px'),
      horizontalMarginMobile: z.string().optional().default('16px'),
    })
    .default({
      maxWidth: '1200px',
      sectionGap: '48px',
      borderRadius: '16px',
      horizontalMarginDesktop: '32px',
      horizontalMarginTablet: '24px',
      horizontalMarginMobile: '16px',
    }),
});

export type TemplateTheme = z.infer<typeof TemplateThemeSchema>;

export const DEFAULT_TEMPLATE_THEME: TemplateTheme = {
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
    fontFamily: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    headingFont: '"Plus Jakarta Sans", sans-serif',
    scale: {
      h1: '42px',
      h2: '26px',
      h3: '20px',
      body: '16px',
      caption: '10px',
    },
    h1: { fontSize: '42px', fontWeight: '700' },
    h2: { fontSize: '26px', fontWeight: '700' },
    h3: { fontSize: '20px', fontWeight: '600' },
    body: { fontSize: '16px', fontWeight: '400' },
    caption: { fontSize: '10px', fontWeight: '400' },
  },
  buttons: {
    borderRadius: '8px',
    paddingY: '10px',
    paddingX: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  layout: {
    maxWidth: '1200px',
    sectionGap: '48px',
    borderRadius: '16px',
    horizontalMarginDesktop: '32px',
    horizontalMarginTablet: '24px',
    horizontalMarginMobile: '16px',
  },
};

export const DEFAULT_TEMPLATE_SECTIONS = [
  {
    id: 'header_announcement_1',
    type: 'header_announcement' as const,
    layoutPreset: 'default_split',
    props: {
      showAnnouncement: true,
      announcementText: 'Selamat Datang di Toko Kami! Dapatkan Penawaran Terbaik Hari Ini',
      logoType: 'image_text',
      logoText: 'TOKO KAMI',
      navLinks: ['Beranda', 'Katalog', 'Tentang Kami', 'Kontak'],
      ctaText: 'Chat WA',
      ctaLink: '#whatsapp',
      layoutPreset: 'default_split',
    },
  },
  {
    id: 'hero_1',
    type: 'hero' as const,
    layoutPreset: 'split_left_text',
    props: {
      tagName: 'h1',
      title: 'Selamat datang di toko kami',
      subtitle: 'Produk berkualitas dengan harga terjangkau',
      imageUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Lihat Katalog',
      ctaLink: '#products',
      badgeText: 'Promo Spesial UMKM',
      layoutPreset: 'split_left_text',
    },
  },
  {
    id: 'features_1',
    type: 'features' as const,
    layoutPreset: 'grid_3_cards',
    props: {
      title: 'Keunggulan Kami',
      subtitle: 'Mengapa memilih produk dan layanan dari toko kami?',
      layoutPreset: 'grid_3_cards',
    },
  },
  {
    id: 'product_catalog_1',
    type: 'product_catalog' as const,
    layoutPreset: 'grid_standard',
    props: {
      title: 'Katalog Produk',
      subtitle: 'Pilihan produk terbaik untuk Anda',
      layoutPreset: 'grid_standard',
    },
  },
  {
    id: 'testimonials_1',
    type: 'testimonials' as const,
    layoutPreset: 'masonry_grid',
    props: {
      title: 'Kata Pelanggan',
      subtitle: 'Pengalaman nyata pelanggan berbelanja di toko kami',
      layoutPreset: 'masonry_grid',
    },
  },
  {
    id: 'faq_1',
    type: 'faq' as const,
    layoutPreset: 'accordion_single_col',
    props: {
      title: 'Pertanyaan yang Sering Diajukan',
      subtitle: 'Temukan jawaban cepat seputar produk dan layanan kami',
      layoutPreset: 'accordion_single_col',
    },
  },
  {
    id: 'footer_1',
    type: 'footer' as const,
    layoutPreset: 'multi_column',
    props: {
      logoText: 'TOKO KAMI',
      tagline: 'Pusat belanja produk UMKM terpercaya',
      layoutPreset: 'multi_column',
    },
  },
];
