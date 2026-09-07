import type { APIRoute } from 'astro';
import { handleApiRoute, jsonSuccess } from '@/lib/utils';
import { getTemplateCategories } from '@/services/template-categories';

export const GET: APIRoute = async (): Promise<Response> => {
  return handleApiRoute(async () => {
    const categories = await getTemplateCategories();
    return jsonSuccess(categories);
  });
};
