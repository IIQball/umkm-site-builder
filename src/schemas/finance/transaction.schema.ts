/**
 * Transaction Validation Schemas (Zod) - Finance Domain
 * Aligned with transactions table schema
 */

import { z } from 'zod';

export const TransactionInitiateInputSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['store_registration', 'template_purchase']),
  storeId: z.string().optional(),
  templateId: z.string().optional(),
}).superRefine((data, ctx) => {
  // store_registration: storeId dan templateId optional (toko belum ada)
  if (data.type === 'store_registration') {
    return;
  }

  // template_purchase: both storeId dan templateId wajib
  if (data.type === 'template_purchase') {
    if (!data.storeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['storeId'],
        message: 'storeId is required for template_purchase (tenant must already own a store)',
      });
    }
    if (!data.templateId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['templateId'],
        message: 'templateId is required for template_purchase',
      });
    }
  }
});

export type TransactionInitiateInput = z.infer<typeof TransactionInitiateInputSchema>;

export const XenditWebhookPayloadSchema = z.object({
  id: z.string(),
  external_id: z.string(),
  user_id: z.string().optional(),
  is_high: z.boolean().optional(),
  status: z.string(),
  merchant_name: z.string().optional(),
  amount: z.number(),
  paid_amount: z.number().optional(),
  bank_code: z.string().optional(),
  paid_at: z.string().optional(),
  payer_email: z.string().optional(),
  description: z.string().optional(),
  payment_method: z.string().optional(),
  payment_channel: z.string().optional(),
  payment_destination: z.string().optional(),
  currency: z.string().optional(),
}).passthrough();

export type XenditWebhookPayload = z.infer<typeof XenditWebhookPayloadSchema>;

export const TemplatePurchaseInputSchema = z.object({
  templateId: z.string().min(1, 'templateId is required'),
});

export type TemplatePurchaseInput = z.infer<typeof TemplatePurchaseInputSchema>;

