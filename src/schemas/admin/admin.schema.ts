import { z } from 'zod';

export const reviewTemplateSchema = z
  .object({
    action: z.enum(['approve', 'reject']),
    rejectionReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.action === 'reject') {
        return typeof data.rejectionReason === 'string' && data.rejectionReason.trim().length >= 5;
      }
      return true;
    },
    {
      message: 'Alasan penolakan wajib diisi minimal 5 karakter',
      path: ['rejectionReason'],
    }
  );

export type ReviewTemplateInput = z.infer<typeof reviewTemplateSchema>;

export const commissionSettingsSchema = z.object({
  platformFeePercentage: z.number().int().min(0).max(100),
  payoutMinimumBalance: z.number().int().min(0).optional(),
  settlementDelayDays: z.number().int().min(0).optional(),
});

export type CommissionSettingsInput = z.infer<typeof commissionSettingsSchema>;

export const adminWhitelistSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
  confirmPassword: z.string().min(8, 'Konfirmasi sandi minimal 8 karakter'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi kata sandi tidak cocok",
  path: ["confirmPassword"],
});

export type AdminWhitelistInput = z.infer<typeof adminWhitelistSchema>;

export const adminStatusUpdateSchema = z.object({
  status: z.enum(['active', 'suspended']),
  suspendReason: z.string().optional(),
}).refine(
  (data) => {
    if (data.status === 'suspended') {
      return typeof data.suspendReason === 'string' && data.suspendReason.trim().length >= 5;
    }
    return true;
  },
  {
    message: 'Alasan penangguhan wajib diisi minimal 5 karakter',
    path: ['suspendReason'],
  }
);

export type AdminStatusUpdateInput = z.infer<typeof adminStatusUpdateSchema>;

export const manualUserRegistrationSchema = z.object({
  role: z.enum(['tenant', 'designer'], { required_error: 'Peran wajib dipilih' }),
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
  confirmPassword: z.string().min(8, 'Konfirmasi sandi minimal 8 karakter'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi kata sandi tidak cocok",
  path: ["confirmPassword"],
});

export type ManualUserRegistrationInput = z.infer<typeof manualUserRegistrationSchema>;
