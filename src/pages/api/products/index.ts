import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/client';
import { products, stores } from '../../../db/schema';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { z } from 'zod';
import { ProductVariantsSchema } from '../../../schemas/product-variant.schema';
import { jsonSuccess, jsonError } from '../../../lib/utils/api-handler';
import { canManageStore, type AuthenticatedUser } from '../../../lib/auth';

const productInput = z.object({
  storeId: z.string().min(1),
  categoryId: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().min(2),
  basePrice: z.number().min(0),
  variants: ProductVariantsSchema.default([]),
  description: z.string().optional(),
  imageUrls: z.array(z.string().url()).default([]),
  isAvailable: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const storeId = url.searchParams.get('storeId');

    if (!storeId) {
      return jsonError('storeId is required', 400);
    }

    const query = db.select().from(products).where(
      and(eq(products.storeId, storeId), isNull(products.deletedAt))
    ).orderBy(desc(products.createdAt));
    const allProducts = await query;

    return jsonSuccess(allProducts, 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonError(message, 500);
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Authenticate
    if (!locals.user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined);
    }

    // 2. Parse input — accept JSON body with pre-uploaded imageUrls
    const body = await request.json();
    const result = productInput.safeParse(body);

    if (!result.success) {
      return jsonError('Validasi gagal', 400, result.error.issues, 'VALIDATION_ERROR');
    }

    // 3. Authorize — check store access via canManageStore
    const [store] = await db.select().from(stores).where(eq(stores.id, result.data.storeId)).limit(1);
    if (!store) {
      return jsonError('Toko tidak ditemukan', 404, undefined, 'NOT_FOUND');
    }

    if (!canManageStore(locals.user as AuthenticatedUser, store)) {
      return jsonError('Anda tidak memiliki izin mengelola produk toko ini', 403, undefined, 'FORBIDDEN');
    }

    // 4. Insert product with pre-uploaded image URLs
    const newProductData = {
      ...result.data,
      id: crypto.randomUUID(),
    };

    const inserted = await db.insert(products).values(newProductData).returning();

    await db.update(stores)
      .set({ lastEditedBy: (locals.user as AuthenticatedUser).id, updatedAt: new Date() })
      .where(eq(stores.id, store.id));

    return jsonSuccess(inserted[0], 201);
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('[PRODUCT] create error:', error instanceof Error ? error.message : error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return jsonError(message, 500, undefined);
  }
};

