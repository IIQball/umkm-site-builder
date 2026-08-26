import type { APIRoute } from 'astro';
import { db, users } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { desc, inArray } from 'drizzle-orm';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    
    // Check if the requester is an admin or superadmin
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Akses khusus admin diperlukan', 403);
    }

    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      suspendReason: users.suspendReason,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(inArray(users.role, ['tenant', 'designer']))
    .orderBy(desc(users.createdAt));

    return jsonSuccess(allUsers, 'Data pengguna berhasil diambil');
  });
};
