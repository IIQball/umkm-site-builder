import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { products, stores } from '@/db/schema';
import { eq, and, isNull, desc, sql } from 'drizzle-orm';
import { z } from 'zod';
import { ProductVariantsSchema } from '@/schemas/tenant/product-variant.schema';
import { handleApiRoute, jsonSuccess, jsonError, parseJsonBody } from '@/lib/utils/api-handler';
import { canManageStore, type AuthenticatedUser } from '@/lib/auth';
import { logActivity } from '@/services/audit.service';

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
  return handleApiRoute(async () => {
    const url = new URL(request.url);
    const storeId = url.searchParams.get('storeId');

    if (!storeId) {
      return jsonError('storeId wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    const allProducts = await db
      .select()
      .from(products)
      .where(and(eq(products.storeId, storeId), isNull(products.deletedAt)))
      .orderBy(desc(products.createdAt));

    return jsonSuccess(allProducts, 200);
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  return handleApiRoute(async () => {
    if (!locals.user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    const body = await parseJsonBody(request);
    const result = productInput.safeParse(body);

    if (!result.success) {
      return jsonError('Validasi gagal', 400, result.error.issues, 'VALIDATION_ERROR');
    }

    const [store] = await db
      .select()
      .from(stores)
      .where(and(eq(stores.id, result.data.storeId), isNull(stores.deletedAt)))
      .limit(1);
    if (!store) {
      return jsonError('Toko tidak ditemukan', 404, undefined, 'NOT_FOUND');
    }

    if (!canManageStore(locals.user as AuthenticatedUser, store)) {
      return jsonError('Anda tidak memiliki izin mengelola produk toko ini', 403, undefined, 'FORBIDDEN');
    }

    const [productCount] = await db
      .select({ count: sql`count(*)` })
      .from(products)
      .where(and(eq(products.storeId, result.data.storeId), isNull(products.deletedAt)));

    if (Number(productCount.count) >= store.maxProducts) {
      return jsonError(
        `Maksimal ${store.maxProducts} produk. Anda telah mencapai batas kuota Anda. Silakan ajukan peningkatan kuota.`,
        402,
        undefined,
        'PAYMENT_REQUIRED'
      );
    }

    const newProductData = {
      ...result.data,
      id: crypto.randomUUID(),
    };

    const inserted = await db.insert(products).values(newProductData).returning();

    await db
      .update(stores)
      .set({ lastEditedBy: (locals.user as AuthenticatedUser).id, updatedAt: new Date() })
      .where(eq(stores.id, store.id));

    await logActivity({
      userId: (locals.user as AuthenticatedUser).id,
      storeId: store.id,
      action: 'Create Product',
      details: {
        productId: inserted[0].id,
        name: inserted[0].name,
        basePrice: inserted[0].basePrice,
      },
    });

    return jsonSuccess(inserted[0], 201, 'Produk berhasil dibuat');
  });
};
