import { db } from '@/lib/db/client';
import { transactions, templates, userTemplates, commissions, notifications, users } from '@/db/schema';
import { calculateCommission } from '@/services/finance/commission.service';
import { creditWallet } from '@/services/finance/wallet.service';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { xenditClient } from '@/lib/finance/xendit';
import type { TransactionRecord } from '@/types';
import { formatIDR } from '@/lib/currency';

export function mapTransactionToRecord(tx: typeof transactions.$inferSelect): TransactionRecord {
  return {
    id: tx.id,
    userId: tx.userId,
    type: tx.type,
    amount: tx.amount,
    adminFee: tx.adminFee,
    status: tx.status,
    storeId: tx.storeId || undefined,
    templateId: tx.templateId || undefined,
    assistedBy: tx.assistedBy || undefined,
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
      const adminAmount = Number(transaction.adminFee || 0);
      const baseAmount = Math.max(0, Number(transaction.amount) - adminAmount);
      const { platformFee, designerAmount } = await calculateCommission(baseAmount);

      const commissionId = `comm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await db.insert(commissions).values({
        id: commissionId,
        designerId: template.designerId,
        adminId: transaction.assistedBy || null,
        transactionId: transaction.id,
        templateId: template.id,
        totalAmount: transaction.amount,
        platformFee,
        designerAmount,
        adminAmount,
        createdAt: new Date(),
      });

      await creditWallet({
        designerId: template.designerId,
        amount: designerAmount,
        description: `Komisi Penjualan Template: ${template.name}`,
        referenceId: transaction.id,
      });

      if (adminAmount > 0 && transaction.assistedBy) {
        await creditWallet({
          designerId: transaction.assistedBy,
          amount: adminAmount,
          description: 'Fee Pendampingan Pembelian Template',
          referenceId: transaction.id,
        });
      }
      
      // Send notification to designer
      try {
        const buyer = await db
          .select({ name: users.name })
          .from(users)
          .where(eq(users.id, transaction.userId))
          .limit(1);
        const buyerName = buyer.length > 0 && buyer[0].name ? buyer[0].name : 'Seseorang';
        
        await db.insert(notifications).values({
          id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          userId: template.designerId,
          type: 'template_purchased',
          title: 'Template Terjual',
          message: `${buyerName} telah membeli template "${template.name}". Komisi sebesar ${formatIDR(designerAmount)} telah ditambahkan ke saldo Anda.`,
          metadata: { templateId: template.id, transactionId: transaction.id }
        });

        if (transaction.assistedBy) {
          await db.insert(notifications).values({
            id: `notif_${Date.now()}_tenant_${Math.random().toString(36).slice(2, 7)}`,
            userId: transaction.userId,
            type: 'template_purchased',
            title: 'Template Berhasil Dibeli',
            message: `Admin telah membantu membelikan template "${template.name}" untuk toko Anda.`,
            metadata: { templateId: template.id, transactionId: transaction.id }
          });
        }
      } catch {
        // Non-blocking notification dispatch
      }
    }
  }
}

export async function queryTenantOrders(userId: string, limit: number = 10, offset: number = 0) {
  return db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, userId),
      eq(transactions.type, 'template_purchase')
    ),
    columns: {
      id: true,
      userId: true,
      type: true,
      amount: true,
      adminFee: true,
      status: true,
      storeId: true,
      templateId: true,
      assistedBy: true,
      externalId: true,
      paymentGatewayRef: true,
      paymentChannel: true,
      createdAt: true,
    },
    with: {
      template: {
        columns: {
          id: true,
          name: true,
          thumbnailUrl: true,
          price: true,
        },
      },
      assistant: {
        columns: { id: true, name: true, email: true },
      },
    },
    orderBy: [desc(transactions.createdAt)],
    limit,
    offset,
  });
}

export async function queryDesignerIncomingOrders(designerId: string, limit: number = 10, offset: number = 0) {
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
    columns: {
      id: true,
      userId: true,
      type: true,
      amount: true,
      adminFee: true,
      status: true,
      storeId: true,
      templateId: true,
      assistedBy: true,
      externalId: true,
      paymentGatewayRef: true,
      paymentChannel: true,
      createdAt: true,
    },
    with: {
      template: {
        columns: {
          id: true,
          name: true,
          thumbnailUrl: true,
          price: true,
        },
      },
      user: {
        columns: { id: true, name: true, email: true, image: true },
      },
      commission: {
        columns: {
          id: true,
          designerAmount: true,
          platformFee: true,
          totalAmount: true,
        },
      },
    },
    orderBy: [desc(transactions.createdAt)],
    limit,
    offset,
  });
}
export async function getTransactionByExternalId(externalId: string) {
  const query = db.select().from(transactions).where(eq(transactions.externalId, externalId));
  const hasLimit = 'limit' in query && typeof (query as { limit?: (n: number) => Promise<unknown> }).limit === 'function';
  const rawResults = hasLimit ? await (query as { limit: (n: number) => Promise<unknown[]> }).limit(1) : await query;
  const results = Array.isArray(rawResults) ? rawResults : [];
  return (results[0] as typeof transactions.$inferSelect) || null;
}

export function formatInvoiceNum(userId: string, idempotencyKey?: string | null): { cleanKey: string | null; invoiceNum: string } {
  const cleanKey = idempotencyKey?.trim() || null;
  const invoiceNum = cleanKey
    ? (cleanKey.startsWith('INV-') ? cleanKey : `INV-${cleanKey}`)
    : `INV-${userId}-${Date.now()}`;
  return { cleanKey, invoiceNum };
}

export async function grantFreeTemplate(
  userId: string,
  buyerName: string,
  template: { id: string; designerId: string; name: string },
  assistedBy?: string | null
): Promise<{ isFree: true; message: string }> {
  const userTemplateId = `utpl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  await db.insert(userTemplates).values({
    id: userTemplateId,
    userId,
    templateId: template.id,
    acquiredAt: new Date(),
  });

  await db.insert(notifications).values({
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: template.designerId,
    type: 'template_purchased',
    title: 'Template Diunduh',
    message: `${buyerName} telah mengunduh template gratis Anda "${template.name}".`,
    metadata: { templateId: template.id },
  });

  if (assistedBy) {
    await db.insert(notifications).values({
      id: `notif_${Date.now()}_tenant_${Math.random().toString(36).slice(2, 7)}`,
      userId,
      type: 'template_purchased',
      title: 'Template Berhasil Diunduh',
      message: `Admin telah membantu mengunduh template gratis "${template.name}" untuk toko Anda.`,
      metadata: { templateId: template.id },
    });
  }

  return { isFree: true, message: 'Free template added to your account successfully' };
}

export const invoiceUrlCache = new Map<string, string>();

export async function fetchInvoiceUrl(externalId: string): Promise<string | null> {
  try {
    if (invoiceUrlCache.has(externalId)) return invoiceUrlCache.get(externalId) || null;

    const tx = await getTransactionByExternalId(externalId);
    if (!tx?.paymentGatewayRef) return null;

    const xenditInvoice = await xenditClient.getInvoice(tx.paymentGatewayRef);
    const invoiceUrl = xenditInvoice.invoiceUrl || null;
    if (invoiceUrl) invoiceUrlCache.set(externalId, invoiceUrl);
    return invoiceUrl;
  } catch {
    return null;
  }
}
