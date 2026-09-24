/**
 * src/lib/domain.ts
 * Utilitas deteksi dinamis domain utama (main domain) dan ekstraksi subdomain.
 * Menghilangkan dependensi hardcoded domain statis di seluruh platform.
 */

const RESERVED_SUBDOMAINS = new Set([
  'www',
  'api',
  'admin',
  'superadmin',
  'dashboard',
  'mail',
  'dev',
  'staging',
  'test',
]);

/**
 * Ekstraksi subdomain tenant dari hostname / host request.
 * Mendukung:
 * - Local dev: kopi-osing.localhost:4321 -> kopi-osing
 * - Cloudflare Worker: kopi-osing.umkm-web-builder.iqdevmp.workers.dev -> kopi-osing
 * - Custom domain: kopi-osing.pinoka.id -> kopi-osing
 */
export function extractSubdomain(rawHost: string | null | undefined): string | null {
  if (!rawHost) return null;

  // Hapus port jika ada
  const host = rawHost.split(':')[0].trim().toLowerCase();

  // Abaikan IP murni atau host kosong
  if (!host || /^(\d{1,3}\.){3}\d{1,3}$/.test(host) || host === 'localhost') {
    return null;
  }

  // Pola 1: *.localhost
  if (host.endsWith('.localhost')) {
    const parts = host.split('.');
    const sub = parts[0];
    return RESERVED_SUBDOMAINS.has(sub) ? null : sub;
  }

  // Pola 2: *.workers.dev
  // Standar Cloudflare workers: <worker>.<account>.workers.dev (4 segmen)
  // Subdomain tenant: <subdomain>.<worker>.<account>.workers.dev (>4 segmen)
  if (host.endsWith('.workers.dev')) {
    const parts = host.split('.');
    if (parts.length > 4) {
      const sub = parts[0];
      return RESERVED_SUBDOMAINS.has(sub) ? null : sub;
    }
    return null;
  }

  // Pola 3: Domain kustom (misal: sub.domain.com atau sub.domain.co.id)
  const parts = host.split('.');
  // Tangani TLD 2-tingkat umum seperti .co.id, .sch.id, .web.id, .org.uk
  const isTwoLevelTld = parts.length >= 3 && ['co', 'web', 'or', 'ac', 'sch', 'go'].includes(parts[parts.length - 2]);
  const minPartsForSubdomain = isTwoLevelTld ? 4 : 3;

  if (parts.length >= minPartsForSubdomain) {
    const sub = parts[0];
    return RESERVED_SUBDOMAINS.has(sub) ? null : sub;
  }

  return null;
}

/**
 * Dapatkan main domain saat ini secara dinamis (tanpa subdomain tenant).
 * Bisa dipanggil dari server (dengan passing host) maupun di browser (otomatis window.location).
 */
export function getMainDomain(rawHost?: string | null): string {
  let host = rawHost;
  if (!host && typeof window !== 'undefined') {
    host = window.location.host;
  }

  if (!host) {
    return 'localhost:4321';
  }

  const port = host.includes(':') ? `:${host.split(':')[1]}` : '';
  const hostname = host.split(':')[0].trim().toLowerCase();

  const sub = extractSubdomain(hostname);
  if (sub) {
    // Potong prefix subdomain
    const withoutSub = hostname.slice(sub.length + 1);
    return `${withoutSub}${port}`;
  }

  // Jika prefix www, hilangkan
  if (hostname.startsWith('www.')) {
    return `${hostname.slice(4)}${port}`;
  }

  return host;
}

/**
 * Bangun URL toko langsung berbasis sub-domain.main-domain
 * Contoh:
 * - http://kopi-osing.localhost:4321
 * - https://kopi-osing.umkm-web-builder.iqdevmp.workers.dev
 */
export function getStoreDirectUrl(subdomain: string, rawHost?: string | null, rawProtocol?: string): string {
  const mainDomain = getMainDomain(rawHost);

  let protocol = rawProtocol;
  if (!protocol && typeof window !== 'undefined') {
    protocol = window.location.protocol;
  }
  if (!protocol) {
    protocol = mainDomain.includes('localhost') ? 'http:' : 'https:';
  }
  if (!protocol.endsWith(':')) {
    protocol = `${protocol}:`;
  }

  return `${protocol}//${subdomain}.${mainDomain}`;
}
