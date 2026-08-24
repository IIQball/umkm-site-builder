import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { commissionSettingsSchema } from '@/schemas';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { getPlatformSettings, updatePlatformSettings } from '@/services/finance';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      throw new AppError('Autentikasi diperlukan', 401);
    }
    if (!isAuthorizedAdmin(user)) {
      throw new AppError('Akses khusus admin diperlukan', 403);
    }

    const settings = await getPlatformSettings();

    return jsonSuccess({
      platformFeePercentage: settings.platformFeePercentage,
      payoutMinimumBalance: settings.payoutMinimumBalance,
      settlementDelayDays: settings.settlementDelayDays,
    }, 'Pengaturan komisi berhasil diambil');
  });
};

export const saveSettings: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      throw new AppError('Autentikasi diperlukan', 401);
    }
    if (!isAuthorizedAdmin(user)) {
      throw new AppError('Akses khusus admin diperlukan', 403);
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = validate(commissionSettingsSchema, body);

    const updatedRecord = await updatePlatformSettings(validated, user.id);

    return jsonSuccess(updatedRecord, 'Pengaturan komisi berhasil diperbarui');
  });
};

export const PUT: APIRoute = saveSettings;
export const POST: APIRoute = saveSettings;

