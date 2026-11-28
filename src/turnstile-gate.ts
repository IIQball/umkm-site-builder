const VERIFY_PATH = '/__pinoka/verify';
const CLEANUP_PATH = '/__pinoka/continuation.js';
const SELECTOR = /[?&]__pinoka_continue=([a-f0-9]{64})$/;
const ACTION = 'page_open';
const COOKIE = '__Host-pinoka-challenge-';
const MAX_CHALLENGES = 8;
const TTL = 300;
const DNS_HOSTNAME = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const noStore = { 'Cache-Control': 'private, no-store, max-age=0', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' };

type Stub = { fetch(request: Request): Promise<Response> };
type Env = {
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_CHALLENGES?: { idFromName(name: string): unknown; get(id: unknown): Stub };
  TURNSTILE_MANAGED_CHALLENGE_HOST?: string;
};

type State = { target: string; hostname: string; expires: number; status: 'verified' | 'consumed' };
type Storage = { get<T>(key: string): Promise<T | undefined>; put(key: string, value: unknown): Promise<void>; setAlarm(time: number): Promise<void>; deleteAll(): Promise<void>; transaction<T>(fn: (txn: Storage) => Promise<T>): Promise<T> };
type Ticket = { id: string; target: string; hostname: string; expires: number; verified: boolean };

// Initialization and consumption are serialized by the per-challenge object.
export class TurnstileChallenge {
  constructor(private ctx: { storage: Storage }) {}
  async alarm() { await this.ctx.storage.deleteAll(); }
  async fetch(request: Request) {
    const { operation, target, hostname, expires } = await request.json() as { operation: string; target: string; hostname: string; expires: number };
    const storage = this.ctx.storage;
    if (operation === 'create') {
      const created = await storage.transaction(async tx => {
        if (await tx.get('state') || expires <= Date.now()) return false;
        await tx.put('state', { target, hostname, expires, status: 'verified' } satisfies State);
        await tx.setAlarm(expires);
        return true;
      });
      return new Response(null, { status: created ? 204 : 409 });
    }
    if (operation === 'consume') {
      const consumed = await storage.transaction(async tx => {
        const state = await tx.get<State>('state');
        if (!state || state.expires <= Date.now() || state.status !== 'verified' || state.target !== target || state.hostname !== hostname) return false;
        await tx.put('state', { ...state, status: 'consumed' });
        return true;
      });
      return new Response(null, { status: consumed ? 204 : 403 });
    }
    return new Response(null, { status: 400 });
  }
}

function base64(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', ''); }
async function ticketKey(secret: string) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(`pinoka-turnstile-ticket-key-v1:${secret}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function ticketSignature(payload: string, secret: string) {
  return base64(new Uint8Array(await crypto.subtle.sign('HMAC', await ticketKey(secret), new TextEncoder().encode(`pinoka-turnstile-ticket-v1:${payload}`))));
}
async function signTicket(ticket: Ticket, secret: string) {
  const payload = base64(new TextEncoder().encode(JSON.stringify(ticket)));
  return `${payload}.${await ticketSignature(payload, secret)}`;
}
async function readTicket(value: string, secret: string): Promise<Ticket | undefined> {
  try {
    const [payload, signature, extra] = value.split('.');
    if (!payload || !signature || extra || value.length > 3500) return;
    if (!/^[A-Za-z0-9_-]{43}$/.test(signature)) return;
    const signatureBytes = Uint8Array.from(atob(signature.replaceAll('-', '+').replaceAll('_', '/') + '='), c => c.charCodeAt(0));
    if (base64(signatureBytes) !== signature || !await crypto.subtle.verify('HMAC', await ticketKey(secret), signatureBytes, new TextEncoder().encode(`pinoka-turnstile-ticket-v1:${payload}`))) return;
    const ticket = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload.replaceAll('-', '+').replaceAll('_', '/')), c => c.charCodeAt(0)))) as Ticket;
    if (!/^[a-f0-9]{64}$/.test(ticket.id) || typeof ticket.target !== 'string' || typeof ticket.hostname !== 'string' || typeof ticket.expires !== 'number' || ticket.expires <= Date.now() || typeof ticket.verified !== 'boolean') return;
    return ticket;
  } catch { return; }
}

function bypass(path: string) {
  if (['/api/', '/_server-islands/', '/_actions/'].some(prefix => path.startsWith(prefix))) return true;
  if (path === '/_image') return true;
  if (['/_astro/', '/frames/', '/images/', '/assets/', '/fonts/'].some(prefix => path.startsWith(prefix))) {
    return /\.(?:css|js|mjs|map|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf|mp4|webm|avif|glb)$/i.test(path);
  }
  return ['/robots.txt', '/sitemap.xml', '/llms.txt', '/favicon.svg', '/icon-512x512.svg', '/icon-desktop-512.svg', '/apple-touch-icon.svg', '/og-image.png', '/site.webmanifest'].includes(path);
}
function usesManagedChallenge(url: URL, configuredHost?: string) {
  if (typeof configuredHost !== 'string') return false;
  const hostname = configuredHost.trim().toLowerCase();
  return url.protocol === 'https:' && hostname === url.hostname &&
    hostname.length <= 253 && DNS_HOSTNAME.test(hostname) &&
    hostname !== 'workers.dev' && !hostname.endsWith('.workers.dev');
}
function cookies(request: Request): { id: string; value: string }[] {
  return (request.headers.get('Cookie') || '').split(';').map(part => part.trim())
    .flatMap(part => {
      const match = /^__Host-pinoka-challenge-([a-f0-9]{64})=([A-Za-z0-9_.-]+)$/.exec(part);
      return match ? [{ id: match[1], value: match[2] }] : [];
    }).slice(0, MAX_CHALLENGES);
}
function call(env: Env, id: string, data: Record<string, string | number>) {
  const namespace = env.TURNSTILE_CHALLENGES!;
  return namespace.get(namespace.idFromName(id)).fetch(new Request('https://challenge.internal/', { method: 'POST', body: JSON.stringify(data) }));
}
function shell(sitekey: string, id: string, nonce: string) {
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Verifikasi keamanan | Pinoka</title><style nonce="${nonce}">*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#f8f7f3;color:#18221d;font-family:system-ui,sans-serif;display:grid;place-items:center;padding:24px}.wrap{width:min(100%,460px)}.brand{font-size:22px;font-weight:800;letter-spacing:-.06em;margin-bottom:52px}.mark{color:#247d4e}.card{background:#fff;border:1px solid #e4e9e3;border-radius:24px;padding:36px;box-shadow:0 18px 60px #152b1d0a}.icon{display:grid;place-items:center;width:48px;height:48px;background:#e9f5ec;color:#247d4e;border-radius:15px;font-size:24px}h1{font-size:28px;line-height:1.15;letter-spacing:-.04em;margin:24px 0 12px}p{color:#66736b;line-height:1.6;margin:0 0 24px}.widget{min-height:65px}#status{font-size:14px;margin:16px 0 0}a{color:#176b41}footer{color:#89958d;font-size:12px;text-align:center;margin-top:26px}@media(max-width:480px){.card{padding:26px}.brand{margin-bottom:36px}}</style><script nonce="${nonce}">function verified(token){document.getElementById('status').textContent='Memeriksa verifikasi…';fetch('${VERIFY_PATH}',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,id:'${id}'})}).then(r=>{if(!r.ok)throw 0;const parts=location.href.split('#');location.replace(parts[0]+(parts[0].includes('?')?'&':'?')+'__pinoka_continue=${id}'+(parts.length>1?'#'+parts.slice(1).join('#'):''))}).catch(failed)}function failed(){document.getElementById('status').textContent='Verifikasi belum berhasil. Muat ulang halaman untuk mencoba lagi.'}</script><script nonce="${nonce}" src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script></head><body><main class="wrap"><div class="brand"><span class="mark">●</span> pinoka</div><section class="card" aria-labelledby="title"><div class="icon" aria-hidden="true">✳</div><h1 id="title">Sebentar, ya.</h1><p>Kami sedang memastikan kunjungan Anda aman sebelum melanjutkan ke Pinoka.</p><div class="widget"><div class="cf-turnstile" data-sitekey="${sitekey}" data-size="compact" data-action="${ACTION}" data-cdata="${id}" data-callback="verified" data-error-callback="failed" data-expired-callback="failed"></div></div><p id="status" role="status" aria-live="polite">Selesaikan verifikasi untuk melanjutkan.</p><noscript>Aktifkan JavaScript, lalu muat ulang halaman untuk melanjutkan.</noscript></section><footer>Perlindungan keamanan oleh Cloudflare</footer></main></body></html>`;
}

export async function gate(request: Request, env: Env, next: (request: Request) => Promise<Response>): Promise<Response> {
  const url = new URL(request.url);
  if (usesManagedChallenge(url, env.TURNSTILE_MANAGED_CHALLENGE_HOST)) return next(request);
  const path = url.pathname;
  if (path === CLEANUP_PATH && request.method === 'GET') return new Response("{const href=location.href;const i=href.indexOf('#');const base=i<0?href:href.slice(0,i);history.replaceState(history.state,'',base.replace(/[?&]__pinoka_continue=[a-f0-9]{64}$/,'')+(i<0?'':href.slice(i)))}", { headers: { ...noStore, 'Content-Type': 'application/javascript; charset=utf-8' } });
  if (path !== VERIFY_PATH && bypass(path)) return next(request);
  const headers = new Headers(noStore);
  if (!env.TURNSTILE_CHALLENGES || !env.TURNSTILE_SECRET_KEY || !env.TURNSTILE_SITE_KEY || !/^[A-Za-z0-9_-]{1,100}$/.test(env.TURNSTILE_SITE_KEY)) return new Response('Verifikasi keamanan sementara tidak tersedia. Silakan coba lagi nanti.', { status: 503, headers });
  const entries = cookies(request);
  try {
    if (path === VERIFY_PATH) {
      if (request.method !== 'POST' || request.headers.get('Origin') !== url.origin || !request.headers.get('Content-Type')?.startsWith('application/json')) return new Response(null, { status: 403, headers });
      if (Number(request.headers.get('Content-Length') || 0) > 4096) return new Response(null, { status: 413, headers });
      const reader = request.body?.getReader(); let bytes = 0; const chunks: Uint8Array[] = [];
      if (!reader) return new Response(null, { status: 400, headers });
      let part = await reader.read();
      while (!part.done) { bytes += part.value.length; if (bytes > 4096) { await reader.cancel(); return new Response(null, { status: 413, headers }); } chunks.push(part.value); part = await reader.read(); }
      const body = JSON.parse(new TextDecoder().decode(Uint8Array.from(chunks.flatMap(chunk => Array.from(chunk))))) as { token?: unknown; id?: unknown };
      if (typeof body.token !== 'string' || !body.token || body.token.length > 2048 || typeof body.id !== 'string') return new Response(null, { status: 400, headers });
      const entry = entries.find(item => item.id === body.id);
      const ticket = entry && await readTicket(entry.value, env.TURNSTILE_SECRET_KEY);
      if (!ticket || ticket.id !== body.id || ticket.verified || ticket.hostname !== url.hostname) return new Response(null, { status: 403, headers });
      const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: body.token }), signal: AbortSignal.timeout(5000),
      });
      const data = await result.json() as { success?: boolean; hostname?: string; action?: string; cdata?: string };
      if (!result.ok || data.success !== true || data.hostname !== ticket.hostname || data.action !== ACTION || data.cdata !== ticket.id || ticket.expires <= Date.now()) return new Response(null, { status: 403, headers });
      const created = await call(env, ticket.id, { operation: 'create', hostname: ticket.hostname, target: ticket.target, expires: ticket.expires });
      if (!created.ok) return new Response(null, { status: 403, headers });
      const verified = await signTicket({ ...ticket, verified: true }, env.TURNSTILE_SECRET_KEY);
      headers.set('Set-Cookie', `${COOKIE}${ticket.id}=${verified}; Path=/; Max-Age=${Math.max(0, Math.floor((ticket.expires - Date.now()) / 1000))}; Secure; HttpOnly; SameSite=Strict`);
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== 'GET') return new Response('Metode tidak didukung.', { status: 405, headers });
    const selector = SELECTOR.exec(request.url);
    const originalUrl = selector ? request.url.slice(0, selector.index) : request.url;
    const original = new URL(originalUrl);
    for (const entry of selector ? entries.filter(item => item.id === selector[1]) : []) {
      const ticket = await readTicket(entry.value, env.TURNSTILE_SECRET_KEY);
      if (!ticket || ticket.id !== entry.id || !ticket.verified || ticket.hostname !== url.hostname || ticket.target !== original.pathname + original.search) continue;
      const id = ticket.id;
      if (!(await call(env, id, { operation: 'consume', hostname: url.hostname, target: original.pathname + original.search })).ok) continue;
      const forwardedHeaders = new Headers(request.headers);
      forwardedHeaders.delete('If-None-Match');
      forwardedHeaders.delete('If-Modified-Since');
      forwardedHeaders.set('Cache-Control', 'no-store');
      const response = await next(new Request(originalUrl, { method: 'GET', headers: forwardedHeaders, redirect: request.redirect }));
      const resultHeaders = new Headers(response.headers);
      for (const [key, value] of Object.entries(noStore)) resultHeaders.set(key, value);
      resultHeaders.set('CDN-Cache-Control', 'no-store');
      resultHeaders.set('Cloudflare-CDN-Cache-Control', 'no-store');
      resultHeaders.append('Set-Cookie', `${COOKIE}${id}=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Strict`);
      const result = new Response(response.body, { status: response.status, statusText: response.statusText, headers: resultHeaders });
      if (!response.headers.get('content-type')?.toLowerCase().includes('text/html')) return result;
      return new HTMLRewriter().on('head', { element(element) { element.append(`<script src="${CLEANUP_PATH}"></script>`, { html: true }); } }).transform(result);
    }
    if (entries.length >= MAX_CHALLENGES) return new Response('Terlalu banyak verifikasi terbuka. Tunggu beberapa menit lalu coba lagi.', { status: 429, headers });
    const newId = Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, '0')).join('');
    const nonce = crypto.randomUUID().replaceAll('-', '');
    const target = url.pathname + url.search;
    if (new TextEncoder().encode(target).length > 1500) return new Response('Alamat terlalu panjang.', { status: 414, headers });
    const ticket = await signTicket({ id: newId, hostname: url.hostname, target, expires: Date.now() + TTL * 1000, verified: false }, env.TURNSTILE_SECRET_KEY);
    headers.set('Content-Type', 'text/html; charset=utf-8');
    headers.set('Content-Security-Policy', `default-src 'none'; script-src 'nonce-${nonce}' https://challenges.cloudflare.com; style-src 'nonce-${nonce}'; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`);
    headers.set('Set-Cookie', `${COOKIE}${newId}=${ticket}; Path=/; Max-Age=${TTL}; Secure; HttpOnly; SameSite=Strict`);
    return new Response(shell(env.TURNSTILE_SITE_KEY, newId, nonce), { headers });
  } catch { return new Response('Verifikasi belum tersedia. Muat ulang halaman untuk mencoba lagi.', { status: 503, headers }); }
}
