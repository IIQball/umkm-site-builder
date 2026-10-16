/**
 * Payment Service - Business logic for transaction orchestration (Finance Domain)
 * Uses transactions table from Drizzle schema
 */

import { db } from '@/lib/db/client';
import { transactions, users, templates, userTemplates } from '@/db/schema';
import { xenditClient } from '@/lib/finance/xendit';
import { eq, and } from 'drizzle-orm';
import { AppError, formatCurrency } from '@/lib/utils';
import { idempotencyManager } from '@/lib/finance/idempotency';
import type { TransactionInitiateInput, TransactionRecord, TransactionType, PaymentStatus } from '@/types';
import {
  mapTransactionToRecord,
  fulfillPaidTransaction,
  queryTenantOrders,
  queryDesignerIncomingOrders,
  fetchInvoiceUrl,
  invoiceUrlCache,
  formatInvoiceNum,
  grantFreeTemplate,
  getTransactionByExternalId,
} from './transaction.helpers';
import { getAdminServiceFee } from './commission.service';

export * from './transaction.helpers';

export class TransactionService {
  async initiateTransaction(
    userId: string,
    input: TransactionInitiateInput,
    baseUrl: string,
    idempotencyKey?: string | null
  ): Promise<{ invoiceId: string; paymentUrl: string }> {
    const { cleanKey, invoiceNum } = formatInvoiceNum(userId, idempotencyKey || input.idempotencyKey);

    const checkExistingInDb = async () => {
      if (!cleanKey) return null;
      const existing = await getTransactionByExternalId(invoiceNum);
      if (!existing) return null;
      const invoiceUrl = (await this.getInvoiceUrl(existing.externalId)) || '';
      return { invoiceId: existing.externalId, paymentUrl: invoiceUrl };
    };

    const executeCore = async () => {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user.length) throw new AppError('User not found', 404);

      const existingTx = await db.select().from(transactions).where(eq(transactions.userId, userId));
      if (existingTx.some((tx: { status: string }) => tx.status === 'pending')) {
        throw new AppError('Payment already in progress', 400);
      }

      const adminFee = input.assistedBy
        ? (input.adminFee !== undefined ? input.adminFee : await getAdminServiceFee())
        : 0;
      const totalAmount = input.adminFee !== undefined ? input.amount : input.amount + adminFee;
      const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const xenditInvoice = await xenditClient.createInvoice({
        invoiceNum,
        amount: totalAmount,
        payerEmail: user[0].email,
        description: 'Payment for Template Purchase',
        expiryDate,
        successRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=success`,
        failureRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=failed`,
        metadata: {
          userId,
          type: input.type,
          storeId: input.storeId || null,
          templateId: input.templateId || null,
          assistedBy: input.assistedBy || null,
          adminFee,
          idempotencyKey: cleanKey || null,
        },
      });

      const externalId = xenditInvoice?.invoiceNum || xenditInvoice?.id;
      await db.insert(transactions).values({
        id: `txn_${Date.now()}`,
        userId,
        type: input.type as TransactionType,
        amount: totalAmount,
        adminFee,
        assistedBy: input.assistedBy || null,
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
    };

    if (cleanKey) {
      return idempotencyManager.execute({
        key: `initiate_${userId}_${cleanKey}`,
        fn: executeCore,
        checkDb: checkExistingInDb,
      });
    }

    return executeCore();
  }

  async purchaseTemplate(
    userId: string,
    templateId: string,
    baseUrl: string,
    assistedBy?: string | null,
    idempotencyKey?: string | null
  ): Promise<{ isFree: boolean; message?: string; data?: { invoiceUrl: string; invoiceId: string; externalId: string } }> {
    const { cleanKey, invoiceNum } = formatInvoiceNum(userId, idempotencyKey);

    const checkExistingInDb = async () => {
      if (!cleanKey) return null;
      const tx = await getTransactionByExternalId(invoiceNum);
      if (!tx) return null;
      const invoiceUrl = (await this.getInvoiceUrl(tx.externalId)) || '';
      return {
        isFree: false,
        data: {
          invoiceUrl,
          invoiceId: tx.paymentGatewayRef || '',
          externalId: tx.externalId,
        },
      };
    };

    const executeCore = async () => {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user.length) throw new AppError('Authentication required', 401);

      const template = await db.query.templates.findFirst({
        where: and(eq(templates.id, templateId), eq(templates.status, 'approved')),
      });

      if (!template) {
        throw new AppError('Template not found or not approved', 404);
      }

      const existingOwnership = await db.query.userTemplates.findFirst({
        where: and(eq(userTemplates.userId, userId), eq(userTemplates.templateId, templateId)),
      });

      if (existingOwnership) {
        if (cleanKey && template.price === 0) {
          return { isFree: true, message: 'Free template added to your account successfully' };
        }
        throw new AppError('Template already owned', 400, undefined, 'TEMPLATE_ALREADY_OWNED');
      }

      if (template.price === 0) {
        return grantFreeTemplate(userId, user[0].name, template, assistedBy);
      }

      const adminFee = assistedBy ? await getAdminServiceFee() : 0;
      const totalAmount = template.price + adminFee;

      const xenditInvoice = await xenditClient.createInvoice({
        invoiceNum,
        amount: totalAmount,
        payerEmail: user[0].email,
        description: `Pembelian Template: ${template.name}`,
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        successRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=success`,
        failureRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=failed`,
        metadata: {
          userId,
          type: 'template_purchase',
          templateId: template.id,
          assistedBy: assistedBy || null,
          adminFee,
          idempotencyKey: cleanKey || null,
        },
      });

      await db.insert(transactions).values({
        id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        userId,
        type: 'template_purchase',
        amount: totalAmount,
        adminFee,
        assistedBy: assistedBy || null,
        status: 'pending',
        templateId: template.id,
        externalId: invoiceNum,
        paymentGatewayRef: xenditInvoice.id,
        paymentChannel: null,
        createdAt: new Date(),
      });

      return {
        isFree: false,
        data: {
          invoiceUrl: xenditInvoice.invoiceUrl || '',
          invoiceId: xenditInvoice.id,
          externalId: invoiceNum,
        },
      };
    };

    if (cleanKey) {
      return idempotencyManager.execute({
        key: `purchase_${userId}_${cleanKey}`,
        fn: executeCore,
        checkDb: checkExistingInDb,
      });
    }

    return executeCore();
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

    const transaction = await getTransactionByExternalId(payload.external_id);
    if (!transaction) {
      console.warn(`Webhook received for unknown transaction: ${payload.external_id}`);
      return { status: 'not_found', message: 'Transaction not found' };
    }

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
      await fulfillPaidTransaction(transaction);
    }

    return { status: 'success', message: 'Webhook processed successfully' };
  }

  async getTransactionDetails(externalId: string): Promise<TransactionRecord | null> {
    const tx = await getTransactionByExternalId(externalId);
    return tx ? mapTransactionToRecord(tx) : null;
  }

  async getInvoiceUrl(externalId: string): Promise<string | null> {
    return fetchInvoiceUrl(externalId);
  }

  async getTenantOrders(userId: string) {
    return queryTenantOrders(userId);
  }

  async getDesignerIncomingOrders(designerId: string) {
    return queryDesignerIncomingOrders(designerId);
  }

  formatCurrency(amount: number): string {
    return formatCurrency(amount);
  }
}

export const transactionService = new TransactionService();
