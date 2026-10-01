/**
 * Helper SSOT tata letak section hero.
 * Menjaga sinkronisasi antara Canvas, Tab Tata Letak, Tab Konten, dan Panel Lapisan.
 */

export const HERO_SPLIT_PRESETS = [
  'split_left_text',
  'split_right_text',
  'interactive_terminal_code',
  'split_stat_counter',
  'badge_ticker_split',
  'dual_contrast_split',
  'brand_story_founder',
  'sticker_badge_playful',
] as const;

export const HERO_IMAGE_SUPPORTED_PRESETS = [
  'split_left_text',
  'split_right_text',
  'centered_minimal',
  'full_banner_overlay',
  'badge_ticker_split',
  'bento_masonry_hero',
  'split_stat_counter',
  'sticker_badge_playful',
  'brand_story_founder',
] as const;

export type HeroImageSupportedPreset = (typeof HERO_IMAGE_SUPPORTED_PRESETS)[number];

export const HERO_NO_CTA_PRESETS = [
  'dual_product_showcase',
] as const;

export const HERO_NO_BADGE_PRESETS = ['interactive_terminal_code'] as const;

/**
 * Pemetaan slot visual utama untuk tiap preset tata letak split 2 kolom.
 */
export const HERO_SPLIT_VISUAL_SLOTS: Record<string, string> = {
  split_left_text: 'image', split_right_text: 'image', interactive_terminal_code: 'terminal',
  split_stat_counter: 'image', badge_ticker_split: 'image', dual_contrast_split: 'contrast_card',
  brand_story_founder: 'image', sticker_badge_playful: 'image',
};

/**
 * Mendapatkan nama slot visual yang dapat ditukar posisi Kiri - Kanan pada preset split.
 */
export function getHeroSplitVisualSlot(preset: string): string | null {
  return HERO_SPLIT_VISUAL_SLOTS[preset] || null;
}

/**
 * Cek apakah layout preset menggunakan grid split 2 kolom (Kiri - Kanan).
 */
export function isHeroSplitLayout(preset: string): boolean {
  return HERO_SPLIT_PRESETS.includes(preset as (typeof HERO_SPLIT_PRESETS)[number]);
}

/**
 * Cek apakah elemen visual berada di kolom sebelah kiri pada preset split.
 */
export function isHeroVisualOnLeft(
  preset: string,
  elementOrder: string[],
  defaultLeft = false
): boolean {
  const visualSlot = getHeroSplitVisualSlot(preset);
  if (!visualSlot || !elementOrder.includes(visualSlot)) return defaultLeft;
  const visualIdx = elementOrder.indexOf(visualSlot);
  if (visualIdx === 0) return true;
  if (visualIdx === elementOrder.length - 1) return false;
  const titleIdx = elementOrder.indexOf('title');
  if (titleIdx !== -1) return visualIdx < titleIdx;
  return defaultLeft;
}

/**
 * Menghasilkan urutan slot elemen hero efektif yang selalu sinkron dan sesuai preset.
 */
export function getEffectiveHeroElementOrder(
  preset: string,
  rawOrder?: unknown,
  heroPreset?: string
): string[] {
  const defaultSlots = getDefaultHeroSlots(preset);
  if (!Array.isArray(rawOrder) || rawOrder.length === 0) {
    return [...defaultSlots];
  }
  const rawList = rawOrder as string[];
  const valid = rawList.filter((s) => defaultSlots.includes(s));
  if (heroPreset === preset || (!heroPreset && rawList.every((s) => defaultSlots.includes(s)))) {
    return valid.length > 0 ? valid : [...defaultSlots];
  }
  const signatureSlots = defaultSlots.filter(
    (s) => !['badge', 'title', 'subtitle', 'cta'].includes(s)
  );
  if (signatureSlots.every((s) => rawList.includes(s)) && valid.length > 0) return valid;
  return [...defaultSlots];
}

/**
 * Cek apakah layout preset mendukung gambar banner / media visual.
 */
export function supportsHeroImage(preset: string): boolean {
  return HERO_IMAGE_SUPPORTED_PRESETS.includes(preset as HeroImageSupportedPreset);
}

/**
 * Cek apakah layout preset memiliki gambar mandiri (bukan background spanduk penuh).
 */
export function isHeroNonBackgroundImage(preset: string): boolean {
  return supportsHeroImage(preset) && preset !== 'full_banner_overlay' && preset !== 'video_background_loop';
}

/**
 * Cek apakah layout preset mendukung tombol aksi (CTA) mandiri.
 */
export function supportsHeroCta(preset: string): boolean {
  return !HERO_NO_CTA_PRESETS.includes(preset as (typeof HERO_NO_CTA_PRESETS)[number]);
}

/**
 * Cek apakah layout preset mendukung lencana promo / badge.
 */
export function supportsHeroBadge(preset: string): boolean {
  return !HERO_NO_BADGE_PRESETS.includes(preset as (typeof HERO_NO_BADGE_PRESETS)[number]);
}

/**
 * Cek apakah preset mendukung elemen tertentu.
 */
export function supportsHeroElement(
  preset: string,
  element: 'image' | 'badge' | 'cta' | 'title' | 'subtitle'
): boolean {
  switch (element) {
    case 'image':
      return supportsHeroImage(preset);
    case 'badge':
      return supportsHeroBadge(preset);
    case 'cta':
      return supportsHeroCta(preset);
    case 'title':
    case 'subtitle':
      return true;
    default:
      return false;
  }
}

/**
 * Menghasilkan urutan slot elemen riil bawaan sesuai spesifikasi tiap variasi layout preset.
 */
export function getDefaultHeroSlots(preset: string): string[] {
  switch (preset) {
    case 'split_right_text':
    case 'brand_story_founder':
      return ['image', 'badge', 'title', 'subtitle', 'cta'];
    case 'interactive_terminal_code':
      return ['title', 'subtitle', 'cta', 'terminal'];
    case 'split_stat_counter':
      return ['badge', 'title', 'subtitle', 'cta', 'stat_counter', 'image'];
    case 'badge_ticker_split':
      return ['badge', 'title', 'subtitle', 'cta', 'trust_badges', 'image'];
    case 'dual_contrast_split':
      return ['badge', 'title', 'subtitle', 'cta', 'contrast_card'];
    case 'dual_product_showcase':
      return ['badge', 'title', 'subtitle', 'product_cards'];
    case 'floating_cards_showcase':
      return ['badge', 'title', 'subtitle', 'cta', 'floating_cards'];
    case 'social_proof_community':
      return ['social_proof', 'badge', 'title', 'subtitle', 'cta'];
    case 'sticky_whatsapp_pill_float':
      return ['badge', 'title', 'subtitle', 'cta', 'chat_simulation'];
    case 'gradient_mesh_glow':
      return ['badge', 'title', 'subtitle', 'cta', 'trust_badges'];
    case 'full_banner_overlay':
    case 'video_background_loop':
      return ['badge', 'title', 'subtitle', 'cta'];
    case 'bento_masonry_hero':
      return ['badge', 'title', 'subtitle', 'cta', 'image', 'bento_promo', 'bento_review'];
    case 'centered_minimal':
    case 'sticker_badge_playful':
    case 'split_left_text':
    default:
      return ['badge', 'title', 'subtitle', 'cta', 'image'];
  }
}

/**
 * Label Bahasa Indonesia baku untuk tiap slot elemen hero.
 */
export function getHeroSlotLabel(slot: string, preset?: string): string {
  switch (slot) {
    case 'badge':
    case 'hero_badge':
      return 'Lencana Promo & Kategori';
    case 'title':
    case 'hero_title':
      return 'Judul Utama (H1)';
    case 'subtitle':
    case 'hero_subtitle':
      return 'Subjudul & Deskripsi';
    case 'cta':
    case 'hero_cta':
      return 'Tombol Aksi (CTA)';
    case 'image':
    case 'hero_image':
    case 'hero_founder_photo':
      return preset === 'brand_story_founder' ? 'Foto Profil Pendiri' : 'Gambar Utama (Showcase)';
    case 'terminal':
    case 'hero_terminal':
      return 'Kotak Kode Terminal';
    case 'stat_counter':
    case 'hero_stat_counter':
      return 'Metrik Statistik Angka';
    case 'trust_badges':
    case 'hero_trust_badges':
      return 'Lencana Sertifikasi / Jaminan';
    case 'contrast_card':
    case 'hero_contrast_card':
      return 'Kartu Pendaftaran Kuota';
    case 'product_cards':
    case 'hero_product_cards':
      return 'Dua Kartu Produk Bundling';
    case 'floating_cards':
    case 'hero_floating_cards':
      return 'Kartu Keunggulan Melayang';
    case 'social_proof':
    case 'hero_social_proof':
      return 'Avatar Komunitas & Rating';
    case 'chat_simulation':
    case 'hero_chat_simulation':
      return 'Simulasi Balon Chat WA';
    case 'bento_promo':
    case 'hero_bento_promo':
      return 'Ubin Teks Promo';
    case 'bento_review':
    case 'hero_bento_review':
      return 'Ubin Rating & Ulasan';
    case 'booking_card':
    case 'hero_booking_card':
      return 'Formulir Reservasi';
    case 'email_capture':
    case 'hero_email_capture':
      return 'Formulir Input Email / WA';
    case 'category_pills':
    case 'hero_pill_category':
      return 'Filter Kategori Kapsul';
    default:
      return slot;
  }
}

export const HERO_SHOWCASE_SLOTS: Record<string, string> = {
  centered_minimal: 'image',
  floating_cards_showcase: 'floating_cards',
  social_proof_community: 'social_proof',
  dual_product_showcase: 'product_cards',
  sticky_whatsapp_pill_float: 'chat_simulation',
  gradient_mesh_glow: 'trust_badges',
};

export function getHeroShowcaseSlot(preset: string): string | null {
  return HERO_SHOWCASE_SLOTS[preset] || null;
}

/**
 * Menentukan arah perpindahan slot elemen hero:
 * - 'horizontal': Kolom visual Kiri - Kanan pada preset split
 * - 'vertical': Elemen tumpukan Atas - Bawah
 * - 'none': Elemen terkunci (hanya tombol hapus, tanpa panah geser agar responsif terjaga)
 */
export function getHeroSlotDirection(
  preset: string,
  slot: string
): 'horizontal' | 'vertical' | 'none' {
  if (preset === 'bento_masonry_hero' && slot === 'image') return 'none';
  if (preset === 'split_stat_counter' && slot === 'stat_counter') return 'none';
  if (preset === 'badge_ticker_split' && slot === 'trust_badges') return 'none';
  if (isHeroSplitLayout(preset) && slot === getHeroSplitVisualSlot(preset)) {
    return 'horizontal';
  }
  return 'vertical';
}
