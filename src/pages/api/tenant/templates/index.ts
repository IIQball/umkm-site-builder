import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, jsonError } from '@/lib/utils/api-handler';
import { getTenantOwnedTemplates } from '@/services/store-template.service';

export const GET: APIRoute = async ({ request }) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401);
    }

    if (user.role !== 'tenant' && user.role !== 'admin' && user.role !== 'superadmin') {
      return jsonError('Akses ditolak: Hanya tenant yang dapat mengakses daftar template milik sendiri', 403);
    }

    const templates = await getTenantOwnedTemplates(user.id);
    return jsonSuccess({ templates });
  });
};
