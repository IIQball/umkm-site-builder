import { describe, it, expect } from 'bun:test';
import { compressImageClient } from '@/lib/client-compressor';

describe('Component Compressor Test (tests/components/compressor.test.ts)', () => {
  it('throws an error if no file is provided', async () => {
    // @ts-expect-error deliberately passing null to test parameter guard
    expect(compressImageClient(null)).rejects.toThrow('Berkas gambar wajib disertakan');
  });

  it('safely handles file conversion in headless fallback environment', async () => {
    const rawContent = 'dummy-image-data-for-packaging-mockup-compression-testing';
    const fakeBlob = new Blob([rawContent], { type: 'image/png' });
    const fakeFile = new File([fakeBlob], 'packaging-sample.png', { type: 'image/png' });

    const result = await compressImageClient(fakeFile);

    expect(result).toBeDefined();
    expect(result.size).toBe(fakeFile.size);
    expect(result.base64).toStartWith('data:image/png;base64,');
    expect(result.blob).toBeDefined();
  });

  it('respects custom maxSizeBytes threshold parameter', async () => {
    const rawContent = 'mock-jpg-image-bytes';
    const fakeFile = new File([rawContent], 'test-product.jpg', { type: 'image/jpeg' });
    const result = await compressImageClient(fakeFile, 1024 * 1024);

    expect(result).toBeDefined();
    expect(result.base64).toStartWith('data:image/jpeg;base64,');
    expect(result.size).toBe(fakeFile.size);
  });

  it('preserves valid mime types during base64 conversion', async () => {
    const webpBlob = new Blob(['webp-data'], { type: 'image/webp' });
    const webpFile = new File([webpBlob], 'banner.webp', { type: 'image/webp' });

    const result = await compressImageClient(webpFile);

    expect(result.base64).toStartWith('data:image/webp;base64,');
    expect(result.blob.type).toBe('image/webp');
  });
});
