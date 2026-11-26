import { auth } from '@/lib/auth';
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db, users, sessions, tenantInvitations, verifications } from '@/db/index';
import { logActivity } from '@/services/audit.service';
import { and, eq, gt } from 'drizzle-orm';
import { AppError, handleApiRoute, jsonError, jsonSuccess, parseJsonBody } from '@/lib/utils/api-handler';
import { errorLog } from '@/lib/utils/logger';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token verifikasi tidak valid atau kedaluwarsa'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
  uid: z.string().optional(),
  name: z.string().optional(),
});

export const POST: APIRoute = async ({ request }) => {
  return handleApiRoute(async () => {
    const body = await parseJsonBody(request);
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return jsonError(result.error.issues[0].message, 400, result.error.flatten().fieldErrors, 'VALIDATION_ERROR');
    }

    const { token, password, name } = result.data;
    const verRecord = await db.query.verifications.findFirst({
      where: and(eq(verifications.identifier, `reset-password:${token}`), gt(verifications.expiresAt, new Date())),
    });
    const targetUser = verRecord?.value ? await db.query.users.findFirst({
      where: eq(users.id, verRecord.value),
    }) : null;
    if (!targetUser) {
      throw new AppError('Token reset kata sandi tidak valid atau telah kedaluwarsa.', 400, undefined, 'INVALID_TOKEN');
    }

    let invitation: typeof tenantInvitations.$inferSelect | undefined;
    if (targetUser.status === 'pending') {
      invitation = await db.query.tenantInvitations.findFirst({
        where: and(eq(tenantInvitations.email, targetUser.email), gt(tenantInvitations.expiresAt, new Date())),
      });
      if (!invitation || !targetUser.registeredBy || invitation.invitedBy !== targetUser.registeredBy || invitation.acceptedAt) {
        throw new AppError('Undangan tidak valid atau telah kedaluwarsa.', 400, undefined, 'INVALID_INVITATION');
      }
    }

    try {
      await auth.api.resetPassword({
        body: { newPassword: password, token },
        headers: request.headers,
      });
    } catch (authError) {
      errorLog('RESET_PASSWORD_TOKEN', authError);
      throw new AppError('Token reset kata sandi tidak valid atau telah kedaluwarsa.', 400, undefined, 'INVALID_TOKEN');
    }

    if (invitation) {
      const activated = await db.update(users).set({ status: 'active', emailVerified: true, ...(name ? { name } : {}) })
        .where(and(eq(users.id, targetUser.id), eq(users.status, 'pending')))
        .returning({ id: users.id });
      if (activated.length) {
        await db.delete(sessions).where(eq(sessions.userId, targetUser.id));
        await db.delete(tenantInvitations).where(eq(tenantInvitations.id, invitation.id));
      }
    }
    await logActivity({
      userId: targetUser.id,
      action: invitation ? 'USER_ACTIVATED' : 'Reset Password',
      details: { email: targetUser.email, role: targetUser.role },
    });
    const userEmail = targetUser.email;
    const userRole = targetUser.role;

    return jsonSuccess(
      { email: userEmail, role: userRole },
      200,
      'Kata sandi berhasil diatur ulang'
    );
  });
};
