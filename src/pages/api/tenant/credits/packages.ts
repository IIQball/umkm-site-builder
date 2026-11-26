import type { APIRoute } from 'astro';
import { jsonSuccess, handleApiRoute } from '@/lib/utils/api-handler';
import {
  DALLE3_STANDARD_IMAGE_COST_USD,
  getAllCreditPackages,
  getPlatformAiCapacity,
} from '@/services/ai';

export const GET: APIRoute = async (): Promise<Response> =>
  handleApiRoute(async () => {
    const [rawPackages, capacity] = await Promise.all([
      getAllCreditPackages(),
      getPlatformAiCapacity(),
    ]);

    const packages = rawPackages.map((pkg) => {
      const requiredUsd = Math.max(0, pkg.credits * DALLE3_STANDARD_IMAGE_COST_USD);
      const isAvailable =
        requiredUsd > 0 && !capacity.isDepleted && capacity.remainingDepositUsd >= requiredUsd;
      const availableStock =
        requiredUsd > 0 && !capacity.isDepleted
          ? Math.max(0, Math.floor(capacity.remainingDepositUsd / requiredUsd))
          : 0;
      return {
        ...pkg,
        isAvailable,
        availableStock,
      };
    });

    return jsonSuccess(
      {
        packages,
        total: packages.length,
        capacity: {
          remainingDepositUsd: capacity.remainingDepositUsd,
          availableCredits: capacity.availableCredits,
          isDepleted: capacity.isDepleted,
        },
      },
      200
    );
  });
