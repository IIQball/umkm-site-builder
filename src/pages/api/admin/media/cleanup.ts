import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError, validate } from '@/lib/utils';
import { runMediaCleanup } from '@/services/media/cleanup.service';
import { MediaCleanupOptionsSchema } from '@/schemas';

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    // 1. Check authorization via Admin Session OR CRON Secret Header
    const cronSecret = process.env.CRON_SECRET || (import.meta as unknown as { env: Record<string, string | undefined> }).env?.CRON_SECRET;
    const authHeader = context.request.headers.get('Authorization') || '';
    const cronHeader = context.request.headers.get('x-cron-secret') || '';

    const isCronAuthorized =
      Boolean(cronSecret) &&
      (cronHeader === cronSecret || authHeader === `Bearer ${cronSecret}`);

    if (!isCronAuthorized) {
      const user = await getAuthenticatedUser(context.request);
      if (!user || !isAuthorizedAdmin(user)) {
        throw new AppError('Admin access or valid CRON secret required', 403);
      }
    }

    // 2. Parse and validate request options using Zod schema
    const body = await context.request.json().catch(() => ({}));
    const validated = validate(MediaCleanupOptionsSchema, body);

    // 3. Execute cleanup service
    const report = await runMediaCleanup({
      olderThanHours: validated.olderThanHours,
      dryRun: validated.dryRun,
    });

    return jsonSuccess(report, validated.dryRun ? 'Media cleanup dry run completed' : 'Media cleanup executed successfully');
  });
};

