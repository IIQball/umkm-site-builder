/**
 * Payment Service - Business logic for transaction orchestration (Finance Domain)
 * Uses transactions table from Drizzle schema
 */

import { db } from '@/lib/db/client';
import { transactions, users, templates, userTemplates, commissions } from '@/db/schema';
import { xenditClient } from '@/lib/finance/xendit';
import { calculateCommission } from '@/services/finance/commission.service';
import { creditWallet } from '@/services/finance/wallet.service';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { AppError, formatCurrency } from '@/lib/utils';
import type { TransactionInitiateInput, TransactionRecord, TransactionType, PaymentStatus } from '@/types';

// In-memory cache for invoice URLs
const invoiceUrlCache = new Map<string, string>();

export class TransactionService {
  async initiateTransaction(
    userId: string,
    input: TransactionInitiateInput,
    baseUrl: string
  ): Promise<{ invoiceId: string; paymentUrl: string }> {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length) throw new AppError('User not found', 404);

    const existingTx = await db.select().from(transactions).where(eq(transactions.userId, userId));
    if (existingTx.some((tx: { status: string }) => tx.status === 'pending')) {
      throw new AppError('Payment already in progress', 400);
    }

    const invoiceNum = `INV-${userId}-${Date.now()}`;
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const xenditInvoice = await xenditClient.createInvoice({
      invoiceNum,
      amount: input.amount,
      payerEmail: user[0].email,
      description: 'Payment for Template Purchase',
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

  async purchaseTemplate(
    userId: string,
    templateId: string,
    baseUrl: string
  ): Promise<{ isFree: boolean; message?: string; data?: { invoiceUrl: string; invoiceId: string; externalId: string } }> {
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
      throw new AppError('Template already owned', 400, undefined, 'TEMPLATE_ALREADY_OWNED');
    }

    // Free template case
    if (template.price === 0) {
      const userTemplateId = `utpl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await db.insert(userTemplates).values({
        id: userTemplateId,
        userId,
        templateId: template.id,
        acquiredAt: new Date(),
      });

      return { isFree: true, message: 'Free template added to your account successfully' };
    }

    // Paid template case
    const invoiceNum = `INV-${userId}-${Date.now()}`;

    const xenditInvoice = await xenditClient.createInvoice({
      invoiceNum,
      amount: template.price,
      payerEmail: user[0].email,
      description: `Pembelian Template: ${template.name}`,
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      successRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=success`,
      failureRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=failed`,
      metadata: {
        userId,
        type: 'template_purchase',
        templateId: template.id,
      },
    });

    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await db.insert(transactions).values({
      id: transactionId,
      userId,
      type: 'template_purchase',
      amount: template.price,
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

  async getTenantOrders(userId: string) {
    return db.query.transactions.findMany({
      where: and(
        eq(transactions.userId, userId),
        eq(transactions.type, 'template_purchase')
      ),
      with: {
        template: true,
      },
      orderBy: [desc(transactions.createdAt)],
    });
  }

  async getDesignerIncomingOrders(designerId: string) {
    const designerTemplates = await db.query.templates.findMany({
      where: eq(templates.designerId, designerId),
      columns: { id: true },
    });

    if (!designerTemplates.length) return [];

    const templateIds = designerTemplates.map((t: { id: string }) => t.id);

    return db.query.transactions.findMany({
      where: and(
        inArray(transactions.templateId, templateIds),
        eq(transactions.type, 'template_purchase')
      ),
      with: {
        template: true,
        user: {
          columns: { id: true, name: true, email: true, image: true },
        },
        commission: true,
      },
      orderBy: [desc(transactions.createdAt)],
    });
  }

  formatCurrency(amount: number): string {
    return formatCurrency(amount);
  }
}

export const transactionService = new TransactionService();
