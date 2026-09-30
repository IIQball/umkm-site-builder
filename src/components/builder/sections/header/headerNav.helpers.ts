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
