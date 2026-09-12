import type { APIRoute } from 'astro';
import { db, users } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { desc, inArray, and, eq, ne } from 'drizzle-orm';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Admin access required', 403);
    }

    let query = db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      suspendReason: users.suspendReason,
      createdAt: users.createdAt,
    })
    .from(users)
    .$dynamic();

    if (user.role === 'superadmin') {
      // Superadmin can see tenant, designer, and admin (excluding pending)
      query = query.where(and(
        inArray(users.role, ['tenant', 'designer', 'admin']),
        ne(users.status, 'pending')
      ));
    } else {
      // Admin can only see tenants that they registered (excluding pending)
      query = query.where(and(
        eq(users.role, 'tenant'), 
        eq(users.registeredBy, user.id),
        ne(users.status, 'pending')
      ));
    }

    const allUsers = await query.orderBy(desc(users.createdAt));

    return jsonSuccess(allUsers);
  });
};
