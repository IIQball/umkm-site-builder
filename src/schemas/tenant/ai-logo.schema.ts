import { z } from 'zod';

export const LOGO_VISUAL_STYLES = [
  'minimalis',
  'tradisional',
  'maskot',
  'tipografi',
] as const;

export type LogoVisualStyle = (typeof LOGO_VISUAL_STYLES)[number];

export const LOGO_CONCEPT_TYPES = [
  'letter_fusion',
  'animal_character',
  'pictorial_symbol',
  'abstract_mark',
] as const;

export type LogoConceptType = (typeof LOGO_CONCEPT_TYPES)[number];

export const LOGO_LOCKUP_TYPES = [
  'icon_only',
  'vertical',
  'horizontal',
] as const;

export type LogoLockupType = (typeof LOGO_LOCKUP_TYPES)[number];

export const LOGO_FONT_FAMILIES = [
  'Poppins',
  'Plus Jakarta Sans',
  'Space Grotesk',
  'Fraunces',
  'Outfit',
  'Playfair Display',
] as const;

export type LogoFontFamily = (typeof LOGO_FONT_FAMILIES)[number];

export const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const hexColorSchema = z
  .string({ required_error: 'Kode warna hex wajib diisi' })
  .trim()
  .regex(HEX_COLOR_REGEX, 'Format kode warna hex tidak valid (contoh: #C85A32 atau #FFF)');

export const AI_QUALITY_TIERS = ['standard', 'high'] as const;
export type AiQualityTier = (typeof AI_QUALITY_TIERS)[number];

export const SLOP_TRIGGER_REGEX = /\b(3d|realistis|realistic|kartun|cartoon|pemandangan|landscape|photorealistic|hyperrealistic|cinematic)\b/gi;
export const DANGEROUS_CHAR_REGEX = /[<>{}[\]$"\\`;]/g;

export function sanitizeFocalSubject(val?: string | null): string | undefined {
  if (!val) return undefined;
  const stripped = val
    .replace(/<[^>]*>/g, '')
    .replace(DANGEROUS_CHAR_REGEX, '')
    .replace(SLOP_TRIGGER_REGEX, '')
    .trim()
    .replace(/\s+/g, ' ');
  return stripped || undefined;
}

export const aiLogoSchema = z.object({
  storeName: z
    .string({ required_error: 'Nama toko wajib diisi' })
    .trim()
    .min(2, 'Nama toko minimal 2 karakter')
    .max(100, 'Nama toko maksimal 100 karakter'),
  conceptType: z
    .enum(LOGO_CONCEPT_TYPES, {
      errorMap: () => ({ message: 'Pilihan konsep & bentuk logo tidak valid' }),
    })
    .optional(),
  visualStyle: z
    .string()
    .refine(
      (val) =>
        !val ||
        (LOGO_VISUAL_STYLES as readonly string[]).includes(val) ||
        (LOGO_CONCEPT_TYPES as readonly string[]).includes(val),
      { message: 'Pilihan gaya visual logo tidak valid' }
    )
    .optional(),
  focalSubject: z
    .string()
    .trim()
    .optional()
    .transform(sanitizeFocalSubject)
    .refine(
      (val) => !val || val.length <= 30,
      { message: 'Fokus objek maksimal 30 karakter' }
    )
    .refine(
      (val) => !val || val.trim().split(/\s+/).filter(Boolean).length <= 3,
      { message: 'Fokus objek maksimal 3 kata' }
    ),
  lockupType: z
    .enum(LOGO_LOCKUP_TYPES, {
      errorMap: () => ({ message: 'Pilihan susunan lockup logo tidak valid' }),
    })
    .optional(),
  fontFamily: z
    .enum(LOGO_FONT_FAMILIES, {
      errorMap: () => ({ message: 'Pilihan tipografi font logo tidak valid' }),
    })
    .optional()
    .default('Plus Jakarta Sans'),
  businessCategory: z.string().trim().optional(),
  logoText: z
    .string()
    .trim()
    .max(20, 'Teks logo maksimal 20 karakter')
    .refine(
      (val) => !val || val.trim().split(/\s+/).filter(Boolean).length <= 2,
      { message: 'Maksimal 2 kata singkat agar tipografi logo tetap tajam dan terbaca' }
    )
    .optional()
    .or(z.literal('')),
  colorPalette: z
    .array(hexColorSchema, {
      required_error: 'Palet warna wajib dipilih',
    })
    .min(1, 'Pilih minimal 1 warna palet')
    .max(3, 'Maksimal 3 warna dalam palet logo sesuai aturan minimalisme visual'),
  qualityTier: z.enum(AI_QUALITY_TIERS).optional(),
  isTesting: z.boolean().optional(),
});

export type AiLogoInput = z.infer<typeof aiLogoSchema>;
export const logoWizardSchema = aiLogoSchema;
export type LogoWizardInput = AiLogoInput;

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export function validateAiLogo(input: unknown): ValidationResult<AiLogoInput> {
  const result = aiLogoSchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join('.') || 'general';
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }

  return { success: false, errors };
}
