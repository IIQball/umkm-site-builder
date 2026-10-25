import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, validate, AppError } from '@/lib/utils';
import { transactionService } from '@/services';
import { extractIdempotencyKey } from '@/lib/finance/idempotency';
import { z } from 'zod';

const CreditCheckoutInputSchema = z.object({
  packageId: z.string().min(1, 'Package ID required'),
  amount: z.number().positive('Amount must be positive'),
  credits: z.number().positive('Credits must be positive'),
  idempotencyKey: z.string().optional().nullable(),
});

export const POST: APIRoute = async (context): Promise<Response> =>
  handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      throw new AppError('Authentication required', 401);
    }
    if (user.status !== 'active') {
      throw new AppError('Account is suspended', 403);
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = validate(CreditCheckoutInputSchema, body);
    const { packageId, amount, credits } = validated;
    const idempotencyKey = extractIdempotencyKey(context.request, validated);

    const protocol = context.request.url.startsWith('https') ? 'https' : 'http';
    const host = context.request.headers.get('host') || 'localhost:4321';
    const baseUrl = `${protocol}://${host}`;

    const result = await transactionService.initiateTransaction(
      user.id,
      {
        amount,
        type: 'ai_credit_purchase',
        idempotencyKey: idempotencyKey || undefined,
      },
      baseUrl,
      idempotencyKey || undefined
    );

    // Provide status page URL for redirect after payment
    const statusUrl = `${baseUrl}/dashboard/credits/status?invoiceId=${result.invoiceId}&status=pending`;

    return Response.json({
      ok: true,
      data: {
        invoiceId: result.invoiceId,
        paymentUrl: result.paymentUrl,
        statusUrl,
        packageId,
        credits,
        amount,
      },
    });
  });