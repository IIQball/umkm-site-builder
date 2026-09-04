import { z } from 'zod';

export const bankAccountSchema = z.preprocess((val: unknown) => {
  if (val && typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    return {
      ...obj,
      accountHolder: obj.accountHolder || obj.holderName || obj.accountHolderName,
    };
  }
  return val;
}, z.object({
  bankName: z.string().min(2, 'Nama bank minimal 2 karakter').max(50, 'Nama bank maksimal 50 karakter').trim(),
  accountNumber: z.string().min(5, 'Nomor rekening minimal 5 karakter').max(30, 'Nomor rekening maksimal 30 karakter').regex(/^\d+$/, 'Nomor rekening harus berupa angka').trim(),
  accountHolder: z.string().min(2, 'Nama pemilik rekening minimal 2 karakter').max(100, 'Nama pemilik rekening maksimal 100 karakter').trim(),
}));

export type BankAccountInput = z.infer<typeof bankAccountSchema>;
