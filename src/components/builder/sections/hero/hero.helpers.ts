/**
 * Hero Section Helpers & Constants (SSOT)
 */

export const IMAGE_SUPPORTED_HERO_PRESETS = [
  'split_left_text',
  'split_right_text',
  'full_banner_overlay',
  'video_background_loop',
  'floating_cards_showcase',
  'dual_product_showcase',
  'badge_ticker_split',
  'editorial_luxury_serif',
  'brand_story_founder',
  'bento_masonry_hero',
  'side_card_booking',
  'dual_contrast_split',
  'sticker_badge_playful',
] as const;

export const parsePx = (val: unknown, fallback: number = 0): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseInt(val, 10) || fallback;
  return fallback;
};

export const isHeroImageSupported = (preset: string): boolean => {
  return IMAGE_SUPPORTED_HERO_PRESETS.includes(preset as typeof IMAGE_SUPPORTED_HERO_PRESETS[number]);
};
