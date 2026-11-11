import type { APIRoute } from 'astro';
import { getPublicStoreBySubdomain, getPublicStoreById } from '@/services/stores';
import { handleApiRoute, jsonSuccess, jsonError } from '@/lib/utils/api-handler';

export const GET: APIRoute = async ({ url }) => {
  return handleApiRoute(async () => {
    const subdomain = url.searchParams.get('subdomain');
    const storeId = url.searchParams.get('storeId');

    if (!subdomain && !storeId) {
      return jsonError('subdomain atau storeId wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    const store = subdomain
      ? await getPublicStoreBySubdomain(subdomain)
      : await getPublicStoreById(storeId!);

    if (!store) {
      return jsonError('Toko tidak ditemukan', 404, undefined, 'NOT_FOUND');
    }

    return jsonSuccess(store, 200);
  });
};
