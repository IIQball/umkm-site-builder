import { describe, it, expect } from 'vitest';
import {
  HERO_BADGE_ICON_OPTIONS,
  HERO_IMAGE_FRAME_OPTIONS,
  HERO_IMAGE_SHAPE_OPTIONS,
  resolveFeatureIcon,
  stripEmoji,
} from '@/components/builder/sections/hero/heroIcons';
import {
  isHeroNonBackgroundImage,
  getDefaultHeroSlots,
  getHeroSlotLabel,
} from '@/components/builder/sections/hero/heroLayout.helpers';

describe('Hero Section Enhancements & Design System Standards', () => {
  describe('stripEmoji', () => {
    it('removes emojis from text correctly without modifying normal text', () => {
      expect(stripEmoji('HOT NEW MENU 2026 🔥')).toBe('HOT NEW MENU 2026');
      expect(stripEmoji('✨ Best Seller 🌟')).toBe('Best Seller');
      expect(stripEmoji('Kain Batik Tulis')).toBe('Kain Batik Tulis');
      expect(stripEmoji('')).toBe('');
    });
  });

  describe('isHeroNonBackgroundImage', () => {
    it('identifies non-background hero image presets', () => {
      expect(isHeroNonBackgroundImage('split_left_text')).toBe(true);
      expect(isHeroNonBackgroundImage('split_right_text')).toBe(true);
      expect(isHeroNonBackgroundImage('centered_minimal')).toBe(true);
      expect(isHeroNonBackgroundImage('bento_masonry_hero')).toBe(true);
      expect(isHeroNonBackgroundImage('badge_ticker_split')).toBe(true);
      expect(isHeroNonBackgroundImage('split_stat_counter')).toBe(true);
      expect(isHeroNonBackgroundImage('sticker_badge_playful')).toBe(true);
      expect(isHeroNonBackgroundImage('brand_story_founder')).toBe(true);
    });

    it('returns false for full banner and non-image presets', () => {
      expect(isHeroNonBackgroundImage('full_banner_overlay')).toBe(false);
      expect(isHeroNonBackgroundImage('video_background_loop')).toBe(false);
      expect(isHeroNonBackgroundImage('social_proof_community')).toBe(false);
      expect(isHeroNonBackgroundImage('gradient_mesh_glow')).toBe(false);
    });
  });

  describe('Hero Image Options', () => {
    it('defines frame options with none as default and includes card and grid', () => {
      const values = HERO_IMAGE_FRAME_OPTIONS.map((o) => o.value);
      expect(values).toContain('none');
      expect(values).toContain('card');
      expect(values).toContain('grid');
    });

    it('defines shape options including rounded, square, circle, squircle', () => {
      const values = HERO_IMAGE_SHAPE_OPTIONS.map((o) => o.value);
      expect(values).toContain('rounded');
      expect(values).toContain('square');
      expect(values).toContain('circle');
      expect(values).toContain('squircle');
    });
  });

  describe('Hero Badge Icons & Resolver', () => {
    it('provides rich badge icon options and resolves components with fallback', () => {
      expect(HERO_BADGE_ICON_OPTIONS.length).toBeGreaterThan(10);
      expect(resolveFeatureIcon('Sparkles')).toBeDefined();
      expect(resolveFeatureIcon('Flame')).toBeDefined();
      expect(resolveFeatureIcon('ShieldCheck')).toBeDefined();
      expect(resolveFeatureIcon('UnknownIcon123')).toBeDefined();
    });
  });

  describe('Default Hero Slots & Slot Labels', () => {
    it('returns proper default slots for layout presets', () => {
      const splitSlots = getDefaultHeroSlots('split_left_text');
      expect(splitSlots).toContain('badge');
      expect(splitSlots).toContain('title');
      expect(splitSlots).toContain('subtitle');
      expect(splitSlots).toContain('cta');
      expect(splitSlots).toContain('image');

      const bentoSlots = getDefaultHeroSlots('bento_masonry_hero');
      expect(bentoSlots).toEqual(['badge', 'title', 'subtitle', 'cta', 'image', 'bento_promo', 'bento_review']);
    });

    it('returns exact Bahasa Indonesia labels for hero slots matching layer panel', () => {
      expect(getHeroSlotLabel('image')).toBe('Gambar Utama (Showcase)');
      expect(getHeroSlotLabel('image', 'brand_story_founder')).toBe('Foto Profil Pendiri');
      expect(getHeroSlotLabel('bento_promo')).toBe('Ubin Teks Promo');
      expect(getHeroSlotLabel('bento_review')).toBe('Ubin Rating & Ulasan');
      expect(getHeroSlotLabel('title')).toBe('Judul Utama (H1)');
    });
  });
});

