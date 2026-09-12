import { z } from 'zod';

export const SUPPORTED_BANK_CODES = [
  'BCA',
  'BRI',
  'MANDIRI',
  'BNI',
  'BTN',
  'BSI',
  'CIMB',
  'MAYBANK',
  'PERMATA',
] as const;

export type SupportedBankCode = (typeof SUPPORTED_BANK_CODES)[number];

export const bankValidateSchema = z.object({
  bankCode: z
    .string()
    .trim()
    .toUpperCase()
    .refine((val): val is SupportedBankCode => SUPPORTED_BANK_CODES.includes(val as SupportedBankCode), {
      message: 'Kode bank tidak didukung. Pilih salah satu dari 9 bank resmi.',
    }),
  accountNumber: z
    .string()
    .trim()
    .min(5, 'Nomor rekening minimal 5 karakter')
    .max(30, 'Nomor rekening maksimal 30 karakter')
    .regex(/^\d+$/, 'Nomor rekening harus berupa angka'),
});

export type BankValidateInput = z.infer<typeof bankValidateSchema>;
