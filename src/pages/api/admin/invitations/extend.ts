import type { APIRoute } from 'astro';
import { db, tenantInvitations } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { eq, and } from 'drizzle-orm';

const MAX_EXTENSIONS = 3;

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

    const whereClause = user.role !== 'superadmin' 
      ? and(eq(tenantInvitations.id, body.id), eq(tenantInvitations.invitedBy, user.id))
      : eq(tenantInvitations.id, body.id);

    // Fetch current invitation to check extensionCount
    const invitation = await db.query.tenantInvitations.findFirst({
      where: () => whereClause,
    });

    if (!invitation) {
      throw new AppError('Undangan tidak ditemukan atau Anda tidak memiliki akses', 404);
    }

    if ((invitation.extensionCount ?? 0) >= MAX_EXTENSIONS) {
      throw new AppError(`Batas perpanjangan maksimal ${MAX_EXTENSIONS}x telah tercapai. Undangan ini tidak dapat diperpanjang lagi.`, 400);
    }

    const newExpiresAt = new Date();
    newExpiresAt.setHours(newExpiresAt.getHours() + 24);

    const updated = await db
      .update(tenantInvitations)
      .set({ 
        expiresAt: newExpiresAt,
        extensionCount: (invitation.extensionCount ?? 0) + 1,
      })
      .where(whereClause)
      .returning();

    if (updated.length === 0) {
      throw new AppError('Undangan tidak ditemukan atau Anda tidak memiliki akses', 404);
    }

    const remaining = MAX_EXTENSIONS - (updated[0].extensionCount ?? 0);
    return jsonSuccess({ 
      message: `Masa aktif undangan berhasil diperpanjang 24 jam (sisa perpanjangan: ${remaining}x)`,
      extensionCount: updated[0].extensionCount,
      remainingExtensions: remaining,
    });
  });
};
