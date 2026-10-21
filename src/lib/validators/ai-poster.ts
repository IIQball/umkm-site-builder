import { z } from 'zod';
import { AI_QUALITY_TIERS, type ValidationResult } from './ai-logo';

export const POSTER_BACKGROUND_MOODS = [
  'studio_putih',
  'meja_kayu',
  'batu_alam',
] as const;

export type PosterBackgroundMood = (typeof POSTER_BACKGROUND_MOODS)[number];

export const POSTER_STYLES = [
  'vietnam_editorial',
  'thai_commercial',
  'neo_brutalism',
  'swiss_grid',
  'japanese_muji',
  'kopitiam_retro',
  'korean_pastel',
  'dark_luxury',
  'tropical_podium',
  'pop_halftone',
] as const;

export type PosterStyle = (typeof POSTER_STYLES)[number];

export const POSTER_SIZE_RATIOS = ['1:1', '2:3'] as const;

export type PosterSizeRatio = (typeof POSTER_SIZE_RATIOS)[number];

const BASE64_IMAGE_DATA_URI_PATTERN = /^data:image\/(?:png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/;
const RAW_BASE64_PATTERN = /^[A-Za-z0-9+/=]+$/;
const MAX_BASE64_LENGTH = 6 * 1024 * 1024;

export const aiPosterSchema = z.object({
  featureType: z.literal('product_poster').optional(),
  productName: z
    .string()
    .trim()
    .min(2, 'Nama produk minimal 2 karakter')
    .max(80, 'Nama produk maksimal 80 karakter')
    .optional()
    .or(z.literal('')),
  posterStyle: z
    .enum(POSTER_STYLES, {
      errorMap: () => ({ message: 'Pilihan gaya poster tidak valid' }),
    })
    .optional()
    .default('vietnam_editorial'),
  backgroundMood: z
    .string()
    .refine(
      (val) =>
        !val ||
        (POSTER_BACKGROUND_MOODS as readonly string[]).includes(val) ||
        (POSTER_STYLES as readonly string[]).includes(val),
      { message: 'Pilihan tema atau gaya latar belakang tidak valid' }
    )
    .optional(),
  sizeRatio: z.enum(POSTER_SIZE_RATIOS, {
    errorMap: () => ({ message: 'Pilihan rasio aspek poster tidak valid' }),
  }),
  titleText: z
    .string({ required_error: 'Judul poster makanan wajib diisi' })
    .trim()
    .min(2, 'Judul poster makanan minimal 2 karakter')
    .max(60, 'Judul poster makanan maksimal 60 karakter'),
  subText: z
    .string()
    .trim()
    .max(100, 'Teks pendukung maksimal 100 karakter')
    .optional()
    .or(z.literal('')),
  referenceImageBase64: z
    .string()
    .trim()
    .max(MAX_BASE64_LENGTH, 'Ukuran foto produk melebihi batas 4 MB')
    .refine(
      (val) => !val || BASE64_IMAGE_DATA_URI_PATTERN.test(val) || RAW_BASE64_PATTERN.test(val),
      {
        message: 'Format foto produk harus berupa data gambar base64 yang valid',
      }
    )
    .optional()
    .or(z.literal('')),
  qualityTier: z.enum(AI_QUALITY_TIERS).optional(),
  isTesting: z.boolean().optional(),
});

export type AiPosterInput = z.infer<typeof aiPosterSchema>;
export const posterWizardSchema = aiPosterSchema;
export type PosterWizardInput = AiPosterInput;

export function validateAiPoster(input: unknown): ValidationResult<AiPosterInput> {
  const result = aiPosterSchema.safeParse(input);
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
