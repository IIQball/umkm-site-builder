/**
 * Helper for image compression to WebP and Cloudinary upload.
 * Delegates compression, signed-upload params, and Cloudinary cleanup to shared helpers.
 */
import { compressImageClient } from '@/lib/client-compressor';
import { getOptimizedCloudinaryVideoUrl } from '@/lib/cloudinary';
import {
  deleteCloudinaryUploadAsset,
  requestSignedUploadParams,
  uploadFormDataWithProgress,
} from '@/components/ui/imageUpload.helpers';

const BUILDER_TARGET_MAX_BYTES = 200 * 1024;

export async function compressToWebP(file: File, maxWidth = 1920, maxHeight = 1080): Promise<Blob> {
  const { blob } = await compressImageClient(file, BUILDER_TARGET_MAX_BYTES, maxWidth, maxHeight);
  return blob;
}

export function deleteOldImage(urlToDelete: string): Promise<void> {
  return deleteCloudinaryUploadAsset(urlToDelete);
}

export async function uploadToCloudinary(
  blob: Blob,
  folder = 'templates',
  fileName = `${Date.now()}_image.webp`
): Promise<string> {
  const signData = await requestSignedUploadParams(folder, 'image');
  return uploadFormDataWithProgress(signData.uploadUrl, blob, fileName, signData);
}

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-matroska',
  'video/x-m4v',
];

export const MAX_VIDEO_SIZE_BYTES = 30 * 1024 * 1024; // 30 MB (optimal for web & Cloudinary free tier)

export function validateVideoFile(file: File): string | null {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return 'Format video harus MP4, MOV, WEBM, MKV, atau M4V';
  }
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return 'Ukuran video maksimal 30MB (optimal untuk performa web)';
  }
  return null;
}

export async function uploadVideoToCloudinary(
  file: File,
  folder = 'templates',
  onProgress?: (percent: number) => void
): Promise<string> {
  const error = validateVideoFile(file);
  if (error) throw new Error(error);

  const signData = await requestSignedUploadParams(folder, 'video');
  const uploadedUrl = await uploadFormDataWithProgress(
    signData.uploadUrl,
    file,
    undefined,
    signData,
    onProgress
  );
  return getOptimizedCloudinaryVideoUrl(uploadedUrl, 1280);
}

