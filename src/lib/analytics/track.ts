/**
 * Client-side analytics tracking helper.
 * Sends events to /api/analytics/track endpoint.
 */

export type EventType = 'wa_click' | 'store_view';

export async function trackAnalyticsEvent(
  storeId: string,
  eventType: EventType
): Promise<void> {
  if (!storeId) {
    console.warn('[trackAnalyticsEvent] storeId is empty, skipping');
    return;
  }

  try {
    console.log(`📊 [trackAnalyticsEvent] Sending ${eventType} for store ${storeId}`);
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ storeId, eventType }),
    });

    const resText = await response.text();
    console.log(`📊 [trackAnalyticsEvent] Response status: ${response.status}, body: ${resText}`);

    if (!response.ok) {
      console.warn(`⚠️ [trackAnalyticsEvent] Failed to track ${eventType}:`, response.statusText);
    } else {
      console.log(`✅ [trackAnalyticsEvent] Successfully tracked ${eventType}`);
    }
  } catch (error) {
    console.warn(`❌ [trackAnalyticsEvent] Error tracking ${eventType}:`, error);
  }
}
