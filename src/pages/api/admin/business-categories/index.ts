import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedSuperAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { BusinessCategoryCreateSchema } from '@/schemas';
import {
  getBusinessCategories,
  createBusinessCategory,
} from '@/services/business-categories';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedSuperAdmin(user)) {
      throw new AppError('Superadmin access required', 403);
    }

    const categories = await getBusinessCategories();
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
    const input = validate(BusinessCategoryCreateSchema, body);

    const created = await createBusinessCategory(input, user.id);
    return jsonSuccess(created, 201);
  });
};
