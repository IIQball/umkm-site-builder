import { afterEach, describe, expect, it, vi } from 'vitest';
import { isGoogleMapsUrl, resolveGoogleMapsUrl } from '@/lib/stores/coordinates';

afterEach(() => vi.unstubAllGlobals());
describe('Google Maps redirect validation', () => {
  it('accepts exact HTTPS hosts only', () => {
    expect(isGoogleMapsUrl('https://maps.app.goo.gl/example')).toBe(true);
    expect(isGoogleMapsUrl('https://www.google.com/maps/place/example')).toBe(true);
    expect(isGoogleMapsUrl('http://maps.app.goo.gl/example')).toBe(false);
    expect(isGoogleMapsUrl('https://maps.app.goo.gl.example.test/')).toBe(false);
    expect(isGoogleMapsUrl('https://maps.app.goo.gl@evil.test/')).toBe(false);
  });
  it('never fetches a redirect to an untrusted host', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 302, headers: { location: 'https://evil.test/' } }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await resolveGoogleMapsUrl('https://maps.app.goo.gl/example')).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('resolves a valid Google redirect', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 302, headers: { location: 'https://www.google.com/maps?q=-8.2,114.3' } })));
    expect(await resolveGoogleMapsUrl('https://maps.app.goo.gl/example')).toBe('https://www.google.com/maps?q=-8.2,114.3');
  });
});
