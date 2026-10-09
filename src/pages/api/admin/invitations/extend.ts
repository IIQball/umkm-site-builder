import type { APIRoute } from 'astro';
import { db, tenantInvitations } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { eq, and } from 'drizzle-orm';

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Admin access required', 403);
    }

    const body = await context.request.json().catch(() => ({}));
    
    if (!body.id || typeof body.id !== 'string') {
      throw new AppError('ID undangan diperlukan', 400);
    }
    
    const newExpiresAt = new Date();
    newExpiresAt.setHours(newExpiresAt.getHours() + 3);

    const whereClause = user.role !== 'superadmin' 
      ? and(eq(tenantInvitations.id, body.id), eq(tenantInvitations.invitedBy, user.id))
      : eq(tenantInvitations.id, body.id);

    const updated = await db
      .update(tenantInvitations)
      .set({ expiresAt: newExpiresAt })
      .where(whereClause)
      .returning();

    if (updated.length === 0) {
      throw new AppError('Undangan tidak ditemukan atau Anda tidak memiliki akses', 404);
    }

    return jsonSuccess({ message: 'Masa aktif undangan berhasil diperpanjang 3 jam' });
  });
};
