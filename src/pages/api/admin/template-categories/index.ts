import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedSuperAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { TemplateCategoryCreateSchema } from '@/schemas';
import {
  getTemplateCategories,
  createTemplateCategory,
} from '@/services/template-categories';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedSuperAdmin(user)) {
      throw new AppError('Superadmin access required', 403);
    }

    const categories = await getTemplateCategories();
    return jsonSuccess(categories);
  });
};

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedSuperAdmin(user)) {
      throw new AppError('Superadmin access required', 403);
    }

    const body = await context.request.json().catch(() => ({}));
    const input = validate(TemplateCategoryCreateSchema, body);

    const created = await createTemplateCategory(input);
    return jsonSuccess(created, 201);
  });
};
