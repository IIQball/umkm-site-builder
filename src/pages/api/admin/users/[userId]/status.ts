import type { APIRoute } from 'astro';
import { db, users, sessions } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { adminStatusUpdateSchema } from '@/schemas/admin';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { eq } from 'drizzle-orm';

export const PUT: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    
    // Check if the requester is an admin or superadmin
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Akses khusus admin diperlukan', 403);
    }

    const userId = context.params.userId;
    if (!userId) {
      throw new AppError('ID pengguna tidak ditemukan', 400);
    }

    // You cannot suspend yourself
    if (userId === user.id) {
      throw new AppError('Anda tidak dapat mengubah status akun Anda sendiri', 403);
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = validate(adminStatusUpdateSchema, body);

    const targetUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (targetUser.length === 0) {
      throw new AppError('Pengguna tidak ditemukan', 404);
    }

    // Superadmin is protected from being suspended by regular admins
    if (targetUser[0].role === 'superadmin' && user.role !== 'superadmin') {
      throw new AppError('Anda tidak memiliki izin untuk mengubah status Super Admin', 403);
    }

    const suspendReason = validated.status === 'suspended' ? validated.suspendReason : null;

    await db.update(users)
      .set({ 
        status: validated.status,
        suspendReason: suspendReason 
      })
      .where(eq(users.id, userId));

    if (validated.status === 'suspended') {
      await db.delete(sessions).where(eq(sessions.userId, userId));
    }

    const message = validated.status === 'active' 
      ? 'Akun pengguna berhasil diaktifkan kembali' 
      : 'Akun pengguna berhasil ditangguhkan';

    return jsonSuccess(null, message);
  });
};
