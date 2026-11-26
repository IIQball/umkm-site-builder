import { describe, expect, it, vi } from 'vitest';

vi.mock('astro:middleware', () => ({ defineMiddleware: (handler: unknown) => handler }));
vi.mock('@/lib/auth', () => ({ auth: { api: { getSession: vi.fn().mockResolvedValue(null) } }, getAuth: vi.fn() }));
vi.mock('@/db', () => ({ db: {}, users: {}, stores: {} }));
vi.mock('@/lib/domain', () => ({ extractSubdomain: vi.fn().mockReturnValue(null) }));
vi.mock('@/lib/utils/error-sanitizer', () => ({ classifyServerError: vi.fn(), registerGlobalRejectionHandler: vi.fn() }));
vi.mock('@/services/stores', () => ({ isStoreFullyOnboarded: vi.fn() }));
import { onRequest } from '@/middleware';

describe('framework response caching', () => {
  it.each(['/_server-islands/example', '/_actions/example', '/_image'])('preserves the framework cache policy for %s', async path => {
    const request = new Request(`https://example.test${path}`);
    const response = await onRequest({ url: new URL(request.url), request, locals: {} } as never, async () => new Response('dynamic', { headers: { 'Cache-Control': 'private, no-store' } }));
    expect((response as Response).headers.get('cache-control')).toBe('private, no-store');
  });
});
