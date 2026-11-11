import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import { bankValidateSchema } from '@/schemas/designer/bank-validate.schema';
import { xenditClient } from '@/lib/finance/xendit';
import { InMemoryRateLimiter } from '@/lib/utils/rate-limiter';
import { handleApiRoute, jsonError, jsonSuccess, parseJsonBody } from '@/lib/utils/api-handler';

// Rate Limiter: Maximum 5 attempts per designer within 1 hour
export const bankValidateLimiter = new InMemoryRateLimiter(5, 60 * 60 * 1000);

/**
 * Compare designer profile name with bank account holder name
 * Strips titles, honorifics, punctuation, and mock tags for loose matching
 */
export function isAccountNameMatching(profileName?: string | null, accountHolderName?: string | null): boolean {
  if (!profileName || !accountHolderName) return true;

  const clean = (str: string) =>
    str
      .toLowerCase()
      .replace(/\b(s\.?kom|s\.?pd|s\.?e|s\.?h|s\.?t|s\.?sos|m\.?kom|m\.?m|m\.?t|dr|drg|ir|drs|prof|h|hj|mock|test|sandbox|account)\b/gi, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const normProfile = clean(profileName);
  const normHolder = clean(accountHolderName);

  if (!normProfile || !normHolder) return true;
  if (normProfile === normHolder || normProfile.includes(normHolder) || normHolder.includes(normProfile)) {
    return true;
  }

  const pTokens = normProfile.split(' ').filter((t) => t.length > 1);
  const hTokens = normHolder.split(' ').filter((t) => t.length > 1);

  if (pTokens.length === 0 || hTokens.length === 0) return true;
  return pTokens.some((pt) => pt.length >= 3 && hTokens.some((ht) => ht.includes(pt) || pt.includes(ht)));
}

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      return jsonError(
        'Akses desainer diperlukan untuk memvalidasi rekening.',
        401,
        { isValid: false },
        'UNAUTHORIZED'
      );
    }

    const rateLimitKey = `bank-val:${user.id}`;
    if (!bankValidateLimiter.check(rateLimitKey)) {
      return jsonError(
        'Batas percobaan tercapai. Silakan coba lagi 1 jam ke depan atau hubungi admin.',
        429,
        { isValid: false },
        'RATE_LIMITED'
      );
    }

    const rawBody = await parseJsonBody<Record<string, unknown>>(context.request).catch(() => ({} as Record<string, unknown>));
    const sanitizedBody = {
      ...rawBody,
      accountNumber:
        typeof rawBody.accountNumber === 'string'
          ? rawBody.accountNumber.replace(/\D/g, '')
          : rawBody.accountNumber,
    };
    const parseResult = bankValidateSchema.safeParse(sanitizedBody);

    if (!parseResult.success) {
      return jsonError(
        'Format nomor rekening tidak sesuai',
        400,
        { isValid: false },
        'VALIDATION_ERROR'
      );
    }

    const { bankCode, accountNumber } = parseResult.data;
    const res = await xenditClient.validateBankAccount({
      bankCode,
      accountNumber,
    });

    if (!res.isValid) {
      let message = res.message;
      if (!message) {
        if (res.httpStatus === 404) {
          message = res.isSandbox
            ? 'Mode Sandbox: Gunakan nomor rekening pengujian Xendit atau beralih ke API Key Production untuk validasi rekening riil.'
            : 'Nomor rekening tidak terdaftar pada bank yang dipilih';
        } else if (res.httpStatus === 400 || res.httpStatus === 422) {
          message = 'Format nomor rekening tidak sesuai';
        } else if (res.httpStatus === 401 || res.httpStatus === 403) {
          message = 'Layanan verifikasi rekening sedang bermasalah';
        } else {
          message = 'Gagal memverifikasi rekening. Silakan periksa kembali nomor Anda.';
        }
      }

      const clientStatus = res.httpStatus === 500 ? 500 : 400;
      return jsonError(message, clientStatus, { isValid: false });
    }

    const isMatching = isAccountNameMatching(user.name, res.accountHolderName);
    const nameMismatch = !isMatching;

    return jsonSuccess(
      {
        isValid: true,
        accountHolderName: res.accountHolderName || '',
        nameMismatch,
        warning: nameMismatch
          ? 'Nama pemilik rekening berbeda dengan nama profil Anda. Pastikan Anda menggunakan rekening pribadi untuk pencairan komisi.'
          : undefined,
      },
      200,
      'Rekening valid'
    );
  });
};
