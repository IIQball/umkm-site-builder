import { describe, it, expect } from 'vitest';
import {
  productImageUrl,
  productImageUrls,
  firstProductImageUrl,
} from '@/lib/products/image';

describe('product image normalization', () => {
  describe('productImageUrl', () => {
    it('passes through a plain URL string', () => {
      expect(productImageUrl('https://cdn.example.com/a.jpg')).toBe('https://cdn.example.com/a.jpg');
    });

    it('unwraps a Cloudinary { url, publicId } object', () => {
      expect(productImageUrl({ url: 'https://cdn.example.com/b.jpg', publicId: 'p/b' })).toBe(
        'https://cdn.example.com/b.jpg',
      );
    });

    it('returns null instead of rendering "[object Object]" for an object with no url', () => {
      expect(productImageUrl({ publicId: 'p/c' })).toBeNull();
    });

    it('treats empty and blank strings as missing', () => {
      expect(productImageUrl('')).toBeNull();
      expect(productImageUrl('   ')).toBeNull();
    });

    it('rejects null, undefined and non-string primitives', () => {
      expect(productImageUrl(null)).toBeNull();
      expect(productImageUrl(undefined)).toBeNull();
      expect(productImageUrl(42)).toBeNull();
    });
  });

  describe('productImageUrls', () => {
    it('normalizes a mixed array of both stored shapes', () => {
      expect(
        productImageUrls([
          'https://cdn.example.com/a.jpg',
          { url: 'https://cdn.example.com/b.jpg', publicId: 'p/b' },
        ]),
      ).toEqual(['https://cdn.example.com/a.jpg', 'https://cdn.example.com/b.jpg']);
    });

    it('drops unusable entries rather than emitting them', () => {
      expect(productImageUrls([{ publicId: 'p/x' }, null, '', 'https://cdn.example.com/c.jpg'])).toEqual([
        'https://cdn.example.com/c.jpg',
      ]);
    });

    it('returns an empty array for non-array values', () => {
      expect(productImageUrls(undefined)).toEqual([]);
      expect(productImageUrls(null)).toEqual([]);
      expect(productImageUrls('nope')).toEqual([]);
    });
  });

  describe('firstProductImageUrl', () => {
    it('returns the first usable url, skipping a leading bad entry', () => {
      expect(firstProductImageUrl([{ publicId: 'p/x' }, 'https://cdn.example.com/d.jpg'])).toBe(
        'https://cdn.example.com/d.jpg',
      );
    });

    it('returns null when a product has no usable image', () => {
      expect(firstProductImageUrl([])).toBeNull();
      expect(firstProductImageUrl(undefined)).toBeNull();
    });
  });
});
