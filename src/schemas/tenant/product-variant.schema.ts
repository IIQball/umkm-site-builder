import { z } from 'zod';

/**
 * A single variant option within a group.
 * Example: { name: "L", priceAdjustment: 5000, isAvailable: true }
 * Final price = product.basePrice + priceAdjustment
 */
export const VariantOptionSchema = z.object({
  name: z.string().min(1, 'Nama opsi wajib diisi').max(100, 'Nama opsi maksimal 100 karakter'),
  priceAdjustment: z.number().default(0),
  isAvailable: z.boolean().default(true),
});

/**
 * A variant group containing multiple options.
 * Example: { groupName: "Ukuran", options: [{ name: "S", ... }, { name: "L", ... }] }
 */
export const VariantGroupSchema = z.object({
  groupName: z.string().min(1, 'Nama grup wajib diisi').max(50, 'Nama grup maksimal 50 karakter'),
  options: z.array(VariantOptionSchema).min(1, 'Minimal 1 opsi per grup').max(20, 'Maksimal 20 opsi per grup'),
});

/**
 * Full product variants array. Max 5 groups per product.
 */
export const ProductVariantsSchema = z.array(VariantGroupSchema).max(5, 'Maksimal 5 grup varian per produk');

export type VariantOption = z.infer<typeof VariantOptionSchema>;
export type VariantGroup = z.infer<typeof VariantGroupSchema>;
export type ProductVariants = z.infer<typeof ProductVariantsSchema>;
