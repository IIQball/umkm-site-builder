import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/client';
import { products } from '../../../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { uploadToCloudinary, deleteFromCloudinary } from '../../../lib/cloudinary';

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

export const POST: APIRoute = async ({ request }) => {
  let uploadedImagePublicId: string | null = null;
  try {
    const formData = await request.formData();
    
    const body = {
      storeId: formData.get('storeId') as string,
      categoryId: formData.get('categoryId') as string,
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      basePrice: parseInt(formData.get('basePrice') as string) || 0,
      description: formData.get('description') as string || '',
      isAvailable: formData.get('isAvailable') === 'true',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      variants: formData.get('variants') ? JSON.parse(formData.get('variants') as string) : [],
    };

    const result = productInput.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ 
        ok: false, 
        error: { message: 'Validation failed', issues: result.error.issues } 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle Image Upload
    const imageUrls: { url: string; publicId: string; version: number }[] = [];
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadToCloudinary(imageFile, 'products');
      imageUrls.push(uploadResult);
      uploadedImagePublicId = uploadResult.publicId;
    }

    const newProductData = {
      ...result.data,
      imageUrls,
      id: crypto.randomUUID(),
    };

    try {
      const inserted = await db.insert(products).values(newProductData).returning();

      return new Response(JSON.stringify({ ok: true, data: inserted[0] }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (dbError) {
      // Rollback image if DB fails
      if (uploadedImagePublicId) {
        await deleteFromCloudinary(uploadedImagePublicId);
      }
      throw dbError; // throw to outer catch
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ ok: false, error: { message } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
