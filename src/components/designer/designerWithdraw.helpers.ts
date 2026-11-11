import { apiFetch } from '@/lib/api/parse-response';
import type { BankAccount, PayoutHistoryItem } from '@/types';

export async function loadPayoutHistory(): Promise<{
  payouts: PayoutHistoryItem[];
  minPayoutLimit?: number;
} | null> {
  const result = await apiFetch<{ payouts?: PayoutHistoryItem[]; minPayoutLimit?: number }>(
    '/api/designer/payout',
    { fallbackError: 'Gagal memuat riwayat penarikan.' }
  );
  if (!result.success || !result.data) return null;
  return {
    payouts: result.data.payouts || [],
    minPayoutLimit: result.data.minPayoutLimit,
  };
}

export async function loadBankAccountsList(): Promise<BankAccount[]> {
  const result = await apiFetch<BankAccount | { accounts?: BankAccount[] }>(
    '/api/designer/bank-account'
  );
  if (!result.success || !result.data) return [];
  const dataObj = result.data as { accounts?: BankAccount[] };
  const rawAccounts: BankAccount[] = dataObj.accounts || [result.data as BankAccount];
  return rawAccounts.map((a) => {
    const r = a as unknown as Record<string, unknown>;
    const resolvedName = (a.accountHolder || a.holderName || r.accountHolderName || '') as string;
    return { ...a, holderName: resolvedName, accountHolder: resolvedName };
  });
}

export async function pollPayoutStatusApi(): Promise<{
  payouts: PayoutHistoryItem[];
  wallet?: { balance: number; availableBalance: number };
} | null> {
  const result = await apiFetch<{
    payouts?: PayoutHistoryItem[];
    wallet?: { balance: number; availableBalance: number };
  }>('/api/designer/payout/status');
  if (!result.success || !result.data) return null;
  return {
    payouts: result.data.payouts || [],
    wallet: result.data.wallet,
  };
}

export async function createBankAccountApi(payload: {
  bankName: string;
  accountNumber: string;
  holderName: string;
}) {
  return apiFetch<{ id?: string }>('/api/designer/bank-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bankCode: payload.bankName,
      bankName: payload.bankName,
      accountNumber: payload.accountNumber,
      accountHolder: payload.holderName,
      holderName: payload.holderName,
    }),
    fallbackError: 'Gagal menyimpan rekening bank.',
  });
}

export async function submitPayoutWithdrawal(
  amountNum: number,
  bankAccountId: string,
  idempotencyKey: string
) {
  return apiFetch<{ id: string; createdAt: string }>('/api/designer/payout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ amount: amountNum, bankAccountId, idempotencyKey }),
    fallbackError: 'Gagal mengajukan penarikan dana.',
  });
}

