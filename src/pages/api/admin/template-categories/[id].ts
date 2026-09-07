import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { TemplateCategoryUpdateSchema } from '@/schemas';
import {
  updateTemplateCategory,
  deleteTemplateCategory,
} from '@/services/template-categories';

export const PUT: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Admin access required', 403);
    }

    const { id } = context.params;
    if (!id) {
      throw new AppError('Category ID is required', 400);
    }

    const body = await context.request.json().catch(() => ({}));
    const input = validate(TemplateCategoryUpdateSchema, body);

    const updated = await updateTemplateCategory(id, input);
    return jsonSuccess(updated);
  });
};

export const DELETE: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Admin access required', 403);
    }

    const { id } = context.params;
    if (!id) {
      throw new AppError('Category ID is required', 400);
    }

    const result = await deleteTemplateCategory(id);
    return jsonSuccess(result);
  });
};
