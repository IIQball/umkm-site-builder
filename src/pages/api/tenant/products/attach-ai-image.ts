import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { products, stores } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { jsonSuccess, jsonError } from '@/lib/utils/api-handler';
import { canManageStore, type AuthenticatedUser } from '@/lib/auth';
import { logActivity } from '@/services/audit.service';

const attachAiImageInput = z.object({
  productId: z.string().min(1, 'Product ID wajib diisi'),
  cloudinaryUrl: z.string().url('URL Cloudinary tidak valid'),
  attachmentType: z.enum(['logo', 'product_poster', 'packaging_mockup'], {
    errorMap: () => ({ message: 'Tipe attachment tidak valid' }),
  }),
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Authenticate
    if (!locals.user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    // 2. Parse & validate input
    const body = await request.json();
    const result = attachAiImageInput.safeParse(body);

    if (!result.success) {
      return jsonError('Validasi gagal', 400, result.error.issues, 'VALIDATION_ERROR');
    }

    const { productId, cloudinaryUrl, attachmentType } = result.data;

    // 3. Get product & verify ownership
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      return jsonError('Produk tidak ditemukan', 404, undefined, 'NOT_FOUND');
    }

    // 4. Get store & verify store access
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.id, product.storeId))
      .limit(1);

    if (!store || !canManageStore(locals.user as AuthenticatedUser, store)) {
      return jsonError('Anda tidak memiliki izin mengelola produk toko ini', 403, undefined, 'FORBIDDEN');
    }

    // 5. Attach AI-generated image to product imageUrls
    const currentImageUrls = (product.imageUrls || []) as Array<{ url: string; publicId?: string; type?: string }>;
    
    // Add new image with type metadata
    const aiImageEntry = {
      url: cloudinaryUrl,
      type: attachmentType,
      attachedAt: new Date().toISOString(),
    };
    
    const updatedImageUrls = [...currentImageUrls, aiImageEntry];

    // 6. Update product with new imageUrls
    const [updatedProduct] = await db
      .update(products)
      .set({
        imageUrls: updatedImageUrls,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();

    // 7. Update store lastEditedBy timestamp
    await db
      .update(stores)
      .set({
        lastEditedBy: (locals.user as AuthenticatedUser).id,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, store.id));

    // 8. Log activity
    await logActivity({
      userId: (locals.user as AuthenticatedUser).id,
      storeId: store.id,
      action: 'Attach AI Image to Product',
      details: {
        productId,
        productName: product.name,
        attachmentType,
        cloudinaryUrl,
      },
    });

    return jsonSuccess(
      {
        productId: updatedProduct.id,
        imageUrls: updatedProduct.imageUrls,
        message: `Gambar ${attachmentType} berhasil dipasang ke produk`,
      },
      200
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return jsonError(message, 500, undefined, 'INTERNAL');
  }
};
