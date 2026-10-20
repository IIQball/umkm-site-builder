import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedSuperAdmin, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { db } from '@/db';
import { aiDepositHistory } from '@/db/schema';
import { getAiDepositHistory } from '@/services/ai';

export const prerender = false;

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);

    if (!user) {
      throw new AppError('Unauthorized', 401);
    }
    if (!isAuthorizedSuperAdmin(user)) {
      throw new AppError('Superadmin access required', 403);
    }

    let body: { amountUsd?: unknown; amountIdr?: unknown; description?: unknown } = {};
    try {
      body = await context.request.json();
    } catch {
      throw new AppError('Payload JSON tidak valid', 400);
    }

    const amountUsd = Number(body?.amountUsd);
    const amountIdr = Number(body?.amountIdr);
    const description = typeof body?.description === 'string' ? body.description.trim() : null;

    if (!amountUsd || Number.isNaN(amountUsd) || amountUsd <= 0) {
      throw new AppError('amountUsd harus berupa angka positif', 400);
    }
    if (!amountIdr || Number.isNaN(amountIdr) || amountIdr <= 0) {
      throw new AppError('amountIdr harus berupa angka positif', 400);
    }

    const exchangeRate = Math.round(amountIdr / amountUsd);
    if (!exchangeRate || exchangeRate <= 0) {
      throw new AppError('Kurs yang dihitung tidak valid', 400);
    }

    const id = `dep_${crypto.randomUUID()}`;

    const [newDeposit] = await db
      .insert(aiDepositHistory)
      .values({
        id,
        amountUsd,
        amountIdr,
        exchangeRate,
        description,
        createdBy: user.id,
      })
      .returning();

    return jsonSuccess(newDeposit, 201);
  });
};

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);

    if (!user) {
      throw new AppError('Unauthorized', 401);
    }
    if (!isAuthorizedAdmin(user)) {
      throw new AppError('Admin access required', 403);
    }

    const deposits = await getAiDepositHistory(50);
    return jsonSuccess(deposits);
  });
};
