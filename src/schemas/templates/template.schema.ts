/**
 * Template Builder Validation Schemas (Zod) - Templates Domain
 */

import { z } from 'zod';

export const ColorTokenSchema = z.enum([
  'primary',
  'secondary',
  'accent',
  'background',
  'surface',
  'text_primary',
  'text_muted',
  'textPrimary',
  'textMuted',
  'transparent',
]);

export type ColorToken = z.infer<typeof ColorTokenSchema>;

export const TypographyTokenSchema = z.enum(['h1', 'h2', 'h3', 'body', 'caption']);
export type TypographyToken = z.infer<typeof TypographyTokenSchema>;

export const SpacingStepSchema = z.union([
  z.literal(0),
  z.literal(8),
  z.literal(16),
  z.literal(24),
  z.literal(32),
  z.literal(40),
  z.literal(48),
  z.literal(56),
  z.literal(64),
  z.literal(80),
  z.literal(96),
]);
export type SpacingStep = z.infer<typeof SpacingStepSchema>;

export const ButtonHeightSchema = z.union([
  z.literal(32),
  z.literal(40),
  z.literal(48),
  z.literal(56),
]);
export type ButtonHeight = z.infer<typeof ButtonHeightSchema>;

export const EffectShadowSchema = z.enum(['none', 'sm', 'md', 'lg']);
export type EffectShadow = z.infer<typeof EffectShadowSchema>;

export const HeaderAnnouncementPresetSchema = z.enum(['default_split', 'centered_stacked', 'compact_inline']);
export type HeaderAnnouncementPreset = z.infer<typeof HeaderAnnouncementPresetSchema>;

export const HeroPresetSchema = z.enum(['split_left_text', 'split_right_text', 'centered_minimal', 'full_banner_overlay']);
export type HeroPreset = z.infer<typeof HeroPresetSchema>;

export const FeaturesPresetSchema = z.enum(['grid_3_cards', 'horizontal_list', 'banner_inline_bar']);
export type FeaturesPreset = z.infer<typeof FeaturesPresetSchema>;

export const ProductCatalogPresetSchema = z.enum(['grid_standard', 'carousel_scroll', 'list_compact']);
export type ProductCatalogPreset = z.infer<typeof ProductCatalogPresetSchema>;

export const TestimonialsPresetSchema = z.enum(['masonry_grid', 'single_spotlight', 'chat_bubble_flow']);
export type TestimonialsPreset = z.infer<typeof TestimonialsPresetSchema>;

export const FAQPresetSchema = z.enum(['accordion_single_col', 'split_faq_sidebar', 'grid_2_col_cards']);
export type FAQPreset = z.infer<typeof FAQPresetSchema>;

export const GoogleMapsPresetSchema = z.enum(['fullwidth_map', 'split_map_info', 'compact_boxed']);
export type GoogleMapsPreset = z.infer<typeof GoogleMapsPresetSchema>;

export const FooterPresetSchema = z.enum(['multi_column', 'centered_simple', 'cta_focused']);
export type FooterPreset = z.infer<typeof FooterPresetSchema>;

export const SectionLayoutPresetSchema = z.union([
  HeaderAnnouncementPresetSchema,
  HeroPresetSchema,
  FeaturesPresetSchema,
  ProductCatalogPresetSchema,
  TestimonialsPresetSchema,
  FAQPresetSchema,
  GoogleMapsPresetSchema,
  FooterPresetSchema,
]);
export type SectionLayoutPreset = z.infer<typeof SectionLayoutPresetSchema>;

export const TemplateStylesSchema = z.object({
  display: z.enum(['flex', 'grid', 'block']).or(z.string()).optional(),
  alignItems: z.string().optional(),
  justifyContent: z.string().optional(),
  gap: z.string().optional(),
  padding: z.string().optional(),
  margin: z.string().optional(),
  fontSize: z.string().optional(),
  fontWeight: z.string().optional(),
  textColorToken: ColorTokenSchema.optional(),
  bgColorToken: ColorTokenSchema.optional(),
  borderColorToken: ColorTokenSchema.optional(),
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
    'google_maps',
    'footer',
  ]),
  layoutPreset: z.string().optional(),
  props: z.record(z.unknown()).optional(),
  styles: TemplateStylesSchema.optional(),
});

export const ThemeColorsSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
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

export const SubmitReviewSchema = z.object({
  templateId: z.string().min(1, 'templateId is required'),
});

export type SubmitReview = z.infer<typeof SubmitReviewSchema>;

