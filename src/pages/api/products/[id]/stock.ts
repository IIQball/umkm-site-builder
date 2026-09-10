import type { APIRoute } from 'astro';
import { db } from '@/db/index';
import { products, stores } from '@/db/schema';
import { getAuthenticatedUser, canManageStore } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const stockUpdateSchema = z.object({
  isAvailable: z.boolean(),
});

export const PATCH: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    
    if (!user) {
      throw new AppError('Silakan login terlebih dahulu', 401);
    }

    const id = context.params.id;
    if (!id) {
      throw new AppError('ID produk tidak ditemukan', 400);
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = validate(stockUpdateSchema, body);

    const targetProduct = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (targetProduct.length === 0) {
      throw new AppError('Produk tidak ditemukan', 404);
    }

    const [store] = await db.select().from(stores).where(eq(stores.id, targetProduct[0].storeId)).limit(1);
    if (!store || !canManageStore(user, store)) {
      throw new AppError('Anda tidak memiliki izin mengelola produk toko ini', 403);
    }

    await db.update(products)
      .set({ 
        isAvailable: validated.isAvailable,
        updatedAt: new Date()
      })
      .where(eq(products.id, id));

    await db.update(stores)
      .set({ lastEditedBy: user.id, updatedAt: new Date() })
      .where(eq(stores.id, store.id));

    return jsonSuccess({ id, isAvailable: validated.isAvailable });
  });
};
