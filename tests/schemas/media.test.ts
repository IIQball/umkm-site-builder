import { describe, it, expect } from 'vitest';
import { MediaSignInput, CloudinaryUploadResult, CLOUDINARY_VARIANTS } from '../../src/schemas/media.schema';

describe('MediaSignInput', () => {
  it('accepts valid folder: products', () => {
    const result = MediaSignInput.safeParse({ folder: 'products' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.folder).toBe('products');
    }
  });

  it('accepts valid folder: templates', () => {
    const result = MediaSignInput.safeParse({ folder: 'templates' });
    expect(result.success).toBe(true);
  });

  it('accepts valid folder: stores', () => {
    const result = MediaSignInput.safeParse({ folder: 'stores' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid folder', () => {
    const result = MediaSignInput.safeParse({ folder: 'invalid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Folder harus salah satu');
    }
  });

  it('rejects empty folder', () => {
    const result = MediaSignInput.safeParse({ folder: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing folder', () => {
    const result = MediaSignInput.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('CloudinaryUploadResult', () => {
  it('accepts valid Cloudinary response', () => {
    const result = CloudinaryUploadResult.safeParse({
      secure_url: 'https://res.cloudinary.com/demo/image/upload/v1234/test.webp',
      public_id: 'umkm-builder/products/test',
      version: 1234567890,
      width: 800,
      height: 600,
      format: 'webp',
      bytes: 50000,
    });
    expect(result.success).toBe(true);
  });

  it('accepts minimal Cloudinary response (required fields only)', () => {
    const result = CloudinaryUploadResult.safeParse({
      secure_url: 'https://res.cloudinary.com/demo/image/upload/v1234/test.webp',
      public_id: 'umkm-builder/products/test',
      version: 1234567890,
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing secure_url', () => {
    const result = CloudinaryUploadResult.safeParse({
      public_id: 'test',
      version: 123,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid secure_url (not a URL)', () => {
    const result = CloudinaryUploadResult.safeParse({
      secure_url: 'not-a-url',
      public_id: 'test',
      version: 123,
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty public_id', () => {
    const result = CloudinaryUploadResult.safeParse({
      secure_url: 'https://example.com/img.webp',
      public_id: '',
      version: 123,
    });
    expect(result.success).toBe(false);
  });
});

describe('CLOUDINARY_VARIANTS', () => {
  it('has all expected variants', () => {
    expect(CLOUDINARY_VARIANTS.thumbnail).toBeDefined();
    expect(CLOUDINARY_VARIANTS.card).toBeDefined();
    expect(CLOUDINARY_VARIANTS.hero).toBeDefined();
    expect(CLOUDINARY_VARIANTS.original).toBeDefined();
  });

  it('all variants include f_webp', () => {
    for (const variant of Object.values(CLOUDINARY_VARIANTS)) {
      expect(variant).toContain('f_webp');
    }
  });
});
