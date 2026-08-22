import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { wallets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import { handleApiRoute, AppError, jsonSuccess } from '@/lib/utils';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Akses desainer diperlukan', 401, undefined, 'UNAUTHORIZED');
    }

    const records = await db.query.payoutRequests.findMany({
      where: (payoutRequests, { eq }) => eq(payoutRequests.designerId, user.id),
      with: {
        bankAccount: true,
      },
      orderBy: (payoutRequests, { desc }) => [desc(payoutRequests.createdAt)],
    });

    const walletList = await db
      .select({
        balance: wallets.balance,
        availableBalance: wallets.availableBalance,
      })
      .from(wallets)
      .where(eq(wallets.designerId, user.id))
      .limit(1);

    const wallet = walletList[0] || { balance: 0, availableBalance: 0 };

    return jsonSuccess({
      payouts: records,
      wallet: {
        balance: Number(wallet.balance),
        availableBalance: Number(wallet.availableBalance),
      },
    });
  });
};
