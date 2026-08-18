/**
 * Payment service - business logic for payment processing
 * Uses transactions table from Drizzle schema
 */

import { db } from '@/lib/db/client';
import { transactions, users } from '@/db/schema';
import { xenditClient } from '@/lib/xendit';
import { eq } from 'drizzle-orm';
import type { TransactionInitiateInput, TransactionRecord, TransactionType, PaymentStatus } from '@/types/transactions';

export const STORE_REGISTRATION_FEE_IDR = 100000; // 100,000 IDR

// In-memory cache for invoice URLs (temp solution until DB schema updated)
const invoiceUrlCache = new Map<string, string>();

export class TransactionService {
  /**
   * Initiate a transaction - creates invoice on Xendit and records in DB
   */
  async initiateTransaction(
    userId: string,
    input: TransactionInitiateInput,
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
    if (input.type === 'store_registration' && input.amount !== STORE_REGISTRATION_FEE_IDR) {
      throw new Error(`Invalid amount. Expected ${STORE_REGISTRATION_FEE_IDR}, got ${input.amount}`);
    }

    // Check for existing pending transaction
    const existingTx = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId));

    const hasPendingTx = existingTx.some(tx => tx.status === 'pending');
    if (hasPendingTx) {
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
        description: `Payment for ${input.type === 'store_registration' ? 'Store Registration' : 'Template Purchase'}`,
        expiryDate,
        successRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=success`,
        failureRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=failed`,
        metadata: {
          userId,
          type: input.type,
          storeId: input.storeId || null,
          templateId: input.templateId || null,
        },
      });

      // Record transaction in database
      const transactionId = `txn_${Date.now()}`;
      const externalId = xenditInvoice?.invoiceNum || xenditInvoice?.id;
      await db.insert(transactions).values({
        id: transactionId,
        userId,
        type: input.type as TransactionType,
        amount: Math.round(input.amount * 100), // Store in cents
        status: 'pending' as PaymentStatus,
        storeId: input.storeId || null,
        templateId: input.templateId || null,
        externalId,
        paymentGatewayRef: xenditInvoice.id,
        paymentChannel: null,
        createdAt: new Date(),
      });

      // Cache invoice URL for later retrieval
      if (xenditInvoice.invoiceUrl) {
        invoiceUrlCache.set(externalId, xenditInvoice.invoiceUrl);
      }

      return {
        invoiceId: externalId,
        paymentUrl: xenditInvoice.invoiceUrl || '',
      };
    } catch (error) {
      console.error('[TransactionService] Failed to initiate payment:', error);
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
    const externalId = payload.external_id;
    const xenditId = payload.id;
    const status = payload.status?.toUpperCase() || 'PENDING';
    const isPaid = status === 'PAID' || payload.paid;

    try {
      // Find existing transaction by external ID (invoice number)
      const existingTxs = await db
        .select()
        .from(transactions)
        .where(eq(transactions.externalId, externalId));

      if (!existingTxs.length) {
        console.warn(
          `[TransactionService] Webhook received for unknown transaction: ${externalId}`
        );
        return;
      }

      const transaction = existingTxs[0];

      // Map Xendit status to PaymentStatus
      let newStatus: PaymentStatus = 'pending';
      if (isPaid) {
        newStatus = 'success';
      } else if (status === 'FAILED') {
        newStatus = 'failed';
      } else if (status === 'EXPIRED') {
        newStatus = 'expired';
      } else if (status === 'CANCELED') {
        newStatus = 'canceled';
      }

      // Check if already processed (idempotency)
      if (transaction.status === 'success' && isPaid) {
        console.log(`[TransactionService] Transaction already processed: ${externalId}`);
        return;
      }

      // Update transaction status
      await db
        .update(transactions)
        .set({
          status: newStatus,
          paymentGatewayRef: xenditId,
          paymentChannel: payload.payment_channel || null,
        })
        .where(eq(transactions.id, transaction.id));

      console.log(`[TransactionService] Transaction updated: ${externalId} -> ${newStatus}`);
    } catch (error) {
      console.error('[TransactionService] Failed to process webhook:', error);
      throw error;
    }
  }

  /**
   * Get transaction details for checkout page
   */
  async getTransactionDetails(externalId: string): Promise<TransactionRecord | null> {
    try {
      // Query by external ID (invoice number)
      const results = await db
        .select()
        .from(transactions)
        .where(eq(transactions.externalId, externalId));

      if (!results.length) {
        return null;
      }

      const tx = results[0];
      return this.mapTransactionToRecord(tx);
    } catch (error) {
      console.error('[TransactionService] Failed to get transaction details:', error);
      throw error;
    }
  }

  /**
   * Get full invoice details including payment URL from Xendit
   */
  async getInvoiceUrl(externalId: string): Promise<string | null> {
    try {
      // Check cache first
      if (invoiceUrlCache.has(externalId)) {
        return invoiceUrlCache.get(externalId) || null;
      }

      // Query transaction to get paymentGatewayRef
      const txResults = await db
        .select()
        .from(transactions)
        .where(eq(transactions.externalId, externalId));

      if (!txResults.length || !txResults[0].paymentGatewayRef) {
        return null;
      }

      // Fetch from Xendit using paymentGatewayRef (Xendit's invoice ID)
      const xenditInvoice = await xenditClient.getInvoice(txResults[0].paymentGatewayRef);
      const invoiceUrl = xenditInvoice.invoiceUrl || null;

      // Cache for future use
      if (invoiceUrl) {
        invoiceUrlCache.set(externalId, invoiceUrl);
      }

      return invoiceUrl;
    } catch (error) {
      console.error('[TransactionService] Failed to fetch invoice URL:', error);
      return null;
    }
  }

  private mapTransactionToRecord(tx: {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    status: PaymentStatus;
    storeId: string | null;
    templateId: string | null;
    externalId: string;
    paymentGatewayRef: string | null;
    paymentChannel: string | null;
    createdAt: Date;
  }): TransactionRecord {
    return {
      id: tx.id,
      userId: tx.userId,
      type: tx.type,
      amount: tx.amount / 100, // Convert from cents
      status: tx.status,
      storeId: tx.storeId || undefined,
      templateId: tx.templateId || undefined,
      externalId: tx.externalId,
      paymentGatewayRef: tx.paymentGatewayRef || undefined,
      paymentChannel: tx.paymentChannel || undefined,
      createdAt: tx.createdAt,
    };
  }

  /**
   * Format amount to IDR with proper formatting
   */
  formatCurrency(amountInCents: number): string {
    const amount = amountInCents / 100;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }
}

export const transactionService = new TransactionService();
