import type { APIRoute } from 'astro';
import { reviewTemplateSchema } from '@/schemas';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { reviewTemplate } from '@/services/templates';

export const handleReview = async (context: Parameters<APIRoute>[0]): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      throw new AppError('Authentication required', 401);
    }
    if (!isAuthorizedAdmin(user)) {
      throw new AppError('Admin access required', 403);
    }

    const templateId = context.params.id;
    if (!templateId) {
      throw new AppError('Template ID is required', 400);
    }

    const body = await context.request.json().catch(() => ({}));
    const validatedInput = validate(reviewTemplateSchema, body);

    const updatedData = await reviewTemplate(templateId, validatedInput.action, validatedInput.rejectionReason, user.id);

    const res = jsonSuccess(updatedData, 'Template status updated successfully');
    const responseBody = await res.json();
    responseBody.template = updatedData;
    return Response.json(responseBody, { status: 200 });
  });
};

export const POST: APIRoute = handleReview;
export const PUT: APIRoute = handleReview;
