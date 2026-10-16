import type { APIRoute } from 'astro';
import { db, stores, notifications } from '@/db';
import { eq } from 'drizzle-orm';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, AppError, jsonSuccess } from '@/lib/utils';
import { z } from 'zod';

const QuotaSchema = z.object({
  maxProducts: z.number().min(1),
  maxCategories: z.number().min(1),
});

export const PUT: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      throw new AppError('Akses ditolak', 403);
    }

    const userId = context.params.id;
    if (!userId) {
      throw new AppError('ID Pengguna tidak valid', 400);
    }

    const body = await context.request.json().catch(() => ({}));
    const parsed = QuotaSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError('Data permintaan tidak valid', 400);
    }

    const { maxProducts, maxCategories } = parsed.data;

    // find store
    const [store] = await db.select().from(stores).where(eq(stores.userId, userId)).limit(1);
    if (!store) {
      throw new AppError('Tenant belum memiliki toko', 404);
    }

    await db.update(stores)
      .set({ maxProducts, maxCategories, updatedAt: new Date() })
      .where(eq(stores.id, store.id));

    await db.insert(notifications).values({
      id: `notif_${crypto.randomUUID()}`,
      userId: userId,
      type: 'quota_upgrade_request',
      title: 'Peningkatan Kuota Disetujui',
      message: `Admin telah menyetujui dan memperbarui kuota toko Anda menjadi ${maxProducts} Produk dan ${maxCategories} Kategori.`,
      metadata: { storeId: store.id }
    });

    return jsonSuccess({ message: 'Kuota berhasil diperbarui' }, 200);
  });
};

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      throw new AppError('Akses ditolak', 403);
    }
    const userId = context.params.id;
    if (!userId) {
      throw new AppError('ID Pengguna tidak valid', 400);
    }
    const [store] = await db.select().from(stores).where(eq(stores.userId, userId)).limit(1);
    if (!store) {
      throw new AppError('Tenant belum memiliki toko', 404);
    }
    return jsonSuccess({
      maxProducts: store.maxProducts,
      maxCategories: store.maxCategories
    }, 200);
  });
};
