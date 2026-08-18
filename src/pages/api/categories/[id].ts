import type { APIRoute } from 'astro';
import { db } from '@/db';
import { productCategories, stores } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { requireSession } from '@/lib/auth/session';
import { okResponse, notFound, forbidden, internalError, validationError } from '@/types/api';
import { updateCategorySchema } from '@/types/category';

/**
 * PATCH /api/categories/[id]
 * Update a specific category.
 */
export const PATCH: APIRoute = async (context) => {
  const sessionOrError = requireSession(context);
  if ('error' in sessionOrError) {
    return new Response(JSON.stringify(sessionOrError.error), { status: sessionOrError.status });
  }
  const session = sessionOrError;
  const { id } = context.params;

  if (!id) return new Response(JSON.stringify(validationError('ID required')), { status: 400 });

  try {
    const body = await context.request.json();
    const result = updateCategorySchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify(validationError(result.error.errors[0].message)), { status: 400 });
    }

    // 1. Authenticate & Authorize
    const userStore = await db.query.stores.findFirst({
      where: and(eq(stores.userId, session.userId), isNull(stores.deletedAt)),
    });

    if (!userStore) {
      // DEV MODE: Auto-create store for mock user if not exists
      if (import.meta.env.DEV && session.userId === 'dev_user_123') {
        return new Response(JSON.stringify(notFound()), { status: 404 });
      }
      return new Response(JSON.stringify(forbidden()), { status: 403 });
    }

    // Ensure category exists and belongs to user's store
    const existing = await db.query.productCategories.findFirst({
      where: and(
        eq(productCategories.id, id),
        eq(productCategories.storeId, userStore.id),
        isNull(productCategories.deletedAt)
      ),
    });

    if (!existing) return new Response(JSON.stringify(notFound()), { status: 404 });

    // 2. Act
    const updated = await db
      .update(productCategories)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(productCategories.id, id))
      .returning();

    return new Response(JSON.stringify(okResponse(updated[0])));
  } catch (e) {
    console.error(`[API] PATCH category ${id} failed:`, e);
    return new Response(JSON.stringify(internalError()), { status: 500 });
  }
};

/**
 * DELETE /api/categories/[id]
 * Soft delete a category.
 */
export const DELETE: APIRoute = async (context) => {
  const sessionOrError = requireSession(context);
  if ('error' in sessionOrError) {
    return new Response(JSON.stringify(sessionOrError.error), { status: sessionOrError.status });
  }
  const session = sessionOrError;
  const { id } = context.params;

  if (!id) return new Response(JSON.stringify(validationError('ID required')), { status: 400 });

  try {
    const userStore = await db.query.stores.findFirst({
      where: and(eq(stores.userId, session.userId), isNull(stores.deletedAt)),
    });

    if (!userStore) {
      // DEV MODE: Auto-create store for mock user if not exists
      if (import.meta.env.DEV && session.userId === 'dev_user_123') {
        return new Response(JSON.stringify(notFound()), { status: 404 });
      }
      return new Response(JSON.stringify(forbidden()), { status: 403 });
    }

    const existing = await db.query.productCategories.findFirst({
      where: and(
        eq(productCategories.id, id),
        eq(productCategories.storeId, userStore.id),
        isNull(productCategories.deletedAt)
      ),
    });

    if (!existing) return new Response(JSON.stringify(notFound()), { status: 404 });

    // 2. Act (Soft Delete)
    await db
      .update(productCategories)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(productCategories.id, id));

    return new Response(JSON.stringify(okResponse({ message: 'Category deleted' })));
  } catch (e) {
    console.error(`[API] DELETE category ${id} failed:`, e);
    return new Response(JSON.stringify(internalError()), { status: 500 });
  }
};
