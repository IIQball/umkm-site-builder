import { describe, expect, it } from 'vitest';
import { isOwnedMedia } from '@/lib/cloudinary';

describe('media ownership', () => {
  it('accepts only the signed-in uploader namespace', () => {
    expect(isOwnedMedia('umkm-builder/products/owners/user-1/photo', 'user-1')).toBe(true);
    expect(isOwnedMedia('umkm-builder/products/owners/user-2/photo', 'user-1')).toBe(false);
    expect(isOwnedMedia('umkm-builder/products/photo', 'user-1')).toBe(false);
    expect(isOwnedMedia('umkm-builder/products/owners/user-1/../photo', 'user-1')).toBe(false);
  });
});
