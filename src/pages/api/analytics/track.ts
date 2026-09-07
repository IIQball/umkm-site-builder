import type { APIRoute } from 'astro';
import { handleApiRoute, jsonSuccess } from '@/lib/utils/api-handler';
import { validate } from '@/lib/utils/validation';
import { trackEvent } from '@/services/analytics.service';
import { z } from 'zod';

const TrackEventSchema = z.object({
  storeId: z.string().min(1, 'storeId wajib diisi'),
  eventType: z.enum(['wa_click', 'store_view'], {
    errorMap: () => ({ message: 'eventType harus wa_click atau store_view' }),
  }),
});

export const POST: APIRoute = async ({ request }) => {
  return handleApiRoute(async () => {
    const body = await request.json();
    const { storeId, eventType } = validate(TrackEventSchema, body);

    const result = await trackEvent(storeId, eventType);

    return jsonSuccess(result, 200);
  });
};
