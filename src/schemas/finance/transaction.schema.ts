/**
 * Transaction Validation Schemas (Zod) - Finance Domain
 * Aligned with transactions table schema
 */

import { z } from 'zod';

export const TransactionInitiateInputSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.literal('template_purchase'),
  storeId: z.string().optional(),
  templateId: z.string().optional(),
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

