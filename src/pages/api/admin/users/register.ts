import type { APIRoute } from 'astro';
import { db, users, sessions, tenantInvitations, activityLogs } from '@/db/index';
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

    // Prevent Admin from registering another Admin or Designer
    if (user.role === 'admin' && validated.role !== 'tenant') {
      throw new AppError(`Sebagai Admin, Anda hanya diizinkan untuk mendaftarkan merchant (tenant). Hanya Superadmin yang dapat mendaftarkan role ${validated.role}.`, 403);
    }

    // Check if email already exists
    const existing = await db.select().from(users).where(eq(users.email, validated.email)).limit(1);
    if (existing.length > 0) {
      throw new AppError('Email is already registered in the system', 400);
    }

    // For all roles created by admin/superadmin, generate a secure random password
    const finalPassword = crypto.randomUUID() + crypto.randomUUID()

    // Create user via BetterAuth API so password is encrypted correctly.
    // IMPORTANT: Do NOT include `registeredBy` in the signUpEmail body.
    // If present, the user.create.before hook will set status='pending', which
    // then causes the session.create.before hook to throw ACCOUNT_PENDING_ACTIVATION
    // before we can delete the session — resulting in a 500 error.
    // We set registeredBy, role, and status manually via DB update immediately after.
    let newUserId = '';
    try {
      const res = await auth.api.signUpEmail({
        body: {
          name: validated.name,
          email: validated.email,
          password: finalPassword as string,
          role: validated.role,
        },
        // Empty Headers so it doesn't set cookies on the admin's browser session
        headers: new Headers()
      }) as unknown as { user?: { id: string } };
      
      if (res && res.user) {
        newUserId = res.user.id;

        // Immediately set status=pending and registeredBy BEFORE the session is used
        await db.update(users).set({ 
          role: validated.role,
          status: 'pending',
          registeredBy: user.id
        }).where(eq(users.id, newUserId));

        // Delete any session created by signUpEmail to prevent auto-login
        await db.delete(sessions).where(eq(sessions.userId, newUserId));

        // Clean up any orphaned invitations for this email to prevent duplicates
        await db.delete(tenantInvitations).where(eq(tenantInvitations.email, validated.email));

        // Insert invitation record so it appears in the pending dashboard
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

        // Add activity log
        await db.insert(activityLogs).values({
          id: crypto.randomUUID(),
          userId: user.id,
          action: `Register ${validated.role === 'admin' ? 'Admin' : 'Merchant'}`,
          details: { email: validated.email, targetRole: validated.role },
        });

        // Activation email is triggered client-side after this response succeeds
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
