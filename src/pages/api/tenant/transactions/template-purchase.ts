import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, validate, AppError, jsonSuccess } from '@/lib/utils';
import { transactionService } from '@/services';
import { TemplatePurchaseInputSchema } from '@/schemas';
import { extractIdempotencyKey } from '@/lib/finance/idempotency';

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      throw new AppError('Authentication required', 401);
    }
    if (user.status !== 'active') {
      throw new AppError('Account is suspended', 403);
    }
    if (user.role !== 'tenant' && user.role !== 'admin') {
      throw new AppError('Hanya akun merchant (tenant) dan admin pendamping yang dapat membeli template', 403, undefined, 'FORBIDDEN_ROLE');
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = validate(TemplatePurchaseInputSchema, body);
    const { templateId, tenantId, assistedBy } = validated;
    const idempotencyKey = extractIdempotencyKey(context.request, validated);

    const protocol = context.request.url.startsWith('https') ? 'https' : 'http';
    const host = context.request.headers.get('host') || 'localhost:4321';
    const baseUrl = `${protocol}://${host}`;

    let targetUserId = user.id;
    let actingAssistedBy: string | null = null;

    if (user.role === 'admin') {
      if (!tenantId) {
        throw new AppError('Admin wajib memilih merchant binaan untuk pembelian template', 400, undefined, 'TENANT_REQUIRED');
      }
      targetUserId = tenantId;
      actingAssistedBy = assistedBy || user.id;
    }

    const result = await transactionService.purchaseTemplate(
      targetUserId,
      templateId,
      baseUrl,
      actingAssistedBy,
      idempotencyKey
    );

    if (result.isFree) {
      return jsonSuccess({ isFree: true }, 200, result.message);
    }

    return jsonSuccess(result.data, 200, 'Invoice pembelian template berhasil dibuat');
  });
};
