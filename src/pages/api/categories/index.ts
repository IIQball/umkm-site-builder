import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { storeCategories, stores } from '../../../db/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { jsonSuccess, jsonError } from '../../../lib/utils/api-handler';
import { getAuthenticatedUser, canManageStore } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const storeId = url.searchParams.get('storeId');
  
  if (!storeId) {
    return jsonError('storeId required', 400);
  }

  const categories = await db
    .select()
    .from(storeCategories)
    .where(and(eq(storeCategories.storeId, storeId), isNull(storeCategories.deletedAt)));

  return jsonSuccess(categories, 200);
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401);
    }

    const body = await request.json();
    const { storeId, name, slug } = body;

    const [store] = await db.select().from(stores).where(eq(stores.id, storeId)).limit(1);
    if (!store || !canManageStore(user, store)) {
      return jsonError('Anda tidak memiliki izin mengelola kategori toko ini', 403);
    }

    const [catCount] = await db.select({ count: sql`count(*)` })
      .from(storeCategories)
      .where(and(eq(storeCategories.storeId, storeId), isNull(storeCategories.deletedAt)));

    if (Number(catCount.count) >= 5) {
      return jsonError('Maksimal 5 kategori. Tambah lebih banyak fitur berbayar.', 402, undefined, 'PAYMENT_REQUIRED');
    }
    
    // Check if slug exists
    const existing = await db.query.storeCategories.findFirst({
      where: and(eq(storeCategories.storeId, storeId), eq(storeCategories.slug, slug))
    });

    if (existing) {
      if (existing.deletedAt !== null) {
        // Free up the slug from the soft-deleted record
        await db.update(storeCategories)
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

    await db.update(stores)
      .set({ lastEditedBy: user.id, updatedAt: new Date() })
      .where(eq(stores.id, store.id));

    return jsonSuccess({ success: true }, 201);
  } catch (error: unknown) {
    const err = error as { code?: string; cause?: { code?: string } };
    const code = err?.code || err?.cause?.code;

    if (code === '23503') {
      return jsonError('Store ID tidak ditemukan', 400);
    }
    if (code === '23505') {
      return jsonError('Slug sudah digunakan untuk toko ini. Silakan gunakan slug lain.', 400);
    }
    return jsonError('Gagal menyimpan data', 500);
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return jsonError('Silakan login terlebih dahulu', 401);
  }

  const body = await request.json();
  const { id, name, slug } = body;
  
  const currentCat = await db.query.storeCategories.findFirst({
    where: eq(storeCategories.id, id)
  });

  if (!currentCat) {
    return jsonError('Kategori tidak ditemukan', 404);
  }

  const [store] = await db.select().from(stores).where(eq(stores.id, currentCat.storeId)).limit(1);
  if (!store || !canManageStore(user, store)) {
    return jsonError('Anda tidak memiliki izin mengelola kategori toko ini', 403);
  }

  const existing = await db.query.storeCategories.findFirst({
    where: and(eq(storeCategories.storeId, currentCat.storeId), eq(storeCategories.slug, slug))
  });

  if (existing && existing.id !== id) {
    if (existing.deletedAt !== null) {
      // Free up the slug from the soft-deleted record
      await db.update(storeCategories)
        .set({ slug: `${existing.slug}-deleted-${Date.now()}` })
        .where(eq(storeCategories.id, existing.id));
    } else {
      return jsonError('Slug sudah digunakan untuk toko ini. Silakan gunakan slug lain.', 400);
    }
  }

  await db.update(storeCategories)
    .set({ name, slug, updatedAt: new Date() })
    .where(eq(storeCategories.id, id));

  await db.update(stores)
    .set({ lastEditedBy: user.id, updatedAt: new Date() })
    .where(eq(stores.id, store.id));

  return jsonSuccess({ success: true }, 200);
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401);
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return jsonError('id required', 400);
    }

    const currentCat = await db.query.storeCategories.findFirst({
      where: eq(storeCategories.id, id)
    });

    if (currentCat) {
      const [store] = await db.select().from(stores).where(eq(stores.id, currentCat.storeId)).limit(1);
      if (!store || !canManageStore(user, store)) {
        return jsonError('Anda tidak memiliki izin mengelola kategori toko ini', 403);
      }

      await db.update(storeCategories)
        .set({ 
          deletedAt: new Date(),
          slug: `${currentCat.slug}-deleted-${Date.now()}`
        })
        .where(eq(storeCategories.id, id));

      await db.update(stores)
        .set({ lastEditedBy: user.id, updatedAt: new Date() })
        .where(eq(stores.id, store.id));
    }

    return jsonSuccess({ success: true }, 200);
  } catch {
    return jsonError('Gagal menghapus kategori', 500);
  }
};
