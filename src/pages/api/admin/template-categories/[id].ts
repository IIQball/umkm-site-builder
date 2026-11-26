import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedSuperAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { TemplateCategoryUpdateSchema } from '@/schemas';
import {
  updateTemplateCategory,
  deleteTemplateCategory,
} from '@/services/template-categories';
import { logActivity } from '@/services/audit.service';

export const PUT: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedSuperAdmin(user)) {
      throw new AppError('Superadmin access required', 403);
    }

    const { id } = context.params;
    if (!id) {
      throw new AppError('Category ID is required', 400);
    }

    const body = await context.request.json().catch(() => ({}));
    const input = validate(TemplateCategoryUpdateSchema, body);

    const updated = await updateTemplateCategory(id, input);

    await logActivity({
      userId: user.id,
      action: 'Update Template Category',
      details: {
        categoryId: id,
        name: updated.name,
      },
    });

    return jsonSuccess(updated);
  });
};

export const DELETE: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedSuperAdmin(user)) {
      throw new AppError('Superadmin access required', 403);
    }

    const { id } = context.params;
    if (!id) {
      throw new AppError('Category ID is required', 400);
    }

    const result = await deleteTemplateCategory(id);

    await logActivity({
      userId: user.id,
      action: 'Delete Template Category',
      details: {
        categoryId: id,
      },
    });

    return jsonSuccess(result);
  });
};
