import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { stores } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { getAuthenticatedUser, canManageStore } from '../../../lib/auth';

export const PUT: APIRoute = async ({ request, url }) => {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });

    const body = await request.json();
    const id = url.searchParams.get('storeId') || body.storeId;

    const [store] = id 
      ? await db.select().from(stores).where(eq(stores.id, id)).limit(1)
      : await db.select().from(stores).where(eq(stores.userId, user.id)).limit(1);

    if (!store) return new Response(JSON.stringify({ success: false, error: 'Not found' }), { status: 404 });
    if (!canManageStore(user, store)) return new Response(JSON.stringify({ success: false, error: 'Forbidden' }), { status: 403 });

    const customization = (store.customization as Record<string, unknown>) || {};
    customization.waCheckoutTemplate = body.template;

    await db.update(stores)
      .set({ customization, updatedAt: new Date(), lastEditedBy: user.id })
      .where(eq(stores.id, store.id));

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
