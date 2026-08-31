import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, validate, AppError } from '@/lib/utils';
import { transactionService } from '@/services';
import { TemplatePurchaseInputSchema } from '@/schemas';

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      throw new AppError('Authentication required', 401);
    }
    if (user.status !== 'active') {
      throw new AppError('Account is suspended', 403);
    }

    const body = await context.request.json().catch(() => ({}));
    const { templateId } = validate(TemplatePurchaseInputSchema, body);

    const protocol = context.request.url.startsWith('https') ? 'https' : 'http';
    const host = context.request.headers.get('host') || 'localhost:4321';
    const baseUrl = `${protocol}://${host}`;

    const result = await transactionService.purchaseTemplate(user.id, templateId, baseUrl);

    if (result.isFree) {
      return Response.json({
        success: true,
        ok: true,
        isFree: true,
        message: result.message,
      });
    }

    return Response.json({
      success: true,
      ok: true,
      data: result.data,
    });
  });
};
