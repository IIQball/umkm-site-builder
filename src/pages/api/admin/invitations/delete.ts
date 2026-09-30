import type { APIRoute } from 'astro';
import { db, tenantInvitations, users } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { eq, and } from 'drizzle-orm';

export const DELETE: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Admin access required', 403);
    }

    const id = context.url.searchParams.get('id');
    
    if (!id || typeof id !== 'string') {
      throw new AppError('ID undangan diperlukan', 400);
    }
    
    // Cari undangan
    const invitation = await db.query.tenantInvitations.findFirst({
      where: (inv) => eq(inv.id, id),
    });

    if (!invitation) {
      throw new AppError('Undangan tidak ditemukan', 404);
    }

    // Pastikan user berhak menghapus (superadmin bisa semua, admin hanya bisa miliknya)
    if (user.role !== 'superadmin' && invitation.invitedBy !== user.id) {
      throw new AppError('Anda tidak memiliki akses untuk menghapus undangan ini', 403);
    }

    // Hapus user terkait (yang statusnya pending) jika ada
    const pendingUser = await db.query.users.findFirst({
      where: (u) => eq(u.email, invitation.email),
    });

    if (pendingUser && pendingUser.status === 'pending') {
      await db.delete(users).where(eq(users.id, pendingUser.id));
    }

    // Hapus undangan
    await db.delete(tenantInvitations).where(eq(tenantInvitations.id, id));

    return jsonSuccess({ message: 'Undangan berhasil dihapus' });
  });
};
