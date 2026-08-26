import { z } from 'zod';
import {
  HeaderAnnouncementPresetSchema,
  HeroPresetSchema,
  FeaturesPresetSchema,
  ProductCatalogPresetSchema,
  TestimonialsPresetSchema,
  FAQPresetSchema,
  GoogleMapsPresetSchema,
  FooterPresetSchema,
} from './presets.schema';

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

export const NodeStylesSchema = z
  .object({
    textAlign: z.string().optional(),
    textColorToken: ColorTokenSchema.optional(),
    bgColorToken: ColorTokenSchema.optional(),
    borderColorToken: ColorTokenSchema.optional(),
    fontFamily: z.string().optional(),
    fontSize: z.string().optional(),
    fontWeight: z.string().optional(),
    borderRadius: z.string().optional(),
    padding: z.string().optional(),
    boxShadow: z.string().optional(),
    marginTop: z.string().optional(),
    marginBottom: z.string().optional(),
    maxWidth: z.string().optional(),
    width: z.string().optional(),
    animation: z.string().optional(),
    hoverEffect: z.string().optional(),
  })
  .passthrough();

export const HeaderAnnouncementPropsSchema = z
  .object({
    showAnnouncement: z.boolean().optional().default(true),
    announcementText: z.string().optional().default('Selamat Datang di Toko Kami! Dapatkan Penawaran Terbaik Hari Ini'),
    announcementAlign: z.enum(['left', 'center', 'right']).optional().default('center'),
    logoType: z.enum(['image_only', 'text_only', 'image_text']).optional().default('image_text'),
    logoText: z.string().optional().default('TOKO KAMI'),
    logoImageUrl: z.string().url().or(z.literal('')).optional(),
    navLinks: z.array(z.string()).optional().default(['Beranda', 'Katalog', 'Tentang Kami', 'Kontak']),
    ctaText: z.string().optional().default('Chat WA'),
    ctaLink: z.string().optional().default('#whatsapp'),
    whatsappNumber: z.string().optional(),
    waNumber: z.string().optional(),
    layoutPreset: HeaderAnnouncementPresetSchema.optional().default('default_split'),
    nodeStyles: z.record(NodeStylesSchema).optional(),
  })
  .passthrough();

export const HeroPropsSchema = z
  .object({
    tagName: z.enum(['h1', 'h2', 'h3']).optional().default('h1'),
    title: z.string().optional().default('Selamat datang di toko kami'),
    subtitle: z.string().optional().default('Produk berkualitas dengan harga terjangkau'),
    imageUrl: z.string().url().or(z.literal('')).optional(),
    ctaText: z.string().optional().default('Lihat Katalog'),
    ctaLink: z.string().optional().default('#products'),
    badgeText: z.string().optional().default('Promo Spesial UMKM'),
    elementOrder: z.array(z.string()).optional(),
    whatsappNumber: z.string().optional(),
    waNumber: z.string().optional(),
    layoutPreset: HeroPresetSchema.optional().default('split_left_text'),
    nodeStyles: z.record(NodeStylesSchema).optional(),
  })
  .passthrough();

export const FeatureItemSchema = z.object({
  id: z.string().optional(),
  icon: z.string().optional(),
  title: z.string(),
  description: z.string(),
});

export const FeaturesPropsSchema = z
  .object({
    badge: z.string().optional(),
    title: z.string().optional().default('Keunggulan Kami'),
    subtitle: z.string().optional().default('Mengapa memilih produk dan layanan dari toko kami?'),
    columns: z.number().int().min(1).max(4).optional().default(3),
    features: z.array(FeatureItemSchema).optional(),
    imageUrl: z.string().optional(),
    layoutPreset: FeaturesPresetSchema.optional().default('grid_3_cards'),
    nodeStyles: z.record(NodeStylesSchema).optional(),
  })
  .passthrough();

export const ProductItemSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  price: z.number(),
  image: z.string().optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  badge: z.string().optional(),
});

export const ProductCatalogPropsSchema = z
  .object({
    badge: z.string().optional(),
    title: z.string().optional().default('Katalog Produk'),
    subtitle: z.string().optional().default('Pilihan produk terbaik untuk Anda'),
    columnsDesktop: z.union([z.number(), z.string()]).optional().default(3),
    columnsMobile: z.union([z.number(), z.string()]).optional().default(1),
    cardBorderRadius: z.string().optional().default('16px'),
    cardPreset: z.string().optional().default('minimal_flat'),
    products: z.array(ProductItemSchema).optional(),
    whatsappNumber: z.string().optional(),
    waNumber: z.string().optional(),
    layoutPreset: ProductCatalogPresetSchema.optional().default('grid_standard'),
    nodeStyles: z.record(NodeStylesSchema).optional(),
  })
  .passthrough();

export const TestimonialItemSchema = z.object({
  id: z.string().optional(),
  customerName: z.string(),
  avatar: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  comment: z.string(),
});

export const TestimonialsPropsSchema = z
  .object({
    badge: z.string().optional(),
    title: z.string().optional().default('Kata Pelanggan'),
    subtitle: z.string().optional().default('Pengalaman nyata pelanggan berbelanja di toko kami'),
    testimonials: z.array(TestimonialItemSchema).optional(),
    layoutPreset: TestimonialsPresetSchema.optional().default('masonry_grid'),
    nodeStyles: z.record(NodeStylesSchema).optional(),
  })
  .passthrough();

export const FAQItemSchema = z.object({
  id: z.string().optional(),
  question: z.string(),
  answer: z.string(),
});

export const FAQPropsSchema = z
  .object({
    badge: z.string().optional(),
    title: z.string().optional().default('Pertanyaan yang Sering Diajukan'),
    subtitle: z.string().optional().default('Temukan jawaban cepat seputar produk dan layanan kami'),
    faqs: z.array(FAQItemSchema).optional(),
    whatsappNumber: z.string().optional(),
    waNumber: z.string().optional(),
    layoutPreset: FAQPresetSchema.optional().default('accordion_single_col'),
    nodeStyles: z.record(NodeStylesSchema).optional(),
  })
  .passthrough();

export const GoogleMapsPropsSchema = z
  .object({
    title: z.string().optional().default('Lokasi Toko'),
    subtitle: z.string().optional().default('Kunjungi outlet toko kami langsung'),
    address: z.string().optional().default('Jl. Raya Jember No.KM 13, Labanasem, Kab. Banyuwangi, Jawa Timur 68461'),
    markerTitle: z.string().optional().default('Toko Kami'),
    zoom: z.number().int().min(1).max(20).optional().default(15),
    googleMapsUrl: z.string().optional(),
    mapsUrl: z.string().optional(),
    layoutPreset: GoogleMapsPresetSchema.optional().default('fullwidth_map'),
    nodeStyles: z.record(NodeStylesSchema).optional(),
  })
  .passthrough();

export const FooterPropsSchema = z
  .object({
    logoText: z.string().optional().default('TOKO KAMI'),
    tagline: z.string().optional().default('Pusat belanja produk UMKM terpercaya'),
    address: z.string().optional().default('Jl. Raya Jember No.KM 13, Kab. Banyuwangi'),
    whatsappNumber: z.string().optional().default('628123456789'),
    waNumber: z.string().optional().default('628123456789'),
    copyrightText: z.string().optional().default('© 2026 Toko Kami. Semua hak dilindungi.'),
    layoutPreset: FooterPresetSchema.optional().default('multi_column'),
    nodeStyles: z.record(NodeStylesSchema).optional(),
  })
  .passthrough();
