import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { stores, products, storeCategories } from '../../../db/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { jsonSuccess, jsonError } from '../../../lib/utils/api-handler';
import { getAuthenticatedUser } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401);
    }

    const [store] = await db.select().from(stores).where(eq(stores.userId, user.id)).limit(1);
    
    if (!store) {
      return jsonError('Toko tidak ditemukan', 404);
    }

    const [productCount] = await db.select({ count: sql`count(*)` })
      .from(products)
      .where(and(eq(products.storeId, store.id), isNull(products.deletedAt)));

    const [categoryCount] = await db.select({ count: sql`count(*)` })
      .from(storeCategories)
      .where(and(eq(storeCategories.storeId, store.id), isNull(storeCategories.deletedAt)));

    return jsonSuccess({
      products: Number(productCount.count),
      categories: Number(categoryCount.count)
    }, 200);
  } catch (error: unknown) {
    console.error('[QUOTA] fetch error:', error);
    return jsonError('Gagal mengambil data kuota', 500);
  }
};
