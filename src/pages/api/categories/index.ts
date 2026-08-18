import type { APIRoute } from 'astro';
import { db } from '../../../db/index';
import { productCategories, stores } from '../../../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { requireSession } from '../../../lib/auth/session';
import { okResponse, validationError, forbidden, internalError } from '../../../types/api';
import { createCategorySchema } from '../../../types/category';

/**
 * GET /api/categories
 * List all categories for the current tenant's store.
 */
export const GET: APIRoute = async (context) => {
  const sessionOrError = requireSession(context);
  if ('error' in sessionOrError) {
    return new Response(JSON.stringify(sessionOrError.error), { status: sessionOrError.status });
  }
  const session = sessionOrError;

  try {
    // 1. Get store owned by user
    const userStore = await db.query.stores.findFirst({
      where: and(eq(stores.userId, session.userId), isNull(stores.deletedAt)),
    });

    if (!userStore) {
      return new Response(JSON.stringify(forbidden('Store not found or inactive')), { status: 403 });
    }

    // 2. Fetch categories
    const categories = await db.query.productCategories.findMany({
      where: and(
        eq(productCategories.storeId, userStore.id),
        isNull(productCategories.deletedAt)
      ),
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    });

    return new Response(JSON.stringify(okResponse(categories)));
  } catch (e) {
    console.error('[API] GET categories failed:', e);
    return new Response(JSON.stringify(internalError()), { status: 500 });
  }
};

/**
 * POST /api/categories
 * Create a new category for the current tenant's store.
 */
export const POST: APIRoute = async (context) => {
  const sessionOrError = requireSession(context);
  if ('error' in sessionOrError) {
    return new Response(JSON.stringify(sessionOrError.error), { status: sessionOrError.status });
  }
  const session = sessionOrError;

  try {
    const body = await context.request.json();
    const result = createCategorySchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify(validationError(result.error.errors[0].message)), { status: 400 });
    }

    // 1. Get store owned by user
    const userStore = await db.query.stores.findFirst({
      where: and(eq(stores.userId, session.userId), isNull(stores.deletedAt)),
    });

    if (!userStore) {
      return new Response(JSON.stringify(forbidden('Store not found or inactive')), { status: 403 });
    }

    // 2. Insert category
    const newCategory = {
      id: `cat_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`,
      storeId: userStore.id,
      name: result.data.name,
      description: result.data.description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(productCategories).values(newCategory);

    return new Response(JSON.stringify(okResponse(newCategory)), { status: 201 });
  } catch (e) {
    console.error('[API] POST categories failed:', e);
    return new Response(JSON.stringify(internalError()), { status: 500 });
  }
};
