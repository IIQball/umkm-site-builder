import type { APIRoute } from 'astro';
import { getPublicStoreBySubdomain, getPublicStoreById } from '@/services/stores';
import { jsonSuccess, jsonError } from '@/lib/utils/api-handler';

export const GET: APIRoute = async ({ url }) => {
  try {
    const subdomain = url.searchParams.get('subdomain');
    const storeId = url.searchParams.get('storeId');

    if (!subdomain && !storeId) {
      return jsonError('subdomain atau storeId wajib diisi', 400);
    }

    const store = subdomain
      ? await getPublicStoreBySubdomain(subdomain)
      : await getPublicStoreById(storeId!);

    if (!store) {
      return jsonError('Toko tidak ditemukan', 404);
    }

    return jsonSuccess(store, 200);
  } catch (error) {
    console.error('Public store detail error:', error);
    return jsonError('Internal Server Error', 500);
  }
};
