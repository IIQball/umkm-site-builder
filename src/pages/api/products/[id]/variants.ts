import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { products, stores } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { ProductVariantsSchema } from '@/schemas/tenant/product-variant.schema';
import { handleApiRoute, jsonSuccess, jsonError } from '@/lib/utils/api-handler';
import { canManageStore, type AuthenticatedUser } from '@/lib/auth';

export const GET: APIRoute = async ({ params, locals }) => {
  return handleApiRoute(async () => {
    const productId = params.id;
    if (!productId) {
      return jsonError('Product ID wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, productId), isNull(products.deletedAt)));

    if (!product) {
      return jsonError('Produk tidak ditemukan', 404, undefined, 'NOT_FOUND');
    }

    if (!product.isAvailable) {
      if (!locals.user) {
        return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
      }

      const [store] = await db
        .select({ userId: stores.userId, registeredBy: stores.registeredBy })
        .from(stores)
        .where(eq(stores.id, product.storeId));

      if (!store || !canManageStore(locals.user as AuthenticatedUser, store)) {
        return jsonError('Akses ditolak', 403, undefined, 'FORBIDDEN');
      }
    }

    const variants = Array.isArray(product.variants) ? product.variants : [];

    return jsonSuccess({ productId, variants }, 200);
  });
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  return handleApiRoute(async () => {
    if (!locals.user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    const productId = params.id;
    if (!productId) {
      return jsonError('Product ID wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, productId), isNull(products.deletedAt)));

    if (!product) {
      return jsonError('Produk tidak ditemukan', 404, undefined, 'NOT_FOUND');
    }

    const [store] = await db
      .select({ id: stores.id, userId: stores.userId, registeredBy: stores.registeredBy })
      .from(stores)
      .where(eq(stores.id, product.storeId));

    if (!store || !canManageStore(locals.user as AuthenticatedUser, store)) {
      return jsonError('Anda tidak memiliki izin mengelola produk toko ini', 403, undefined, 'FORBIDDEN');
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return jsonError('Format data JSON tidak valid', 400, undefined, 'INVALID_JSON');
    }

    const variantPayload =
      rawBody && typeof rawBody === 'object' && !Array.isArray(rawBody) && 'variants' in rawBody
        ? (rawBody as { variants?: unknown }).variants
        : rawBody;
    const result = ProductVariantsSchema.safeParse(variantPayload);

    if (!result.success) {
      return jsonError('Validasi varian gagal', 400, result.error.issues, 'VALIDATION_ERROR');
    }

    const [updated] = await db
      .update(products)
      .set({ variants: result.data, updatedAt: new Date() })
      .where(eq(products.id, productId))
      .returning();

    await db
      .update(stores)
      .set({ lastEditedBy: (locals.user as AuthenticatedUser).id, updatedAt: new Date() })
      .where(eq(stores.id, store.id));

    return jsonSuccess({ productId, variants: updated.variants }, 200, 'Varian produk diperbarui');
  });
};
