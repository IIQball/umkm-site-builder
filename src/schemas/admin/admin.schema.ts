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
});

export type CommissionSettingsInput = z.infer<typeof commissionSettingsSchema>;
