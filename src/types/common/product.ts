/**
 * Product media types
 */

/**
 * One entry of `products.image_urls`.
 *
 * The column is untyped `jsonb` and holds two shapes in production: Cloudinary uploads
 * stored as `{ url, publicId }` objects, and plain URL strings from the newer API, which
 * validates input as `z.array(z.string().url())`. `publicId` is load-bearing — the product
 * delete route uses it to remove the asset from Cloudinary.
 */
export type ProductImageEntry = string | { url?: string; publicId?: string };
