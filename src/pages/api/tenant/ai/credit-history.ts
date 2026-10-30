import type { APIRoute } from 'astro';
import { db } from '@/db';
import { stores, transactions, aiGenerationLogs, tenantAiCredits } from '@/db/schema';
import { eq, and, desc, isNull, or } from 'drizzle-orm';
import { jsonSuccess, jsonError } from '@/lib/utils/api-handler';
import { formatIDR } from '@/lib/currency';
import { getAuthenticatedUser } from '@/lib/auth';
import { getOrInitializeAiCredit } from '@/services/ai-credit.service';
import { getCreditPackageByAmount } from '@/services/ai';

export const prerender = false;

export interface CreditQuotaBreakdown {
  balance: number;
  totalUsed: number;
  totalPurchased: number;
  initialBonus: number;
  totalQuota: number;
  percentage: number;
  status: 'plenty' | 'low' | 'critical' | 'empty';
}

export interface CreditMutationItem {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  category: 'BONUS' | 'TOP_UP' | 'USAGE';
  description: string;
  referenceId: string | null;
  createdAt: string;
}

const FEATURE_NAMES: Record<string, string> = {
  logo: 'Generasi Logo Toko AI',
  packaging_mockup: 'Mockup Kemasan Produk AI',
  product_poster: 'Poster Promosi Produk AI',
};

function getCreditsFromAmount(amount: number): number {
  const pkg = getCreditPackageByAmount(amount);
  return pkg ? pkg.credits : Math.max(1, Math.floor(amount / 2500));
}

function resolveQuotaStatus(balance: number, percentage: number): 'plenty' | 'low' | 'critical' | 'empty' {
  if (balance <= 0) return 'empty';
  if (balance <= 2 || percentage <= 20) return 'critical';
  if (percentage <= 50) return 'low';
  return 'plenty';
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401);
    }

    // Ambil data toko tenant
    const [store] = await db
      .select({ id: stores.id, createdAt: stores.createdAt })
      .from(stores)
      .where(and(eq(stores.userId, user.id), isNull(stores.deletedAt)))
      .limit(1);

    if (!store) {
      const emptyQuota: CreditQuotaBreakdown = {
        balance: 0,
        totalUsed: 0,
        totalPurchased: 0,
        initialBonus: 0,
        totalQuota: 0,
        percentage: 0,
        status: 'empty',
      };
      return jsonSuccess(
        {
          quota: emptyQuota,
          mutations: [],
          pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
          summary: { totalTopUpCredits: 0, totalUsedCredits: 0, bonusCredits: 0 },
        },
        200
      );
    }

    // Ambil saldo kredit AI toko menggunakan service terpusat yang sudah ada
    const credit = await getOrInitializeAiCredit(store.id);

    // Normalisasi saldo akun lama yang belum pernah beli agar tidak menyimpan sisa 2 kredit bonus
    let balance = credit.balance;
    if (credit.totalPurchased === 0 && credit.totalUsed === 0 && balance > 0) {
      await db
        .update(tenantAiCredits)
        .set({ balance: 0 })
        .where(eq(tenantAiCredits.tenantId, store.id));
      balance = 0;
    }

    const initialBonus = 0;
    const totalPurchased = credit.totalPurchased;
    const totalUsed = credit.totalUsed;
    const totalQuota = Math.max(totalPurchased, balance + totalUsed, 0);
    const percentage = totalQuota > 0 ? Math.min(100, Math.max(0, Math.round((balance / totalQuota) * 100))) : 0;
    const status = resolveQuotaStatus(balance, percentage);

    // Ambil riwayat transaksi top-up sukses
    const creditTransactions = await db
      .select({
        id: transactions.id,
        externalId: transactions.externalId,
        amount: transactions.amount,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .where(
        and(
          or(eq(transactions.storeId, store.id), eq(transactions.userId, user.id)),
          eq(transactions.type, 'ai_credit_purchase'),
          eq(transactions.status, 'success')
        )
      )
      .orderBy(desc(transactions.createdAt));

    // Ambil riwayat pemakaian AI log
    const usageLogs = await db
      .select({
        id: aiGenerationLogs.id,
        featureType: aiGenerationLogs.featureType,
        creditsDeducted: aiGenerationLogs.creditsDeducted,
        createdAt: aiGenerationLogs.createdAt,
      })
      .from(aiGenerationLogs)
      .where(
        and(
          or(eq(aiGenerationLogs.tenantId, store.id), eq(aiGenerationLogs.userId, user.id)),
          eq(aiGenerationLogs.isTesting, false),
          eq(aiGenerationLogs.status, 'success')
        )
      )
      .orderBy(desc(aiGenerationLogs.createdAt))
      .limit(100);

    const mutations: CreditMutationItem[] = [];

    // 1. Bonus awal (hanya dicatat jika initialBonus > 0)
    if (initialBonus > 0) {
      mutations.push({
        id: `bonus_${store.id}`,
        type: 'CREDIT',
        amount: initialBonus,
        category: 'BONUS',
        description: 'Bonus Kuota Awal UMKM (Starter)',
        referenceId: null,
        createdAt: (store.createdAt || new Date()).toISOString(),
      });
    }

    // 2. Pembelian paket kredit
    let totalTopUpCredits = 0;
    for (const tx of creditTransactions) {
      const credits = getCreditsFromAmount(tx.amount);
      totalTopUpCredits += credits;
      mutations.push({
        id: `tx_${tx.id}`,
        type: 'CREDIT',
        amount: credits,
        category: 'TOP_UP',
        description: `Isi Ulang Paket Kredit AI (+${credits} Kredit - ${formatIDR(tx.amount)})`,
        referenceId: tx.externalId || tx.id,
        createdAt: tx.createdAt.toISOString(),
      });
    }

    // 3. Pemakaian kredit generasi AI
    let totalUsedCredits = 0;
    for (const log of usageLogs) {
      totalUsedCredits += log.creditsDeducted;
      mutations.push({
        id: `gen_${log.id}`,
        type: 'DEBIT',
        amount: log.creditsDeducted,
        category: 'USAGE',
        description: FEATURE_NAMES[log.featureType] || 'Generasi Visual AI',
        referenceId: log.id,
        createdAt: log.createdAt.toISOString(),
      });
    }

    // Urutkan mutasi dari yang terbaru
    mutations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Filter & Paginasi
    const url = new URL(request.url);
    const typeFilter = url.searchParams.get('type')?.toUpperCase() || 'ALL';
    const searchQuery = (url.searchParams.get('search') || '').trim().toLowerCase();
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10) || 10));

    const filtered = mutations.filter((m) => {
      const matchesType = typeFilter === 'ALL' || m.type === typeFilter;
      const matchesSearch =
        !searchQuery ||
        m.description.toLowerCase().includes(searchQuery) ||
        (m.referenceId && m.referenceId.toLowerCase().includes(searchQuery));
      return matchesType && matchesSearch;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return jsonSuccess({
      quota: {
        balance,
        totalUsed,
        totalPurchased,
        initialBonus,
        totalQuota,
        percentage,
        status,
      },
      mutations: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      summary: {
        totalTopUpCredits,
        totalUsedCredits,
        bonusCredits: initialBonus,
      },
    });
  } catch (error: unknown) {
    console.error('[CREDIT_HISTORY] fetch error:', error);
    return jsonError('Gagal mengambil rincian kuota dan riwayat mutasi kredit', 500);
  }
};
