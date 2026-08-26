/**
 * Template Builder Validation Schemas (Zod) - Templates Domain
 */

import { z } from 'zod';
import {
  HeaderAnnouncementPropsSchema,
  HeroPropsSchema,
  FeaturesPropsSchema,
  ProductCatalogPropsSchema,
  TestimonialsPropsSchema,
  FAQPropsSchema,
  GoogleMapsPropsSchema,
  FooterPropsSchema,
} from './props.schema';
import { TemplateThemeSchema } from './theme.schema';

export * from './presets.schema';
export * from './props.schema';
export * from './theme.schema';

export const SectionTypeSchema = z.enum([
  'header_announcement',
  'hero',
  'features',
  'product_catalog',
  'testimonials',
  'faq',
  'google_maps',
  'footer',
]);

export type SectionType = z.infer<typeof SectionTypeSchema>;

export const SectionStylesSchema = z
  .object({
    backgroundColor: z.string().optional(),
    bgColorToken: z.string().optional(),
    color: z.string().optional(),
    textColorToken: z.string().optional(),
    padding: z.string().optional(),
    paddingTop: z.union([z.number(), z.string()]).optional(),
    paddingBottom: z.union([z.number(), z.string()]).optional(),
    margin: z.string().optional(),
    marginTop: z.union([z.number(), z.string()]).optional(),
    marginBottom: z.union([z.number(), z.string()]).optional(),
    layoutPreset: z.string().optional(),
    columnsDesktop: z.union([z.number(), z.string()]).optional(),
    columnsTablet: z.union([z.number(), z.string()]).optional(),
    columnsMobile: z.union([z.number(), z.string()]).optional(),
    minHeight: z.string().optional(),
  })
  .passthrough();

export type SectionStyles = z.infer<typeof SectionStylesSchema>;

export const TemplateSectionSchema = z.object({
  id: z.string(),
  type: SectionTypeSchema,
  layoutPreset: z.string().optional(),
  props: z
    .union([
      HeaderAnnouncementPropsSchema,
      HeroPropsSchema,
      FeaturesPropsSchema,
      ProductCatalogPropsSchema,
      TestimonialsPropsSchema,
      FAQPropsSchema,
      GoogleMapsPropsSchema,
      FooterPropsSchema,
      z.record(z.unknown()),
    ])
    .optional(),
  styles: SectionStylesSchema.optional(),
});

export type TemplateSection = z.infer<typeof TemplateSectionSchema>;

export const TemplateConfigSchema = z.object({
  theme: TemplateThemeSchema.optional(),
  sections: z.array(TemplateSectionSchema),
});

export type TemplateConfig = z.infer<typeof TemplateConfigSchema>;

export const TemplateDraftCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  price: z.number().int().nonnegative().optional().default(0),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  config: TemplateConfigSchema.optional(),
});

export const TemplateDraftUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  price: z.number().int().nonnegative().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  config: TemplateConfigSchema.optional(),
});

export const TemplateDraftSubmitSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  price: z.number().int().nonnegative(),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  config: TemplateConfigSchema,
});

export const SubmitReviewSchema = z.object({
  templateId: z.string().min(1, 'templateId is required'),
});

export const TemplateBatchDeleteSchema = z.object({
  templateIds: z.array(z.string().min(1)).min(1, 'templateIds cannot be empty'),
});
