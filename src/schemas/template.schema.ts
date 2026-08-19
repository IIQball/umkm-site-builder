import { z } from 'zod';

export const TemplateStylesSchema = z.object({
  display: z.enum(['flex', 'grid']).optional(),
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
  props: z.record(z.any()).optional(),
  styles: TemplateStylesSchema.optional(),
});

export const TemplateConfigSchema = z.object({
  theme: z.object({
    primaryColor: z.string().optional(),
    fontFamily: z.string().optional(),
  }).optional(),
  sections: z.array(TemplateSectionSchema),
});

export const TemplateDraftCreateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  price: z.number().nonnegative('Price must be non-negative').optional().default(0),
  description: z.string().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().or(z.literal('')).optional(),
});

export const TemplateDraftUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  description: z.string().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().or(z.literal('')).optional(),
  config: TemplateConfigSchema.optional(),
});

export const TemplateDraftSubmitSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  price: z.number().nonnegative('Price must be non-negative'),
  description: z.string().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().or(z.literal('')).optional(),
  config: TemplateConfigSchema,
});

export type TemplateStyles = z.infer<typeof TemplateStylesSchema>;
export type TemplateSection = z.infer<typeof TemplateSectionSchema>;
export type TemplateConfig = z.infer<typeof TemplateConfigSchema>;
export type TemplateDraftCreate = z.infer<typeof TemplateDraftCreateSchema>;
export type TemplateDraftUpdate = z.infer<typeof TemplateDraftUpdateSchema>;
export type TemplateDraftSubmit = z.infer<typeof TemplateDraftSubmitSchema>;

export const DEFAULT_TEMPLATE_SECTIONS: TemplateSection[] = [
  {
    id: 'section-1',
    type: 'header_announcement',
    props: {
      announcementText: 'Diskon 20% khusus hari ini',
      navLinks: ['Beranda', 'Produk', 'Tentang', 'Kontak'],
    },
    styles: {
      backgroundColor: '#f3f4f6',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
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
