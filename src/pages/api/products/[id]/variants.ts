import type { APIRoute } from 'astro';
import { db } from '../../../../lib/db/client';
import { products, stores } from '../../../../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { ProductVariantsSchema } from '../../../../schemas/product-variant.schema';

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const productId = params.id;
    if (!productId) {
      return new Response(JSON.stringify({ ok: false, error: { code: 'VALIDATION_ERROR', message: 'Product ID wajib diisi' } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const [product] = await db.select()
      .from(products)
      .where(and(eq(products.id, productId), isNull(products.deletedAt)));

    if (!product) {
      return new Response(JSON.stringify({ ok: false, error: { code: 'NOT_FOUND', message: 'Produk tidak ditemukan' } }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Public access allowed for available products; ownership required for unavailable ones
    if (!product.isAvailable) {
      if (!locals.user) {
        return new Response(JSON.stringify({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Silakan login terlebih dahulu' } }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const [store] = await db.select({ userId: stores.userId })
        .from(stores)
        .where(eq(stores.id, product.storeId));

      if (store?.userId !== locals.user.id && locals.user.role !== 'superadmin') {
        return new Response(JSON.stringify({ ok: false, error: { code: 'FORBIDDEN', message: 'Akses ditolak' } }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    const variants = Array.isArray(product.variants) ? product.variants : [];

    return new Response(JSON.stringify({ ok: true, data: { productId, variants } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    console.error('[PRODUCT] get variants error:', error instanceof Error ? error.message : error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return new Response(JSON.stringify({ ok: false, error: { code: 'INTERNAL', message } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    // 1. Authenticate
    if (!locals.user) {
      return new Response(JSON.stringify({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Silakan login terlebih dahulu' } }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Authorize — tenant or superadmin
    if (locals.user.role !== 'tenant' && locals.user.role !== 'superadmin') {
      return new Response(JSON.stringify({ ok: false, error: { code: 'FORBIDDEN', message: 'Hanya tenant yang dapat mengubah varian produk' } }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const productId = params.id;
    if (!productId) {
      return new Response(JSON.stringify({ ok: false, error: { code: 'VALIDATION_ERROR', message: 'Product ID wajib diisi' } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Ownership — product must belong to user's store
    const [product] = await db.select()
      .from(products)
      .where(and(eq(products.id, productId), isNull(products.deletedAt)));

    if (!product) {
      return new Response(JSON.stringify({ ok: false, error: { code: 'NOT_FOUND', message: 'Produk tidak ditemukan' } }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const [store] = await db.select({ userId: stores.userId })
      .from(stores)
      .where(eq(stores.id, product.storeId));

    if (!store || (store.userId !== locals.user.id && locals.user.role !== 'superadmin')) {
      return new Response(JSON.stringify({ ok: false, error: { code: 'FORBIDDEN', message: 'Akses ditolak' } }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. Validate
    const body = await request.json();
    const result = ProductVariantsSchema.safeParse(body.variants ?? body);

    if (!result.success) {
      return new Response(JSON.stringify({
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: 'Validasi varian gagal', issues: result.error.issues }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. Act — replace all variants
    const [updated] = await db.update(products)
      .set({ variants: result.data, updatedAt: new Date() })
      .where(eq(products.id, productId))
      .returning();

    return new Response(JSON.stringify({ ok: true, data: { productId, variants: updated.variants } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    console.error('[PRODUCT] update variants error:', error instanceof Error ? error.message : error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return new Response(JSON.stringify({ ok: false, error: { code: 'INTERNAL', message } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
