import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { products, stores } from '@/db/schema';
import { asc, desc, eq, and, count, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { slugify } from '@/lib/utils';
import { handleApiRoute, jsonError, jsonSuccess, parseJsonBody } from '@/lib/utils/api-handler';
import { canManageStore, type AuthenticatedUser } from '@/lib/auth';
import { ProductVariantsSchema } from '@/schemas/tenant/product-variant.schema';
import { logActivity } from '@/services/audit.service';
import { touchStoreLastEdited } from '@/services/stores/store.service';

const createStoreProductSchema = z.object({
  name: z.string().trim().min(1, 'Nama produk wajib diisi').max(150),
  categoryId: z.string().trim().min(1, 'Kategori produk wajib dipilih'),
  basePrice: z.number().min(0, 'Harga dasar tidak valid'),
  description: z.string().max(2000).optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  imageUrls: z.array(z.string().url()).optional(),
  variants: ProductVariantsSchema.optional(),
});

export const GET: APIRoute = async ({ params, request }) => {
  return handleApiRoute(async () => {
    const storeId = params.storeId;

    if (!storeId) {
      return jsonError('storeId wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    const url = new URL(request.url);
    const categoryId = url.searchParams.get('categoryId');
    const pageParam = url.searchParams.get('page');
    const limitParam = url.searchParams.get('limit');

    const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;
    const limit = limitParam ? Math.min(100, Math.max(1, parseInt(limitParam, 10) || 12)) : 12;
    const offset = (page - 1) * limit;

    const baseConditions = [
      eq(products.storeId, storeId),
      isNull(products.deletedAt),
      eq(products.isAvailable, true),
    ];

    if (categoryId && categoryId !== 'all') {
      baseConditions.push(eq(products.categoryId, categoryId));
    }

    const whereClause = and(...baseConditions);

    const [{ total }] = await db.select({ total: count() }).from(products).where(whereClause);

    const records = await db
      .select()
      .from(products)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(asc(products.sortOrder), desc(products.createdAt));

    const mappedItems = records.map((p) => ({
      ...p,
      price: p.basePrice,
      imageUrl: Array.isArray(p.imageUrls) && p.imageUrls.length > 0 ? p.imageUrls[0] : '',
      variants: Array.isArray(p.variants) ? p.variants : [],
    }));

    const storeRecord = await db
      .select({ waNumber: stores.waNumber })
      .from(stores)
      .where(eq(stores.id, storeId))
      .limit(1);

    const waNumber = storeRecord.length > 0 ? storeRecord[0].waNumber : null;

    return jsonSuccess(mappedItems, 200, 'Produk toko berhasil dimuat', {
      store: { waNumber },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
};

export const POST: APIRoute = async ({ params, request, locals }) => {
  return handleApiRoute(async () => {
    const storeId = params.storeId;
    if (!storeId) {
      return jsonError('storeId wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    const user = locals.user as AuthenticatedUser | undefined;
    if (!user || !locals.session?.userId) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    const [store] = await db
      .select({
        id: stores.id,
        userId: stores.userId,
        registeredBy: stores.registeredBy,
        maxProducts: stores.maxProducts,
      })
      .from(stores)
      .where(and(eq(stores.id, storeId), isNull(stores.deletedAt)))
      .limit(1);

    if (!store) {
      return jsonError('Toko tidak ditemukan', 404, undefined, 'NOT_FOUND');
    }
    if (!canManageStore(user, store)) {
      return jsonError('Anda tidak memiliki izin mengelola toko ini', 403, undefined, 'FORBIDDEN');
    }

    const rawBody = await parseJsonBody(request);
    const parsed = createStoreProductSchema.safeParse(rawBody);
    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message || 'Validasi produk gagal',
        400,
        parsed.error.issues,
        'VALIDATION_ERROR'
      );
    }

    const [{ totalProducts }] = await db
      .select({ totalProducts: count() })
      .from(products)
      .where(and(eq(products.storeId, storeId), isNull(products.deletedAt)));

    if (totalProducts >= store.maxProducts) {
      return jsonError(
        `Maksimal ${store.maxProducts} produk. Anda telah mencapai batas kuota Anda.`,
        402,
        undefined,
        'PAYMENT_REQUIRED'
      );
    }

    const { name, categoryId, basePrice, description, isAvailable, sortOrder, imageUrls, variants } =
      parsed.data;

    const baseSlug = slugify(name);
    const existing = await db
      .select({ slug: products.slug })
      .from(products)
      .where(and(eq(products.storeId, storeId), isNull(products.deletedAt)));
    const existingSlugs = new Set(existing.map((r) => r.slug));
    let slug = baseSlug;
    let counter = 1;
    while (existingSlugs.has(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const [inserted] = await db
      .insert(products)
      .values({
        id: crypto.randomUUID(),
        storeId,
        categoryId,
        name,
        slug,
        basePrice: Math.round(basePrice),
        description: description?.trim() || null,
        isAvailable: isAvailable !== false,
        sortOrder: sortOrder ?? 0,
        imageUrls: imageUrls ?? [],
        variants: variants ?? [],
      })
      .returning();

    await touchStoreLastEdited(store.id, user.id);

    await logActivity({
      userId: user.id,
      storeId: store.id,
      action: 'Create Product',
      details: {
        productId: inserted.id,
        name: inserted.name,
        basePrice: inserted.basePrice,
      },
    });

    return jsonSuccess(inserted, 201, 'Produk berhasil dibuat');
  });
};
