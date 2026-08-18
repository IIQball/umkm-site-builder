/**
 * Product category types and validation schemas
 */

import { z } from 'zod';

// Create category schema
export const createCategorySchema = z.object({
  name: z.string()
    .min(1, 'Nama kategori harus diisi')
    .max(100, 'Nama kategori maksimal 100 karakter'),
  description: z.string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional(),
});

// Update category schema (all fields optional)
export const updateCategorySchema = z.object({
  name: z.string()
    .min(1, 'Nama kategori harus diisi')
    .max(100, 'Nama kategori maksimal 100 karakter')
    .optional(),
  description: z.string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional(),
});

// Category ID schema
export const categoryIdSchema = z.object({
  id: z.string().min(1, 'ID kategori tidak valid'),
});

// Store ID schema
export const storeIdSchema = z.object({
  storeId: z.string().min(1, 'ID toko tidak valid'),
});

// Inferred types
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryId = z.infer<typeof categoryIdSchema>;
export type StoreId = z.infer<typeof storeIdSchema>;
