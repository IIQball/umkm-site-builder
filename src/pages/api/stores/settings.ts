import type { APIRoute } from 'astro';
import { db } from '@/db';
import { stores } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { StoreSettingsInput } from '@/lib/stores/schemas';
import { getAuthenticatedUser, canManageStore } from '@/lib/auth';
import { getMaxStoreBranches } from '@/services/finance';
import { ZodError } from 'zod';

export const PUT: APIRoute = async (context) => {
  try {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      return new Response(JSON.stringify({ ok: false, success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await context.request.json();
    const data = StoreSettingsInput.parse(body);

    const storeId = context.url.searchParams.get('storeId') || (body as { storeId?: string }).storeId;
    const [existingStore] = storeId 
      ? await db.select().from(stores).where(eq(stores.id, storeId)).limit(1)
      : await db.select().from(stores).where(eq(stores.userId, user.id)).limit(1);

    if (!existingStore) {
      return new Response(JSON.stringify({ ok: false, success: false, error: 'Store not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!canManageStore(user, existingStore)) {
      return new Response(JSON.stringify({ ok: false, success: false, error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const currentCustomization = (existingStore.customization as Record<string, unknown>) || {};
    const updatedCustomization: Record<string, unknown> = {
      ...currentCustomization,
    };
    if (data.customization && typeof data.customization === 'object') {
      Object.assign(updatedCustomization, data.customization);
    }
    if (data.regionData !== undefined) {
      updatedCustomization.region = data.regionData;
    }
    if (data.isOpen !== undefined) {
      updatedCustomization.isOpen = data.isOpen;
    }
    if (data.waCheckoutTemplate !== undefined) {
      updatedCustomization.waCheckoutTemplate = data.waCheckoutTemplate;
    }

    const maxBranches = await getMaxStoreBranches();
    const mapsCustomization = updatedCustomization.maps as { branches?: unknown[] } | undefined;
    if (Array.isArray(mapsCustomization?.branches) && mapsCustomization.branches.length > maxBranches) {
      return new Response(JSON.stringify({ ok: false, success: false, error: `Jumlah cabang toko melebihi batas maksimal (${maxBranches} cabang)` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.update(stores)
      .set({
        name: data.name,
        waNumber: data.waNumber,
        googleMapsUrl: data.googleMapsUrl || undefined,
        ...(data.address !== undefined ? { address: data.address } : {}),
        ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
        ...(data.templateId !== undefined ? { templateId: data.templateId } : {}),
        customization: updatedCustomization,
        lastEditedBy: user.id,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, existingStore.id));

    return new Response(JSON.stringify({ ok: true, success: true, data: { message: 'Settings updated successfully' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ ok: false, success: false, error: 'Validation Error', details: error.errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    console.error('Store settings update error:', error);
    return new Response(JSON.stringify({ ok: false, success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};