import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/client';
import { products } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { ProductVariantsSchema } from '../../../schemas/product-variant.schema';

import { deleteFromCloudinary } from '../../../lib/cloudinary';
import { jsonSuccess, jsonError } from '../../../lib/utils/api-handler';

const productUpdateInput = z.object({
  storeId: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  basePrice: z.number().min(0).optional(),
  variants: ProductVariantsSchema.optional(),
  description: z.string().optional(),
  imageUrls: z.array(z.string().url()).optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    // 1. Authenticate
    if (!locals.user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }
    
    // 2. Authorize
    if (locals.user.role !== 'tenant' && locals.user.role !== 'superadmin') {
      return jsonError('Hanya tenant yang dapat mengubah produk', 403, undefined, 'FORBIDDEN');
    }

    const id = params.id;
    if (!id) throw new Error('ID is required');

    const body = await request.json();
    const result = productUpdateInput.safeParse(body);

    if (!result.success) {
      return jsonError('Validation failed', 400, result.error.issues, 'VALIDATION_ERROR');
    }

    const existingProduct = await db.select().from(products).where(eq(products.id, id));
    if (existingProduct.length === 0) {
      return jsonError('Product not found', 404, undefined, 'NOT_FOUND');
    }

    const updated = await db.update(products)
      .set({ ...result.data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    return jsonSuccess(updated[0], 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonError(message, 500);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    if (!id) throw new Error('ID is required');

    const existingProduct = await db.select().from(products).where(eq(products.id, id));
    if (existingProduct.length === 0) {
      return jsonError('Product not found', 404, undefined);
    }

    await db.update(products)
      .set({ deletedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    // delete image if exists (even on soft delete, per requirements)
    const imageUrls = (existingProduct[0].imageUrls || []) as Array<{ publicId?: string; url?: string }>;
    if (imageUrls && imageUrls.length > 0 && imageUrls[0].publicId) {
      await deleteFromCloudinary(imageUrls[0].publicId);
    }

    return jsonSuccess({ id }, 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonError(message, 500);
  }
};
