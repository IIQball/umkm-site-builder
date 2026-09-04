import { db } from '@/lib/db/client';
import { products } from '@/db/schema';
import { isNull, eq } from 'drizzle-orm';
import { validate } from '@/lib/utils';
import { MediaSyncOptionsSchema } from '@/schemas/media.schema';
import type { MediaSyncReport, CloudinaryAsset } from '@/types/media';
import {
  extractCloudinaryPublicId,
} from './cleanup.helpers';
import { fetchCloudinaryAssets } from './cleanup.service';

type DbExecutor = typeof db;

/**
 * Main service method to run Cloudinary product imageUrls synchronization.
 */
export async function runMediaSync(options: {
  dryRun?: boolean;
  dbClient?: DbExecutor;
  fetchFn?: typeof fetch;
} = {}): Promise<MediaSyncReport> {
  const validated = validate(MediaSyncOptionsSchema, {
    dryRun: options.dryRun,
  });
  const { dryRun } = validated;
  const dbClient = options.dbClient || db;
  const fetchFn = options.fetchFn || fetch;

  // Fetch all Cloudinary assets and collect their public IDs
  const allCloudinaryAssets = await fetchCloudinaryAssets({ fetchFn });
  const cloudinaryPublicIds = new Set(allCloudinaryAssets.map((a: CloudinaryAsset) => a.public_id));

  let productsChecked = 0;
  let productsUpdated = 0;
  let brokenUrlsRemoved = 0;

  try {
    // Fetch all products that are not deleted
    const productRecords = await dbClient
      .select({
        id: products.id,
        imageUrls: products.imageUrls,
      })
      .from(products)
      .where(isNull(products.deletedAt));

    for (const product of productRecords) {
      if (!product.imageUrls || !Array.isArray(product.imageUrls)) {
        continue;
      }

      productsChecked++;

      const originalUrls = product.imageUrls as string[];
      const validUrls: string[] = [];

      for (const url of originalUrls) {
        if (typeof url !== 'string') {
          validUrls.push(url);
          continue;
        }

        const publicId = extractCloudinaryPublicId(url);
        // If we can extract a public ID, check if it exists in Cloudinary
        if (publicId) {
          if (cloudinaryPublicIds.has(publicId)) {
            validUrls.push(url);
          } else {
            brokenUrlsRemoved++;
          }
        } else {
          // If we cannot extract a Cloudinary public ID, keep the URL (e.g. external URL)
          validUrls.push(url);
        }
      }

      // If URLs have been removed
      if (validUrls.length !== originalUrls.length) {
        productsUpdated++;

        if (!dryRun) {
          await dbClient
            .update(products)
            .set({ imageUrls: validUrls, updatedAt: new Date() })
            .where(eq(products.id, product.id));
        }
      }
    }
  } catch (err) {
    console.error('[runMediaSync] Failed during sync process:', err);
    throw err;
  }

  return {
    success: true,
    timestamp: new Date().toISOString(),
    dryRun,
    productsChecked,
    productsUpdated,
    brokenUrlsRemoved,
  };
}

export const mediaSyncService = {
  runMediaSync,
};
