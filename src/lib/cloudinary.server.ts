import { getCloudinaryConfig, generateSignature } from './cloudinary';

export interface CloudinaryUploadOptions {
  folder?: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  format?: string;
  [key: string]: unknown;
}

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  bytes?: number;
  [key: string]: unknown;
}

/**
 * Lightweight, edge-compatible Cloudinary server client.
 * Uses native fetch and Web Crypto, avoiding Node.js CommonJS SDK issues in Cloudflare workerd.
 */
export const cloudinary = {
  config: (_options?: Record<string, unknown>) => {
    void _options;
  },
  uploader: {
    /**
     * Uploads an image (base64 data URI or URL) to Cloudinary via signed REST API.
     */
    async upload(
      file: string,
      options: CloudinaryUploadOptions = {}
    ): Promise<CloudinaryUploadResponse> {
      const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const resourceType = options.resource_type || 'image';

      const signParams: Record<string, string> = {
        timestamp,
      };

      if (options.folder) {
        signParams.folder = options.folder;
      }
      if (options.format) {
        signParams.format = options.format;
      }

      const signature = await generateSignature(signParams, apiSecret);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);

      if (options.folder) {
        formData.append('folder', options.folder);
      }
      if (options.format) {
        formData.append('format', options.format);
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        signal: typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
          ? AbortSignal.timeout(120000)
          : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed request to https://api.cloudinary.com - ${response.status} ${errorText}`);
      }

      return (await response.json()) as CloudinaryUploadResponse;
    },
  },
};

/**
 * Initializes and returns the server-side Cloudinary client.
 * Validates environment configuration.
 */
export function getCloudinaryServer() {
  getCloudinaryConfig();
  return cloudinary;
}
