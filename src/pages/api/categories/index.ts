import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { storeCategories } from '../../../db/schema';
import { eq, and, isNull } from 'drizzle-orm';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const storeId = url.searchParams.get('storeId');
  
  if (!storeId) {
    return new Response(JSON.stringify({ error: 'storeId required' }), { status: 400 });
  }

  const categories = await db
    .select()
    .from(storeCategories)
    .where(and(eq(storeCategories.storeId, storeId), isNull(storeCategories.deletedAt)));

  return new Response(JSON.stringify(categories), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { storeId, name, slug } = body;
    
    await db.insert(storeCategories).values({
      id: crypto.randomUUID(),
      storeId,
      name,
      slug,
    });

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: string; cause?: { code?: string } };
    const code = err?.code || err?.cause?.code;

    if (code === '23503') {
      return new Response(JSON.stringify({ error: 'Store ID tidak ditemukan' }), { status: 400 });
    }
    if (code === '23505') {
      return new Response(JSON.stringify({ error: 'Slug sudah digunakan untuk toko ini. Silakan gunakan slug lain.' }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: 'Gagal menyimpan data' }), { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { id, name, slug } = body;
  
  await db.update(storeCategories)
    .set({ name, slug, updatedAt: new Date() })
    .where(eq(storeCategories.id, id));

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
    }

    await db.update(storeCategories)
      .set({ deletedAt: new Date() })
      .where(eq(storeCategories.id, id));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Gagal menghapus kategori' }), { status: 500 });
  }
};
