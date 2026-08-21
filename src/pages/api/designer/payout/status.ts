import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { wallets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';

interface ApiResponse<T = unknown> {
  success: boolean;
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export const GET: APIRoute = async (context): Promise<Response> => {
  try {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      return new Response(
        JSON.stringify({
          success: false,
          ok: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Akses desainer diperlukan',
          },
        } as ApiResponse),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
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

    return new Response(
      JSON.stringify({
        success: true,
        ok: true,
        data: {
          payouts: records,
          wallet: {
            balance: Number(wallet.balance),
            availableBalance: Number(wallet.availableBalance),
          },
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        ok: false,
        error: {
          code: 'INTERNAL',
          message: error instanceof Error ? error.message : 'Gagal mengambil status penarikan dana',
        },
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
