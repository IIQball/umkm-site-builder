/**
 * Helper pencarian aman untuk Header
 * Memvalidasi input dari ancaman SQL Injection, XSS, dan serangan script,
 * serta menyediakan filter lazy-search untuk katalog produk.
 */

// Regex deteksi pola berbahaya SQL Injection & XSS
const DANGEROUS_PATTERNS = [
  /--/i,
  /;\s*$/i,
  /\/\*|\*\//i,
  /@@/i,
  /\b(or|and)\b\s+['"]?[\w\d]+['"]?\s*=\s*['"]?[\w\d]+/i,
  /'\s*(or|and)\s*'/i,
  /\b(select|union|insert|update|delete|drop|truncate|alter|exec|execute|cast|declare)\b/i,
  /<script\b[^>]*>/i,
  /<\/script>/i,
  /javascript:/i,
  /onload\s*=/i,
  /onerror\s*=/i,
];

export interface SanitizeResult {
  isValid: boolean;
  cleanQuery: string;
  hasThreat: boolean;
}

export function sanitizeSearchInput(rawQuery: string): SanitizeResult {
  if (!rawQuery || typeof rawQuery !== 'string') {
    return { isValid: true, cleanQuery: '', hasThreat: false };
  }

  // Cek apakah ada pola berbahaya
  const hasThreat = DANGEROUS_PATTERNS.some((pattern) => pattern.test(rawQuery));

  // Bersihkan karakter kontrol berbahaya dan tag HTML
  const clean = rawQuery
    .replace(/<[^>]*>/g, '') // Hapus tag HTML
    .replace(/['"`;\\<>]/g, '') // Hapus karakter SQL/XSS rentan
    .split('')
    .filter((c) => {
      const code = c.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join('')
    .trim()
    .slice(0, 60); // Batasi panjang maksimal 60 karakter

  return {
    isValid: !hasThreat,
    cleanQuery: clean,
    hasThreat,
  };
}

export interface SearchProduct {
  id?: string;
  name: string;
  price?: number;
  basePrice?: number;
  category?: string;
  imageUrl?: string;
  image?: string;
}

export function filterCatalogProducts(products: SearchProduct[], query: string): SearchProduct[] {
  const { cleanQuery } = sanitizeSearchInput(query);
  if (!cleanQuery || !Array.isArray(products)) return [];

  const lower = cleanQuery.toLowerCase();
  return products
    .filter((p) => {
      const name = (p.name || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      return name.includes(lower) || cat.includes(lower);
    })
    .slice(0, 6);
}
