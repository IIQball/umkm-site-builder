import { v2 as cloudinary } from 'cloudinary';
import { getCloudinaryConfig } from './cloudinary';

/**
 * Initializes and returns the server-side Cloudinary Node SDK.
 * STRICTLY for server-side environments (API routes, background workers).
 * NEVER import this file into client-side Svelte/Astro components.
 */
export function getCloudinaryServer() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  return cloudinary;
}

export { cloudinary };
