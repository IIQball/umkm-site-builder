import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/client';
import { products } from '../../../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { z } from 'zod';

const productInput = z.object({
  storeId: z.string().min(1),
  categoryId: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().min(2),
  basePrice: z.number().min(0),
  variants: z.array(z.unknown()).default([]),
  description: z.string().optional(),
  imageUrls: z.array(z.string().url()).default([]),
  isAvailable: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const storeId = url.searchParams.get('storeId');

    if (!storeId) {
      return new Response(JSON.stringify({ ok: false, error: { message: 'storeId is required' } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const query = db.select().from(products).where(
      and(eq(products.storeId, storeId), isNull(products.deletedAt))
    );
    const allProducts = await query;

    return new Response(JSON.stringify({ ok: true, data: allProducts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ ok: false, error: { message } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Authenticate
    if (!locals.user) {
      return new Response(JSON.stringify({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Silakan login terlebih dahulu' } }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Authorize — tenant only
    if (locals.user.role !== 'tenant' && locals.user.role !== 'superadmin') {
      return new Response(JSON.stringify({ ok: false, error: { code: 'FORBIDDEN', message: 'Hanya tenant yang dapat menambah produk' } }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Parse input — accept JSON body with pre-uploaded imageUrls
    const body = await request.json();
    const result = productInput.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ 
        ok: false, 
        error: { code: 'VALIDATION_ERROR', message: 'Validasi gagal', issues: result.error.issues } 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. Insert product with pre-uploaded image URLs
    const newProductData = {
      ...result.data,
      id: crypto.randomUUID(),
    };

    const inserted = await db.insert(products).values(newProductData).returning();

    return new Response(JSON.stringify({ ok: true, data: inserted[0] }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('[PRODUCT] create error:', error instanceof Error ? error.message : error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return new Response(JSON.stringify({ ok: false, error: { code: 'INTERNAL', message } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

