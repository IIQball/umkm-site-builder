import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/client';
import { products } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { uploadToCloudinary, deleteFromCloudinary } from '../../../lib/cloudinary';

const productUpdateInput = z.object({
  storeId: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  basePrice: z.number().min(0).optional(),
  variants: z.array(z.unknown()).optional(),
  description: z.string().optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const PUT: APIRoute = async ({ params, request }) => {
  let uploadedImagePublicId: string | null = null;
  try {
    const id = params.id;
    if (!id) throw new Error('ID is required');

    const contentType = request.headers.get('content-type') || '';
    let body: Record<string, unknown> = {};
    let imageFile: File | null = null;

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      if (formData.has('storeId')) body.storeId = formData.get('storeId') as string;
      if (formData.has('categoryId')) body.categoryId = formData.get('categoryId') as string;
      if (formData.has('name')) body.name = formData.get('name') as string;
      if (formData.has('slug')) body.slug = formData.get('slug') as string;
      if (formData.has('basePrice')) body.basePrice = parseInt(formData.get('basePrice') as string);
      if (formData.has('description')) body.description = formData.get('description') as string;
      if (formData.has('isAvailable')) body.isAvailable = formData.get('isAvailable') === 'true';
      if (formData.has('sortOrder')) body.sortOrder = parseInt(formData.get('sortOrder') as string);
      if (formData.has('variants')) {
        const variantsStr = formData.get('variants') as string;
        if (variantsStr) body.variants = JSON.parse(variantsStr);
      }
      imageFile = formData.get('image') as File | null;
    }

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

    let imageUrls = (existingProduct[0].imageUrls || []) as Array<{ publicId?: string; url?: string }>;
    let oldImagePublicId: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadToCloudinary(imageFile, 'products');
      uploadedImagePublicId = uploadResult.publicId;
      
      if (imageUrls && imageUrls.length > 0 && imageUrls[0].publicId) {
        oldImagePublicId = imageUrls[0].publicId;
      }
      imageUrls = [uploadResult]; // replace with new image
    }

    try {
      const updated = await db.update(products)
        .set({ ...result.data, imageUrls, updatedAt: new Date() })
        .where(eq(products.id, id))
        .returning();

      // Delete old image if new image was uploaded and DB update succeeded
      if (oldImagePublicId) {
        await deleteFromCloudinary(oldImagePublicId);
      }

      return new Response(JSON.stringify({ ok: true, data: updated[0] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (dbError) {
      if (uploadedImagePublicId) {
        await deleteFromCloudinary(uploadedImagePublicId);
      }
      throw dbError;
    }
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
