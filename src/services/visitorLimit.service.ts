import { db } from '@/lib/db/client';
import { visitorDailyLimit } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export type EventType = 'view' | 'click';

/**
 * Get visitor IP dari request headers
 */
export function getVisitorIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  
  const clientIp = request.headers.get('cf-connecting-ip');
  if (clientIp) return clientIp;
  
  return 'unknown';
}

/**
 * Check apakah visitor sudah pernah trigger event hari ini
 */
export async function hasVisitorEventToday(
  storeId: string,
  visitorIp: string,
  eventType: EventType,
  today: string,
): Promise<boolean> {
  const record = await db.query.visitorDailyLimit.findFirst({
    where: and(
      eq(visitorDailyLimit.storeId, storeId),
      eq(visitorDailyLimit.visitorIp, visitorIp),
      eq(visitorDailyLimit.date, today),
    ),
  });

  if (!record) return false;

  if (eventType === 'view') return record.viewedAt !== null;
  if (eventType === 'click') return record.clickedAt !== null;

  return false;
}

/**
 * Record visitor event (view atau click)
 * Otomatis create atau update daily record
 */
export async function recordVisitorEvent(
  storeId: string,
  visitorIp: string,
  eventType: EventType,
  today: string,
): Promise<void> {
  const existingRecord = await db.query.visitorDailyLimit.findFirst({
    where: and(
      eq(visitorDailyLimit.storeId, storeId),
      eq(visitorDailyLimit.visitorIp, visitorIp),
      eq(visitorDailyLimit.date, today),
    ),
  });

  if (existingRecord) {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (eventType === 'view') updateData.viewedAt = new Date();
    if (eventType === 'click') updateData.clickedAt = new Date();

    await db
      .update(visitorDailyLimit)
      .set(updateData)
      .where(eq(visitorDailyLimit.id, existingRecord.id));
  } else {
    const newRecord: Record<string, unknown> = {
      id: `vdl_${crypto.randomUUID()}`,
      storeId,
      visitorIp,
      date: today,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (eventType === 'view') newRecord.viewedAt = new Date();
    if (eventType === 'click') newRecord.clickedAt = new Date();

    await db.insert(visitorDailyLimit).values(newRecord);
  }
}
