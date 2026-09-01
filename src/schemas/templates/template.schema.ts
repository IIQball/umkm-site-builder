/**
 * Template Builder Validation Schemas (Zod) - Templates Domain
 */

import { z } from 'zod';
import { ColorTokenSchema } from './template.tokens';

// Re-export all tokens, presets, & defaults for 100% backwards compatibility
export * from './template.tokens';
export * from './template.presets';
export * from './template.defaults';
import { CURRENT_SCHEMA_VERSION } from './template.defaults';

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
  schemaVersion: z.number().int().positive().optional().default(CURRENT_SCHEMA_VERSION),
  theme: TemplateThemeSchema,
  sections: z.array(TemplateSectionSchema),
});

export const TemplateDraftCreateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  price: z.coerce.number().int().nonnegative('Price must be non-negative').optional().default(0),
  description: z.string().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().or(z.literal('')).optional(),
  categoryId: z.string().nullable().optional(),
});

export const TemplateDraftUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.coerce.number().int().nonnegative().optional(),
  description: z.string().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().or(z.literal('')).optional(),
  categoryId: z.string().nullable().optional(),
  config: TemplateConfigSchema.optional(),
});

export const TemplateDraftSubmitSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  price: z.coerce.number().int().nonnegative('Price must be non-negative'),
  description: z.string().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().or(z.literal('')).optional(),
  categoryId: z.string().nullable().optional(),
  config: TemplateConfigSchema,
});

export const SubmitReviewSchema = z.object({
  templateId: z.string().min(1, 'templateId is required'),
});

export type TemplateStyles = z.infer<typeof TemplateStylesSchema>;
export type TemplateSection = z.infer<typeof TemplateSectionSchema>;
export type TemplateTheme = NonNullable<z.infer<typeof TemplateThemeSchema>>;
export type TemplateConfig = z.infer<typeof TemplateConfigSchema>;
export type TemplateDraftCreate = z.infer<typeof TemplateDraftCreateSchema>;
export type TemplateDraftUpdate = z.infer<typeof TemplateDraftUpdateSchema>;
export type TemplateDraftSubmit = z.infer<typeof TemplateDraftSubmitSchema>;
export type SubmitReview = z.infer<typeof SubmitReviewSchema>;
