/**
 * Payment Service - Business logic for transaction orchestration (Finance Domain)
 * Uses transactions table from Drizzle schema
 */

import { db } from '@/lib/db/client';
import { transactions, users, templates, userTemplates, commissions, stores } from '@/db/schema';
import { xenditClient } from '@/lib/finance/xendit';
import { calculateCommission } from '@/services/finance/commission.service';
import { creditWallet } from '@/services/finance/wallet.service';
import { eq } from 'drizzle-orm';
import type { TransactionInitiateInput, TransactionRecord, TransactionType, PaymentStatus } from '@/types';

export const STORE_REGISTRATION_FEE_IDR = 100000;

// In-memory cache for invoice URLs
const invoiceUrlCache = new Map<string, string>();

export class TransactionService {
  async initiateTransaction(
    userId: string,
    input: TransactionInitiateInput,
    baseUrl: string
  ): Promise<{ invoiceId: string; paymentUrl: string }> {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length) throw new Error('User not found');

    if (input.type === 'store_registration' && input.amount !== STORE_REGISTRATION_FEE_IDR) {
      throw new Error(`Invalid amount. Expected ${STORE_REGISTRATION_FEE_IDR}, got ${input.amount}`);
    }

    const existingTx = await db.select().from(transactions).where(eq(transactions.userId, userId));
    if (existingTx.some((tx: { status: string }) => tx.status === 'pending')) {
      throw new Error('Payment already in progress');
    }

    const invoiceNum = `INV-${userId}-${Date.now()}`;
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const xenditInvoice = await xenditClient.createInvoice({
      invoiceNum,
      amount: input.amount,
      payerEmail: user[0].email,
      description: `Payment for ${input.type === 'store_registration' ? 'Store Registration' : 'Template Purchase'}`,
      expiryDate,
      successRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=success`,
      failureRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=failed`,
      metadata: { userId, type: input.type, storeId: input.storeId || null, templateId: input.templateId || null },
    });

    const transactionId = `txn_${Date.now()}`;
    const externalId = xenditInvoice?.invoiceNum || xenditInvoice?.id;
    await db.insert(transactions).values({
      id: transactionId,
      userId,
      type: input.type as TransactionType,
      amount: input.amount,
      status: 'pending' as PaymentStatus,
      storeId: input.storeId || null,
      templateId: input.templateId || null,
      externalId,
      paymentGatewayRef: xenditInvoice.id,
      paymentChannel: null,
      createdAt: new Date(),
    });

    if (xenditInvoice.invoiceUrl) {
      invoiceUrlCache.set(externalId, xenditInvoice.invoiceUrl);
    }

    return { invoiceId: externalId, paymentUrl: xenditInvoice.invoiceUrl || '' };
  }

  async processWebhook(payload: {
    id: string;
    external_id: string;
    amount: number;
    paid_amount?: number;
    status: string;
    paid?: boolean;
    paid_at?: string;
    payment_method?: string;
    payment_channel?: string;
  }): Promise<{ status: string; message: string }> {
    const status = payload.status?.toUpperCase() || 'PENDING';
    const isPaid = status === 'PAID' || status === 'SETTLED' || Boolean(payload.paid);

    const existingTxs = await db.select().from(transactions).where(eq(transactions.externalId, payload.external_id));
    if (!existingTxs.length) {
      // eslint-disable-next-line no-console
      console.warn(`Webhook received for unknown transaction: ${payload.external_id}`);
      return { status: 'not_found', message: 'Transaction not found' };
    }

    const transaction = existingTxs[0];
    if (transaction.status === 'success') {
      return { status: 'ignored', message: 'Already processed' };
    }

    let newStatus: PaymentStatus = 'pending';
    if (isPaid) newStatus = 'success';
    else if (status === 'FAILED') newStatus = 'failed';
    else if (status === 'EXPIRED') newStatus = 'expired';
    else if (status === 'CANCELED') newStatus = 'canceled';

    await db.update(transactions).set({
      status: newStatus,
      paymentGatewayRef: payload.id,
      paymentChannel: payload.payment_channel || payload.payment_method || 'xendit',
    }).where(eq(transactions.id, transaction.id));

    if (isPaid) {
      await this.fulfillPaidTransaction(transaction);
    }

    return { status: 'success', message: 'Webhook processed successfully' };
  }

  private async fulfillPaidTransaction(transaction: typeof transactions.$inferSelect): Promise<void> {
    if (transaction.type === 'template_purchase' && transaction.templateId) {
      const userTemplateId = `utpl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      try {
        await db.insert(userTemplates).values({
          id: userTemplateId,
          userId: transaction.userId,
          templateId: transaction.templateId,
          acquiredAt: new Date(),
        });
      } catch {
        // Ignore duplicate record
      }

      const templateList = await db.select().from(templates).where(eq(templates.id, transaction.templateId)).limit(1);
      if (templateList.length > 0) {
        const template = templateList[0];
        const { platformFee, designerAmount } = await calculateCommission(transaction.amount);

        const commissionId = `comm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        await db.insert(commissions).values({
          id: commissionId,
          designerId: template.designerId,
          transactionId: transaction.id,
          templateId: template.id,
          totalAmount: transaction.amount,
          platformFee,
          designerAmount,
          createdAt: new Date(),
        });

        await creditWallet({
          designerId: template.designerId,
          amount: designerAmount,
          description: `Komisi Penjualan Template: ${template.name}`,
          referenceId: transaction.id,
        });
      }
    } else if (transaction.type === 'store_registration') {
      const condition = transaction.storeId ? eq(stores.id, transaction.storeId) : eq(stores.userId, transaction.userId);
      await db.update(stores).set({ isRegistrationPaid: true, status: 'active', updatedAt: new Date() }).where(condition);
    }
  }

  async getTransactionDetails(externalId: string): Promise<TransactionRecord | null> {
    const results = await db.select().from(transactions).where(eq(transactions.externalId, externalId));
    if (!results.length) return null;
    return this.mapTransactionToRecord(results[0]);
  }

  async getInvoiceUrl(externalId: string): Promise<string | null> {
    try {
      if (invoiceUrlCache.has(externalId)) return invoiceUrlCache.get(externalId) || null;

      const txResults = await db.select().from(transactions).where(eq(transactions.externalId, externalId));
      if (!txResults.length || !txResults[0].paymentGatewayRef) return null;

      const xenditInvoice = await xenditClient.getInvoice(txResults[0].paymentGatewayRef);
      const invoiceUrl = xenditInvoice.invoiceUrl || null;
      if (invoiceUrl) invoiceUrlCache.set(externalId, invoiceUrl);
      return invoiceUrl;
    } catch {
      return null;
    }
  }

  private mapTransactionToRecord(tx: typeof transactions.$inferSelect): TransactionRecord {
    return {
      id: tx.id,
      userId: tx.userId,
      type: tx.type,
      amount: tx.amount,
      status: tx.status,
      storeId: tx.storeId || undefined,
      templateId: tx.templateId || undefined,
      externalId: tx.externalId,
      paymentGatewayRef: tx.paymentGatewayRef || undefined,
      paymentChannel: tx.paymentChannel || undefined,
      createdAt: tx.createdAt,
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }
}

export const transactionService = new TransactionService();
