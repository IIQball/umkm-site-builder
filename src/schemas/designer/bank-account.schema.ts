import { z } from 'zod';

export const bankAccountSchema = z.object({
  bankName: z.string().min(2, 'Nama bank minimal 2 karakter').max(50, 'Nama bank maksimal 50 karakter').trim(),
  accountNumber: z.string().min(5, 'Nomor rekening minimal 5 karakter').max(30, 'Nomor rekening maksimal 30 karakter').regex(/^\d+$/, 'Nomor rekening harus berupa angka').trim(),
  accountHolder: z.string().min(2, 'Nama pemilik rekening minimal 2 karakter').max(100, 'Nama pemilik rekening maksimal 100 karakter').trim().optional(),
  holderName: z.string().min(2, 'Nama pemilik rekening minimal 2 karakter').max(100, 'Nama pemilik rekening maksimal 100 karakter').trim().optional(),
}).refine((data) => Boolean(data.accountHolder || data.holderName), {
  message: 'Nama pemilik rekening minimal 2 karakter',
  path: ['accountHolder'],
}).transform((data) => ({
  bankName: data.bankName,
  accountNumber: data.accountNumber,
  accountHolder: (data.accountHolder || data.holderName)!.trim(),
  holderName: (data.accountHolder || data.holderName)!.trim(),
}));

export type BankAccountInput = z.infer<typeof bankAccountSchema>;
