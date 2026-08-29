import { db } from '@/lib/db/client';
import { stores } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '@/lib/utils/api-handler';

export type EventType = 'wa_click' | 'store_view';

export interface TrackEventResult {
  storeId: string;
  eventType: EventType;
  totalWaClicks: number;
  totalViews: number;
}

export async function trackEvent(
  storeId: string,
  eventType: EventType
): Promise<TrackEventResult> {
  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  });

  if (!store) {
    throw new AppError('Toko tidak ditemukan', 404, undefined, 'STORE_NOT_FOUND');
  }

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (eventType === 'wa_click') {
    updateData.totalWaClicks = store.totalWaClicks + 1;
  } else if (eventType === 'store_view') {
    updateData.totalViews = store.totalViews + 1;
  } else {
    throw new AppError('Tipe event tidak valid', 400, undefined, 'INVALID_EVENT_TYPE');
  }

  const [updated] = await db
    .update(stores)
    .set(updateData)
    .where(eq(stores.id, storeId))
    .returning({
      totalWaClicks: stores.totalWaClicks,
      totalViews: stores.totalViews,
    });

  return {
    storeId,
    eventType,
    totalWaClicks: updated.totalWaClicks,
    totalViews: updated.totalViews,
  };
}
