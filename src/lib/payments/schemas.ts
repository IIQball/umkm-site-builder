/**
 * Payment validation schemas (Zod)
 */

import { z } from 'zod';

export const PaymentInitiateInputSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['activation_fee', 'template_purchase']),
  templateId: z.string().optional(),
}).refine(
  (data) => data.type === 'template_purchase' ? !!data.templateId : true,
  {
    message: 'templateId is required for template_purchase',
    path: ['templateId'],
  }
);

export type PaymentInitiateInput = z.infer<typeof PaymentInitiateInputSchema>;

export const XenditWebhookPayloadSchema = z.object({
  id: z.string(),
  invoiceNum: z.string().optional(),
  userId: z.string().optional(),
  userEmail: z.string().email().optional(),
  amount: z.number().positive(),
  paidAmount: z.number().min(0),
  payerEmail: z.string().email().optional(),
  description: z.string().optional(),
  expiryDate: z.string().optional(),
  invoiceUrl: z.string().url().optional(),
  status: z.enum(['PAID', 'PENDING', 'EXPIRED', 'SETTLED']),
  paid: z.boolean(),
  paidAt: z.string().datetime().optional(),
  paymentMethod: z.string().optional(),
  paymentChannel: z.string().optional(),
  created: z.string().datetime().optional(),
  updated: z.string().datetime().optional(),
  currency: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type XenditWebhookPayload = z.infer<typeof XenditWebhookPayloadSchema>;
