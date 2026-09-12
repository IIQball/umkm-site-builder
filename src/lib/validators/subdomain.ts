import { z } from 'zod';

export const SUBDOMAIN_BLACKLIST = new Set([
  'admin', 'administrator', 'api', 'app', 'auth',
  'billing', 'blog', 'cache', 'cdn', 'dashboard',
  'db', 'dev', 'developer', 'docs', 'help',
  'host', 'login', 'mail', 'manage', 'manager',
  'metrics', 'ns1', 'ns2', 'panel', 'portal',
  'prod', 'register', 'root', 'secure', 'server',
  'setup', 'shop', 'smtp', 'stage', 'staging',
  'static', 'store', 'support', 'sys', 'system',
  'test', 'update', 'web', 'www'
]);

const SUBDOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

export const subdomainField = z
  .string()
  .min(3, 'Subdomain minimal 3 karakter')
  .max(63, 'Subdomain maksimal 63 karakter')
  .regex(SUBDOMAIN_PATTERN, 'Subdomain hanya boleh huruf kecil, angka, dan tanda hubung')
  .refine((val) => !val.startsWith('-') && !val.endsWith('-'), {
    message: 'Subdomain tidak boleh diawali atau diakhiri tanda hubung',
  })
  .refine((val) => !SUBDOMAIN_BLACKLIST.has(val.toLowerCase()), {
    message: 'Subdomain tidak tersedia (kata terlarang)',
  });

export function validateSubdomainLocally(input: string): string | null {
  if (!input) return null;
  if (input.length < 3) return 'Subdomain minimal 3 karakter';
  if (input.length > 63) return 'Subdomain maksimal 63 karakter';
  if (!SUBDOMAIN_PATTERN.test(input)) {
    return 'Subdomain hanya boleh huruf kecil, angka, dan tanda hubung';
  }
  if (input.startsWith('-') || input.endsWith('-')) {
    return 'Subdomain tidak boleh diawali atau diakhiri tanda hubung';
  }
  if (SUBDOMAIN_BLACKLIST.has(input.toLowerCase())) {
    return 'Subdomain tidak tersedia (kata terlarang)';
  }
  return null;
}
