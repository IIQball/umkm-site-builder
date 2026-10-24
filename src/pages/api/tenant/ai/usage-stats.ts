import type { APIRoute } from 'astro';
import { db } from '@/db';
import { stores, aiGenerationLogs, tenantAiCredits } from '@/db/schema';
import { eq, and, gte, isNull } from 'drizzle-orm';
import { jsonSuccess, jsonError } from '@/lib/utils/api-handler';
import { getAuthenticatedUser } from '@/lib/auth';

export const prerender = false;

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const ID_DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const ID_DAYS_FULL = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const ID_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

/** Format tanggal (YYYY-MM-DD) berdasarkan zona waktu WIB (UTC+7) */
export function toWibDateKey(date: Date): string {
  return new Date(date.getTime() + WIB_OFFSET_MS).toISOString().slice(0, 10);
}

/** Menambahkan hari ke tanggal berformat YYYY-MM-DD */
export function addDaysToKey(key: string, days: number): string {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export interface DailyUsagePoint {
  date: string;
  label: string;
  dayName: string;
  fullLabel: string;
  creditsUsed: number;
  generationsCount: number;
}

export interface UsageStatsSummary {
  totalCreditsUsed7d: number;
  totalGenerations7d: number;
  dailyAverage: number;
  currentBalance: number;
  totalPurchased: number;
  totalUsedLifetime: number;
  highestUsageDay: {
    date: string;
    label: string;
    creditsUsed: number;
  } | null;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401);
    }

    // Ambil data toko milik tenant - Isolasi data multi-tenant ketat
    const [store] = await db
      .select({ id: stores.id })
      .from(stores)
      .where(and(eq(stores.userId, user.id), isNull(stores.deletedAt)))
      .limit(1);

    const today = toWibDateKey(new Date());
    const startKey = addDaysToKey(today, -6); // 7 hari: today - 6 sampai today

    // Susun array 7 hari kalender berurutan
    const dateKeys = Array.from({ length: 7 }, (_, i) => addDaysToKey(startKey, i));

    const defaultPoints: DailyUsagePoint[] = dateKeys.map((key) => {
      const [y, m, d] = key.split('-').map(Number);
      const utcDate = new Date(Date.UTC(y, m - 1, d));
      const dayIdx = utcDate.getUTCDay();
      return {
        date: key,
        label: `${d} ${ID_MONTHS[m - 1]}`,
        dayName: ID_DAYS[dayIdx],
        fullLabel: `${ID_DAYS_FULL[dayIdx]}, ${d} ${ID_MONTHS[m - 1]} ${y}`,
        creditsUsed: 0,
        generationsCount: 0,
      };
    });

    if (!store) {
      const emptySummary: UsageStatsSummary = {
        totalCreditsUsed7d: 0,
        totalGenerations7d: 0,
        dailyAverage: 0,
        currentBalance: 0,
        totalPurchased: 0,
        totalUsedLifetime: 0,
        highestUsageDay: null,
      };
      return jsonSuccess({ points: defaultPoints, summary: emptySummary }, 200);
    }

    // Ambil saldo kredit AI toko terisolasi
    const [creditRecord] = await db
      .select({
        balance: tenantAiCredits.balance,
        totalPurchased: tenantAiCredits.totalPurchased,
        totalUsed: tenantAiCredits.totalUsed,
      })
      .from(tenantAiCredits)
      .where(eq(tenantAiCredits.tenantId, store.id))
      .limit(1);

    // Ambil riwayat pemakaian kredit 7 hari terakhir (sukses dan non-testing)
    const startTimestamp = new Date(`${startKey}T00:00:00+07:00`);

    const logs = await db
      .select({
        creditsDeducted: aiGenerationLogs.creditsDeducted,
        createdAt: aiGenerationLogs.createdAt,
      })
      .from(aiGenerationLogs)
      .where(
        and(
          eq(aiGenerationLogs.tenantId, store.id),
          eq(aiGenerationLogs.isTesting, false),
          eq(aiGenerationLogs.status, 'success'),
          gte(aiGenerationLogs.createdAt, startTimestamp)
        )
      );

    // Kelompokkan pemakaian kredit berdasarkan hari (WIB)
    const dailyMap = new Map<string, { creditsUsed: number; generationsCount: number }>();
    for (const log of logs) {
      const key = toWibDateKey(log.createdAt);
      const existing = dailyMap.get(key) || { creditsUsed: 0, generationsCount: 0 };
      existing.creditsUsed += log.creditsDeducted;
      existing.generationsCount += 1;
      dailyMap.set(key, existing);
    }

    let totalCreditsUsed7d = 0;
    let totalGenerations7d = 0;

    const points: DailyUsagePoint[] = defaultPoints.map((dp) => {
      const stats = dailyMap.get(dp.date);
      const creditsUsed = stats?.creditsUsed ?? 0;
      const generationsCount = stats?.generationsCount ?? 0;

      totalCreditsUsed7d += creditsUsed;
      totalGenerations7d += generationsCount;

      return {
        ...dp,
        creditsUsed,
        generationsCount,
      };
    });

    let highestPoint: DailyUsagePoint | null = null;
    for (const p of points) {
      if (p.creditsUsed > 0 && (!highestPoint || p.creditsUsed > highestPoint.creditsUsed)) {
        highestPoint = p;
      }
    }

    const summary: UsageStatsSummary = {
      totalCreditsUsed7d,
      totalGenerations7d,
      dailyAverage: Math.round((totalCreditsUsed7d / 7) * 10) / 10,
      currentBalance: creditRecord?.balance ?? 0,
      totalPurchased: creditRecord?.totalPurchased ?? 0,
      totalUsedLifetime: creditRecord?.totalUsed ?? 0,
      highestUsageDay: highestPoint
        ? {
            date: highestPoint.date,
            label: highestPoint.label,
            creditsUsed: highestPoint.creditsUsed,
          }
        : null,
    };

    return jsonSuccess({ points, summary }, 200);
  } catch (error: unknown) {
    console.error('[AI_USAGE_STATS] fetch error:', error);
    return jsonError('Gagal mengambil statistik penggunaan kredit AI', 500);
  }
};
