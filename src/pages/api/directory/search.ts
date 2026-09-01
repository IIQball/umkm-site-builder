import type { APIRoute } from 'astro';
import { handleApiRoute, jsonError } from '@/lib/utils/api-handler';
import { db } from '@/db';
import { stores } from '@/db/schema';
import { eq, ilike, or, and, desc, isNull, sql } from 'drizzle-orm';
import { z } from 'zod';

const SearchQuerySchema = z.object({
  q: z.string().optional(),
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
  
  const { q, page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  const conditions = [
    eq(stores.status, 'active'),
    isNull(stores.deletedAt)
  ];

  if (q) {
    const searchTerm = `%${q}%`;
    conditions.push(
      or(
        ilike(stores.name, searchTerm),
        ilike(stores.subdomain, searchTerm)
      )!
    );
  }

  // Execute both count and data queries in parallel
  const [countResult, results] = await Promise.all([
    db
      .select({ count: sql<number>`cast(count(${stores.id}) as integer)` })
      .from(stores)
      .where(and(...conditions)),
      
    db
      .select({
        id: stores.id,
        name: stores.name,
        subdomain: stores.subdomain,
        totalViews: stores.totalViews,
        totalWaClicks: stores.totalWaClicks,
        customization: stores.customization,
      })
      .from(stores)
      .where(and(...conditions))
      .orderBy(desc(stores.totalViews), desc(stores.createdAt))
      .limit(limit)
      .offset(offset)
  ]);

  const total = countResult[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const storesData = results.map(store => {
    let logoUrl: string | null = null;
    
    try {
      const config = store.customization as Record<string, unknown>;
      if (config && Array.isArray(config.sections)) {
        const header = config.sections.find((s: Record<string, unknown>) => s.type === 'header_announcement' || s.type === 'header');
        if (header && header.props && typeof (header.props as Record<string, unknown>).logoImageUrl === 'string') {
          logoUrl = (header.props as Record<string, string>).logoImageUrl;
        }
      }
    } catch {
      // safe fallback
    }

    return {
      id: store.id,
      name: store.name,
      subdomain: store.subdomain,
      totalViews: store.totalViews,
      totalWaClicks: store.totalWaClicks,
      logoUrl,
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
