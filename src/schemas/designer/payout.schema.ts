import { z } from 'zod';

export const payoutSchema = z.object({
  amount: z.number().int().positive('Nominal penarikan harus berupa angka positif'),
  bankAccountId: z.string().min(1, 'ID Rekening bank diperlukan').optional(),
});

export type PayoutInput = z.infer<typeof payoutSchema>;
