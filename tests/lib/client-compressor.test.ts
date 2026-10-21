import { describe, it, expect } from 'bun:test';
import { compressImageClient } from '@/lib/client-compressor';

describe('Client Compressor - compressImageClient', () => {
  it('throws an error if no file is provided', async () => {
    // @ts-expect-error testing missing argument
    expect(compressImageClient(null)).rejects.toThrow('Berkas gambar wajib disertakan');
  });

  it('safely handles file conversion in headless environment fallback', async () => {
    const rawContent = 'dummy-image-data-for-compression-testing';
    const fakeBlob = new Blob([rawContent], { type: 'image/png' });
    const fakeFile = new File([fakeBlob], 'test-product.png', { type: 'image/png' });

    const result = await compressImageClient(fakeFile);

    expect(result).toBeDefined();
    expect(result.size).toBe(fakeFile.size);
    expect(result.base64).toStartWith('data:image/png;base64,');
    expect(result.blob).toBeDefined();
  });

  it('respects custom maxSizeBytes parameter', async () => {
    const fakeFile = new File(['small'], 'avatar.jpg', { type: 'image/jpeg' });
    const result = await compressImageClient(fakeFile, 1024 * 1024);

    expect(result).toBeDefined();
    expect(result.base64).toStartWith('data:image/jpeg;base64,');
  });
});
