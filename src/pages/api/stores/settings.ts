import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { stores } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { StoreSettingsInput } from '../../../lib/stores/schemas';
import { getAuthenticatedUser } from '../../../lib/auth';
import { ZodError } from 'zod';

export const PUT: APIRoute = async (context) => {
  try {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (user.role !== 'tenant') {
      return new Response(JSON.stringify({ success: false, error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await context.request.json();
    const data = StoreSettingsInput.parse(body);

    const [existingStore] = await db.select().from(stores).where(eq(stores.userId, user.id));
    if (!existingStore) {
      return new Response(JSON.stringify({ success: false, error: 'Store not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.update(stores)
      .set({
        name: data.name,
        waNumber: data.waNumber,
        googleMapsUrl: data.googleMapsUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, existingStore.id));

    return new Response(JSON.stringify({ success: true, data: { message: 'Settings updated successfully' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ success: false, error: 'Validation Error', details: error.errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    console.error('Store settings update error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};