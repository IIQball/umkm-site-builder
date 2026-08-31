import type { APIRoute } from 'astro';
import { db } from '@/db/index';
import { products } from '@/db/schema';
import { getAuthenticatedUser } from '@/lib/auth';
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
    if (user.role !== 'tenant' && user.role !== 'superadmin') {
      throw new AppError('Hanya tenant yang dapat mengubah stok produk', 403);
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

    await db.update(products)
      .set({ 
        isAvailable: validated.isAvailable,
        updatedAt: new Date()
      })
      .where(eq(products.id, id));

    return jsonSuccess({ id, isAvailable: validated.isAvailable }, 'Status ketersediaan produk berhasil diubah');
  });
};
