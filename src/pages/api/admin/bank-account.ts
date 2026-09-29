import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { bankAccountSchema } from '@/schemas/designer/bank-account.schema';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import {
  getUserBankAccounts,
  addUserBankAccount,
  deleteUserBankAccount,
  setPrimaryBankAccount,
} from '@/services/finance/bank-account.service';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Akses admin diperlukan', 401);
    }

    const accounts = await getUserBankAccounts(user.id);
    if (accounts.length === 0) {
      return jsonSuccess(null);
    }

    const primaryAccount = accounts.find((a) => a.isPrimary) || accounts[0];
    return jsonSuccess({
      ...primaryAccount,
      accounts,
      primaryAccount,
    });
  });
};

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Akses admin diperlukan', 401);
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = validate(bankAccountSchema, body);

    const result = await addUserBankAccount(user.id, validated);
    return jsonSuccess(result);
  });
};

export const DELETE: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Akses admin diperlukan', 401);
    }

    const url = new URL(context.request.url);
    const body = await context.request.json().catch(() => ({}));
    const accountId = url.searchParams.get('id') || body.id;

    if (!accountId) {
      throw new AppError('ID rekening bank diperlukan', 400);
    }

    await deleteUserBankAccount(user.id, accountId);
    return jsonSuccess({ success: true, message: 'Rekening bank berhasil dihapus' });
  });
};

export const PATCH: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedAdmin(user)) {
      throw new AppError('Akses admin diperlukan', 401);
    }

    const body = await context.request.json().catch(() => ({}));
    const accountId = body.id || body.bankAccountId;

    if (!accountId) {
      throw new AppError('ID rekening bank diperlukan', 400);
    }

    const result = await setPrimaryBankAccount(user.id, accountId);
    return jsonSuccess(result);
  });
};

export const PUT: APIRoute = POST;
