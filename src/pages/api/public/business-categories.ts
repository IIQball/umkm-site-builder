import type { APIRoute } from 'astro';
import { handleApiRoute, jsonSuccess } from '@/lib/utils';
import { getBusinessCategories } from '@/services/business-categories';

export const GET: APIRoute = async (): Promise<Response> => {
  return handleApiRoute(async () => {
    const categories = await getBusinessCategories();
    return jsonSuccess(categories);
  });
};
