import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { getTemplatesForAdmin } from '@/services/templates';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Akses khusus admin', 403);
    }

    const url = new URL(context.request.url);
    const statusFilter = url.searchParams.get('status');

    const records = await getTemplatesForAdmin(statusFilter);

    return jsonSuccess(records, 'Daftar template berhasil diambil');
  });
};

