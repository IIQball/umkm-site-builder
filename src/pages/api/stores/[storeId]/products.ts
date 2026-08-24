import type { APIRoute } from 'astro';
import { db } from '../../../../lib/db/client';
import { products, stores } from '../../../../db/schema';
import { asc, desc, eq, and, count, isNull } from 'drizzle-orm';

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
        imageUrl: Array.isArray(p.imageUrls) && p.imageUrls.length > 0 ? p.imageUrls[0] : ''
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
