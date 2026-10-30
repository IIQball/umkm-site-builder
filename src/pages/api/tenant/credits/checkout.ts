import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, validate, AppError } from '@/lib/utils';
import { transactionService } from '@/services';
import { extractIdempotencyKey } from '@/lib/finance/idempotency';
import { getCreditPackageById, getPlatformAiCapacity, notifySuperadminsAiDepleted } from '@/services/ai';
import { db } from '@/db';
import { stores } from '@/db/schema';
import { eq } from 'drizzle-orm';
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
      throw new AppError('Silakan login terlebih dahulu', 401);
    }
    if (user.status !== 'active') {
      throw new AppError('Akun Anda sedang dinonaktifkan', 403);
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = validate(CreditCheckoutInputSchema, body);
    const { packageId, amount, credits } = validated;

    // 1. Verifikasi Anti-Tampering terhadap Canonical SSOT Package
    const canonicalPkg = getCreditPackageById(packageId);
    if (!canonicalPkg) {
      throw new AppError('Paket kredit tidak ditemukan atau sudah tidak aktif', 400);
    }
    if (canonicalPkg.price !== amount || canonicalPkg.credits !== credits) {
      throw new AppError('Nominal pembayaran atau kuota kredit tidak sesuai dengan ketentuan paket', 400);
    }

    // 2. Proteksi Kapasitas Deposit Token Platform (Cegah Checkout Saat Token Habis)
    const capacity = await getPlatformAiCapacity();
    const requiredUsd = canonicalPkg.credits * 0.04;
    if (capacity.isDepleted || capacity.remainingDepositUsd < requiredUsd) {
      await notifySuperadminsAiDepleted({
        remainingDepositUsd: capacity.remainingDepositUsd,
        packageId: canonicalPkg.id,
        packageName: canonicalPkg.name,
      });
      throw new AppError(
        'Kapasitas kuota token AI sistem saat ini sedang habis. Tim administrator telah diberitahu untuk melakukan isi ulang saldo AI. Silakan coba beberapa saat lagi.',
        503
      );
    }

    // 3. Ambil toko milik merchant
    const [store] = await db
      .select({ id: stores.id })
      .from(stores)
      .where(eq(stores.userId, user.id))
      .limit(1);

    // 3. Pastikan Idempotency Key aman dan konsisten
    const extractedKey = extractIdempotencyKey(context.request, validated);
    const finalIdempotencyKey = extractedKey || `cred_${user.id}_${packageId}_${Date.now()}`;

    const protocol = context.request.url.startsWith('https') ? 'https' : 'http';
    const host = context.request.headers.get('host') || 'localhost:4321';
    const baseUrl = `${protocol}://${host}`;

    const result = await transactionService.initiateTransaction(
      user.id,
      {
        amount: canonicalPkg.price,
        type: 'ai_credit_purchase',
        storeId: store?.id,
        idempotencyKey: finalIdempotencyKey,
      },
      baseUrl,
      finalIdempotencyKey
    );

    // URL status transaksi untuk arahan setelah pembayaran selesai
    const statusUrl = `${baseUrl}/dashboard/credits/status?invoiceId=${result.invoiceId}&status=pending`;

    return Response.json({
      ok: true,
      data: {
        invoiceId: result.invoiceId,
        paymentUrl: result.paymentUrl,
        statusUrl,
        packageId: canonicalPkg.id,
        packageName: canonicalPkg.name,
        credits: canonicalPkg.credits,
        amount: canonicalPkg.price,
      },
    });
  });
