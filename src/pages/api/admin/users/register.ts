import type { APIRoute } from 'astro';
import { db, users, sessions } from '@/db/index';
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

    // Create user via BetterAuth API so password is encrypted correctly
    let newUserId = '';
    try {
      const res = await auth.api.signUpEmail({
        body: {
          name: validated.name,
          email: validated.email,
          password: validated.password,
          role: validated.role
        },
        // We pass empty Headers so it doesn't set cookies on the admin's session
        headers: new Headers()
      }) as unknown as { user?: { id: string } };
      
      if (res && res.user) {
        newUserId = res.user.id;
        // Delete the session created by signUpEmail to prevent auto-login
        await db.delete(sessions).where(eq(sessions.userId, newUserId));
      } else {
        throw new AppError('Failed to create user account', 500);
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Error during user registration';
      throw new AppError(errorMessage, 500);
    }

    return jsonSuccess({ id: newUserId });
  });
};
