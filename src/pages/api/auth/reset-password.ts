import { auth } from '@/lib/auth';
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db, users, sessions, tenantInvitations, verifications } from '@/db/index';
import { logActivity } from '@/services/audit.service';
import { eq, or } from 'drizzle-orm';
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
      return jsonError(result.error.errors[0].message, 400, result.error.flatten().fieldErrors, 'VALIDATION_ERROR');
    }

    const { token, password, uid, name } = result.data;

    let targetUid = uid;
    if (!targetUid && token) {
      const verRecord = await db.query.verifications.findFirst({
        where: eq(verifications.identifier, `reset-password:${token}`),
      });
      if (verRecord?.value) {
        const matched = await db.query.users.findFirst({
          where: or(eq(users.email, verRecord.value), eq(users.id, verRecord.value)),
        });
        if (matched) {
          targetUid = matched.id;
        }
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

    let userEmail = '';
    let userRole = '';

    if (targetUid) {
      const targetUser = await db.select().from(users).where(eq(users.id, targetUid)).limit(1);
      if (targetUser.length === 1) {
        userEmail = targetUser[0].email;
        userRole = targetUser[0].role;
        const wasPending = targetUser[0].status === 'pending';

        await db.update(users).set({ status: 'active' }).where(eq(users.id, targetUid));

        if (name) {
          try {
            const signinRes = (await auth.api.signInEmail({
              body: { email: userEmail, password },
              headers: new Headers(),
            })) as unknown as { user?: { id: string } };

            if (signinRes?.user) {
              await db.update(users).set({ name, status: 'active' }).where(eq(users.id, targetUid));
              await db.delete(sessions).where(eq(sessions.userId, targetUid));
            }
          } catch (e) {
            errorLog('RESET_PASSWORD_NAME_UPDATE', e);
          }
        }

        await db.delete(tenantInvitations).where(eq(tenantInvitations.email, userEmail));

        await logActivity({
          userId: targetUid,
          action: wasPending ? 'USER_ACTIVATED' : 'Reset Password',
          details: {
            email: userEmail,
            role: userRole,
          },
        });
      }
    }

    return jsonSuccess(
      { email: userEmail, role: userRole },
      200,
      'Kata sandi berhasil diatur ulang'
    );
  });
};
