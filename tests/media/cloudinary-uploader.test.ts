import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { UploadApiResponse } from 'cloudinary';
import { uploadBase64Image } from '@/services/media/cloudinary-uploader';
import { cloudinary } from '@/lib/cloudinary.server';

describe('CloudinaryUploader - uploadBase64Image', () => {
  let uploadSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLOUDINARY_NAME = 'test-cloud';
    process.env.CLOUDINARY_API_KEY = 'test-api-key-12345';
    process.env.CLOUDINARY_SECRET = 'test-api-secret-67890';

    uploadSpy = vi.spyOn(cloudinary.uploader, 'upload');
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Happy path & Payload Processing', () => {
    it('prefixes raw base64 data with data:image/png;base64, and uploads to given folder', async () => {
      const rawBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      uploadSpy.mockResolvedValueOnce({
        public_id: 'pinoka/mockups/asset_001',
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/pinoka/mockups/asset_001.png',
        bytes: 2048,
      } as unknown as UploadApiResponse);

      const result = await uploadBase64Image(rawBase64, 'pinoka/mockups');

      expect(uploadSpy).toHaveBeenCalledTimes(1);
      expect(uploadSpy).toHaveBeenCalledWith(
        `data:image/png;base64,${rawBase64}`,
        {
          folder: 'pinoka/mockups',
          resource_type: 'image',
        }
      );

      expect(result).toEqual({
        publicId: 'pinoka/mockups/asset_001',
        secureUrl: 'https://res.cloudinary.com/test-cloud/image/upload/pinoka/mockups/asset_001.png',
        bytes: 2048,
      });
    });

    it('keeps existing data: URI prefix without adding duplicate prefix', async () => {
      const dataUri = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';

      uploadSpy.mockResolvedValueOnce({
        public_id: 'templates/sample_002',
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/templates/sample_002.webp',
        bytes: 1024,
      } as unknown as UploadApiResponse);

      const result = await uploadBase64Image(dataUri, 'templates');

      expect(uploadSpy).toHaveBeenCalledWith(
        dataUri,
        {
          folder: 'templates',
          resource_type: 'image',
        }
      );
      expect(result.publicId).toBe('templates/sample_002');
    });

    it('defaults bytes to 0 if bytes field is omitted by response', async () => {
      uploadSpy.mockResolvedValueOnce({
        public_id: 'stores/logo_fallback',
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/stores/logo_fallback.png',
      } as unknown as UploadApiResponse);

      const result = await uploadBase64Image('dummy-b64', 'stores');
      expect(result.bytes).toBe(0);
    });
  });

  describe('Validation & Edge Cases', () => {
    it('throws error when base64 string is empty or whitespace', async () => {
      await expect(uploadBase64Image('', 'pinoka/mockups')).rejects.toThrow(
        'Base64 image data is required and cannot be empty'
      );

      await expect(uploadBase64Image('   \n  ', 'pinoka/mockups')).rejects.toThrow(
        'Base64 image data is required and cannot be empty'
      );

      expect(uploadSpy).not.toHaveBeenCalled();
    });

    it('throws error when folder is empty or whitespace', async () => {
      await expect(uploadBase64Image('valid-b64', '')).rejects.toThrow(
        'Upload folder is required and cannot be empty'
      );

      await expect(uploadBase64Image('valid-b64', '   \t  ')).rejects.toThrow(
        'Upload folder is required and cannot be empty'
      );

      expect(uploadSpy).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling & Credential Sanitization', () => {
    it('sanitizes api_key and api_secret from error message and logs without exposing secrets', async () => {
      uploadSpy.mockRejectedValueOnce(
        new Error('Failed request to https://api.cloudinary.com?api_key=SECRET_KEY_123&api_secret=SUPER_SECRET_456 - timeout')
      );

      await expect(uploadBase64Image('valid-b64', 'pinoka/mockups')).rejects.toThrow(
        'Cloudinary upload failed: Failed request to https://api.cloudinary.com?api_key=***&api_secret=*** - timeout'
      );

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const loggedError = consoleErrorSpy.mock.calls[0][1];
      expect(loggedError).not.toContain('SECRET_KEY_123');
      expect(loggedError).not.toContain('SUPER_SECRET_456');
      expect(loggedError).toContain('api_key=***');
      expect(loggedError).toContain('api_secret=***');
    });

    it('sanitizes cloudinary:// URL credentials from error messages', async () => {
      uploadSpy.mockRejectedValueOnce(
        new Error('Connection error on cloudinary://user_test:sensitive_pass@cloud_name')
      );

      await expect(uploadBase64Image('valid-b64', 'pinoka/mockups')).rejects.toThrow(
        'Cloudinary upload failed: Connection error on cloudinary://***:***@cloud_name'
      );
    });
  });
});
