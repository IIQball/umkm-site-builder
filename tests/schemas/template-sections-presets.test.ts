import { describe, it, expect } from 'vitest';
import { TemplateSectionSchema } from '@/schemas';

describe('Template Section Presets Schema Validation', () => {
  it('should validate all 8 section types with their specific layout presets', () => {
    const sectionsToTest = [
      { id: 'sec-header-1', type: 'header_announcement', layoutPreset: 'default_split' },
      { id: 'sec-header-2', type: 'header_announcement', layoutPreset: 'centered_stacked' },
      { id: 'sec-header-3', type: 'header_announcement', layoutPreset: 'compact_inline' },
      { id: 'sec-hero-1', type: 'hero', layoutPreset: 'split_left_text' },
      { id: 'sec-hero-2', type: 'hero', layoutPreset: 'split_right_text' },
      { id: 'sec-hero-3', type: 'hero', layoutPreset: 'centered_minimal' },
      { id: 'sec-hero-4', type: 'hero', layoutPreset: 'full_banner_overlay' },
      { id: 'sec-feat-1', type: 'features', layoutPreset: 'grid_3_cards' },
      { id: 'sec-feat-2', type: 'features', layoutPreset: 'horizontal_list' },
      { id: 'sec-feat-3', type: 'features', layoutPreset: 'banner_inline_bar' },
      { id: 'sec-prod-1', type: 'product_catalog', layoutPreset: 'grid_standard' },
      { id: 'sec-prod-2', type: 'product_catalog', layoutPreset: 'carousel_scroll' },
      { id: 'sec-prod-3', type: 'product_catalog', layoutPreset: 'list_compact' },
      { id: 'sec-testi-1', type: 'testimonials', layoutPreset: 'masonry_grid' },
      { id: 'sec-testi-2', type: 'testimonials', layoutPreset: 'single_spotlight' },
      { id: 'sec-testi-3', type: 'testimonials', layoutPreset: 'chat_bubble_flow' },
      { id: 'sec-faq-1', type: 'faq', layoutPreset: 'accordion_single_col' },
      { id: 'sec-faq-2', type: 'faq', layoutPreset: 'split_faq_sidebar' },
      { id: 'sec-faq-3', type: 'faq', layoutPreset: 'grid_2_col_cards' },
      { id: 'sec-map-1', type: 'google_maps', layoutPreset: 'fullwidth_map' },
      { id: 'sec-map-2', type: 'google_maps', layoutPreset: 'split_map_info' },
      { id: 'sec-map-3', type: 'google_maps', layoutPreset: 'compact_boxed' },
      { id: 'sec-foot-1', type: 'footer', layoutPreset: 'multi_column' },
      { id: 'sec-foot-2', type: 'footer', layoutPreset: 'centered_simple' },
      { id: 'sec-foot-3', type: 'footer', layoutPreset: 'cta_focused' },
    ];

    for (const sec of sectionsToTest) {
      const result = TemplateSectionSchema.safeParse(sec);
      expect(result.success).toBe(true);
    }
  });

  it('should verify Hero presets and layout configurations', () => {
    const fullBannerHero = {
      id: 'sec-hero-full',
      type: 'hero',
      layoutPreset: 'full_banner_overlay',
      props: {
        title: 'Full Bleed Banner',
        subtitle: 'Hero Background 100% Bleed',
        imageUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040',
        ctaText: 'Belanja Sekarang',
        ctaLink: '#products',
        badgeText: 'Promo Toko',
      },
      styles: {
        minHeight: '560px',
        paddingTop: '64px',
        paddingBottom: '64px',
      },
    };

    const parsed = TemplateSectionSchema.safeParse(fullBannerHero);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.layoutPreset).toBe('full_banner_overlay');
      expect(parsed.data.styles?.minHeight).toBe('560px');
    }
  });
});
