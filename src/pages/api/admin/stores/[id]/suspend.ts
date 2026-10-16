import type { APIRoute } from 'astro';
import { db, stores, activityLogs } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const suspendStoreSchema = z.object({
  reason: z.string().min(1, 'Alasan wajib diisi').max(500, 'Alasan maksimal 500 karakter'),
});

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

    // Parse and validate body
    const body = await context.request.json();
    const { reason } = suspendStoreSchema.parse(body);

    // Get store
    const store = await db.query.stores.findFirst({
      where: eq(stores.id, storeId),
    });

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    // Check authorization: admin can only suspend own assisted stores
    if (user.role === 'admin' && store.registeredBy !== user.id) {
      throw new AppError('Unauthorized to suspend this store', 403);
    }

    // Check store is not already suspended
    if (store.status === 'suspended') {
      throw new AppError('Store is already suspended', 400);
    }

    // Update store status
    await db
      .update(stores)
      .set({
        status: 'suspended',
        suspendReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, storeId));

    // Log activity
    await db.insert(activityLogs).values({
      id: crypto.randomUUID(),
      userId: user.id,
      storeId: storeId,
      action: 'store_suspended',
      details: { reason },
      createdAt: new Date(),
    });

    return jsonSuccess({ success: true, message: 'Store suspended successfully' });
  });
};
