import type { APIRoute } from 'astro';
import { handleApiRoute, jsonError } from '@/lib/utils/api-handler';
import { db } from '@/db';
import { stores, businessCategories, products } from '@/db/schema';
import { eq, ilike, or, and, desc, asc, isNull, sql, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { firstProductImageUrl } from '@/lib/products/image';

const SearchQuerySchema = z.object({
  q: z.string().optional(),
  keyword: z.string().optional(),
  category: z.string().optional(),
  categoryId: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().min(0.1).max(500).default(10),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
});

export const GET: APIRoute = async ({ request }): Promise<Response> => {
  return handleApiRoute(async () => {
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    const parsed = SearchQuerySchema.safeParse(query);
    if (!parsed.success) {
      return jsonError('Parameter pencarian tidak valid', 400, parsed.error.format(), 'VALIDATION_ERROR');
    }

    const { lat, lng, radius, page, limit } = parsed.data;
    const keyword = (parsed.data.keyword || parsed.data.q || '').trim();
    const categoryFilter = (parsed.data.categoryId || parsed.data.category || '').trim();
    const offset = (page - 1) * limit;

    const hasGeo = typeof lat === 'number' && typeof lng === 'number';

    const conditions = [
      eq(stores.status, 'active'),
      isNull(stores.deletedAt)
    ];

    if (keyword) {
      const searchTerm = `%${keyword}%`;
      conditions.push(
        or(
          ilike(stores.name, searchTerm),
          ilike(stores.subdomain, searchTerm),
          ilike(businessCategories.name, searchTerm),
          sql`EXISTS (
            SELECT 1 FROM ${products}
            WHERE ${products.storeId} = ${stores.id}
              AND ${products.deletedAt} IS NULL
              AND ${products.isAvailable} = true
              AND ${products.name} ILIKE ${searchTerm}
          )`
        )!
      );
    }

    if (categoryFilter) {
      conditions.push(
        or(
          eq(businessCategories.id, categoryFilter),
          eq(businessCategories.slug, categoryFilter)
        )!
      );
    }

    const distanceSql = hasGeo
      ? sql<number>`
          6371 * acos(
            least(1.0, greatest(-1.0,
              cos(radians(${lat})) * cos(radians(${stores.latitude})) *
              cos(radians(${stores.longitude}) - radians(${lng})) +
              sin(radians(${lat})) * sin(radians(${stores.latitude}))
            ))
          )
        `
      : null;

    if (hasGeo && distanceSql) {
      conditions.push(
        and(
          sql`${stores.latitude} IS NOT NULL`,
          sql`${stores.longitude} IS NOT NULL`,
          sql`6371 * acos(
            least(1.0, greatest(-1.0,
              cos(radians(${lat})) * cos(radians(${stores.latitude})) *
              cos(radians(${stores.longitude}) - radians(${lng})) +
              sin(radians(${lat})) * sin(radians(${stores.latitude}))
            ))
          ) <= ${radius}`
        )!
      );
    }

    const selectFields = {
      id: stores.id,
      name: stores.name,
      subdomain: stores.subdomain,
      address: stores.address,
      latitude: stores.latitude,
      longitude: stores.longitude,
      waNumber: stores.waNumber,
      totalViews: stores.totalViews,
      totalWaClicks: stores.totalWaClicks,
      customization: stores.customization,
      categoryId: businessCategories.id,
      categoryName: businessCategories.name,
      categorySlug: businessCategories.slug,
      categoryIcon: businessCategories.icon,
      ...(distanceSql ? { distance: distanceSql } : {}),
    };

    const countQuery = db
      .select({ count: sql<number>`cast(count(${stores.id}) as integer)` })
      .from(stores)
      .leftJoin(businessCategories, eq(stores.categoryId, businessCategories.id))
      .where(and(...conditions));

    let dataQuery = db
      .select(selectFields)
      .from(stores)
      .leftJoin(businessCategories, eq(stores.categoryId, businessCategories.id))
      .where(and(...conditions));

    if (distanceSql) {
      dataQuery = dataQuery
        .orderBy(asc(distanceSql), desc(stores.totalViews))
        .limit(limit)
        .offset(offset) as typeof dataQuery;
    } else {
      dataQuery = dataQuery
        .orderBy(desc(stores.totalViews), desc(stores.createdAt))
        .limit(limit)
        .offset(offset) as typeof dataQuery;
    }

    const [countResult, results] = await Promise.all([countQuery, dataQuery]);

    const total = countResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    // Fetch sample products for returned stores
    const storeIds = results.map(s => s.id);
    const productsByStore: Record<string, Array<{ id: string; name: string; price: number; imageUrl: string | null }>> = {};

    if (storeIds.length > 0) {
      try {
        const rawProducts = await db
          .select({
            id: products.id,
            storeId: products.storeId,
            name: products.name,
            basePrice: products.basePrice,
            imageUrls: products.imageUrls,
          })
          .from(products)
          .where(
            and(
              inArray(products.storeId, storeIds),
              eq(products.isAvailable, true),
              isNull(products.deletedAt)
            )
          )
          .orderBy(asc(products.sortOrder), asc(products.createdAt));

        for (const p of rawProducts) {
          if (!productsByStore[p.storeId]) {
            productsByStore[p.storeId] = [];
          }
          if (productsByStore[p.storeId].length < 3) {
            productsByStore[p.storeId].push({
              id: p.id,
              name: p.name,
              price: Number(p.basePrice),
              imageUrl: firstProductImageUrl(p.imageUrls),
            });
          }
        }
      } catch {
        // safe fallback if products table mock or query fails
      }
    }

    const storesData = results.map(store => {
      let logoUrl: string | null = null;
      try {
        const config = store.customization as Record<string, unknown>;
        if (config && Array.isArray(config.sections)) {
          const header = config.sections.find((s: Record<string, unknown>) =>
            s.type === 'header_announcement' || s.type === 'header'
          );
          if (header?.props && typeof (header.props as Record<string, unknown>).logoImageUrl === 'string') {
            logoUrl = (header.props as Record<string, string>).logoImageUrl;
          }
        }
      } catch {
        // safe fallback
      }

      const rawDist = (store as Record<string, unknown>).distance;
      const distance = typeof rawDist === 'number'
        ? Math.round(rawDist * 10) / 10
        : typeof rawDist === 'string'
          ? Math.round(parseFloat(rawDist) * 10) / 10
          : null;

      return {
        id: store.id,
        name: store.name,
        subdomain: store.subdomain,
        address: store.address ?? null,
        latitude: store.latitude ?? null,
        longitude: store.longitude ?? null,
        waNumber: store.waNumber,
        totalViews: store.totalViews,
        totalWaClicks: store.totalWaClicks,
        logoUrl,
        distance,
        category: store.categoryId ? {
          id: store.categoryId,
          name: store.categoryName,
          slug: store.categorySlug,
          icon: store.categoryIcon,
        } : null,
        sampleProducts: productsByStore[store.id] || [],
      };
    });

    return Response.json({
      success: true,
      ok: true,
      message: 'Data direktori berhasil dimuat',
      data: storesData,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    }, { status: 200 });
  });
};
