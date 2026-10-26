/**
 * Security Prompt Sanitizer
 * Membersihkan input teks pedagang (nama usaha, label produk) dari potensi prompt injection,
 * tag HTML liar, dan karakter kontrol berbahaya sebelum diproses oleh generator visual AI.
 */

export const INJECTION_PATTERNS: readonly RegExp[] = [
  /ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions?/gi,
  /(?:system|assistant|developer|user)\s*:/gi,
  /\[\/?(?:system|inst|prompt|instruction)\]/gi,
  /<\|(?:im_start|im_end|endoftext)\|>/gi,
  /eval\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/gi,
  /javascript:[^;\s]*/gi,
  /data:text\/html[^;\s]*/gi,
];

export const DANGEROUS_PUNCTUATION_REGEX = /[<>{}[\]$"\\`;^~|]/g;

/**
 * Membersihkan karakter injeksi, tag HTML, dan karakter kontrol mencurigakan pada input teks pedagang.
 *
 * @param text - Teks mentah input pedagang (nama usaha, deskripsi, label produk)
 * @returns Teks bersih yang aman untuk prompt AI
 */
export function sanitizePromptInput(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let cleaned = text;

  // 1. Bersihkan tag HTML (misal: <script>...</script>, <img ...>, dsb.)
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // 2. Bersihkan karakter kontrol ASCII tidak tercetak (< 32 dan 127)
  cleaned = Array.from(cleaned)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join('');

  // 3. Bersihkan pola injeksi prompt / jailbreak kata kunci sistem
  for (const pattern of INJECTION_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }

  // 4. Bersihkan karakter pembatas / kurung berbahaya
  cleaned = cleaned.replace(DANGEROUS_PUNCTUATION_REGEX, '');

  // 5. Normalisasi spasi berulang dan rapikan spasi ujung
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Mendeteksi apakah suatu input mengandung indikasi percobaan injeksi prompt
 */
export function isPotentialPromptInjection(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  return INJECTION_PATTERNS.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}
