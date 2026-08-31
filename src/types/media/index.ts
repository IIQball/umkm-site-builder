export interface CloudinaryAsset {
  public_id: string;
  created_at: string;
  bytes?: number;
  secure_url?: string;
  format?: string;
}

export interface MediaCleanupReport {
  success: boolean;
  timestamp: string;
  dryRun: boolean;
  olderThanHours: number;
  activeDbPublicIdsCount: number;
  totalCloudinaryAssetsCount: number;
  orphanAssetsCount: number;
  deletedAssetsCount: number;
  deletedPublicIds: string[];
  failedPublicIds: string[];
  skippedRecentCount: number;
}
