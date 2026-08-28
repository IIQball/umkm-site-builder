import { db } from '@/lib/db/client';
import { users, templates, stores, products } from '@/db/schema';
import { isNotNull, isNull } from 'drizzle-orm';
import { validate } from '@/lib/utils';
import { MediaCleanupOptionsSchema } from '@/schemas';
import type { CloudinaryAsset, MediaCleanupReport } from '@/types';

type DbExecutor = typeof db;

function getCloudinaryCredentials() {
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
 * Strips transformations, versions, query parameters, and file extensions.
 */
export function extractCloudinaryPublicId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;

  const trimmed = urlOrId.trim();
  if (!trimmed) return null;

  // If already a publicId path starting with umkm-builder/
  if (trimmed.startsWith('umkm-builder/')) {
    return trimmed.replace(/\.[a-zA-Z0-9]+$/, '');
  }

  // If it's a Cloudinary URL
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

  // 1. Users profile picture
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

  // 2. Templates (thumbnailUrl and full config jsonb)
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

  // 3. Stores customization (logo, banner, etc.)
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

  // 4. Products imageUrls
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

  // Normalize all candidate strings to public IDs
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
 * Fetches assets from Cloudinary Admin API under the specified prefix.
 */
export async function fetchCloudinaryAssets(options: {
  prefix?: string;
  maxResults?: number;
  fetchFn?: typeof fetch;
} = {}): Promise<CloudinaryAsset[]> {
  const { prefix = 'umkm-builder/', maxResults = 500, fetchFn = fetch } = options;
  const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials();

  const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=${encodeURIComponent(prefix)}&max_results=${maxResults}`;

  const response = await fetchFn(url, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Cloudinary resources: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return (data.resources || []) as CloudinaryAsset[];
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
    // If the asset is currently referenced in the DB, it's active
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

/**
 * Deletes public IDs from Cloudinary via Admin API.
 */
export async function deleteCloudinaryAssets(
  publicIds: string[],
  options: { fetchFn?: typeof fetch } = {}
): Promise<{ deleted: string[]; failed: string[] }> {
  if (publicIds.length === 0) {
    return { deleted: [], failed: [] };
  }

  const { fetchFn = fetch } = options;
  const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials();
  const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;

  const deleted: string[] = [];
  const failed: string[] = [];

  // Batch delete in chunks of 100 (Cloudinary Admin API limit per call)
  const chunkSize = 100;
  for (let i = 0; i < publicIds.length; i += chunkSize) {
    const chunk = publicIds.slice(i, i + chunkSize);
    const queryParams = chunk.map((id) => `public_ids[]=${encodeURIComponent(id)}`).join('&');
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?${queryParams}`;

    try {
      const res = await fetchFn(url, {
        method: 'DELETE',
        headers: {
          Authorization: authHeader,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`[deleteCloudinaryAssets] Batch delete failed for chunk:`, errText);
        failed.push(...chunk);
      } else {
        const json = await res.json();
        // Response format: { deleted: { "umkm-builder/...": "deleted" } }
        const resultDeleted = json.deleted || {};
        for (const id of chunk) {
          if (resultDeleted[id] === 'deleted' || resultDeleted[id] === 'not_found') {
            deleted.push(id);
          } else {
            failed.push(id);
          }
        }
      }
    } catch (err) {
      console.error(`[deleteCloudinaryAssets] Exception during delete chunk:`, err);
      failed.push(...chunk);
    }
  }

  return { deleted, failed };
}

/**
 * Main service method to run Cloudinary orphan media garbage collection.
 */
export async function runMediaCleanup(options: {
  olderThanHours?: number;
  dryRun?: boolean;
  dbClient?: DbExecutor;
  fetchFn?: typeof fetch;
} = {}): Promise<MediaCleanupReport> {
  const validated = validate(MediaCleanupOptionsSchema, {
    olderThanHours: options.olderThanHours,
    dryRun: options.dryRun,
  });
  const { olderThanHours, dryRun } = validated;
  const dbClient = options.dbClient || db;
  const fetchFn = options.fetchFn || fetch;


  const activePublicIds = await collectActivePublicIds(dbClient);
  const allCloudinaryAssets = await fetchCloudinaryAssets({ fetchFn });

  const { orphanAssets, skippedRecentAssets } = identifyOrphanAssets(
    allCloudinaryAssets,
    activePublicIds,
    olderThanHours
  );

  const orphanPublicIds = orphanAssets.map((a) => a.public_id);
  let deletedPublicIds: string[] = [];
  let failedPublicIds: string[] = [];

  if (!dryRun && orphanPublicIds.length > 0) {
    const deleteResult = await deleteCloudinaryAssets(orphanPublicIds, { fetchFn });
    deletedPublicIds = deleteResult.deleted;
    failedPublicIds = deleteResult.failed;
  }

  return {
    success: true,
    timestamp: new Date().toISOString(),
    dryRun,
    olderThanHours,
    activeDbPublicIdsCount: activePublicIds.size,
    totalCloudinaryAssetsCount: allCloudinaryAssets.length,
    orphanAssetsCount: orphanPublicIds.length,
    deletedAssetsCount: dryRun ? 0 : deletedPublicIds.length,
    deletedPublicIds,
    failedPublicIds,
    skippedRecentCount: skippedRecentAssets.length,
  };
}

export const mediaCleanupService = {
  extractCloudinaryPublicId,
  extractStringsFromUnknown,
  collectActivePublicIds,
  fetchCloudinaryAssets,
  identifyOrphanAssets,
  deleteCloudinaryAssets,
  runMediaCleanup,
};
