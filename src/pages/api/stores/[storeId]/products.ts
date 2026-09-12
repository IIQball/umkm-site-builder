import type { APIRoute } from 'astro';
import { db } from '../../../../lib/db/client';
import { products, stores } from '../../../../db/schema';
import { asc, desc, eq, and, count, isNull } from 'drizzle-orm';
import { slugify } from '@/lib/utils';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const storeId = params.storeId;
    
    if (!storeId) {
      return new Response(JSON.stringify({ ok: false, error: { message: 'storeId is required' } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(request.url);
    const categoryId = url.searchParams.get('categoryId');
    const pageParam = url.searchParams.get('page');
    const limitParam = url.searchParams.get('limit');
    
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 12;
    const offset = (page - 1) * limit;

    const baseConditions = [
      eq(products.storeId, storeId),
      isNull(products.deletedAt),
      eq(products.isAvailable, true)
    ];

    if (categoryId && categoryId !== 'all') {
      baseConditions.push(eq(products.categoryId, categoryId));
    }

    const whereClause = and(...baseConditions);

    // Get total count for pagination
    const [{ total }] = await db
      .select({ total: count() })
      .from(products)
      .where(whereClause);

    // Get paginated products
    const records = await db.select()
      .from(products)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(asc(products.sortOrder), desc(products.createdAt));

    const mappedItems = records.map(p => ({
        ...p,
        price: p.basePrice,
        imageUrl: Array.isArray(p.imageUrls) && p.imageUrls.length > 0 ? p.imageUrls[0] : '',
        variants: Array.isArray(p.variants) ? p.variants : [],
    }));

    const storeRecord = await db.select({ waNumber: stores.waNumber })
      .from(stores)
      .where(eq(stores.id, storeId))
      .limit(1);
    
    const waNumber = storeRecord.length > 0 ? storeRecord[0].waNumber : null;

    return new Response(JSON.stringify({
      ok: true,
      data: mappedItems,
      store: {
        waNumber
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    console.error('[API] Error fetching products:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ ok: false, error: { message } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ params, request, locals }) => {
  try {
    const storeId = params.storeId;
    if (!storeId) {
      return new Response(JSON.stringify({ ok: false, error: { message: 'storeId is required' } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Auth: must be logged in
    const session = locals.session;
    if (!session?.userId) {
      return new Response(JSON.stringify({ ok: false, error: { message: 'Unauthorized' } }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify store belongs to the requesting user (unless superadmin/admin)
    const userRole = locals.user?.role;
    if (userRole !== 'superadmin' && userRole !== 'admin') {
      const store = await db.query.stores.findFirst({
        where: and(eq(stores.id, storeId), isNull(stores.deletedAt)),
        columns: { userId: true },
      });
      if (!store || store.userId !== session.userId) {
        return new Response(JSON.stringify({ ok: false, error: { message: 'Forbidden' } }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const body = await request.json();
    const { name, categoryId, basePrice, description, isAvailable, sortOrder, imageUrls, variants } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return new Response(JSON.stringify({ ok: false, error: { message: 'Nama produk wajib diisi' } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!categoryId || typeof categoryId !== 'string') {
      return new Response(JSON.stringify({ ok: false, error: { message: 'Kategori produk wajib dipilih' } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (typeof basePrice !== 'number' || basePrice < 0) {
      return new Response(JSON.stringify({ ok: false, error: { message: 'Harga dasar tidak valid' } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate unique slug
    const baseSlug = slugify(name.trim());
    const existing = await db.select({ slug: products.slug })
      .from(products)
      .where(and(eq(products.storeId, storeId), isNull(products.deletedAt)));
    const existingSlugs = new Set(existing.map(r => r.slug));
    let slug = baseSlug;
    let counter = 1;
    while (existingSlugs.has(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const [inserted] = await db.insert(products).values({
      id: crypto.randomUUID(),
      storeId,
      categoryId,
      name: name.trim(),
      slug,
      basePrice: Math.round(basePrice),
      description: description?.trim() || null,
      isAvailable: isAvailable !== false,
      sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
      variants: Array.isArray(variants) ? variants : [],
    }).returning();

    return new Response(JSON.stringify({ ok: true, data: inserted }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('[API] Error creating product:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ ok: false, error: { message } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
