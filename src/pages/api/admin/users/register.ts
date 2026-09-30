import type { APIRoute } from 'astro';
import { db, users, sessions, tenantInvitations } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedAdmin, auth } from '@/lib/auth';
import { manualUserRegistrationSchema } from '@/schemas/admin';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    
    // Only Admin or Superadmin can manually register users
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Admin access required', 403);
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = validate(manualUserRegistrationSchema, body);

    // Check if email already exists
    const existing = await db.select().from(users).where(eq(users.email, validated.email)).limit(1);
    if (existing.length > 0) {
      throw new AppError('Email is already registered in the system', 400);
    }

    // For all roles created by admin/superadmin, generate a secure random password
    const finalPassword = crypto.randomUUID() + crypto.randomUUID()

    // Create user via BetterAuth API so password is encrypted correctly
    let newUserId = '';
    try {
      const res = await auth.api.signUpEmail({
        body: {
          name: validated.name,
          email: validated.email,
          password: finalPassword as string,
          role: validated.role,
          registeredBy: user.id
        },
        // We pass empty Headers so it doesn't set cookies on the admin's session
        headers: new Headers()
      }) as unknown as { user?: { id: string } };
      
      if (res && res.user) {
        newUserId = res.user.id;
        // Delete the session created by signUpEmail to prevent auto-login
        await db.delete(sessions).where(eq(sessions.userId, newUserId));

        // Insert a record into tenantInvitations so it appears in the invitation dashboard
        const invId = crypto.randomUUID();
        const token = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        
        await db.insert(tenantInvitations).values({
          id: invId,
          name: validated.name,
          email: validated.email,
          token: token,
          invitedBy: user.id,
          expiresAt: expiresAt,
        });

        // We will trigger the activation email from the client-side to prevent server deadlocks
      } else {
        throw new AppError('Failed to create user account', 500);
      }
    } catch (e: unknown) {
      if (e instanceof AppError) throw e;
      const errorMessage = e instanceof Error ? e.message : 'Error during user registration';
      throw new AppError(errorMessage, 500);
    }

    return jsonSuccess({ id: newUserId, email: validated.email });
  });
};
