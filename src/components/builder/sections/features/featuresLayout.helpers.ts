/**
 * Helper SSOT tata letak section features.
 * Menjaga sinkronisasi urutan slot antara Canvas, Tab Tata Letak, dan Panel Lapisan.
 */

export const FEATURES_SPLIT_PRESETS = [
  'horizontal_list',
  'interactive_tabs',
  'vertical_accordion_showcase',
  'sticky_scroll_highlight',
  'before_after_comparison',
  'alternating_zigzag_rows',
] as const;

export type FeaturesSplitPreset = (typeof FEATURES_SPLIT_PRESETS)[number];

export const FEATURES_SPLIT_SLOTS: Record<string, string> = {
  horizontal_list: 'feature_rows',
  interactive_tabs: 'image',
  vertical_accordion_showcase: 'image',
  sticky_scroll_highlight: 'scroll_cards',
  before_after_comparison: 'before_card',
  alternating_zigzag_rows: 'zigzag_items',
};

export function isFeaturesSplitLayout(preset: string): boolean {
  return FEATURES_SPLIT_PRESETS.includes(preset as FeaturesSplitPreset);
}

export function getFeaturesSplitSlot(preset: string): string | null {
  return FEATURES_SPLIT_SLOTS[preset] || null;
}

/**
 * Cek apakah elemen visual / split berada di sisi Kiri.
 */
export function isFeaturesVisualOnLeft(
  preset: string,
  elementOrder: string[],
  defaultLeft = false
): boolean {
  if (preset === 'before_after_comparison') {
    const afterIdx = elementOrder.indexOf('after_card');
    const beforeIdx = elementOrder.indexOf('before_card');
    if (afterIdx !== -1 && beforeIdx !== -1) return afterIdx < beforeIdx;
    return defaultLeft;
  }

  const splitSlot = getFeaturesSplitSlot(preset);
  if (!splitSlot) return defaultLeft;

  // Cek slot primer atau legacy features_grid
  const targetSlot = elementOrder.includes(splitSlot)
    ? splitSlot
    : elementOrder.includes('features_grid')
      ? 'features_grid'
      : null;

  if (!targetSlot) return defaultLeft;

  const splitIdx = elementOrder.indexOf(targetSlot);
  if (splitIdx === 0) return true;
  if (splitIdx === elementOrder.length - 1) return false;

  const titleIdx = elementOrder.indexOf('title');
  if (titleIdx !== -1) return splitIdx < titleIdx;

  if (preset === 'interactive_tabs') {
    const cardIdx = elementOrder.indexOf('tab_card');
    if (cardIdx !== -1) return splitIdx < cardIdx;
  }

  return defaultLeft;
}

/**
 * Menentukan arah perpindahan slot elemen features:
 * - 'horizontal': Kolom Kiri - Kanan pada preset split
 * - 'vertical': Elemen tumpukan Atas - Bawah
 * - 'none': Terkunci
 */
export function getFeaturesSlotDirection(
  preset: string,
  slot: string
): 'horizontal' | 'vertical' | 'none' {
  if (preset === 'before_after_comparison' && (slot === 'before_card' || slot === 'after_card')) {
    return 'horizontal';
  }
  if (preset === 'interactive_tabs' && (slot === 'image' || slot === 'tab_card')) {
    return 'horizontal';
  }
  if (isFeaturesSplitLayout(preset)) {
    const splitSlot = getFeaturesSplitSlot(preset);
    if (slot === splitSlot || slot === 'features_grid') return 'horizontal';
  }
  return 'vertical';
}

/**
 * Urutan slot default spesifik untuk tiap preset tata letak features.
 */
export function getDefaultFeaturesSlots(preset: string): string[] {
  switch (preset) {
    case 'grid_3_cards':
      return ['badge', 'title', 'subtitle', 'feature_cards'];
    case 'horizontal_list':
      return ['badge', 'title', 'subtitle', 'feature_rows'];
    case 'banner_inline_bar':
      return ['badge', 'title', 'ribbon_bar'];
    case 'bento_grid_asymmetric':
      return ['badge', 'title', 'subtitle', 'bento_spotlight', 'bento_cards', 'image'];
    case 'alternating_zigzag_rows':
      return ['badge', 'title', 'subtitle', 'zigzag_items'];
    case 'interactive_tabs':
      return ['badge', 'title', 'subtitle', 'tab_nav', 'tab_card', 'image'];
    case 'vertical_accordion_showcase':
      return ['badge', 'title', 'subtitle', 'accordion_list', 'image'];
    case 'sticky_scroll_highlight':
      return ['badge', 'title', 'subtitle', 'cta', 'scroll_cards'];
    case 'dense_icon_matrix':
      return ['badge', 'title', 'subtitle', 'icon_matrix'];
    case 'before_after_comparison':
      return ['badge', 'title', 'subtitle', 'before_card', 'after_card'];
    default:
      return ['badge', 'title', 'subtitle', 'feature_cards'];
  }
}

/**
 * Label Bahasa Indonesia baku untuk tiap slot elemen features.
 */
export function getFeaturesSlotLabel(slot: string, preset?: string): string {
  switch (slot) {
    case 'badge':
      return 'Lencana & Tagline';
    case 'title':
      return preset === 'banner_inline_bar' ? 'Judul Ringkas Ribbon' : 'Judul Utama (Heading)';
    case 'subtitle':
      return 'Subjudul & Deskripsi';
    case 'cta':
      return 'Tombol WhatsApp (CTA)';
    case 'image':
      if (preset === 'bento_grid_asymmetric') return 'Foto Sorotan Bento';
      if (preset === 'interactive_tabs') return 'Foto Ilustrasi Tab';
      if (preset === 'vertical_accordion_showcase') return 'Foto Ilustrasi Akordeon';
      return 'Gambar Ilustrasi Fitur';
    case 'feature_cards':
      return 'Grid Kartu Fitur (3 Kolom)';
    case 'feature_rows':
      return 'Daftar Baris Fitur';
    case 'ribbon_bar':
      return 'Pita Baris Fitur (Ribbon 64px)';
    case 'bento_spotlight':
      return 'Kartu Sorotan Utama (Span 8)';
    case 'bento_cards':
      return 'Kartu Fitur Pendukung (Span 4)';
    case 'zigzag_items':
      return 'Baris Zigzag Bergantian';
    case 'tab_nav':
      return 'Bilah Pilihan Tab (Tab Bar)';
    case 'tab_card':
      return 'Kartu Detail Tab Aktif';
    case 'accordion_list':
      return 'Daftar Akordeon Fitur';
    case 'scroll_cards':
      return 'Daftar Kartu Fitur Mengalir';
    case 'icon_matrix':
      return 'Matriks Ubin Ikon Kompak';
    case 'before_card':
      return 'Kartu Sebelum (Produk Pasaran)';
    case 'after_card':
      return 'Kartu Sesudah (Solusi Dapur Kami)';
    case 'features_grid':
      return 'Daftar Kartu Fitur';
    default:
      return slot;
  }
}

/**
 * Normalisasi legacy features_grid ke slot primer preset.
 */
function normalizeLegacySlot(slot: string, preset: string): string[] {
  if (slot !== 'features_grid') return [slot];
  switch (preset) {
    case 'grid_3_cards': return ['feature_cards'];
    case 'horizontal_list': return ['feature_rows'];
    case 'banner_inline_bar': return ['ribbon_bar'];
    case 'bento_grid_asymmetric': return ['bento_spotlight', 'bento_cards'];
    case 'alternating_zigzag_rows': return ['zigzag_items'];
    case 'interactive_tabs': return ['tab_nav', 'tab_card'];
    case 'vertical_accordion_showcase': return ['accordion_list'];
    case 'sticky_scroll_highlight': return ['scroll_cards'];
    case 'dense_icon_matrix': return ['icon_matrix'];
    case 'before_after_comparison': return ['before_card', 'after_card'];
    default: return ['feature_cards'];
  }
}

/**
 * Menghasilkan urutan slot elemen features efektif yang selalu sinkron dan sesuai preset.
 */
export function getEffectiveFeaturesElementOrder(
  preset: string,
  rawOrder?: unknown,
  featuresPreset?: string
): string[] {
  const defaultSlots = getDefaultFeaturesSlots(preset);
  if (!Array.isArray(rawOrder) || rawOrder.length === 0) {
    return [...defaultSlots];
  }

  // Jika preset sama persis dengan yang tersimpan di props, filter slot yang valid
  if (featuresPreset === preset) {
    const expanded: string[] = [];
    for (const s of rawOrder as string[]) {
      for (const norm of normalizeLegacySlot(s, preset)) {
        if (defaultSlots.includes(norm) && !expanded.includes(norm)) {
          expanded.push(norm);
        }
      }
    }
    return expanded.length > 0 ? expanded : [...defaultSlots];
  }

  // Jika user baru ganti layout, adaptasikan slot yang relevan atau gunakan defaultSlots
  const rawList = rawOrder as string[];
  const signatureSlots = defaultSlots.filter(
    (s) => !['badge', 'title', 'subtitle'].includes(s)
  );

  // Jika semua signature slot preset baru sudah ada, pertahankan urutan
  if (signatureSlots.length > 0 && signatureSlots.every((s) => rawList.includes(s))) {
    const valid = rawList.filter((s) => defaultSlots.includes(s));
    if (valid.length > 0) return valid;
  }

  return [...defaultSlots];
}
