import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/client';
import { products } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { ProductVariantsSchema } from '../../../schemas/product-variant.schema';

import { deleteFromCloudinary } from '../../../lib/cloudinary';

const productUpdateInput = z.object({
  storeId: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  basePrice: z.number().min(0).optional(),
  variants: ProductVariantsSchema.optional(),
  description: z.string().optional(),
  imageUrls: z.array(z.string().url()).optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    // 1. Authenticate
    if (!locals.user) {
      return new Response(JSON.stringify({ ok: false, error: { message: 'Silakan login terlebih dahulu' } }), { status: 401 });
    }
    
    // 2. Authorize
    if (locals.user.role !== 'tenant' && locals.user.role !== 'superadmin') {
      return new Response(JSON.stringify({ ok: false, error: { message: 'Hanya tenant yang dapat mengubah produk' } }), { status: 403 });
    }

    const id = params.id;
    if (!id) throw new Error('ID is required');

    const body = await request.json();
    const result = productUpdateInput.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ 
        ok: false, 
        error: { message: 'Validation failed', issues: result.error.issues } 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const existingProduct = await db.select().from(products).where(eq(products.id, id));
    if (existingProduct.length === 0) {
      return new Response(JSON.stringify({ ok: false, error: { message: 'Product not found' } }), { status: 404 });
    }

    const updated = await db.update(products)
      .set({ ...result.data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    return new Response(JSON.stringify({ ok: true, data: updated[0] }), {
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

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    if (!id) throw new Error('ID is required');

    const existingProduct = await db.select().from(products).where(eq(products.id, id));
    if (existingProduct.length === 0) {
      return new Response(JSON.stringify({ ok: false, error: { message: 'Product not found' } }), { status: 404 });
    }

    await db.update(products)
      .set({ deletedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    // delete image if exists (even on soft delete, per requirements)
    const imageUrls = (existingProduct[0].imageUrls || []) as Array<{ publicId?: string; url?: string }>;
    if (imageUrls && imageUrls.length > 0 && imageUrls[0].publicId) {
      await deleteFromCloudinary(imageUrls[0].publicId);
    }

    return new Response(JSON.stringify({ ok: true, data: { id } }), {
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
