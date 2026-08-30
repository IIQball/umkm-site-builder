import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, jsonSuccess } from '@/lib/utils/api-handler';
import { getTenantOwnedTemplates } from '@/services/store-template.service';
import { getPublicTemplates } from '@/services/templates';

export const GET: APIRoute = async ({ request }) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(request);

    if (user && user.role === 'tenant') {
      const templates = await getTenantOwnedTemplates(user.id);
      return jsonSuccess({ templates }, 'Daftar template milik tenant berhasil dimuat');
    }

    const templates = await getPublicTemplates();
    return jsonSuccess({ templates }, 'Daftar template publik berhasil dimuat');
  });
};
