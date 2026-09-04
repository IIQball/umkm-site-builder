import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { bankAccounts, designers, wallets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import { bankAccountSchema } from '@/schemas/designer/bank-account.schema';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Akses desainer diperlukan', 401);
    }

    const record = await db.query.bankAccounts.findFirst({
      where: (bankAccounts, { eq }) => eq(bankAccounts.designerId, user.id),
    });

    return jsonSuccess(record || null, 'Rekening bank berhasil diambil');
  });
};

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Akses desainer diperlukan', 401);
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
    const validated = validate(bankAccountSchema, body);

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

    return jsonSuccess(result, 'Rekening bank berhasil disimpan');
  });
};

export const PUT: APIRoute = POST;

