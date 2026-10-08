/**
 * Helper sentral untuk variasi tata letak header_announcement
 * Menjaga konsistensi antara Canvas, Tab Tata Letak, Tab Konten, dan Panel Lapisan.
 */

export const HEADER_ROW_SUPPORTED_PRESETS = [
  'default_split',
  'centered_stacked',
  'split_nav_centered_logo',
  'command_search_bar',
  'mega_menu_dropdown',
  'top_contact_bar',
  'delivery_order_cta',
  'promo_countdown_banner',
] as const;

export type HeaderRowSupportedPreset = (typeof HEADER_ROW_SUPPORTED_PRESETS)[number];

export type HeaderTopBarType = 'promo' | 'contact' | 'delivery' | 'countdown' | 'none';

/**
 * Cek apakah preset memiliki lebih dari 1 baris (misal Bar Atas + Navbar).
 * Jika false, preset hanya memiliki 1 baris (single-row) sehingga kontrol baris tidak ditampilkan.
 */
export function headerHasRowOrder(preset: string): boolean {
  return HEADER_ROW_SUPPORTED_PRESETS.includes(preset as HeaderRowSupportedPreset);
}

/**
 * Menghasilkan urutan slot baris default untuk preset header.
 */
export function getDefaultHeaderRowOrder(preset: string): string[] {
  if (!headerHasRowOrder(preset)) return [];
  return ['announcement_bar', 'navbar'];
}

/**
 * Menghasilkan urutan slot bilah navigasi default untuk preset header.
 */
export function getDefaultHeaderNavbarOrder(preset: string): string[] {
  switch (preset) {
    case 'centered_stacked':
      return ['logo', 'nav_links'];
    case 'command_search_bar':
      return ['logo', 'search_bar', 'cta'];
    case 'store_badge_highlight':
      return ['logo', 'store_badges', 'nav_links', 'cta'];
    default:
      return ['logo', 'nav_links', 'cta'];
  }
}

/**
 * Cek apakah preset header mendukung tombol WhatsApp (CTA) pada bilah utama.
 */
export function headerSupportsCta(preset: string): boolean {
  return preset !== 'centered_stacked';
}

/**
 * Cek apakah preset header memiliki menu navigasi teks biasa (nav_links).
 */
export function headerSupportsNavLinks(preset: string): boolean {
  return preset !== 'command_search_bar';
}

/**
 * Mendapatkan jenis bilah atas (top bar) untuk preset tertentu.
 */
export function getHeaderTopBarType(preset: string): HeaderTopBarType {
  switch (preset) {
    case 'top_contact_bar':
      return 'contact';
    case 'delivery_order_cta':
      return 'delivery';
    case 'promo_countdown_banner':
      return 'countdown';
    case 'compact_inline':
    case 'floating_pill_island':
    case 'transparent_glass_header':
    case 'store_badge_highlight':
      return 'none';
    default:
      return 'promo';
  }
}

/**
 * Label Bahasa Indonesia baku untuk slot baris header.
 */
export function getHeaderRowSlotLabel(slot: string, preset: string): string {
  if (slot === 'navbar') return 'Bilah Navigasi Utama';
  if (slot === 'announcement_bar' || slot === 'announcement') {
    const topBarType = getHeaderTopBarType(preset);
    switch (topBarType) {
      case 'contact':
        return 'Bar Kontak & Jam Buka';
      case 'delivery':
        return 'Bar Layanan Pesan Antar';
      case 'countdown':
        return 'Bar Hitung Mundur Promo';
      default:
        return 'Bar Pengumuman Promo';
    }
  }
  return slot;
}

/**
 * Label Bahasa Indonesia baku untuk slot elemen bilah navigasi header.
 */
export function getHeaderNavbarSlotLabel(slot: string): string {
  switch (slot) {
    case 'logo':
      return 'Logo & Brand Toko';
    case 'nav_links':
      return 'Menu Navigasi Toko';
    case 'cta':
      return 'Tombol Pesan WhatsApp (CTA)';
    case 'search_bar':
      return 'Bilah Pencarian Produk';
    case 'store_badges':
      return 'Lencana Legalitas (BPOM / Halal)';
    default:
      return slot;
  }
}

/**
 * Daftar seluruh elemen yang didukung oleh preset header tertentu.
 */
export function getHeaderSupportedSlots(preset: string): Array<{ id: string; name: string }> {
  const slots: Array<{ id: string; name: string }> = [];
  if (headerHasRowOrder(preset)) {
    const topBarType = getHeaderTopBarType(preset);
    if (topBarType === 'contact') slots.push({ id: 'contact_bar', name: 'Bar Kontak & Jam Buka' });
    else if (topBarType === 'delivery') slots.push({ id: 'delivery_bar', name: 'Bar Layanan Pesan Antar' });
    else if (topBarType === 'countdown') slots.push({ id: 'countdown_bar', name: 'Bar Hitung Mundur Promo' });
    else slots.push({ id: 'announcement', name: 'Bar Pengumuman Promo' });
  }
  const defaultNav = getDefaultHeaderNavbarOrder(preset);
  for (const s of defaultNav) {
    slots.push({ id: s, name: getHeaderNavbarSlotLabel(s) });
  }
  return slots;
}

/**
 * Menghasilkan urutan slot navbar efektif yang sinkron dengan preset header aktif.
 */
export function getEffectiveHeaderNavbarOrder(preset: string, rawNavbarOrder?: unknown): string[] {
  const defaultOrder = getDefaultHeaderNavbarOrder(preset);
  if (!Array.isArray(rawNavbarOrder) || rawNavbarOrder.length === 0) {
    return defaultOrder;
  }
  const filtered = (rawNavbarOrder as string[]).filter((s) => defaultOrder.includes(s));
  for (const item of defaultOrder) {
    if (!filtered.includes(item)) {
      filtered.push(item);
    }
  }
  return filtered.length > 0 ? filtered : defaultOrder;
}
