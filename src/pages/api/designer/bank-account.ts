import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { bankAccounts, designers, wallets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import { bankAccountSchema } from '@/schemas/designer/bank-account.schema';

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

    const record = await db.query.bankAccounts.findFirst({
      where: (bankAccounts, { eq }) => eq(bankAccounts.designerId, user.id),
    });

    return new Response(
      JSON.stringify({
        success: true,
        ok: true,
        data: record || null,
      } as ApiResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        ok: false,
        error: {
          code: 'INTERNAL',
          message: error instanceof Error ? error.message : 'Gagal mengambil rekening bank',
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

    // Ensure designer profile and wallet exist (for admin/superadmin acting as designers)
    const existingDesigner = await db.select().from(designers).where(eq(designers.userId, user.id)).limit(1);
    if (existingDesigner.length === 0) {
      await db.insert(designers).values({
        userId: user.id,
        isVerified: true,
      });
      // also create wallet if it doesn't exist
      await db.insert(wallets).values({
        id: `wal_${crypto.randomUUID()}`,
        designerId: user.id,
        balance: 0,
        availableBalance: 0,
      }).onConflictDoNothing();
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = bankAccountSchema.parse(body);

    const existingAccount = await db.select().from(bankAccounts).where(eq(bankAccounts.designerId, user.id)).limit(1);

    let result;
    if (existingAccount.length === 0) {
      const [newRecord] = await db
        .insert(bankAccounts)
        .values({
          id: `ba_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          designerId: user.id,
          bankName: validated.bankName,
          accountNumber: validated.accountNumber,
          accountHolder: validated.accountHolder,
        })
        .returning();
      result = newRecord;
    } else {
      const [updatedRecord] = await db
        .update(bankAccounts)
        .set({
          bankName: validated.bankName,
          accountNumber: validated.accountNumber,
          accountHolder: validated.accountHolder,
        })
        .where(eq(bankAccounts.designerId, user.id))
        .returning();
      result = updatedRecord;
    }

    return new Response(
      JSON.stringify({
        success: true,
        ok: true,
        data: result,
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

    return new Response(
      JSON.stringify({
        success: false,
        ok: false,
        error: {
          code: 'INTERNAL',
          message: error instanceof Error ? error.message : 'Gagal menyimpan rekening bank',
        },
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = POST;
