import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils/api-handler';
import { validate } from '@/lib/utils/validation';
import { db } from '@/lib/db/client';
import { products, storeCategories, stores } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { z } from 'zod';
import type { APIRoute } from 'astro';

const GetCatalogSchema = z.object({
  subdomain: z.string().min(1)
});

export const GET: APIRoute = async ({ request }) => handleApiRoute(async () => {
  const url = new URL(request.url);
  const subdomain = url.searchParams.get('subdomain');
  
  const query = validate(GetCatalogSchema, { subdomain });
  
  // Find store by subdomain
  const store = await db.query.stores.findFirst({
    where: eq(stores.subdomain, query.subdomain)
  });
  
  if (!store) {
    throw new AppError('Store not found', 404, undefined, 'NOT_FOUND');
  }
  
  // Get active products with their categories
  const activeProducts = await db.query.products.findMany({
    where: and(
      eq(products.storeId, store.id),
      eq(products.isAvailable, true)
    ),
    with: {
      category: true
    },
    orderBy: [sql`${products.sortOrder} ASC`]
  });
  
  // Get all active categories for this store
  const activeCategories = await db.query.storeCategories.findMany({
     where: eq(storeCategories.storeId, store.id)
  });
  
  return jsonSuccess({
    products: activeProducts,
    categories: activeCategories
  });
});
