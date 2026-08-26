import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import { TemplateBatchDeleteSchema } from '@/schemas';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { batchDeleteTemplates } from '@/services/templates';

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Designer access required', 401);
    }

    const body = await context.request.json().catch(() => ({}));
    const input = validate(TemplateBatchDeleteSchema, body);

    const result = await batchDeleteTemplates(input.templateIds, user.id, user.role);

    return jsonSuccess(result, `${result.count} template berhasil dihapus secara permanen`);
  });
};
