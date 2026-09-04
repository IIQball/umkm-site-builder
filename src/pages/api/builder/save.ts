import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import { TemplateDraftUpdateSchema } from '@/schemas';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { updateTemplateDraft } from '@/services/templates';

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Designer access required', 401);
    }

    const url = new URL(context.request.url);
    const templateId = url.searchParams.get('templateId');

    if (!templateId) {
      throw new AppError('templateId query parameter is required', 400);
    }

    const body = await context.request.json().catch(() => ({}));
    const input = validate(TemplateDraftUpdateSchema, body);

    const updated = await updateTemplateDraft(templateId, input, user.id, user.role);

    return jsonSuccess(updated);
  });
};

