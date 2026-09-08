import { db } from '@/lib/db/client';
import { users, templates, stores, products } from '@/db/schema';
import { isNotNull, isNull } from 'drizzle-orm';
import type { CloudinaryAsset, DbExecutor } from '@/types';


export function getCloudinaryCredentials() {
  const cloudName = process.env.CLOUDINARY_NAME || (import.meta as unknown as { env: Record<string, string | undefined> }).env?.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || (import.meta as unknown as { env: Record<string, string | undefined> }).env?.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_SECRET || (import.meta as unknown as { env: Record<string, string | undefined> }).env?.CLOUDINARY_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials (CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET) are missing');
  }

  return { cloudName, apiKey, apiSecret };
}

/**
 * Extracts publicId with 'umkm-builder/' prefix from a Cloudinary URL or path.
 */
export function extractCloudinaryPublicId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;

  const trimmed = urlOrId.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('umkm-builder/')) {
    return trimmed.replace(/\.[a-zA-Z0-9]+$/, '');
  }

  if (trimmed.includes('cloudinary.com') || trimmed.includes('/image/upload/')) {
    const uploadIndex = trimmed.indexOf('/image/upload/');
    if (uploadIndex !== -1) {
      let afterUpload = trimmed.slice(uploadIndex + '/image/upload/'.length);
      afterUpload = afterUpload.split('?')[0].split('#')[0];
      
      const builderIndex = afterUpload.indexOf('umkm-builder/');
      if (builderIndex !== -1) {
        const publicPathWithExt = afterUpload.slice(builderIndex);
        return publicPathWithExt.replace(/\.[a-zA-Z0-9]+$/, '');
      }
    }
  }

  return null;
}

/**
 * Traverses any nested object or array to find all potential string URLs/paths.
 */
export function extractStringsFromUnknown(val: unknown, results: Set<string>): void {
  if (!val) return;
  if (typeof val === 'string') {
    results.add(val);
    return;
  }
  if (Array.isArray(val)) {
    for (const item of val) {
      extractStringsFromUnknown(item, results);
    }
    return;
  }
  if (typeof val === 'object') {
    for (const key of Object.keys(val as Record<string, unknown>)) {
      extractStringsFromUnknown((val as Record<string, unknown>)[key], results);
    }
  }
}

/**
 * Collects all active Cloudinary public IDs referenced across the database.
 */
export async function collectActivePublicIds(dbClient: DbExecutor = db): Promise<Set<string>> {
  const allUrlsOrIds = new Set<string>();

  try {
    const userRecords = await dbClient
      .select({ image: users.image })
      .from(users)
      .where(isNotNull(users.image));
    for (const u of userRecords) {
      if (u.image) allUrlsOrIds.add(u.image);
    }
  } catch (err) {
    console.warn('[collectActivePublicIds] Failed querying users:', err);
  }

  try {
    const templateRecords = await dbClient
      .select({ thumbnailUrl: templates.thumbnailUrl, config: templates.config })
      .from(templates)
      .where(isNull(templates.deletedAt));
    for (const t of templateRecords) {
      if (t.thumbnailUrl) allUrlsOrIds.add(t.thumbnailUrl);
      if (t.config) extractStringsFromUnknown(t.config, allUrlsOrIds);
    }
  } catch (err) {
    console.warn('[collectActivePublicIds] Failed querying templates:', err);
  }

  try {
    const storeRecords = await dbClient
      .select({ customization: stores.customization })
      .from(stores)
      .where(isNull(stores.deletedAt));
    for (const s of storeRecords) {
      if (s.customization) extractStringsFromUnknown(s.customization, allUrlsOrIds);
    }
  } catch (err) {
    console.warn('[collectActivePublicIds] Failed querying stores:', err);
  }

  try {
    const productRecords = await dbClient
      .select({ imageUrls: products.imageUrls })
      .from(products)
      .where(isNull(products.deletedAt));
    for (const p of productRecords) {
      if (p.imageUrls) extractStringsFromUnknown(p.imageUrls, allUrlsOrIds);
    }
  } catch (err) {
    console.warn('[collectActivePublicIds] Failed querying products:', err);
  }

  const activePublicIds = new Set<string>();
  for (const candidate of allUrlsOrIds) {
    const parsedId = extractCloudinaryPublicId(candidate);
    if (parsedId) {
      activePublicIds.add(parsedId);
    }
  }

  return activePublicIds;
}

/**
 * Filters Cloudinary assets that are older than threshold and not in the active database set.
 */
export function identifyOrphanAssets(
  assets: CloudinaryAsset[],
  activePublicIds: Set<string>,
  olderThanHours: number = 24
): { orphanAssets: CloudinaryAsset[]; skippedRecentAssets: CloudinaryAsset[] } {
  const thresholdTime = Date.now() - olderThanHours * 60 * 60 * 1000;
  const orphanAssets: CloudinaryAsset[] = [];
  const skippedRecentAssets: CloudinaryAsset[] = [];

  for (const asset of assets) {
    if (activePublicIds.has(asset.public_id)) {
      continue;
    }

    const assetCreatedAt = new Date(asset.created_at).getTime();
    if (assetCreatedAt < thresholdTime) {
      orphanAssets.push(asset);
    } else {
      skippedRecentAssets.push(asset);
    }
  }

  return { orphanAssets, skippedRecentAssets };
}
