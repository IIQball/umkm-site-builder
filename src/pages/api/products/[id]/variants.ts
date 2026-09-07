import type { APIRoute } from 'astro';
import { db } from '../../../../lib/db/client';
import { products, stores } from '../../../../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { ProductVariantsSchema } from '../../../../schemas/product-variant.schema';
import { jsonSuccess, jsonError } from '../../../../lib/utils/api-handler';

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const productId = params.id;
    if (!productId) {
      return jsonError('Product ID wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    const [product] = await db.select()
      .from(products)
      .where(and(eq(products.id, productId), isNull(products.deletedAt)));

    if (!product) {
      return jsonError('Produk tidak ditemukan', 404, undefined, 'NOT_FOUND');
    }

    // Public access allowed for available products; ownership required for unavailable ones
    if (!product.isAvailable) {
      if (!locals.user) {
        return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
      }

      const [store] = await db.select({ userId: stores.userId })
        .from(stores)
        .where(eq(stores.id, product.storeId));

      if (store?.userId !== locals.user.id && locals.user.role !== 'superadmin') {
        return jsonError('Akses ditolak', 403, undefined, 'FORBIDDEN');
      }
    }

    const variants = Array.isArray(product.variants) ? product.variants : [];

    return jsonSuccess({ productId, variants }, 200);
  } catch (error: unknown) {
    console.error('[PRODUCT] get variants error:', error instanceof Error ? error.message : error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return jsonError(message, 500, undefined);
  }
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    // 1. Authenticate
    if (!locals.user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    // 2. Authorize — tenant or superadmin
    if (locals.user.role !== 'tenant' && locals.user.role !== 'superadmin') {
      return jsonError('Hanya tenant yang dapat mengubah varian produk', 403, undefined, 'FORBIDDEN');
    }

    const productId = params.id;
    if (!productId) {
      return jsonError('Product ID wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    // 3. Ownership — product must belong to user's store
    const [product] = await db.select()
      .from(products)
      .where(and(eq(products.id, productId), isNull(products.deletedAt)));

    if (!product) {
      return jsonError('Produk tidak ditemukan', 404, undefined, 'NOT_FOUND');
    }

    const [store] = await db.select({ userId: stores.userId })
      .from(stores)
      .where(eq(stores.id, product.storeId));

    if (!store || (store.userId !== locals.user.id && locals.user.role !== 'superadmin')) {
      return jsonError('Akses ditolak', 403, undefined, 'FORBIDDEN');
    }

    // 4. Validate
    const body = await request.json();
    const result = ProductVariantsSchema.safeParse(body.variants ?? body);

    if (!result.success) {
      return jsonError('Validasi varian gagal', 400, result.error.issues, 'VALIDATION_ERROR');
    }

    // 5. Act — replace all variants
    const [updated] = await db.update(products)
      .set({ variants: result.data, updatedAt: new Date() })
      .where(eq(products.id, productId))
      .returning();

    return jsonSuccess({ productId, variants: updated.variants }, 200);
  } catch (error: unknown) {
    console.error('[PRODUCT] update variants error:', error instanceof Error ? error.message : error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return jsonError(message, 500, undefined);
  }
};
