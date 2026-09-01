import { db } from '@/lib/db/client';
import { transactions, templates, userTemplates, commissions } from '@/db/schema';
import { calculateCommission } from '@/services/finance/commission.service';
import { creditWallet } from '@/services/finance/wallet.service';
import { eq, and, desc, inArray } from 'drizzle-orm';
import type { TransactionRecord } from '@/types';

export function mapTransactionToRecord(tx: typeof transactions.$inferSelect): TransactionRecord {
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

export async function fulfillPaidTransaction(transaction: typeof transactions.$inferSelect): Promise<void> {
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

export async function queryTenantOrders(userId: string) {
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

export async function queryDesignerIncomingOrders(designerId: string) {
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
