import type { APIRoute } from 'astro';
import { db, stores, activityLogs } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Admin access required', 403);
    }

    const storeId = context.params.id;
    if (!storeId) {
      throw new AppError('Store ID required', 400);
    }

    // Get store
    const store = await db.query.stores.findFirst({
      where: eq(stores.id, storeId),
    });

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    // Check authorization: admin can only unsuspend own assisted stores
    if (user.role === 'admin' && store.registeredBy !== user.id) {
      throw new AppError('Unauthorized to restore this store', 403);
    }

    // Check store is currently suspended
    if (store.status !== 'suspended') {
      throw new AppError('Store is not suspended', 400);
    }

    // Update store status to active and clear suspend reason
    await db
      .update(stores)
      .set({
        status: 'active',
        suspendReason: null,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, storeId));

    // Log activity
    await db.insert(activityLogs).values({
      id: crypto.randomUUID(),
      userId: user.id,
      storeId: storeId,
      action: 'store_unsuspended',
      details: { previousReason: store.suspendReason },
      createdAt: new Date(),
    });

    return jsonSuccess({ success: true, message: 'Store restored successfully' });
  });
};

