import { describe, it, expect, vi, afterEach } from 'vitest';
import { runInNewContext } from 'node:vm';
import { gate, TurnstileChallenge } from '../../src/turnstile-gate';

function setup() {
  const objects = new Map<string, TurnstileChallenge>();
  const env = { TURNSTILE_SITE_KEY: 'site_key', TURNSTILE_SECRET_KEY: 'secret', TURNSTILE_CHALLENGES: {
    idFromName: (id: string) => id,
    get(id: unknown) {
      if (!objects.has(id as string)) {
        const data = new Map(); let lock = Promise.resolve();
        const storage: ConstructorParameters<typeof TurnstileChallenge>[0]['storage'] = { get: async <T>(key: string): Promise<T | undefined> => data.get(key), put: async (key: string, value: unknown) => { data.set(key, value); }, setAlarm: async () => {}, deleteAll: async () => { data.clear(); }, transaction: async <T>(fn: (tx: ConstructorParameters<typeof TurnstileChallenge>[0]['storage']) => Promise<T>): Promise<T> => { const previous = lock; let release!: () => void; lock = new Promise<void>(r => { release = r; }); await previous; try { return await fn(storage); } finally { release(); } } };
        objects.set(id as string, new TurnstileChallenge({ storage }));
      }
      return objects.get(id as string)!;
    },
  } };
  const next = vi.fn(async (request: Request) => { void request; return new Response('APP', { headers: { 'Cache-Control': 'public, max-age=3600' } }); });
  const request = (url: string, init?: RequestInit) => gate(new Request(url, init), env, next);
  return { request, next, objects };
}
function challengeCookie(response: Response) { return response.headers.get('set-cookie')!.split(';')[0]; }
function id(cookie: string) { return cookie.split('=')[0].slice('__Host-pinoka-challenge-'.length); }
function continuation(url: string, cookie: string) { return url + (url.includes('?') ? '&' : '?') + '__pinoka_continue=' + id(cookie); }
afterEach(() => vi.unstubAllGlobals());
describe('Turnstile page gate', () => {
  it('lets the configured HTTPS hostname rely on its Managed Challenge rule', async () => {
    const { next } = setup();
    const env = { TURNSTILE_MANAGED_CHALLENGE_HOST: ' Pinoka.My.ID ' };

    for (const path of ['/', '/produk', '/__pinoka/verify']) {
      const request = new Request('https://pinoka.my.id' + path);
      expect(await (await gate(request, env, next)).text()).toBe('APP');
      expect(next).toHaveBeenLastCalledWith(request);
    }
  });
  it.each([
    ['https://pinoka.my.id/', undefined],
    ['https://pinoka.my.id/', ''],
    ['https://pinoka.my.id/', '*.my.id'],
    ['https://pinoka.my.id/', 'https://pinoka.my.id'],
    ['https://pinoka.my.id/', 'pinoka.my.id/'],
    ['https://pinoka..my.id/', 'pinoka..my.id'],
    ['http://pinoka.my.id/', 'pinoka.my.id'],
    ['https://shop.pinoka.my.id/', 'pinoka.my.id'],
    ['https://pinoka.my.id.example.com/', 'pinoka.my.id'],
    ['https://pinoka.pinokaofficial.workers.dev/', 'pinoka.pinokaofficial.workers.dev'],
    ['https://preview-pinoka.pinokaofficial.workers.dev/', 'preview-pinoka.pinokaofficial.workers.dev'],
  ])('requires the existing gate for %s with Managed Challenge host %s', async (url, host) => {
    const { next } = setup();
    const result = await gate(new Request(url), { TURNSTILE_MANAGED_CHALLENGE_HOST: host }, next);

    expect(result.status).toBe(503);
    expect(next).not.toHaveBeenCalled();
  });
  it('withholds all page routes before Astro and passes explicit protocols and assets', async () => {
    const { request, next } = setup();
    for (const path of ['/', '/dashboard', '/storefront/shop?x=1', '/some.html', '/images/page.html', '/missing', '/api%2Fauth']) {
      const response = await request('https://shop.example.com' + path, { headers: { Accept: '*/*', 'Sec-Fetch-Dest': 'empty' } });
      expect(await response.text()).toContain('Sebentar, ya.');
      expect(response.headers.get('cache-control')).toContain('no-store');
    }
    expect(next).not.toHaveBeenCalled();
    for (const path of ['/api/auth/callback', '/api/webhooks/xendit', '/api/cron/expire-transactions', '/_astro/a.js', '/frames/a.webp', '/assets/3d/banyuwangi_map.glb', '/robots.txt', '/_server-islands/example']) await request('https://shop.example.com' + path);
    await request('https://shop.example.com/_server-islands/example', { method: 'POST' });
    expect(next).toHaveBeenCalledTimes(9);
  });
  it('binds verification and a single atomic continuation to host, path and query', async () => {
    const { request, next } = setup();
    const url = 'https://shop.example.com/deep?x=1';
    const first = await request(url); const c = challengeCookie(first);
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: true, hostname: 'shop.example.com', action: 'page_open', cdata: id(c) })));
    const verified = await request('https://shop.example.com/__pinoka/verify', { method: 'POST', headers: { origin: 'https://shop.example.com', cookie: c, 'content-type': 'application/json' }, body: JSON.stringify({ token: 'valid', id: id(c) }) });
    expect(verified.status).toBe(204);
    const proof = challengeCookie(verified);
    expect(await (await request(continuation('https://other.example.com/deep?x=1', proof), { headers: { cookie: proof } })).text()).toContain('Sebentar');
    expect(await (await request(continuation('https://shop.example.com/deep?x=2', proof), { headers: { cookie: proof } })).text()).toContain('Sebentar');
    const results = await Promise.all([request(continuation(url, proof), { headers: { cookie: proof } }), request(continuation(url, proof), { headers: { cookie: proof } })]);
    expect((await Promise.all(results.map(r => r.text()))).filter(t => t === 'APP')).toHaveLength(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].url).toBe(url);
    expect(results.find(r => r.headers.get('content-type')?.includes('text/html'))).toBeDefined();
    expect(results.find(r => r.headers.get('cdn-cache-control') === 'no-store')).toBeDefined();
  });
  it('allows overlapping challenges for separate targets and the same target', async () => {
    const { request } = setup();
    const urls = ['https://example.com/a?one=1', 'https://example.com/b', 'https://example.com/a?one=1'];
    const cs = await Promise.all(urls.map(async url => challengeCookie(await request(url))));
    const cookie = cs.join('; ');
    vi.stubGlobal('fetch', vi.fn(async (_url, init) => {
      const body = JSON.parse(init.body as string);
      return Response.json({ success: true, hostname: 'example.com', action: 'page_open', cdata: body.response });
    }));
    const proofs: string[] = [];
    for (const c of cs) {
      const response = await request('https://example.com/__pinoka/verify', { method: 'POST', headers: { origin: 'https://example.com', cookie, 'content-type': 'application/json' }, body: JSON.stringify({ token: id(c), id: id(c) }) });
      expect(response.status).toBe(204);
      proofs.push(challengeCookie(response));
    }
    const proofCookie = proofs.join('; ');
    expect(await (await request(urls[0], { headers: { cookie: proofCookie } })).text()).toContain('Sebentar');
    for (const index of [2, 0, 1]) expect(await (await request(continuation(urls[index], proofs[index]), { headers: { cookie: proofCookie } })).text()).toBe('APP');
    expect(await (await request(continuation(urls[0], proofs[0]), { headers: { cookie: proofCookie } })).text()).toContain('Sebentar');
  });
  it('restores the original address and forwards its unchanged query', async () => {
    const { request, next } = setup();
    const url = 'https://example.com/deep?x=%2f&x=2&__pinoka_continue=original';
    const c = challengeCookie(await request(url));
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: true, hostname: 'example.com', action: 'page_open', cdata: id(c) })));
    const verified = await request('https://example.com/__pinoka/verify', { method: 'POST', headers: { origin: 'https://example.com', cookie: c, 'content-type': 'application/json' }, body: JSON.stringify({ token: 'valid', id: id(c) }) });
    const proof = challengeCookie(verified);
    let inserted = '';
    vi.stubGlobal('HTMLRewriter', class { on(_selector: string, handlers: { element(element: { append(html: string): void }): void }) { handlers.element({ append(html) { inserted = html; } }); return this; } transform(response: Response) { return response; } });
    next.mockImplementation(async () => new Response('<html><head></head></html>', { headers: { 'Content-Type': 'text/html' } }));
    await request(continuation(url, proof), { headers: { cookie: proof } });
    expect(next.mock.calls[0][0].url).toBe(url);
    expect(inserted).toContain('/__pinoka/continuation.js');
    const script = await (await request('https://example.com/__pinoka/continuation.js')).text();
    let restored = '';
    runInNewContext(script, { location: { href: continuation(url, proof) + '#section' }, history: { state: null, replaceState: (_state: unknown, _title: string, value: string) => { restored = value; } } });
    expect(restored).toBe(url + '#section');
  });
  it.each([
    { hostname: 'wrong.example', action: 'page_open', cdata: 'correct' },
    { hostname: 'example.com', action: 'wrong', cdata: 'correct' },
    { hostname: 'example.com', action: 'page_open', cdata: 'wrong' },
  ])('rejects mismatched Siteverify metadata', async metadata => {
    const { request, next } = setup();
    const c = challengeCookie(await request('https://example.com/'));
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: true, ...metadata, cdata: metadata.cdata === 'correct' ? id(c) : metadata.cdata })));
    const response = await request('https://example.com/__pinoka/verify', { method: 'POST', headers: { origin: 'https://example.com', cookie: c, 'content-type': 'application/json' }, body: JSON.stringify({ token: 'valid', id: id(c) }) });
    expect(response.status).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });
  it('does not allocate storage for issuance, refresh, or rejected verification; cannot reissue a consumed proof', async () => {
    const { request, objects } = setup();
    const url = 'https://example.com/page';
    const pending = challengeCookie(await request(url));
    await request(url, { headers: { cookie: pending } });
    expect(objects.size).toBe(0);
    const post = () => request('https://example.com/__pinoka/verify', { method: 'POST', headers: { origin: 'https://example.com', cookie: pending, 'content-type': 'application/json' }, body: JSON.stringify({ token: 'valid', id: id(pending) }) });
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: false })));
    expect((await post()).status).toBe(403);
    expect(objects.size).toBe(0);
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: true, hostname: 'example.com', action: 'page_open', cdata: id(pending) })));
    const verified = await post();
    expect(verified.status).toBe(204);
    expect(objects.size).toBe(1);
    expect(await (await request(continuation(url, challengeCookie(verified)), { headers: { cookie: challengeCookie(verified) } })).text()).toBe('APP');
    expect((await post()).status).toBe(403);
  });
  it('rejects a ticket with a tampered HMAC', async () => {
    const { request, next } = setup();
    const c = challengeCookie(await request('https://example.com/'));
    const split = c.lastIndexOf('.') + 1;
    const tampered = c.slice(0, split) + (c[split] === 'A' ? 'B' : 'A') + c.slice(split + 1);
    const response = await request('https://example.com/__pinoka/verify', { method: 'POST', headers: { origin: 'https://example.com', cookie: tampered, 'content-type': 'application/json' }, body: JSON.stringify({ token: 'valid', id: id(c) }) });
    expect(response.status).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });
  it('fails closed for invalid verification, cross-origin requests and missing settings', async () => {
    const { request, next } = setup(); const c = challengeCookie(await request('https://example.com/'));
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: true, hostname: 'wrong.example', action: 'page_open', cdata: id(c) })));
    const post = (origin: string) => request('https://example.com/__pinoka/verify', { method: 'POST', headers: { origin, cookie: c, 'content-type': 'application/json' }, body: JSON.stringify({ token: 'x', id: id(c) }) });
    expect((await post('https://attacker.example')).status).toBe(403);
    expect((await post('https://example.com')).status).toBe(403);
    expect((await post('https://example.com')).status).toBe(403);
    expect(await (await request('https://example.com/', { headers: { cookie: c } })).text()).toContain('Sebentar');
    expect((await gate(new Request('https://example.com/'), {}, next)).status).toBe(503);
    expect(next).not.toHaveBeenCalled();
  });
});
