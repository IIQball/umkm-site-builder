import { z } from 'zod';
import { AI_QUALITY_TIERS, type ValidationResult } from './ai-logo';

export const PACKAGING_TYPES = [
  'standing_pouch',
  'aluminium_pouch',
  'box_kraft',
  'paper_bowl',
] as const;

export type PackagingType = (typeof PACKAGING_TYPES)[number];

export const MOCKUP_PRESENTATION_STYLES = [
  'clean_studio',
  'monolith_podium',
  'vietnam_tabletop',
  'eco_craft',
  'dark_spotlight',
  'floating_hero',
] as const;

export type MockupPresentationStyle = (typeof MOCKUP_PRESENTATION_STYLES)[number];

// Pola data URI base64 atau string base64 murni
const BASE64_IMAGE_DATA_URI_PATTERN = /^data:image\/(?:png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/;
const RAW_BASE64_PATTERN = /^[A-Za-z0-9+/=]+$/;

// Batas panjang string base64 (~4.5MB raw binary)
const MAX_BASE64_LENGTH = 6 * 1024 * 1024;

export const aiPackagingSchema = z.object({
  packagingType: z.enum(PACKAGING_TYPES, {
    errorMap: () => ({ message: 'Pilihan jenis kemasan tidak valid' }),
  }),
  presentationStyle: z
    .enum(MOCKUP_PRESENTATION_STYLES, {
      errorMap: () => ({ message: 'Pilihan gaya presentasi mockup tidak valid' }),
    })
    .optional()
    .default('clean_studio'),
  productLabel: z
    .string({ required_error: 'Label kemasan produk wajib diisi' })
    .trim()
    .min(2, 'Label kemasan minimal 2 karakter')
    .max(100, 'Label kemasan maksimal 100 karakter'),
  referenceImageBase64: z
    .string({ required_error: 'Foto referensi produk wajib diunggah' })
    .trim()
    .min(10, 'Foto referensi produk tidak boleh kosong')
    .max(MAX_BASE64_LENGTH, 'Ukuran foto referensi melebihi batas 4 MB')
    .refine(
      (val) => BASE64_IMAGE_DATA_URI_PATTERN.test(val) || RAW_BASE64_PATTERN.test(val),
      {
        message: 'Format foto referensi harus berupa data gambar base64 yang valid',
      }
    ),
  qualityTier: z.enum(AI_QUALITY_TIERS).optional(),
  isTesting: z.boolean().optional(),
});

export type AiPackagingInput = z.infer<typeof aiPackagingSchema>;
export const packagingWizardSchema = aiPackagingSchema;
export type PackagingWizardInput = AiPackagingInput;

export function validateAiPackaging(
  input: unknown
): ValidationResult<AiPackagingInput> {
  const result = aiPackagingSchema.safeParse(input);
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
