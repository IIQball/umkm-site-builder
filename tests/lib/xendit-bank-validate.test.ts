import { describe, it, expect, vi, beforeEach } from 'vitest';
import { XenditClient } from '@/lib/finance/xendit';

describe('XenditClient.validateBankAccount', () => {
  let client: XenditClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new XenditClient();
  });

  it('uses mock adapter when no live or sandbox key is present', async () => {
    const clientWithKey = client as unknown as { apiKey: string };
    clientWithKey.apiKey = 'mock_key';

    const res = await client.validateBankAccount({ bankCode: 'BCA', accountNumber: '7128391829' });
    expect(res.isValid).toBe(true);
    expect(res.httpStatus).toBe(200);
    expect(res.accountHolderName).toContain('MOCK');

    const invalid = await client.validateBankAccount({ bankCode: 'BCA', accountNumber: '00000000' });
    expect(invalid.isValid).toBe(false);
    expect(invalid.httpStatus).toBe(404);
  });

  it('resolves official test account 1234567890 in sandbox mode', async () => {
    const clientWithKey = client as unknown as { apiKey: string };
    clientWithKey.apiKey = 'xnd_development_test_123';

    const res = await client.validateBankAccount({ bankCode: 'BCA', accountNumber: '1234567890' });
    expect(res.isValid).toBe(true);
    expect(res.isSandbox).toBe(true);
    expect(res.accountHolderName).toBe('TEST ACCOUNT SANDBOX');
  });

  it('calls official inquiries endpoint and converts 404 in sandbox to educational message', async () => {
    const clientWithKey = client as unknown as { apiKey: string };
    clientWithKey.apiKey = 'xnd_development_test_123';

    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error_code: 'NOT_FOUND', message: 'Resource not found' }),
    } as Response);

    const res = await client.validateBankAccount({ bankCode: 'BRI', accountNumber: '888899990000' });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.xendit.co/bank_account_data_inquiries',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: expect.stringContaining('Basic '),
        }),
        body: JSON.stringify({ bank_code: 'BRI', account_number: '888899990000' }),
      })
    );
    expect(res.isValid).toBe(false);
    expect(res.httpStatus).toBe(404);
    expect(res.message).toContain('Mode Sandbox: Gunakan nomor rekening pengujian Xendit');
  });

  it('handles live production inquiries: 200 success and 404 not found', async () => {
    const clientWithKey = client as unknown as { apiKey: string };
    clientWithKey.apiKey = 'xnd_production_live_456';

    // 200 OK
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ account_holder_name: 'DEWI SARTIKA' }),
    } as Response);

    const successRes = await client.validateBankAccount({ bankCode: 'MANDIRI', accountNumber: '137001928374' });
    expect(successRes.isValid).toBe(true);
    expect(successRes.accountHolderName).toBe('DEWI SARTIKA');

    // 404 in Production
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error_code: 'NOT_FOUND' }),
    } as Response);

    const failRes = await client.validateBankAccount({ bankCode: 'MANDIRI', accountNumber: '9999999999' });
    expect(failRes.isValid).toBe(false);
    expect(failRes.httpStatus).toBe(404);
    expect(failRes.message).toBe('Nomor rekening tidak terdaftar pada bank yang dipilih');
  });
});
