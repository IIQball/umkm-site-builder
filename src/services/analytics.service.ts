import { db } from "@/lib/db/client";
import { stores, storeDailyStats } from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { AppError } from "@/lib/utils/api-handler";

export type EventType = "wa_click" | "store_view";

export interface TrackEventResult {
  storeId: string;
  eventType: EventType;
  totalWaClicks: number;
  totalViews: number;
}

export async function trackEvent(
  storeId: string,
  eventType: EventType,
): Promise<TrackEventResult> {
  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  });

  if (!store) {
    throw new AppError(
      "Toko tidak ditemukan",
      404,
      undefined,
      "STORE_NOT_FOUND",
    );
  }

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (eventType === "wa_click") {
    updateData.totalWaClicks = store.totalWaClicks + 1;
  } else if (eventType === "store_view") {
    updateData.totalViews = store.totalViews + 1;
  } else {
    throw new AppError(
      "Tipe event tidak valid",
      400,
      undefined,
      "INVALID_EVENT_TYPE",
    );
  }

  const [updated] = await db
    .update(stores)
    .set(updateData)
    .where(eq(stores.id, storeId))
    .returning({
      totalWaClicks: stores.totalWaClicks,
      totalViews: stores.totalViews,
    });

  // Catat juga ke statistik harian untuk grafik. Kegagalan di sini tidak boleh
  // membuat tracking utama gagal.
  try {
    await db
      .insert(storeDailyStats)
      .values({
        id: `sds_${crypto.randomUUID()}`,
        storeId,
        date: wibDateKey(new Date()),
        views: eventType === "store_view" ? 1 : 0,
        waClicks: eventType === "wa_click" ? 1 : 0,
      })
      .onConflictDoUpdate({
        target: [storeDailyStats.storeId, storeDailyStats.date],
        set:
          eventType === "store_view"
            ? { views: sql`${storeDailyStats.views} + 1` }
            : { waClicks: sql`${storeDailyStats.waClicks} + 1` },
      });
  } catch (error) {
    console.error("[ANALYTICS] daily stats upsert failed:", error);
  }

  return {
    storeId,
    eventType,
    totalWaClicks: updated.totalWaClicks,
    totalViews: updated.totalViews,
  };
}

// ==========================================
// Grafik traffic (dashboard merchant)
// ==========================================

export type TrafficRange = "7d" | "30d" | "12m";

export interface TrafficPoint {
  /** Kunci bucket: YYYY-MM-DD (harian) atau YYYY-MM (bulanan) */
  key: string;
  label: string;
  views: number;
  waClicks: number;
  /** Persentase klik WA terhadap views pada bucket tersebut */
  conversion: number;
}

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const ID_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

/** Tanggal (YYYY-MM-DD) pada zona waktu WIB (UTC+7) */
export function wibDateKey(date: Date): string {
  return new Date(date.getTime() + WIB_OFFSET_MS).toISOString().slice(0, 10);
}

function addDays(key: string, days: number): string {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function toConversion(views: number, clicks: number): number {
  return views > 0 ? Math.round((clicks / views) * 1000) / 10 : 0;
}

export async function getStoreTrafficSeries(
  storeId: string,
  range: TrafficRange,
): Promise<TrafficPoint[]> {
  const today = wibDateKey(new Date());

  if (range === "12m") {
    // 12 bulan kalender terakhir, termasuk bulan berjalan
    const [ty, tm] = today.split("-").map(Number);
    const months: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const idx = ty * 12 + (tm - 1) - i;
      months.push(
        `${Math.floor(idx / 12)}-${String((idx % 12) + 1).padStart(2, "0")}`,
      );
    }

    const rows = await db
      .select({
        date: storeDailyStats.date,
        views: storeDailyStats.views,
        waClicks: storeDailyStats.waClicks,
      })
      .from(storeDailyStats)
      .where(
        and(
          eq(storeDailyStats.storeId, storeId),
          gte(storeDailyStats.date, `${months[0]}-01`),
        ),
      );

    const agg = new Map<string, { views: number; waClicks: number }>();
    for (const r of rows) {
      const k = r.date.slice(0, 7);
      const cur = agg.get(k) ?? { views: 0, waClicks: 0 };
      cur.views += r.views;
      cur.waClicks += r.waClicks;
      agg.set(k, cur);
    }

    return months.map((key) => {
      const v = agg.get(key) ?? { views: 0, waClicks: 0 };
      const [y, m] = key.split("-").map(Number);
      return {
        key,
        label: `${ID_MONTHS[m - 1]} ${String(y).slice(2)}`,
        views: v.views,
        waClicks: v.waClicks,
        conversion: toConversion(v.views, v.waClicks),
      };
    });
  }

  const days = range === "7d" ? 7 : 30;
  const start = addDays(today, -(days - 1));

  const rows = await db
    .select({
      date: storeDailyStats.date,
      views: storeDailyStats.views,
      waClicks: storeDailyStats.waClicks,
    })
    .from(storeDailyStats)
    .where(
      and(
        eq(storeDailyStats.storeId, storeId),
        gte(storeDailyStats.date, start),
      ),
    );

  const byDate = new Map(rows.map((r) => [r.date, r]));

  return Array.from({ length: days }, (_, i) => {
    const key = addDays(start, i);
    const r = byDate.get(key);
    const views = r?.views ?? 0;
    const waClicks = r?.waClicks ?? 0;
    const [, m, d] = key.split("-").map(Number);
    return {
      key,
      label: `${d} ${ID_MONTHS[m - 1]}`,
      views,
      waClicks,
      conversion: toConversion(views, waClicks),
    };
  });
}
