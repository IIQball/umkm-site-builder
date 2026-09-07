import type { APIRoute } from 'astro';
import { db, users, sessions } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { adminStatusUpdateSchema } from '@/schemas/admin';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { eq } from 'drizzle-orm';

export const PUT: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Admin access required', 403);
    }

    const userId = context.params.userId;
    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    if (userId === user.id) {
      throw new AppError('Cannot update your own account status', 403);
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = validate(adminStatusUpdateSchema, body);

    const targetUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (targetUser.length === 0) {
      throw new AppError('User not found', 404);
    }

    if (targetUser[0].role === 'superadmin' && user.role !== 'superadmin') {
      throw new AppError('Permission denied to update Super Admin status', 403);
    }

    const suspendReason = validated.status === 'suspended' ? validated.suspendReason : null;

    await db.update(users)
      .set({ 
        status: validated.status,
        suspendReason: suspendReason 
      })
      .where(eq(users.id, userId));

    if (validated.status === 'suspended') {
      await db.delete(sessions).where(eq(sessions.userId, userId));
    }

    return jsonSuccess(null);
  });
};
