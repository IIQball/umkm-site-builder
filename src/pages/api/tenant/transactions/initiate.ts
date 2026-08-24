import type { APIRoute } from 'astro';
import { transactionService } from '@/services';
import { TransactionInitiateInputSchema } from '@/schemas';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      throw new AppError('Please log in to continue', 401);
    }
    if (user.status !== 'active') {
      throw new AppError('Account is suspended', 403);
    }

    const body = await context.request.json().catch(() => ({}));
    const input = validate(TransactionInitiateInputSchema, body);

    const protocol = context.request.url.startsWith('https') ? 'https' : 'http';
    const host = context.request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    const result = await transactionService.initiateTransaction(user.id, input, baseUrl);

    return jsonSuccess(result, 'Payment initiated successfully');
  });
};

