import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedSuperAdmin } from '@/lib/auth';
import { commissionSettingsSchema } from '@/schemas';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { getPlatformSettings, updatePlatformSettings } from '@/services/finance';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      throw new AppError('Authentication required', 401);
    }
    if (!isAuthorizedSuperAdmin(user)) {
      throw new AppError('Superadmin access required', 403);
    }

    const settings = await getPlatformSettings();

    return jsonSuccess({
      platformFeePercentage: settings.platformFeePercentage,
      adminServiceFee: settings.adminServiceFee,
      payoutMinimumBalance: settings.payoutMinimumBalance,
      settlementDelayDays: settings.settlementDelayDays,
    });
  });
};

export const saveSettings: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      throw new AppError('Authentication required', 401);
    }
    if (!isAuthorizedSuperAdmin(user)) {
      throw new AppError('Superadmin access required', 403);
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = validate(commissionSettingsSchema, body);

    const updatedRecord = await updatePlatformSettings(validated, user.id);

    return jsonSuccess(updatedRecord);
  });
};

export const PUT: APIRoute = saveSettings;
export const POST: APIRoute = saveSettings;
