import type { APIRoute } from 'astro';
import { reviewTemplateSchema } from '@/schemas';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { reviewTemplate } from '@/services/templates';

export const handleReview = async (context: Parameters<APIRoute>[0]): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      throw new AppError('Autentikasi diperlukan', 401);
    }
    if (!isAuthorizedAdmin(user)) {
      throw new AppError('Akses khusus admin diperlukan', 403);
    }

    const templateId = context.params.id;
    if (!templateId) {
      throw new AppError('ID Template wajib diisi', 400);
    }

    const body = await context.request.json().catch(() => ({}));
    const validatedInput = validate(reviewTemplateSchema, body);

    const action: 'approved' | 'rejected' = validatedInput.action === 'approve' ? 'approved' : 'rejected';
    const updatedData = await reviewTemplate(templateId, action, validatedInput.rejectionReason, user.id);

    const res = jsonSuccess(updatedData, 'Status template berhasil diperbarui');
    const responseBody = await res.json();
    responseBody.template = updatedData;
    return Response.json(responseBody, { status: 200 });
  });
};

export const POST: APIRoute = handleReview;
export const PUT: APIRoute = handleReview;

