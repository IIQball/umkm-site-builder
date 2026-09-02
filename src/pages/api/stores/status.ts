import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { stores } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { StoreStatusInput } from '@/lib/stores/schemas';
import { getAuthenticatedUser } from '@/lib/auth';
import { ZodError } from 'zod';

export const POST: APIRoute = async (context) => {
  try {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (user.role !== 'tenant') {
      return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await context.request.json();
    const data = StoreStatusInput.parse(body);

    const [store] = await db.select().from(stores).where(eq(stores.userId, user.id));
    if (!store) {
      return new Response(JSON.stringify({ ok: false, error: 'Store not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const customization = (store.customization as Record<string, unknown>) || {};
    customization.isOpen = data.isOpen;

    await db.update(stores)
      .set({
        customization,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, store.id));

    return new Response(JSON.stringify({ ok: true, data: { storeId: store.id, isOpen: data.isOpen } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ ok: false, error: 'Validation error', details: error.errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.error('Store status update error:', error);
    return new Response(JSON.stringify({ ok: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET: APIRoute = async (context) => {
  try {
    const subdomain = context.params.subdomain || context.url.searchParams.get('subdomain');

    if (!subdomain) {
      return new Response(JSON.stringify({ ok: false, error: 'Subdomain required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [store] = await db.select().from(stores).where(eq(stores.subdomain, subdomain));
    if (!store) {
      return new Response(JSON.stringify({ ok: false, error: 'Store not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const customization = (store.customization as Record<string, unknown>) || {};
    const isOpen = customization.isOpen !== false;

    return new Response(JSON.stringify({ ok: true, data: { storeId: store.id, isOpen } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Store status fetch error:', error);
    return new Response(JSON.stringify({ ok: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
