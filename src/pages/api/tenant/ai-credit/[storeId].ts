import type { APIRoute } from 'astro';
import { getOrInitializeAiCredit } from '@/services/ai-credit.service';
import { resolveStoreAiModel } from '@/services/ai';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      throw new AppError('Autentikasi diperlukan', 401, undefined, 'UNAUTHORIZED');
    }

    const storeId = context.params.storeId;
    if (!storeId) {
      throw new AppError('Store ID diperlukan', 400, undefined, 'MISSING_STORE_ID');
    }

    // Get or initialize credit balance
    const balance = await getOrInitializeAiCredit(storeId);
    const resolvedModel = await resolveStoreAiModel(storeId);

    return jsonSuccess({
      ...balance,
      tier: resolvedModel.tier,
      packageName: resolvedModel.packageName,
      model: resolvedModel.model,
      requiredCredits: resolvedModel.requiredCredits,
    });
  });
};
