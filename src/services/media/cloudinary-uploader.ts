import { cloudinary, getCloudinaryConfig } from '@/lib/cloudinary';

import type { CloudinaryUploadResult } from '@/types/media';

export type { CloudinaryUploadResult };

/**
 * Strips sensitive API keys, secrets, or credential URLs from error messages.
 */
function sanitizeErrorMessage(message: string): string {
  return message
    .replace(/api_key=[^&\s]+/gi, 'api_key=***')
    .replace(/api_secret=[^&\s]+/gi, 'api_secret=***')
    .replace(/(?:cloudinary:\/\/[^:]+:)[^@]+(@)/gi, 'cloudinary://***:***$1');
}

/**
 * Uploads a base64 encoded image directly to Cloudinary.
 *
 * @param b64Data - Raw base64 string or data URI string
 * @param folder - Cloudinary destination folder name
 * @returns Structured result containing publicId, secureUrl, and bytes
 */
export async function uploadBase64Image(
  b64Data: string,
  folder: string
): Promise<CloudinaryUploadResult> {
  const sanitizedBase64 = typeof b64Data === 'string' ? b64Data.trim() : '';
  if (!sanitizedBase64) {
    throw new Error('Base64 image data is required and cannot be empty');
  }

  const sanitizedFolder = typeof folder === 'string' ? folder.trim() : '';
  if (!sanitizedFolder) {
    throw new Error('Upload folder is required and cannot be empty');
  }

  // Ensure Cloudinary SDK is initialized with environment credentials
  getCloudinaryConfig();

  const dataUri = sanitizedBase64.startsWith('data:')
    ? sanitizedBase64
    : `data:image/png;base64,${sanitizedBase64}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: sanitizedFolder,
      resource_type: 'image',
    });

    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      bytes: result.bytes ?? 0,
    };
  } catch (error: unknown) {
    const rawMessage = error instanceof Error ? error.message : String(error);
    const sanitized = sanitizeErrorMessage(rawMessage);

    // eslint-disable-next-line no-console
    console.error('[CloudinaryUploader] Upload failed:', sanitized);

    throw new Error(`Cloudinary upload failed: ${sanitized}`);
  }
}
