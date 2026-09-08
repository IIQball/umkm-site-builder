import type { ProductImageEntry } from '@/types';

/**
 * Resolves one `products.image_urls` entry to a usable URL.
 *
 * Entries are either a plain URL string or a `{ url, publicId }` Cloudinary object.
 * Rendering an object directly produces `src="[object Object]"`, so every read site
 * should go through here rather than indexing the array itself.
 */
export function productImageUrl(entry: unknown): string | null {
  if (typeof entry === 'string') {
    return entry.trim() || null;
  }

  if (entry && typeof entry === 'object') {
    const url = (entry as { url?: unknown }).url;
    if (typeof url === 'string' && url.trim()) {
      return url;
    }
  }

  return null;
}

/** Resolves a whole `image_urls` value to URL strings, dropping unusable entries. */
export function productImageUrls(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return (value as ProductImageEntry[])
    .map(productImageUrl)
    .filter((url): url is string => url !== null);
}

/** First usable image URL, or null when a product has none. */
export function firstProductImageUrl(value: unknown): string | null {
  return productImageUrls(value)[0] ?? null;
}
