import type { APIRoute } from 'astro';
import { db, users, sessions, activityLogs } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { eq } from 'drizzle-orm';

export const DELETE: APIRoute = async (context): Promise<Response> => {
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
      throw new AppError('Cannot delete your own account', 403);
    }

    const targetUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (targetUser.length === 0) {
      throw new AppError('User not found', 404);
    }

    const target = targetUser[0];

    if (user.role === 'admin') {
      if (target.role !== 'tenant' || target.registeredBy !== user.id) {
        throw new AppError('Permission denied to delete this user', 403);
      }
    } else if (user.role === 'superadmin') {
      if (target.role === 'superadmin') {
        throw new AppError('Cannot delete a Superadmin account', 403);
      }
    }

    await db.delete(users).where(eq(users.id, userId));

    await db.insert(activityLogs).values({
      id: crypto.randomUUID(),
      userId: user.id,
      action: 'Delete User',
      details: { targetUserId: userId, targetEmail: target.email, targetRole: target.role },
    });

    return jsonSuccess(null);
  });
};
