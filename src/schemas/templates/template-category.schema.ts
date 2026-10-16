import { z } from 'zod';

export const TemplateCategoryCreateSchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi').max(100),
  slug: z
    .string()
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug harus berupa huruf kecil, angka, atau tanda strip (-)')
    .optional()
    .nullable()
    .or(z.literal('')),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
});

export const TemplateCategoryUpdateSchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi').max(100).optional(),
  slug: z
    .string()
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug harus berupa huruf kecil, angka, atau tanda strip (-)')
    .optional()
    .nullable()
    .or(z.literal('')),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
});

export type TemplateCategoryCreateInput = z.infer<typeof TemplateCategoryCreateSchema>;
export type TemplateCategoryUpdateInput = z.infer<typeof TemplateCategoryUpdateSchema>;
