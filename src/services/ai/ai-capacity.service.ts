import { db } from '@/db';
import { aiDepositHistory, aiGenerationLogs, notifications, users } from '@/db/schema';
import { sql, eq, and, gte } from 'drizzle-orm';
import { getActiveExchangeRate } from './cost-calculator.service';

export interface PlatformAiCapacity {
  remainingDepositUsd: number;
  remainingDepositIdr: number;
  remainingTokens: number;
  availableCredits: number;
  isDepleted: boolean;
}

/**
 * Calculates real-time AI platform deposit buffer & token capacity.
 * Ensures the platform does not sell packages when upstream provider budget is exhausted.
 */
export async function getPlatformAiCapacity(): Promise<PlatformAiCapacity> {
  const [depositResult, logsResult, activeExchangeRate] = await Promise.all([
    db
      .select({
        totalDepositUsd: sql<number>`coalesce(sum(${aiDepositHistory.amountUsd}), 0)`.mapWith(Number),
      })
      .from(aiDepositHistory),
    db
      .select({
        totalCostUsd: sql<number>`coalesce(sum(${aiGenerationLogs.costUsd}), 0)`.mapWith(Number),
      })
      .from(aiGenerationLogs),
    getActiveExchangeRate(),
  ]);

  const totalDepositUsd = depositResult[0]?.totalDepositUsd || 0;
  const totalCostUsd = logsResult[0]?.totalCostUsd || 0;
  const remainingDepositUsd = Math.max(0, Number((totalDepositUsd - totalCostUsd).toFixed(4)));
  const remainingDepositIdr = Math.max(0, Math.round(remainingDepositUsd * activeExchangeRate));
  const remainingTokens = Math.max(0, Math.round(remainingDepositUsd / 0.000010));
  // 1 kredit standar AI ekuivalen flat ~$0.04 USD
  const availableCredits = Math.floor(remainingDepositUsd / 0.04);
  const isDepleted = remainingDepositUsd <= 0 || availableCredits <= 0;

  return {
    remainingDepositUsd,
    remainingDepositIdr,
    remainingTokens,
    availableCredits,
    isDepleted,
  };
}

/**
 * Dispatches an automated warning notification to all Superadmins
 * when AI platform token pool is depleted or insufficient for checkout.
 * Rate-limited to at most 1 alert per hour to prevent notification spam.
 */
export async function notifySuperadminsAiDepleted(details: {
  remainingDepositUsd: number;
  packageId?: string;
  packageName?: string;
}): Promise<void> {
  try {
    const superadmins = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, 'superadmin'));

    if (superadmins.length === 0) return;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const now = new Date();

    for (const sa of superadmins) {
      const [existing] = await db
        .select({ id: notifications.id })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, sa.id),
            eq(notifications.type, 'quota_upgrade_request'),
            sql`${notifications.metadata}->>'reason' = 'ai_token_depleted'`,
            gte(notifications.createdAt, oneHourAgo)
          )
        )
        .limit(1);

      if (!existing) {
        await db.insert(notifications).values({
          id: `notif_depleted_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          userId: sa.id,
          type: 'quota_upgrade_request',
          title: 'Peringatan Kritis: Saldo Kuota Token AI Habis!',
          message: `Saldo token AI platform saat ini telah habis ($${details.remainingDepositUsd.toFixed(2)} USD tersisa). Pembelian paket kredit AI oleh tenant dicegah sementara hingga superadmin melakukan top up deposit AI.`,
          isRead: false,
          metadata: {
            reason: 'ai_token_depleted',
            remainingDepositUsd: details.remainingDepositUsd,
            packageId: details.packageId || null,
            packageName: details.packageName || null,
            blockedAt: now.toISOString(),
          },
          createdAt: now,
        });
      }
    }
  } catch (err) {
    console.error('[notifySuperadminsAiDepleted] Failed to notify superadmins:', err);
  }
}

