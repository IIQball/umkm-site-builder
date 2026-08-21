/**
 * Template Builder Validation Schemas (Zod) - Templates Domain
 */

import { z } from 'zod';

export const TemplateStylesSchema = z.object({
  display: z.enum(['flex', 'grid', 'block']).or(z.string()).optional(),
  alignItems: z.string().optional(),
  justifyContent: z.string().optional(),
  gap: z.string().optional(),
  padding: z.string().optional(),
  margin: z.string().optional(),
  fontSize: z.string().optional(),
  fontWeight: z.string().optional(),
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
  borderRadius: z.string().optional(),
}).passthrough();

export const TemplateSectionSchema = z.object({
  id: z.string(),
  type: z.enum([
    'header_announcement',
    'hero',
    'features',
    'product_catalog',
    'testimonials',
    'faq',
    'footer',
  ]),
  props: z.record(z.unknown()).optional(),
  styles: TemplateStylesSchema.optional(),
});

export const ThemeColorsSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  background: z.string().optional(),
  surface: z.string().optional(),
  textPrimary: z.string().optional(),
  textMuted: z.string().optional(),
}).optional();

export const TypographyScaleItemSchema = z.object({
  fontSize: z.string().optional(),
  lineHeight: z.string().optional(),
  fontWeight: z.string().optional(),
}).optional();

export const ThemeTypographySchema = z.object({
  headingFont: z.string().optional(),
  bodyFont: z.string().optional(),
  h1: TypographyScaleItemSchema,
  h2: TypographyScaleItemSchema,
  h3: TypographyScaleItemSchema,
  body: TypographyScaleItemSchema,
  caption: TypographyScaleItemSchema,
}).optional();

export const ThemeButtonVariantSchema = z.object({
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  borderColor: z.string().optional(),
  hoverBg: z.string().optional(),
  hoverText: z.string().optional(),
}).optional();

export const ThemeButtonsSchema = z.object({
  primary: ThemeButtonVariantSchema,
  secondary: ThemeButtonVariantSchema,
  outline: ThemeButtonVariantSchema,
  borderRadius: z.string().optional(),
}).optional();

export const ThemeLayoutSchema = z.object({
  maxWidth: z.string().optional(),
  horizontalMarginDesktop: z.string().optional(),
  horizontalMarginTablet: z.string().optional(),
  horizontalMarginMobile: z.string().optional(),
}).optional();

export const TemplateThemeSchema = z.object({
  primaryColor: z.string().optional(),
  fontFamily: z.string().optional(),
  colors: ThemeColorsSchema,
  typography: ThemeTypographySchema,
  buttons: ThemeButtonsSchema,
  layout: ThemeLayoutSchema,
}).passthrough().optional();

export const TemplateConfigSchema = z.object({
  theme: TemplateThemeSchema,
  sections: z.array(TemplateSectionSchema),
});

export const TemplateDraftCreateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  price: z.coerce.number().int().nonnegative('Price must be non-negative').optional().default(0),
  description: z.string().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().or(z.literal('')).optional(),
});

export const TemplateDraftUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.coerce.number().int().nonnegative().optional(),
  description: z.string().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().or(z.literal('')).optional(),
  config: TemplateConfigSchema.optional(),
});

export const TemplateDraftSubmitSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  price: z.coerce.number().int().nonnegative('Price must be non-negative'),
  description: z.string().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().or(z.literal('')).optional(),
  config: TemplateConfigSchema,
});

export type TemplateStyles = z.infer<typeof TemplateStylesSchema>;
export type TemplateSection = z.infer<typeof TemplateSectionSchema>;
export type TemplateTheme = NonNullable<z.infer<typeof TemplateThemeSchema>>;
export type TemplateConfig = z.infer<typeof TemplateConfigSchema>;
export type TemplateDraftCreate = z.infer<typeof TemplateDraftCreateSchema>;
export type TemplateDraftUpdate = z.infer<typeof TemplateDraftUpdateSchema>;
export type TemplateDraftSubmit = z.infer<typeof TemplateDraftSubmitSchema>;

export const DEFAULT_TEMPLATE_THEME: TemplateTheme = {
  primaryColor: '#3b82f6',
  fontFamily: 'Inter, sans-serif',
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    textPrimary: '#0f172a',
    textMuted: '#64748b',
  },
  typography: {
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    h1: { fontSize: '36px', lineHeight: '1.2', fontWeight: '700' },
    h2: { fontSize: '28px', lineHeight: '1.25', fontWeight: '700' },
    h3: { fontSize: '22px', lineHeight: '1.3', fontWeight: '600' },
    body: { fontSize: '15px', lineHeight: '1.6', fontWeight: '400' },
    caption: { fontSize: '13px', lineHeight: '1.5', fontWeight: '400' },
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
    props: {
      showAnnouncement: true,
      announcementText: 'Diskon 20% khusus hari ini',
      announcementAlign: 'center',
      announcementBgColor: '#2563eb',
      announcementTextColor: '#ffffff',
      announcementPaddingY: '8px',
      logoType: 'image_text',
      logoText: 'Toko UMKM',
      logoImageUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100',
      logoImageHeight: 36,
      logoTextSize: 'lg',
      logoTextWeight: 'bold',
      logoTextColor: '#0f172a',
      navLinks: ['Beranda', 'Produk', 'Tentang', 'Kontak'],
      navGap: 'normal',
      navFontSize: '14px',
      navFontWeight: '500',
      navTextTransform: 'none',
      navColor: '#475569',
      navHoverColor: '#2563eb',
    },
    styles: {
      backgroundColor: '#ffffff',
      padding: '0px',
      display: 'block',
    },
  },
  {
    id: 'section-2',
    type: 'hero',
    props: {
      tagName: 'h1',
      title: 'Selamat datang di toko kami',
      subtitle: 'Produk berkualitas dengan harga terjangkau',
      imageUrl: '',
      ctaText: 'Lihat Katalog',
      ctaLink: '#catalog',
    },
    styles: {
      padding: '64px 32px',
      backgroundColor: '#ffffff',
      textAlign: 'center',
    },
  },
  {
    id: 'section-3',
    type: 'features',
    props: {
      features: [
        {
          icon: '✓',
          title: 'Toko Terpercaya',
          description: 'Dipercaya oleh ribuan pelanggan',
        },
        {
          icon: '🚚',
          title: 'Pengiriman Cepat',
          description: 'Gratis ongkos kirim untuk pembelian tertentu',
        },
        {
          icon: '💯',
          title: 'Produk Berkualitas',
          description: 'Garansi kualitas atau uang kembali',
        },
      ],
    },
    styles: {
      display: 'grid',
      gap: '24px',
      padding: '48px 32px',
      backgroundColor: '#f9fafb',
    },
  },
  {
    id: 'section-4',
    type: 'product_catalog',
    props: {
      products: [],
    },
    styles: {
      display: 'grid',
      gap: '20px',
      padding: '48px 32px',
      backgroundColor: '#ffffff',
    },
  },
  {
    id: 'section-5',
    type: 'testimonials',
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
      display: 'grid',
      gap: '24px',
      padding: '48px 32px',
      backgroundColor: '#f3f4f6',
    },
  },
  {
    id: 'section-6',
    type: 'faq',
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
      padding: '48px 32px',
      backgroundColor: '#ffffff',
    },
  },
  {
    id: 'section-7',
    type: 'footer',
    props: {
      whatsappNumber: '',
      address: '',
      copyrightText: '© 2024 Toko Kami. Semua hak dilindungi.',
    },
    styles: {
      backgroundColor: '#1f2937',
      color: '#ffffff',
      padding: '32px',
      textAlign: 'center',
    },
  },
];
