/**
 * Payment service - business logic for payment processing
 */

import { db } from '@/lib/db/client';
import { payments, users } from '@/db/schema';
import { xenditClient } from '@/lib/xendit';
import { eq } from 'drizzle-orm';
import type { PaymentInitiateInput, PaymentRecord } from '@/types/payments';

export const ACTIVATION_FEE_IDR = 100000; // 100,000 IDR

export class PaymentService {
  /**
   * Initiate a payment - creates invoice on Xendit and records in DB
   */
  async initiatePayment(
    userId: string,
    input: PaymentInitiateInput,
    baseUrl: string
  ): Promise<{ invoiceId: string; paymentUrl: string }> {
    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      throw new Error('User not found');
    }

    const userEmail = user[0].email;

    // Validate amount matches server configuration
    if (input.type === 'activation_fee' && input.amount !== ACTIVATION_FEE_IDR) {
      throw new Error(`Invalid amount. Expected ${ACTIVATION_FEE_IDR}, got ${input.amount}`);
    }

    // Check for existing pending payment
    const existingPayment = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .limit(1);

    if (existingPayment.length && existingPayment[0].status === 'pending') {
      throw new Error('Payment already in progress');
    }

    // Generate unique invoice number
    const invoiceNum = `INV-${userId}-${Date.now()}`;
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    try {
      // Create invoice on Xendit
      const xenditInvoice = await xenditClient.createInvoice({
        invoiceNum,
        amount: input.amount,
        payerEmail: userEmail,
        description: `Payment for ${input.type === 'activation_fee' ? 'Account Activation' : 'Template Purchase'}`,
        expiryDate,
        successRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=success`,
        failureRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=failed`,
        metadata: {
          userId,
          type: input.type,
          templateId: input.templateId || null,
        },
      });

      // Record payment in database
      const paymentId = `pay_${Date.now()}`;
      await db.insert(payments).values({
        id: paymentId,
        userId,
        amount: Math.round(input.amount * 100), // Store in cents
        transactionId: xenditInvoice.id,
        status: 'pending',
        provider: 'xendit',
        metadata: {
          invoiceId: xenditInvoice.invoiceNum || xenditInvoice.id,
          invoiceUrl: xenditInvoice.invoiceUrl,
          type: input.type,
          templateId: input.templateId || null,
        },
      });

      return {
        invoiceId: xenditInvoice.invoiceNum || xenditInvoice.id,
        paymentUrl: xenditInvoice.invoiceUrl || '',
      };
    } catch (error) {
      console.error('[PaymentService] Failed to initiate payment:', error);
      throw error;
    }
  }

  /**
   * Process webhook from Xendit
   * Idempotent - safe to call multiple times for same transaction
   */
  async processWebhook(payload: {
    id: string;
    external_id: string;
    amount: number;
    paid_amount: number;
    status: string;
    paid: boolean;
    paid_at?: string;
    payment_method?: string;
    payment_channel?: string;
  }): Promise<void> {
    const transactionId = payload.id;
    const invoiceNum = payload.external_id;
    const status = payload.status?.toUpperCase() || 'PENDING';
    const isPaid = status === 'PAID' || payload.paid;

    try {
      // Find existing payment by Xendit transaction ID
      const existingPayments = await db
        .select()
        .from(payments)
        .where(eq(payments.transactionId, transactionId));

      if (!existingPayments.length) {
        console.warn(
          `[PaymentService] Webhook received for unknown transaction: ${transactionId}`
        );
        throw new Error('Payment record not found');
      }

      const payment = existingPayments[0];

      // Check if already processed (idempotency)
      if (payment.status === 'completed' && isPaid) {
        console.log(`[PaymentService] Payment already processed: ${transactionId}`);
        return;
      }

      // Update payment status
      const newStatus = isPaid ? 'completed' : status === 'FAILED' ? 'failed' : 'pending';

      const existingMetadata = (payment.metadata as Record<string, any>) || {};
      
      await db
        .update(payments)
        .set({
          status: newStatus as any,
          metadata: {
            ...existingMetadata,
            invoiceId: invoiceNum,
            paidAt: payload.paid_at,
            method: payload.payment_method,
            channel: payload.payment_channel,
          } as any,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, payment.id));

      console.log(`[PaymentService] Payment updated: ${transactionId} -> ${newStatus}`);
    } catch (error) {
      console.error('[PaymentService] Failed to process webhook:', error);
      throw error;
    }
  }

  /**
   * Get payment details for checkout page
   */
  async getPaymentDetails(invoiceNum: string): Promise<PaymentRecord | null> {
    try {
      // Query by transactionId OR metadata invoiceId
      const results = await db
        .select()
        .from(payments)
        .where(eq(payments.transactionId, invoiceNum));

      if (results.length) {
        const payment = results[0];
        return this.mapPaymentToRecord(payment);
      }

      // Fallback: search by invoiceNum in metadata (if not found by transactionId)
      const allPayments = await db.select().from(payments);
      const payment = allPayments.find(
        (p: any) => (p.metadata as Record<string, any>)?.invoiceId === invoiceNum
      );

      if (!payment) {
        return null;
      }

      return this.mapPaymentToRecord(payment);
    } catch (error) {
      console.error('[PaymentService] Failed to get payment details:', error);
      throw error;
    }
  }

  private mapPaymentToRecord(payment: any): PaymentRecord {
    return {
      id: payment.id,
      userId: payment.userId,
      amount: payment.amount / 100,
      transactionId: payment.transactionId,
      status: payment.status as any,
      provider: payment.provider,
      metadata: payment.metadata as any,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}

export const paymentService = new PaymentService();
