import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { POST, bankValidateLimiter, isAccountNameMatching } from '@/pages/api/designer/bank/validate';
import * as authLib from '@/lib/auth';
import { SUPPORTED_BANK_CODES } from '@/schemas/designer/bank-validate.schema';

type ApiContext = Parameters<typeof POST>[0];

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedDesigner: vi.fn(),
}));

vi.mock('@/lib/finance/xendit', () => ({
  xenditClient: {
    validateBankAccount: vi.fn(async (params: { bankCode: string; accountNumber: string }) => {
      const cleanNum = params.accountNumber.trim();
      const bankCodeUpper = params.bankCode.trim().toUpperCase();

      if (cleanNum.length < 5 || /^0+$/.test(cleanNum)) {
        return {
          isValid: false,
          httpStatus: 404,
          message: 'Nomor rekening tidak terdaftar pada bank yang dipilih',
        };
      }

      const mockNames: Record<string, string> = {
        BCA: 'AHMAD SURYA PRATAMA',
        BRI: 'SITI RAHMAWATI',
        MANDIRI: 'DIMAS ARYA KUSUMA',
        BNI: 'LESTARI WULANDARI',
        BTN: 'EKO PRASETYO',
        BSI: 'MUHAMMAD RIZKY FAUZAN',
        CIMB: 'FARHAN MAULANA',
        MAYBANK: 'KEVIN TANUWIJAYA',
        PERMATA: 'ANDI SAPUTRA',
      };

      return {
        isValid: true,
        accountHolderName: mockNames[bankCodeUpper] || `PEMILIK ${bankCodeUpper} TEST`,
      };
    }),
  },
}));

describe('POST /api/designer/bank/validate', () => {
  const mockGetAuthUser = authLib.getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedDesigner = authLib.isAuthorizedDesigner as unknown as Mock;

  const mockDesigner = {
    id: 'usr_designer_1',
    name: 'Ahmad Surya Pratama',
    role: 'designer',
    status: 'active',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    bankValidateLimiter.reset();
  });

  it('returns 401 when user is not authenticated or not a designer', async () => {
    mockGetAuthUser.mockResolvedValue(null);
    mockIsAuthorizedDesigner.mockReturnValue(false);

    const request = new Request('http://test.local/api/designer/bank/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankCode: 'BCA', accountNumber: '1234567890' }),
    });

    const res = await POST({ request, params: {} } as unknown as ApiContext);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.message).toContain('Akses desainer');
  });

  it('enforces rate limiting of 5 attempts per hour per designer', async () => {
    mockGetAuthUser.mockResolvedValue(mockDesigner);
    mockIsAuthorizedDesigner.mockReturnValue(true);

    for (let i = 0; i < 5; i++) {
      const req = new Request('http://test.local/api/designer/bank/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankCode: 'BCA', accountNumber: `789123456${i}` }),
      });
      const res = await POST({ request: req, params: {} } as unknown as ApiContext);
      expect(res.status).toBe(200);
    }

    const reqExceeded = new Request('http://test.local/api/designer/bank/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankCode: 'BCA', accountNumber: '7891234569' }),
    });
    const resExceeded = await POST({ request: reqExceeded, params: {} } as unknown as ApiContext);
    expect(resExceeded.status).toBe(429);
    const data = await resExceeded.json();
    expect(data.success).toBe(false);
    expect(data.message).toBe('Batas percobaan tercapai. Silakan coba lagi 1 jam ke depan atau hubungi admin.');
  });

  it('rejects SEABANK as it is removed from supported national banks', async () => {
    mockGetAuthUser.mockResolvedValue(mockDesigner);
    mockIsAuthorizedDesigner.mockReturnValue(true);

    const req = new Request('http://test.local/api/designer/bank/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankCode: 'SEABANK', accountNumber: '1234567890' }),
    });
    const res = await POST({ request: req, params: {} } as unknown as ApiContext);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.isValid).toBe(false);
  });

  it('detects name mismatch and returns warning when account holder differs from profile', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'usr_designer_mismatch',
      name: 'John Doe',
      role: 'designer',
      status: 'active',
    });
    mockIsAuthorizedDesigner.mockReturnValue(true);

    const req = new Request('http://test.local/api/designer/bank/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankCode: 'BRI', accountNumber: '7891234560' }),
    });
    const res = await POST({ request: req, params: {} } as unknown as ApiContext);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.isValid).toBe(true);
    expect(data.nameMismatch).toBe(true);
    expect(data.warning).toContain('Nama pemilik rekening berbeda');
  });

  it('returns 400 when input schema is invalid', async () => {
    mockGetAuthUser.mockResolvedValue(mockDesigner);
    mockIsAuthorizedDesigner.mockReturnValue(true);

    const req = new Request('http://test.local/api/designer/bank/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankCode: 'UNKNOWN_BANK', accountNumber: '1234567890' }),
    });
    const res = await POST({ request: req, params: {} } as unknown as ApiContext);
    expect(res.status).toBe(400);
  });

  it('returns educational message when Xendit sandbox returns 404', async () => {
    mockGetAuthUser.mockResolvedValue(mockDesigner);
    mockIsAuthorizedDesigner.mockReturnValue(true);

    const { xenditClient } = await import('@/lib/finance/xendit');
    const mockValidate = xenditClient.validateBankAccount as unknown as Mock;
    mockValidate.mockResolvedValueOnce({
      isValid: false,
      httpStatus: 404,
      isSandbox: true,
      message: 'Mode Sandbox: Gunakan nomor rekening pengujian Xendit atau beralih ke API Key Production untuk validasi rekening riil.',
    });

    const request = new Request('http://test.local/api/designer/bank/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankCode: 'BCA', accountNumber: '9999999999' }),
    });

    const res = await POST({ request, params: {} } as unknown as ApiContext);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toContain('Mode Sandbox');
  });

  it('returns sanitized error for HTTP 422, 403, and 500', async () => {
    mockGetAuthUser.mockResolvedValue(mockDesigner);
    mockIsAuthorizedDesigner.mockReturnValue(true);

    const { xenditClient } = await import('@/lib/finance/xendit');
    const mockValidate = xenditClient.validateBankAccount as unknown as Mock;

    mockValidate.mockResolvedValueOnce({ isValid: false, httpStatus: 422, message: 'Format nomor rekening tidak sesuai' });
    const req422 = new Request('http://test.local/api/designer/bank/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankCode: 'BCA', accountNumber: '11111111' }),
    });
    const res422 = await POST({ request: req422, params: {} } as unknown as ApiContext);
    expect(res422.status).toBe(400);

    mockValidate.mockResolvedValueOnce({ isValid: false, httpStatus: 403, message: 'Layanan verifikasi rekening sedang bermasalah' });
    const req403 = new Request('http://test.local/api/designer/bank/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankCode: 'BCA', accountNumber: '11111111' }),
    });
    const res403 = await POST({ request: req403, params: {} } as unknown as ApiContext);
    expect(res403.status).toBe(400);

    mockValidate.mockResolvedValueOnce({ isValid: false, httpStatus: 500, message: 'Gagal memverifikasi rekening. Silakan periksa kembali nomor Anda.' });
    const req500 = new Request('http://test.local/api/designer/bank/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankCode: 'BCA', accountNumber: '11111111' }),
    });
    const res500 = await POST({ request: req500, params: {} } as unknown as ApiContext);
    expect(res500.status).toBe(500);
  });

  it('successfully validates bank account for all 9 official national banks', async () => {
    expect(SUPPORTED_BANK_CODES.length).toBe(9);
    expect(SUPPORTED_BANK_CODES).not.toContain('SEABANK');

    for (const bankCode of SUPPORTED_BANK_CODES) {
      bankValidateLimiter.reset();
      const mockName = bankCode === 'BCA' ? 'Ahmad Surya Pratama' : 'Test User';
      mockGetAuthUser.mockResolvedValue({ id: `usr_${bankCode}`, name: mockName, role: 'designer', status: 'active' });
      mockIsAuthorizedDesigner.mockReturnValue(true);

      const request = new Request('http://test.local/api/designer/bank/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankCode, accountNumber: '7891234560' }),
      });

      const res = await POST({ request, params: {} } as unknown as ApiContext);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.isValid).toBe(true);
      expect(typeof data.accountHolderName).toBe('string');
    }
  });

  describe('isAccountNameMatching helper', () => {
    it('normalizes titles and honorifics correctly', () => {
      expect(isAccountNameMatching('Dr. Budi Santoso, S.Kom., M.M.', 'BUDI SANTOSO')).toBe(true);
      expect(isAccountNameMatching('Ahmad Surya Pratama', 'AHMAD SURYA P')).toBe(true);
      expect(isAccountNameMatching('Ahmad Surya Pratama', 'SITI RAHMAWATI')).toBe(false);
      expect(isAccountNameMatching(null, 'BUDI')).toBe(true);
    });
  });
});
