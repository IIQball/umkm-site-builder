import type { APIRoute } from 'astro';
import { db, users, tenantInvitations, stores } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { desc, inArray, and, eq, ne, isNull, notExists, sql } from 'drizzle-orm';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Admin access required', 403);
    }

    const unacceptedInvitationSubquery = db
      .select()
      .from(tenantInvitations)
      .where(
        and(
          eq(tenantInvitations.email, users.email),
          isNull(tenantInvitations.acceptedAt),
        ),
      );

    const storeExistsSubquery = db
      .select({ 1: sql`1` })
      .from(stores)
      .where(eq(stores.userId, users.id));

    let query = db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      suspendReason: users.suspendReason,
      createdAt: users.createdAt,
      hasStore: sql<boolean>`exists (${storeExistsSubquery})`,
    })
    .from(users)
    .$dynamic();

    if (user.role === 'superadmin') {
      // Superadmin can see tenant, designer, and admin (excluding pending)
      query = query.where(and(
        inArray(users.role, ['tenant', 'designer', 'admin']),
        ne(users.status, 'pending'),
        notExists(unacceptedInvitationSubquery),
      ));
    } else {
      // Admin can only see tenants that they registered (excluding pending)
      query = query.where(and(
        eq(users.role, 'tenant'), 
        eq(users.registeredBy, user.id),
        ne(users.status, 'pending'),
        notExists(unacceptedInvitationSubquery),
      ));
    }

    const allUsers = await query.orderBy(desc(users.createdAt));

    return jsonSuccess(allUsers);
  });
};
