import { db } from '@/lib/db/client';
import { transactions, templates, userTemplates, commissions, notifications, users, tenantAiCredits, stores } from '@/db/schema';
import { calculateCommission } from '@/services/finance/commission.service';
import { creditWallet } from '@/services/finance/wallet.service';
import { eq, sql } from 'drizzle-orm';
import type { TransactionRecord } from '@/types';
import type { DbExecutor } from '@/types/common/db';
import { formatIDR } from '@/lib/currency';
import { logActivity } from '@/services/audit.service';
import { getCreditPackageByAmount } from '@/services/ai';

export {
  queryTenantOrders,
  queryDesignerIncomingOrders,
  getTransactionByExternalId,
  formatInvoiceNum,
  grantFreeTemplate,
  invoiceUrlCache,
  fetchInvoiceUrl,
} from './transactionOrders.helpers';

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

export async function fulfillPaidTransaction(
  transaction: typeof transactions.$inferSelect,
  client: DbExecutor = db
): Promise<void> {
  if (transaction.type === 'template_purchase' && transaction.templateId) {
    const userTemplateId = `utpl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    try {
      await client.insert(userTemplates).values({
        id: userTemplateId,
        userId: transaction.userId,
        templateId: transaction.templateId,
        acquiredAt: new Date(),
      });
    } catch {
      // Ignore duplicate record
    }

    const templateList = await client.select().from(templates).where(eq(templates.id, transaction.templateId)).limit(1);
    if (templateList.length > 0) {
      const template = templateList[0];
      const adminAmount = Number(transaction.adminFee || 0);
      const baseAmount = Math.max(0, Number(transaction.amount) - adminAmount);
      const { platformFee, designerAmount } = await calculateCommission(baseAmount);

      const commissionId = `comm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await client.insert(commissions).values({
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
        tx: client,
      });

      if (adminAmount > 0 && transaction.assistedBy) {
        await creditWallet({
          designerId: transaction.assistedBy,
          amount: adminAmount,
          description: 'Fee Pendampingan Pembelian Template',
          referenceId: transaction.id,
          tx: client,
        });
      }
      
      // Send notification to designer
      try {
        const buyer = await client
          .select({ name: users.name })
          .from(users)
          .where(eq(users.id, transaction.userId))
          .limit(1);
        const buyerName = buyer.length > 0 && buyer[0].name ? buyer[0].name : 'Seseorang';
        
        await client.insert(notifications).values({
          id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          userId: template.designerId,
          type: 'template_purchased',
          title: 'Template Terjual',
          message: `${buyerName} telah membeli template "${template.name}". Komisi sebesar ${formatIDR(designerAmount)} telah ditambahkan ke saldo Anda.`,
          metadata: { templateId: template.id, transactionId: transaction.id }
        });

        if (transaction.assistedBy) {
          await client.insert(notifications).values({
            id: `notif_${Date.now()}_tenant_${Math.random().toString(36).slice(2, 7)}`,
            userId: transaction.userId,
            type: 'template_purchased',
            title: 'Pembelian Template Berhasil',
            message: `Admin telah membantu pembelian template "${template.name}" untuk toko Anda. Template kini sudah aktif di dashboard.`,
            metadata: { templateId: template.id, transactionId: transaction.id }
          });
        }
      } catch {
        // Non-blocking notification dispatch
      }

      await logActivity({
        userId: transaction.userId,
        action: 'Purchase Template',
        details: {
          templateId: template.id,
          templateName: template.name,
          amount: transaction.amount,
          adminFee: adminAmount,
          assistedBy: transaction.assistedBy || null,
        },
      });
    }
  } else if (transaction.type === 'ai_credit_purchase' && transaction.userId) {
    // Handle AI credit purchase fulfillment
    try {
      // 1. Resolve exact credits from canonical package by amount
      const canonicalPkg = getCreditPackageByAmount(Number(transaction.amount));
      const credits = canonicalPkg ? canonicalPkg.credits : Math.max(1, Math.floor(Number(transaction.amount) / 2500));
      const packageName = canonicalPkg?.name || 'Paket Kredit AI';

      // 2. Resolve storeId
      let targetStoreId = transaction.storeId;
      if (!targetStoreId) {
        const [foundStore] = await client
          .select({ id: stores.id })
          .from(stores)
          .where(eq(stores.userId, transaction.userId))
          .limit(1);
        targetStoreId = foundStore?.id || transaction.userId;
      }

      // 3. Get or update tenant AI credits record
      const now = new Date();
      const creditRecordId = `cred_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await client.insert(tenantAiCredits).values({
        id: creditRecordId,
        userId: transaction.userId,
        tenantId: targetStoreId,
        balance: credits,
        totalPurchased: credits,
        totalUsed: 0,
        createdAt: now,
        updatedAt: now,
      }).onConflictDoUpdate({
        target: tenantAiCredits.tenantId,
        set: {
          userId: transaction.userId,
          balance: sql`${tenantAiCredits.balance} + ${credits}`,
          totalPurchased: sql`${tenantAiCredits.totalPurchased} + ${credits}`,
          updatedAt: now,
        },
      });

      // 4. Send notification & audit log
      try {
        await client.insert(notifications).values({
          id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          userId: transaction.userId,
          type: 'quota_upgrade_request',
          title: 'Kredit AI Berhasil Ditambahkan',
          message: `Pembelian ${packageName} berhasil! Saldo ${credits} kredit AI telah ditambahkan dan siap digunakan.`,
          metadata: { credits, packageName, transactionId: transaction.id, amount: transaction.amount }
        });
      } catch {
        // Non-blocking notification dispatch
      }

      await logActivity({
        userId: transaction.userId,
        storeId: transaction.storeId || null,
        action: 'Purchase AI Credit',
        details: {
          transactionId: transaction.id,
          amount: transaction.amount,
          credits,
          paymentChannel: transaction.paymentChannel || null,
        },
      });
    } catch (error) {
      console.error('[FULFILL_CREDIT_PURCHASE] error:', error);
      throw error;
    }
  }
}
