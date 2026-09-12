import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { stores } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { StoreStatusInput } from '@/lib/stores/schemas';
import { getAuthenticatedUser, canManageStore } from '@/lib/auth';
import { ZodError } from 'zod';
import { jsonSuccess, jsonError } from '@/lib/utils/api-handler';

export const POST: APIRoute = async (context) => {
  try {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      return jsonError('Unauthorized', 401, undefined, 'UNAUTHORIZED');
    }

    const body = await context.request.json();
    const data = StoreStatusInput.parse(body);

    const storeId = context.url.searchParams.get('storeId') || (body as { storeId?: string }).storeId;
    const [store] = storeId 
      ? await db.select().from(stores).where(eq(stores.id, storeId)).limit(1)
      : await db.select().from(stores).where(eq(stores.userId, user.id)).limit(1);

    if (!store) {
      return jsonError('Store not found', 404, undefined, 'NOT_FOUND');
    }

    if (!canManageStore(user, store)) {
      return jsonError('Forbidden', 403, undefined, 'FORBIDDEN');
    }

    const customization = (store.customization as Record<string, unknown>) || {};
    customization.isOpen = data.isOpen;

    await db.update(stores)
      .set({
        customization,
        lastEditedBy: user.id,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, store.id));

    return jsonSuccess({ storeId: store.id, isOpen: data.isOpen }, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError('Validation error', 400, error.errors, 'VALIDATION_ERROR');
    }
    console.error('Store status update error:', error);
    return jsonError('Internal Server Error', 500);
  }
};

export const GET: APIRoute = async (context) => {
  try {
    const subdomain = context.params.subdomain || context.url.searchParams.get('subdomain');

    if (!subdomain) {
      return jsonError('Subdomain required', 400);
    }

    const store = await db.query.stores.findFirst({
      where: eq(stores.subdomain, subdomain),
      with: {
        registrar: {
          columns: { name: true },
        },
      },
    });

    if (!store) {
      return jsonError('Store not found', 404, undefined);
    }

    const customization = (store.customization as Record<string, unknown>) || {};
    const isOpen = customization.isOpen !== false;
    const managedByAdmin = store.registeredBy && store.registrar?.name
      ? { name: store.registrar.name }
      : null;

    return jsonSuccess({
      storeId: store.id,
      name: store.name,
      subdomain: store.subdomain,
      isOpen,
      managedByAdmin,
    }, 200);
  } catch (error) {
    console.error('Store status fetch error:', error);
    return jsonError('Internal Server Error', 500);
  }
};
