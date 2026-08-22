import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import { handleApiRoute, validate, AppError } from '@/lib/utils';
import { submitTemplateForReview } from '@/services/templates';
import { SubmitReviewSchema } from '@/schemas';

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Akses desainer diperlukan untuk mengajukan review', 401);
    }

    const body = await context.request.json().catch(() => ({}));
    const { templateId } = validate(SubmitReviewSchema, body);

    const updated = await submitTemplateForReview(templateId, user.id, user.role);

    return Response.json({
      success: true,
      ok: true,
      data: updated,
      status: 'pending',
      redirectUrl: `/builder/preview/${templateId}`,
    });
  });
};
