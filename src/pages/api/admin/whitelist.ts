import type { APIRoute } from 'astro';
import { db, users, adminWhitelist, sessions, activityLogs } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedSuperAdmin, auth } from '@/lib/auth';
import { adminWhitelistSchema, adminStatusUpdateSchema } from '@/schemas/admin';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { eq, desc } from 'drizzle-orm';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedSuperAdmin(user)) {
      throw new AppError('Super admin access required', 403);
    }

    const admins = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      status: users.status,
      createdAt: users.createdAt,
    })
    .from(users)
    .innerJoin(adminWhitelist, eq(users.email, adminWhitelist.email))
    .where(eq(users.role, 'admin'))
    .orderBy(desc(users.createdAt));

    return jsonSuccess(admins);
  });
};

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedSuperAdmin(user)) {
      throw new AppError('Super admin access required', 403);
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = validate(adminWhitelistSchema, body);

    const existing = await db.select().from(users).where(eq(users.email, validated.email)).limit(1);
    if (existing.length > 0) {
      throw new AppError('Email is already registered in the system', 400);
    }

    // Create user via BetterAuth API so password is encrypted correctly
    let newUserId = '';
    try {
      const res = await auth.api.signUpEmail({
        body: {
          name: validated.name,
          email: validated.email,
          password: validated.password,
          role: 'admin'
        },
        headers: new Headers()
      }) as unknown as { user?: { id: string } };
      if (res && res.user) {
        newUserId = res.user.id;
        // Explicitly set the role to 'admin' in case BetterAuth ignored it
        await db.update(users).set({ role: 'admin' }).where(eq(users.id, newUserId));
        await db.delete(sessions).where(eq(sessions.userId, newUserId));
      } else {
        throw new AppError('Failed to create admin account', 500);
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Error during admin registration';
      throw new AppError(errorMessage, 500);
    }

    await db.insert(adminWhitelist).values({
      id: crypto.randomUUID(),
      email: validated.email,
      role: 'admin',
      addedBy: user.id,
    });

    await db.insert(activityLogs).values({
      id: crypto.randomUUID(),
      userId: user.id,
      action: 'Add Admin Whitelist',
      details: { email: validated.email },
    });

    return jsonSuccess({ id: newUserId });
  });
};

export const PATCH: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedSuperAdmin(user)) {
      throw new AppError('Super admin access required', 403);
    }

    const id = context.url.searchParams.get('id');
    if (!id) throw new AppError('Admin ID is required', 400);

    const body = await context.request.json().catch(() => ({}));
    const validated = validate(adminStatusUpdateSchema, body);

    await db.update(users).set({ status: validated.status }).where(eq(users.id, id));
    
    await db.insert(activityLogs).values({
      id: crypto.randomUUID(),
      userId: user.id,
      action: 'Update Admin Status',
      details: { targetUserId: id, newStatus: validated.status },
    });

    return jsonSuccess(null);
  });
};

export const DELETE: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedSuperAdmin(user)) {
      throw new AppError('Super admin access required', 403);
    }

    const id = context.url.searchParams.get('id');
    if (!id) {
      throw new AppError('Admin ID is required', 400);
    }

    const targetUser = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (targetUser.length === 0) {
      throw new AppError('Admin not found', 404);
    }

    if (targetUser[0].role !== 'admin') {
      throw new AppError('Only accounts with admin role can be deleted', 403);
    }

    await db.delete(users).where(eq(users.id, id));
    await db.delete(adminWhitelist).where(eq(adminWhitelist.email, targetUser[0].email));

    await db.insert(activityLogs).values({
      id: crypto.randomUUID(),
      userId: user.id,
      action: 'Delete Admin Whitelist',
      details: { email: targetUser[0].email },
    });

    return jsonSuccess(null);
  });
};
