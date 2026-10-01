/**
 * Helper SSOT tata letak Google Maps Section.
 * Menjaga sinkronisasi 1:1 antara Panel Lapisan (Kiri) dan Tab Tata Letak (Kanan).
 * Elemen yang ditampilkan harus sesuai dengan wujud nyata preset yang aktif.
 */

export const MAPS_PRESET_SLOTS: Record<string, string[]> = {
  fullwidth_map: ['badge', 'title', 'subtitle', 'maps_iframe', 'maps_info_card', 'maps_cta_button'],
  split_map_info: ['badge', 'title', 'subtitle', 'maps_info_card', 'maps_cta_button', 'maps_iframe'],
  compact_boxed: ['maps_info_card', 'maps_iframe', 'maps_cta_button'],
  floating_address_card: ['badge', 'title', 'subtitle', 'maps_iframe', 'maps_info_card', 'maps_cta_button'],
  two_column_directions: ['badge', 'title', 'subtitle', 'maps_directions_card', 'maps_cta_button', 'maps_iframe'],
  store_hours_highlight: ['badge', 'title', 'subtitle', 'maps_hours_card', 'maps_iframe'],
  interactive_route_finder: ['badge', 'title', 'subtitle', 'maps_iframe', 'maps_cta_button'],
  minimal_framed_map: ['maps_info_card', 'maps_iframe'],
  multi_branch_tabs: ['badge', 'title', 'subtitle', 'maps_branch_selector', 'maps_info_card', 'maps_cta_button', 'maps_iframe'],
  card_overlay_bottom: ['badge', 'title', 'subtitle', 'maps_iframe', 'maps_info_card', 'maps_cta_button'],
};

/**
 * Mengembalikan daftar slot default sesuai preset dan mode cabang.
 */
export function getDefaultMapsSlots(preset: string, branchMode?: string): string[] {
  const baseSlots = MAPS_PRESET_SLOTS[preset] || MAPS_PRESET_SLOTS.fullwidth_map;
  const isMulti = branchMode === 'multi' || (preset === 'multi_branch_tabs' && branchMode !== 'single');

  if (isMulti) {
    if (baseSlots.includes('maps_branch_selector')) {
      return [...baseSlots];
    }
    // Sisipkan maps_branch_selector setelah subtitle atau di awal jika tidak ada header
    const subtitleIdx = baseSlots.indexOf('subtitle');
    if (subtitleIdx !== -1) {
      const copy = [...baseSlots];
      copy.splice(subtitleIdx + 1, 0, 'maps_branch_selector');
      return copy;
    }
    return ['maps_branch_selector', ...baseSlots];
  }

  // Jika mode single pada preset multi_branch_tabs, hapus maps_branch_selector
  if (!isMulti && baseSlots.includes('maps_branch_selector')) {
    return baseSlots.filter((s) => s !== 'maps_branch_selector');
  }

  return [...baseSlots];
}

/**
 * Slot yang diizinkan untuk preset Maps aktif.
 */
export function getAllowedMapsSlots(preset: string, branchMode?: string): string[] {
  return getDefaultMapsSlots(preset, branchMode);
}

/**
 * Label Bahasa Indonesia baku untuk tiap elemen maps.
 */
export function getMapsSlotLabel(slot: string, preset?: string): string {
  if (preset && (preset === 'compact_boxed' || preset === 'minimal_framed_map') && slot === 'title') {
    return 'Nama Gerai (H2)';
  }
  switch (slot) {
    case 'badge':
      return 'Lencana & Tagline';
    case 'title':
      return 'Judul Utama (H2)';
    case 'subtitle':
      return 'Deskripsi Subjudul';
    case 'maps_branch_selector':
      return 'Bilah Tab Cabang Gerai (Maks 5)';
    case 'maps_iframe':
      return 'Bingkai Peta Interaktif (Google Maps)';
    case 'maps_info_card':
      return 'Kartu Informasi Gerai & Alamat';
    case 'maps_cta_button':
      return 'Tombol Petunjuk Arah (Navigasi)';
    case 'maps_hours_card':
      return 'Bilah Status Jam Buka Toko';
    case 'maps_directions_card':
      return 'Kartu Panduan Rute & Parkir';
    // Fallback normalisasi legacy
    case 'maps_header':
      return 'Judul Lokasi (Header)';
    case 'maps_hours_badge':
      return 'Bilah Status Jam Buka Toko';
    case 'maps_branch_tabs':
      return 'Bilah Tab Cabang Gerai (Maks 5)';
    case 'map_view':
      return 'Bingkai Peta Interaktif (Google Maps)';
    default:
      return slot;
  }
}

/**
 * Normalisasi slot legacy jika ada reorder lama
 */
function normalizeLegacyMapsSlot(slot: string): string[] {
  if (slot === 'map_view') return ['maps_iframe'];
  if (slot === 'maps_header') return ['badge', 'title', 'subtitle'];
  if (slot === 'maps_hours_badge') return ['maps_hours_card'];
  if (slot === 'maps_branch_tabs') return ['maps_branch_selector'];
  return [slot];
}

/**
 * Menghasilkan urutan slot efektif yang sinkron dengan preset aktif.
 */
export function getEffectiveMapsElementOrder(
  preset: string,
  rawOrder?: unknown,
  branchMode?: string
): string[] {
  const defaultSlots = getDefaultMapsSlots(preset, branchMode);

  if (!Array.isArray(rawOrder)) {
    return defaultSlots;
  }

  const normalizedRaw: string[] = [];
  for (const s of rawOrder) {
    if (typeof s === 'string') {
      normalizedRaw.push(...normalizeLegacyMapsSlot(s));
    }
  }

  const validSlotsSet = new Set(defaultSlots);
  const result: string[] = [];

  for (const slot of normalizedRaw) {
    if (validSlotsSet.has(slot) && !result.includes(slot)) {
      result.push(slot);
    }
  }

  return result;
}
