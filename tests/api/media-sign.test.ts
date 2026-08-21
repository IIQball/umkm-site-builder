import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateSignedUploadParams } from '../../src/lib/cloudinary';

// Mock crypto.subtle for signature generation
const originalCrypto = globalThis.crypto;
globalThis.crypto = {
  ...originalCrypto,
  subtle: {
    ...originalCrypto?.subtle,
    digest: vi.fn().mockResolvedValue(new ArrayBuffer(20)),
  },
  randomUUID: () => 'test-uuid',
} as unknown as Crypto;

describe('generateSignedUploadParams', () => {
  beforeEach(() => {
    process.env.CLOUDINARY_NAME = 'test-cloud';
    process.env.CLOUDINARY_API_KEY = '123456789';
    process.env.CLOUDINARY_SECRET = 'test-secret';
  });

  it('returns all required fields for client-side upload', async () => {
    const result = await generateSignedUploadParams('products');

    expect(result).toHaveProperty('signature');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('apiKey');
    expect(result).toHaveProperty('cloudName');
    expect(result).toHaveProperty('folder');
    expect(result).toHaveProperty('uploadUrl');
  });

  it('prefixes folder with umkm-builder/', async () => {
    const result = await generateSignedUploadParams('products');
    expect(result.folder).toBe('umkm-builder/products');
  });

  it('generates correct upload URL with cloud name', async () => {
    const result = await generateSignedUploadParams('templates');
    expect(result.uploadUrl).toBe('https://api.cloudinary.com/v1_1/test-cloud/image/upload');
  });

  it('returns apiKey from environment', async () => {
    const result = await generateSignedUploadParams('stores');
    expect(result.apiKey).toBe('123456789');
  });

  it('returns cloudName from environment', async () => {
    const result = await generateSignedUploadParams('stores');
    expect(result.cloudName).toBe('test-cloud');
  });

  it('generates valid timestamp', async () => {
    const before = Math.floor(Date.now() / 1000);
    const result = await generateSignedUploadParams('products');
    const after = Math.floor(Date.now() / 1000);

    const timestamp = parseInt(result.timestamp);
    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });

  it('signature is a hex string', async () => {
    const result = await generateSignedUploadParams('products');
    expect(result.signature).toMatch(/^[0-9a-f]+$/);
  });
});
