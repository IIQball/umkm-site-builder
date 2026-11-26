import type { APIRoute } from 'astro';
import { db } from '@/db';
import { storeCategories, stores } from '@/db/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { jsonSuccess, jsonError, handleApiRoute, parseJsonBody } from '@/lib/utils/api-handler';
import { getAuthenticatedUser, canManageStore } from '@/lib/auth';

export const GET: APIRoute = async ({ request }) => {
  return handleApiRoute(async () => {
    const url = new URL(request.url);
    const storeId = url.searchParams.get('storeId');

    if (!storeId) {
      return jsonError('storeId wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    const categories = await db
      .select()
      .from(storeCategories)
      .where(and(eq(storeCategories.storeId, storeId), isNull(storeCategories.deletedAt)));

    return jsonSuccess(categories, 200);
  });
};

export const POST: APIRoute = async ({ request }) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    const body = await parseJsonBody<{ storeId?: string; name?: string; slug?: string }>(request);
    const { storeId, name, slug } = body;
    if (!storeId || !name || !slug) {
      return jsonError('Data kategori tidak lengkap', 400, undefined, 'VALIDATION_ERROR');
    }

    const [store] = await db.select().from(stores).where(eq(stores.id, storeId)).limit(1);
    if (!store || !canManageStore(user, store)) {
      return jsonError('Anda tidak memiliki izin mengelola kategori toko ini', 403, undefined, 'FORBIDDEN');
    }

    const [catCount] = await db
      .select({ count: sql`count(*)` })
      .from(storeCategories)
      .where(and(eq(storeCategories.storeId, storeId), isNull(storeCategories.deletedAt)));

    if (Number(catCount.count) >= store.maxCategories) {
      return jsonError(
        `Maksimal ${store.maxCategories} kategori. Anda telah mencapai batas kuota Anda. Silakan ajukan peningkatan kuota.`,
        402,
        undefined,
        'PAYMENT_REQUIRED'
      );
    }

    const existing = await db.query.storeCategories.findFirst({
      where: and(eq(storeCategories.storeId, storeId), eq(storeCategories.slug, slug)),
    });

    if (existing) {
      if (existing.deletedAt !== null) {
        await db
          .update(storeCategories)
          .set({ slug: `${existing.slug}-deleted-${Date.now()}` })
          .where(eq(storeCategories.id, existing.id));
      } else {
        return jsonError('Slug sudah digunakan untuk toko ini. Silakan gunakan slug lain.', 400);
      }
    }

    await db.insert(storeCategories).values({
      id: crypto.randomUUID(),
      storeId,
      name,
      slug,
    });

    await db
      .update(stores)
      .set({ lastEditedBy: user.id, updatedAt: new Date() })
      .where(eq(stores.id, store.id));

    return jsonSuccess({ created: true }, 201, 'Kategori berhasil dibuat');
  });
};

export const PATCH: APIRoute = async ({ request }) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    const body = await parseJsonBody<{ id?: string; name?: string; slug?: string }>(request);
    const { id, name, slug } = body;
    if (!id || !name || !slug) {
      return jsonError('Data kategori tidak lengkap', 400, undefined, 'VALIDATION_ERROR');
    }

    const currentCat = await db.query.storeCategories.findFirst({
      where: eq(storeCategories.id, id),
    });

    if (!currentCat) {
      return jsonError('Kategori tidak ditemukan', 404, undefined, 'NOT_FOUND');
    }

    const [store] = await db.select().from(stores).where(eq(stores.id, currentCat.storeId)).limit(1);
    if (!store || !canManageStore(user, store)) {
      return jsonError('Anda tidak memiliki izin mengelola kategori toko ini', 403, undefined, 'FORBIDDEN');
    }

    const existing = await db.query.storeCategories.findFirst({
      where: and(eq(storeCategories.storeId, currentCat.storeId), eq(storeCategories.slug, slug)),
    });

    if (existing && existing.id !== id) {
      if (existing.deletedAt !== null) {
        await db
          .update(storeCategories)
          .set({ slug: `${existing.slug}-deleted-${Date.now()}` })
          .where(eq(storeCategories.id, existing.id));
      } else {
        return jsonError('Slug sudah digunakan untuk toko ini. Silakan gunakan slug lain.', 400);
      }
    }

    await db
      .update(storeCategories)
      .set({ name, slug, updatedAt: new Date() })
      .where(eq(storeCategories.id, id));

    await db
      .update(stores)
      .set({ lastEditedBy: user.id, updatedAt: new Date() })
      .where(eq(stores.id, store.id));

    return jsonSuccess({ id }, 200, 'Kategori berhasil diperbarui');
  });
};

export const DELETE: APIRoute = async ({ request }) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return jsonError('id wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    const currentCat = await db.query.storeCategories.findFirst({
      where: eq(storeCategories.id, id),
    });

    if (currentCat) {
      const [store] = await db.select().from(stores).where(eq(stores.id, currentCat.storeId)).limit(1);
      if (!store || !canManageStore(user, store)) {
        return jsonError('Anda tidak memiliki izin mengelola kategori toko ini', 403, undefined, 'FORBIDDEN');
      }

      await db
        .update(storeCategories)
        .set({
          deletedAt: new Date(),
          slug: `${currentCat.slug}-deleted-${Date.now()}`,
        })
        .where(eq(storeCategories.id, id));

      await db
        .update(stores)
        .set({ lastEditedBy: user.id, updatedAt: new Date() })
        .where(eq(stores.id, store.id));
    }

    return jsonSuccess({ id }, 200, 'Kategori berhasil dihapus');
  });
};
