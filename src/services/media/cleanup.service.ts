import { db } from '@/lib/db/client';
import { validate } from '@/lib/utils';
import { MediaCleanupOptionsSchema } from '@/schemas';
import type { CloudinaryAsset, MediaCleanupReport, DbExecutor } from '@/types';
import {
  getCloudinaryCredentials,
  collectActivePublicIds,
  identifyOrphanAssets,
} from './cleanup.helpers';

export * from './cleanup.helpers';


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
  fetchCloudinaryAssets,
  deleteCloudinaryAssets,
  runMediaCleanup,
};
