import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { wallets, walletMutations, payoutRequests, platformSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import { calculateEligibleBalance, createXenditDisbursement } from '@/services/finance';
import { payoutSchema } from '@/schemas';

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

    const settingsList = await db.select().from(platformSettings).limit(1);
    const minBalance = settingsList.length > 0 ? settingsList[0].payoutMinimumBalance : 50000;

    return new Response(
      JSON.stringify({
        success: true,
        ok: true,
        data: {
          payouts: records,
          minPayoutLimit: minBalance,
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
          message: error instanceof Error ? error.message : 'Gagal mengambil riwayat penarikan dana',
        },
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async (context): Promise<Response> => {
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

    const body = await context.request.json().catch(() => ({}));
    const validated = payoutSchema.parse(body);
    const { amount, bankAccountId } = validated;

    // 1. Verify bank account exists and belongs to the designer
    const bankAcc = await db.query.bankAccounts.findFirst({
      where: (bankAccounts, { and, eq }) => and(eq(bankAccounts.id, bankAccountId), eq(bankAccounts.designerId, user.id)),
    });
    if (!bankAcc) {
      return new Response(
        JSON.stringify({
          success: false,
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Rekening bank tidak ditemukan',
          },
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Verify amount is >= payoutMinimumBalance
    const settingsList = await db.select().from(platformSettings).limit(1);
    const minBalance = settingsList.length > 0 ? settingsList[0].payoutMinimumBalance : 50000;
    if (amount < minBalance) {
      return new Response(
        JSON.stringify({
          success: false,
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Nominal penarikan minimal Rp ${minBalance.toLocaleString('id-ID')}`,
          },
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Verify amount is <= eligible/available balance
    const eligibleBalance = await calculateEligibleBalance(user.id);
    if (amount > eligibleBalance) {
      return new Response(
        JSON.stringify({
          success: false,
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Saldo tersedia tidak mencukupi untuk melakukan penarikan',
          },
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Run atomic database transaction
    const newPayout = await db.transaction(async (tx) => {
      const walletList = await tx.select().from(wallets).where(eq(wallets.designerId, user.id)).limit(1);
      if (walletList.length === 0) {
        throw new Error('WALLET_NOT_FOUND');
      }
      const wallet = walletList[0];
      const currentBalance = Number(wallet.balance);

      if (currentBalance < amount) {
        throw new Error('INSUFFICIENT_BALANCE');
      }

      // Check eligible balance inside transaction to avoid race conditions
      const txEligible = await calculateEligibleBalance(user.id, tx as unknown as typeof db);
      if (amount > txEligible) {
        throw new Error('INSUFFICIENT_BALANCE');
      }

      const balanceAfter = currentBalance - amount;
      const availableBalanceAfter = txEligible - amount;

      // Update wallet balance and availableBalance
      await tx.update(wallets)
        .set({
          balance: balanceAfter,
          availableBalance: availableBalanceAfter,
          updatedAt: new Date(),
        })
        .where(eq(wallets.id, wallet.id));

      // Record DEBIT mutation
      const mutationId = `wmut_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await tx.insert(walletMutations)
        .values({
          id: mutationId,
          walletId: wallet.id,
          type: 'DEBIT',
          amount,
          balanceAfter,
          description: `Penarikan dana ke ${bankAcc.bankName} (${bankAcc.accountNumber})`,
          createdAt: new Date(),
        });

      // Create payoutRequests record with status 'processing'
      const payoutId = `po_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const [record] = await tx.insert(payoutRequests)
        .values({
          id: payoutId,
          designerId: user.id,
          bankAccountId,
          amount,
          status: 'processing',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return record;
    });

    try {
      await createXenditDisbursement(newPayout.id);
    } catch (err) {
      console.error('Failed to initiate Xendit disbursement:', err);
    }

    return new Response(
      JSON.stringify({
        success: true,
        ok: true,
        data: newPayout,
      } as ApiResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0]?.message || 'Input tidak valid',
          },
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (error instanceof Error && (error.message === 'WALLET_NOT_FOUND' || error.message === 'INSUFFICIENT_BALANCE')) {
      return new Response(
        JSON.stringify({
          success: false,
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Saldo tersedia tidak mencukupi',
          },
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        ok: false,
        error: {
          code: 'INTERNAL',
          message: error instanceof Error ? error.message : 'Gagal mengirim pengajuan penarikan dana',
        },
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
