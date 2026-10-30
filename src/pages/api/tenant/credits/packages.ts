import type { APIRoute } from 'astro';
import { jsonSuccess, jsonError, handleApiRoute } from '@/lib/utils/api-handler';
import { getAllCreditPackages, getPlatformAiCapacity } from '@/services/ai';

export const GET: APIRoute = async (): Promise<Response> =>
  handleApiRoute(async () => {
    try {
      const [rawPackages, capacity] = await Promise.all([
        getAllCreditPackages(),
        getPlatformAiCapacity(),
      ]);

      const packages = rawPackages.map((pkg) => {
        const requiredUsd = pkg.credits * 0.04;
        const isAvailable = !capacity.isDepleted && capacity.remainingDepositUsd >= requiredUsd;
        const availableStock = Math.floor(capacity.remainingDepositUsd / requiredUsd);
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
    } catch (error: unknown) {
      console.error('[CREDIT_PACKAGES] fetch error:', error);
      return jsonError('Gagal mengambil data paket kredit', 500);
    }
  });
