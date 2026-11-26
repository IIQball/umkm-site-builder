import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ remove: vi.fn() }));
vi.mock('@/lib/cloudinary', async (load) => {
  const actual = await load<typeof import('@/lib/cloudinary')>();
  return { ...actual, deleteFromCloudinary: mocks.remove };
});
import { POST } from '@/pages/api/media/delete';

function request(url: string) {
  return { locals: { user: { id: 'user-1' } }, request: new Request('https://example.test', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url }) }) } as unknown as Parameters<typeof POST>[0];
}
beforeEach(() => vi.clearAllMocks());
describe('media deletion', () => {
  it('denies another uploader without contacting Cloudinary', async () => {
    const response = await POST(request('https://res.cloudinary.com/demo/image/upload/v1/umkm-builder/products/owners/user-2/photo.webp'));
    expect(response.status).toBe(403);
    expect(mocks.remove).not.toHaveBeenCalled();
  });
  it('uses the video destroy endpoint for an owned video', async () => {
    const response = await POST(request('https://res.cloudinary.com/demo/video/upload/v1/umkm-builder/templates/owners/user-1/clip.mp4'));
    expect(response.status).toBe(200);
    expect(mocks.remove).toHaveBeenCalledWith('umkm-builder/templates/owners/user-1/clip', 'video');
  });
});
