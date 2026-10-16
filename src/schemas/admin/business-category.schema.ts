import { z } from 'zod';

export const BusinessCategoryCreateSchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi').max(100),
  slug: z
    .string()
    .min(1, 'Slug kategori wajib diisi')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug harus berupa huruf kecil, angka, atau tanda strip (-)'),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
});

export const BusinessCategoryUpdateSchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi').max(100).optional(),
  slug: z
    .string()
    .min(1, 'Slug kategori wajib diisi')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug harus berupa huruf kecil, angka, atau tanda strip (-)')
    .optional(),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
});

export type BusinessCategoryCreateInput = z.infer<typeof BusinessCategoryCreateSchema>;
export type BusinessCategoryUpdateInput = z.infer<typeof BusinessCategoryUpdateSchema>;
