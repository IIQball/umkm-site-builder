/**
 * Helper navigasi sentral untuk Header
 * Memetakan tautan menu ke ID seksi backend dan melakukan scroll halus.
 */

const NAV_TARGET_MAP: Record<string, string> = {
  // Beranda
  beranda: 'beranda',
  home: 'beranda',
  hero: 'beranda',

  // Produk & Katalog
  produk: 'produk',
  katalog: 'produk',
  menu: 'produk',
  products: 'produk',
  catalog: 'produk',

  // Tentang & Fitur
  tentang: 'tentang',
  'tentang-kami': 'tentang',
  about: 'tentang',
  fitur: 'tentang',
  keunggulan: 'tentang',
  features: 'tentang',

  // Ulasan & Testimoni
  ulasan: 'ulasan',
  testimoni: 'ulasan',
  reviews: 'ulasan',
  testimonials: 'ulasan',

  // FAQ
  faq: 'faq',
  'tanya-jawab': 'faq',
  bantuan: 'faq',
  pertanyaan: 'faq',

  // Lokasi & Peta
  lokasi: 'lokasi',
  alamat: 'lokasi',
  peta: 'lokasi',
  maps: 'lokasi',
  location: 'lokasi',

  // Kontak
  kontak: 'kontak',
  'hubungi-kami': 'kontak',
  contact: 'kontak',
  footer: 'kontak',
};

export function resolveSectionAnchor(linkName: string): { anchor: string; sectionType?: string } {
  if (!linkName) return { anchor: 'beranda', sectionType: 'hero' };
  const clean = linkName.trim().replace(/^[#/]+/, '').toLowerCase().replace(/\s+/g, '-');
  const target = NAV_TARGET_MAP[clean] || clean;

  const ANCHOR_TO_SECTION_TYPE: Record<string, string> = {
    beranda: 'hero',
    produk: 'product_catalog',
    tentang: 'features',
    ulasan: 'testimonials',
    faq: 'faq',
    lokasi: 'google_maps',
    kontak: 'footer',
  };

  return {
    anchor: target,
    sectionType: ANCHOR_TO_SECTION_TYPE[target],
  };
}

export function navigateToSection(
  e: MouseEvent | KeyboardEvent,
  linkName: string,
  onAfterNavigate?: () => void
): void {
  if (typeof document === 'undefined') return;

  const { anchor, sectionType } = resolveSectionAnchor(linkName);

  // 1. Coba cari elemen dengan id anchor utama atau sectionType
  let target =
    document.getElementById(anchor) ||
    (sectionType ? document.querySelector(`[data-section-type="${sectionType}"]`) : null) ||
    (sectionType ? document.getElementById(sectionType) : null) ||
    document.getElementById(`section-${anchor}`) ||
    document.querySelector(`[data-section-id="${anchor}"]`) ||
    document.querySelector(`[data-section-type="${anchor}"]`);

  // 2. Jika tidak ditemukan, fallback ke alias seksi
  if (!target) {
    const rawClean = linkName.trim().replace(/^[#/]+/, '').toLowerCase();
    const aliases = [anchor, rawClean, `section-${rawClean}`];
    for (const a of aliases) {
      const el = document.getElementById(a);
      if (el) {
        target = el;
        break;
      }
    }
  }

  // 3. Scroll halus ke elemen jika ada
  if (target) {
    e.preventDefault();
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  if (onAfterNavigate) {
    onAfterNavigate();
  }
}

export const NAV_TYPOGRAPHY_TOKENS = [
  { label: 'Caption / Kompak (12px)', value: 'caption', fontSize: 'var(--theme-text-caption, var(--text-caption-size, 12px))' },
  { label: 'Body / Standar (14px)', value: 'body', fontSize: 'var(--theme-text-body, var(--text-body-size, 14px))' },
  { label: 'Medium / Sedang (16px)', value: 'medium', fontSize: 'var(--theme-text-body-lg, 16px)' },
  { label: 'Large / Menonjol (18px)', value: 'large', fontSize: 'var(--theme-text-h3, var(--text-h3-size, 18px))' },
];

export const NAV_TYPOGRAPHY_MAP: Record<string, string> = {
  caption: 'var(--theme-text-caption, var(--text-caption-size, 12px))',
  body: 'var(--theme-text-body, var(--text-body-size, 14px))',
  medium: 'var(--theme-text-body-lg, 16px)',
  large: 'var(--theme-text-h3, var(--text-h3-size, 18px))',
};

export function resolveNavFontSize(token: string | undefined): string {
  if (!token) return NAV_TYPOGRAPHY_MAP.body;
  return NAV_TYPOGRAPHY_MAP[token] || token;
}

export const NAV_TRANSFORM_OPTIONS = [
  { label: 'Normal', value: 'none' },
  { label: 'KAPITAL', value: 'uppercase' },
  { label: 'Huruf Awal', value: 'capitalize' },
  { label: 'kecil', value: 'lowercase' },
];

export const NAV_COLOR_TOKENS = [
  { label: 'Teks Redup (Muted)', value: 'var(--theme-text-muted, var(--color-text-muted, #64748b))', preview: '#64748b' },
  { label: 'Teks Utama (Primary Text)', value: 'var(--theme-text-primary, var(--color-text-main, #0f172a))', preview: '#0f172a' },
  { label: 'Warna Brand (Primary)', value: 'var(--theme-primary, var(--color-primary))', preview: '#36C6FD' },
  { label: 'Warna Aksen (Secondary)', value: 'var(--theme-secondary, var(--color-secondary, #3b82f6))', preview: '#3b82f6' },
  { label: 'Putih Bersih (White)', value: '#ffffff', preview: '#ffffff' },
  { label: 'Hitam Gelap (#0f172a)', value: '#0f172a', preview: '#0f172a' },
];

export const NAV_HOVER_COLOR_TOKENS = [
  { label: 'Warna Brand (Primary)', value: 'var(--theme-primary, var(--color-primary))', preview: '#36C6FD' },
  { label: 'Warna Aksen (Secondary)', value: 'var(--theme-secondary, var(--color-secondary, #3b82f6))', preview: '#3b82f6' },
  { label: 'Teks Utama (Primary Text)', value: 'var(--theme-text-primary, var(--color-text-main, #0f172a))', preview: '#0f172a' },
  { label: 'Teks Redup (Muted)', value: 'var(--theme-text-muted, var(--color-text-muted, #64748b))', preview: '#64748b' },
  { label: 'Putih Bersih (White)', value: '#ffffff', preview: '#ffffff' },
  { label: 'Emas / Amber (#f59e0b)', value: '#f59e0b', preview: '#f59e0b' },
];

export function resolveColorTokenMatch(
  currentValue: string | undefined,
  options: Array<{ value: string }>,
  defaultFallback: string
): string {
  if (!currentValue) return defaultFallback;
  const exact = options.find((opt) => opt.value === currentValue);
  if (exact) return exact.value;
  if (currentValue.includes('text-muted') || currentValue.includes('#64748b') || currentValue.includes('text-secondary')) {
    const match = options.find((opt) => opt.value.includes('text-muted'));
    if (match) return match.value;
  }
  if (currentValue.includes('text-primary') || currentValue.includes('text-main') || currentValue.includes('#0f172a')) {
    const match = options.find((opt) => opt.value.includes('text-primary') || opt.value === '#0f172a');
    if (match) return match.value;
  }
  if (currentValue.includes('primary') || currentValue.includes('#36C6FD') || currentValue.includes('#00A3EF')) {
    const match = options.find((opt) => opt.value.includes('primary') && !opt.value.includes('text-primary'));
    if (match) return match.value;
  }
  if (currentValue.includes('secondary') || currentValue.includes('#3b82f6') || currentValue.includes('#FC018B')) {
    const match = options.find((opt) => opt.value.includes('secondary'));
    if (match) return match.value;
  }
  if (currentValue.toLowerCase() === '#ffffff' || currentValue.toLowerCase() === 'white') {
    const match = options.find((opt) => opt.value === '#ffffff');
    if (match) return match.value;
  }
  return currentValue;
}
