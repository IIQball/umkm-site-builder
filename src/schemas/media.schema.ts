import { z } from 'zod';

/**
 * Allowed upload folders — maps to Cloudinary folder structure.
 * Each folder is prefixed with 'umkm-builder/' in the signature.
 */
const ALLOWED_FOLDERS = ['products', 'templates', 'stores'] as const;

/**
 * Input schema for POST /api/media/sign
 * Generates Cloudinary signed upload params for client-side direct upload.
 */
export const MediaSignInput = z.object({
  folder: z.enum(ALLOWED_FOLDERS, {
    errorMap: () => ({ message: 'Folder harus salah satu: products, templates, stores' }),
  }),
});

export type MediaSignInput = z.infer<typeof MediaSignInput>;

/**
 * Cloudinary upload response shape — validated on client after direct upload.
 * Used to extract URL and publicId from Cloudinary response.
 */
export const CloudinaryUploadResult = z.object({
  secure_url: z.string().url(),
  public_id: z.string().min(1),
  version: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
});

export type CloudinaryUploadResult = z.infer<typeof CloudinaryUploadResult>;

/**
 * Variant transformation strings for responsive images.
 * Applied via Cloudinary URL transformation (not eager transforms).
 */
export const CLOUDINARY_VARIANTS = {
  thumbnail: 'w_200,h_200,c_fill,f_webp',
  card: 'w_400,h_300,c_fill,f_webp',
  hero: 'w_1200,h_600,c_fill,f_webp',
  original: 'f_webp',
} as const;

export type CloudinaryVariant = keyof typeof CLOUDINARY_VARIANTS;
