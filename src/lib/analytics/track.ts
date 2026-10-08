/**
 * Client-side analytics tracking helper.
 * Sends events to /api/analytics/track endpoint.
 */

export type EventType = 'wa_click' | 'store_view';

export async function trackAnalyticsEvent(
  storeId: string,
  eventType: EventType
): Promise<void> {
  if (!storeId) return;

  try {
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ storeId, eventType }),
    });

    if (!response.ok) {
      console.warn(`[Analytics] Failed to track ${eventType}:`, response.statusText);
    }
  } catch (error) {
    console.warn(`[Analytics] Error tracking ${eventType}:`, error);
  }
}
