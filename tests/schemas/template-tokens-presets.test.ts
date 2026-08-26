import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
  ColorTokenSchema,
  TypographyTokenSchema,
  SpacingStepSchema,
  ButtonHeightSchema,
  EffectShadowSchema,
  HeaderAnnouncementPresetSchema,
  HeroPresetSchema,
  FeaturesPresetSchema,
  ProductCatalogPresetSchema,
  TestimonialsPresetSchema,
  FAQPresetSchema,
  GoogleMapsPresetSchema,
  FooterPresetSchema,
  TemplateSectionSchema,
  DEFAULT_TEMPLATE_SECTIONS,
  DEFAULT_TEMPLATE_THEME,
} from '@/schemas';
import {
  calculateNestedRadius,
  calculatePillRadius,
} from '@/types/templates/builder';
import {
  canvasStore,
  documentStore,
} from '@/components/builder/stores/editorStore';

describe('Token-Based Presets & Mathematical Design System Schema', () => {
  it('should validate valid and invalid ColorTokens', () => {
    const validTokens = [
      'primary',
      'secondary',
      'accent',
      'background',
      'surface',
      'textPrimary',
      'textMuted',
      'text_primary',
      'text_muted',
      'transparent',
    ];
    for (const token of validTokens) {
      expect(ColorTokenSchema.safeParse(token).success).toBe(true);
    }
    expect(ColorTokenSchema.safeParse('#ff0000').success).toBe(false);
    expect(ColorTokenSchema.safeParse('custom-color').success).toBe(false);
  });

  it('should validate TypographyToken, SpacingStep, ButtonHeight, and EffectShadow', () => {
    // TypographyToken
    const validTypography = ['h1', 'h2', 'h3', 'body', 'caption'];
    for (const typo of validTypography) {
      expect(TypographyTokenSchema.safeParse(typo).success).toBe(true);
    }
    expect(TypographyTokenSchema.safeParse('h4').success).toBe(false);

    // SpacingStep (Multiples of 8)
    const validSpacings = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96];
    for (const spacing of validSpacings) {
      expect(SpacingStepSchema.safeParse(spacing).success).toBe(true);
    }
    expect(SpacingStepSchema.safeParse(10).success).toBe(false);
    expect(SpacingStepSchema.safeParse(50).success).toBe(false);

    // ButtonHeight (Multiples of 8: 32, 40, 48, 56)
    const validHeights = [32, 40, 48, 56];
    for (const height of validHeights) {
      expect(ButtonHeightSchema.safeParse(height).success).toBe(true);
    }
    expect(ButtonHeightSchema.safeParse(24).success).toBe(false);
    expect(ButtonHeightSchema.safeParse(60).success).toBe(false);

    // EffectShadow
    const validShadows = ['none', 'sm', 'md', 'lg'];
    for (const shadow of validShadows) {
      expect(EffectShadowSchema.safeParse(shadow).success).toBe(true);
    }
    expect(EffectShadowSchema.safeParse('xl').success).toBe(false);
  });

  it('should calculate nested radius and pill radius correctly according to math rules', () => {
    // R_inner = max(0, R_outer - Padding)
    expect(calculateNestedRadius(16, 8)).toBe(8);
    expect(calculateNestedRadius(8, 16)).toBe(0);
    expect(calculateNestedRadius(24, 8)).toBe(16);

    // Pill radius = height / 2
    expect(calculatePillRadius(48)).toBe(24);
    expect(calculatePillRadius(32)).toBe(16);
    expect(calculatePillRadius(40)).toBe(20);
    expect(calculatePillRadius(56)).toBe(28);
  });

  it('should adhere to Golden Ratio typography scale in DEFAULT_TEMPLATE_THEME', () => {
    const typo = DEFAULT_TEMPLATE_THEME.typography;
    expect(typo?.h1?.fontSize).toBe('42px'); // 16 * 1.618^2
    expect(typo?.h2?.fontSize).toBe('26px'); // 16 * 1.618
    expect(typo?.h3?.fontSize).toBe('20px'); // 16 * 1.25
    expect(typo?.body?.fontSize).toBe('16px'); // Base 16px
    expect(typo?.caption?.fontSize).toBe('10px'); // 16 / 1.618
  });

  it('should validate layout presets per section type', () => {
    const headerPresets = [
      'default_split',
      'centered_stacked',
      'compact_inline',
      'floating_pill',
      'centered_inline',
      'sidebar_drawer_trigger',
      'top_contact_bar',
      'minimal_borderless',
    ];
    for (const p of headerPresets) {
      expect(HeaderAnnouncementPresetSchema.safeParse(p).success).toBe(true);
    }
    expect(HeaderAnnouncementPresetSchema.safeParse('unknown_preset').success).toBe(false);

    const heroPresets = [
      'split_left_text',
      'split_right_text',
      'centered_minimal',
      'full_banner_overlay',
      'hero_card_overlap',
      'split_multi_badges',
      'hero_triple_highlights',
      'hero_search_focused',
    ];
    for (const p of heroPresets) {
      expect(HeroPresetSchema.safeParse(p).success).toBe(true);
    }
    expect(HeroPresetSchema.safeParse('unknown_hero').success).toBe(false);

    const featuresPresets = [
      'grid_3_cards',
      'horizontal_list',
      'banner_inline_bar',
      'grid_4_compact',
      'numbered_process',
      'feature_bento_grid',
      'icon_pill_chips',
      'split_image_feature',
    ];
    for (const p of featuresPresets) {
      expect(FeaturesPresetSchema.safeParse(p).success).toBe(true);
    }
    expect(FeaturesPresetSchema.safeParse('unknown_features').success).toBe(false);

    const catalogPresets = [
      'grid_standard',
      'carousel_scroll',
      'list_compact',
      'grid_2_col_large',
      'featured_hero_product',
      'masonry_catalog',
      'horizontal_card_slider',
      'catalog_table_menu',
    ];
    for (const p of catalogPresets) {
      expect(ProductCatalogPresetSchema.safeParse(p).success).toBe(true);
    }
    expect(ProductCatalogPresetSchema.safeParse('unknown_catalog').success).toBe(false);

    const testimonialsPresets = [
      'masonry_grid',
      'single_spotlight',
      'chat_bubble_flow',
      'testimonial_marquee_slider',
      'large_quote_cards',
      'two_column_cards',
      'statistics_with_review',
      'compact_badge_grid',
    ];
    for (const p of testimonialsPresets) {
      expect(TestimonialsPresetSchema.safeParse(p).success).toBe(true);
    }
    expect(TestimonialsPresetSchema.safeParse('unknown_testi').success).toBe(false);

    const faqPresets = [
      'accordion_single_col',
      'split_faq_sidebar',
      'grid_2_col_cards',
      'categorized_tabs_faq',
      'faq_contact_banner_bottom',
      'two_column_accordion',
      'searchable_faq_box',
      'bubble_chat_faq',
    ];
    for (const p of faqPresets) {
      expect(FAQPresetSchema.safeParse(p).success).toBe(true);
    }
    expect(FAQPresetSchema.safeParse('unknown_faq').success).toBe(false);

    const mapPresets = [
      'fullwidth_map',
      'split_map_info',
      'compact_boxed',
      'card_overlay_center',
      'multi_branch_map',
      'route_guide_map',
      'minimal_map_action',
      'full_bleed_with_hours_pill',
    ];
    for (const p of mapPresets) {
      expect(GoogleMapsPresetSchema.safeParse(p).success).toBe(true);
    }
    expect(GoogleMapsPresetSchema.safeParse('unknown_map').success).toBe(false);

    const footerPresets = [
      'multi_column',
      'centered_simple',
      'cta_focused',
      'minimal_stacked',
      'newsletter_footer',
      'two_column_clean',
      'floating_bottom_bar',
      'app_store_style_footer',
    ];
    for (const p of footerPresets) {
      expect(FooterPresetSchema.safeParse(p).success).toBe(true);
    }
    expect(FooterPresetSchema.safeParse('unknown_footer').success).toBe(false);
  });

  it('should validate sections with layoutPreset and token-based styles', () => {
    const section = {
      id: 'map-1',
      type: 'google_maps',
      layoutPreset: 'fullwidth_map',
      props: {
        address: 'Jl. Sudirman No. 1, Jakarta',
        zoom: 15,
      },
      styles: {
        bgColorToken: 'surface',
        textColorToken: 'text_primary',
        borderColorToken: 'primary',
      },
    };

    const parsed = TemplateSectionSchema.safeParse(section);
    expect(parsed.success).toBe(true);
  });
});

describe('Split Store: canvasStore (Ephemeral) & documentStore (Persistent)', () => {
  beforeEach(() => {
    canvasStore.reset();
    documentStore.init({
      id: 'tpl-test',
      name: 'Test Template',
      price: 50000,
      config: {
        theme: DEFAULT_TEMPLATE_THEME,
        sections: DEFAULT_TEMPLATE_SECTIONS,
      },
    });
  });

  it('canvasStore mutations must NOT change isDirty and must NOT push history', () => {
    expect(get(documentStore).isDirty).toBe(false);
    expect(get(documentStore).history.past.length).toBe(0);

    canvasStore.selectSection('section-2');
    canvasStore.selectNode('section-2', 'title');
    canvasStore.setViewMode('mobile');
    canvasStore.setZoom(75);
    canvasStore.toggleGrid();
    canvasStore.setActiveMargin('32px');
    canvasStore.setHovered('title');
    canvasStore.toggleLeftSidebar();
    canvasStore.toggleRightSidebar();
    canvasStore.toggleEditorTheme();

    // Visual state changed
    const canvas = get(canvasStore);
    expect(canvas.selectedSectionId).toBe('section-2');
    expect(canvas.selectedNodeId).toBe('title');
    expect(canvas.viewMode).toBe('mobile');
    expect(canvas.zoom).toBe(75);
    expect(canvas.gridActive).toBe(true);
    expect(canvas.activeMargin).toBe('32px');
    expect(canvas.hoveredNodeId).toBe('title');
    expect(canvas.leftSidebarOpen).toBe(false);
    expect(canvas.rightSidebarOpen).toBe(false);
    expect(canvas.editorTheme).toBe('dark');

    // Ephemeral mutates must NOT affect document persistence
    expect(get(documentStore).isDirty).toBe(false);
    expect(get(documentStore).history.past.length).toBe(0);
  });

  it('documentStore mutations MUST change isDirty and push history', () => {
    expect(get(documentStore).isDirty).toBe(false);

    // 1. updateSectionLayoutPreset
    documentStore.updateSectionLayoutPreset('section-2', 'centered_minimal');
    expect(get(documentStore).isDirty).toBe(true);
    expect(get(documentStore).history.past.length).toBe(1);
    const sec2 = get(documentStore).template?.config.sections.find((s) => s.id === 'section-2');
    expect(sec2?.layoutPreset).toBe('centered_minimal');

    // 2. updateNodeStyleToken
    documentStore.updateNodeStyleToken('section-2', 'title', 'textColorToken', 'accent');
    const sec2Updated = get(documentStore).template?.config.sections.find((s) => s.id === 'section-2');
    const nodeStyles = sec2Updated?.props?.nodeStyles as Record<string, Record<string, string>> | undefined;
    expect(nodeStyles?.title?.textColorToken).toBe('accent');

    // 3. updateSectionStyles with token
    documentStore.updateSectionStyles('section-2', { bgColorToken: 'surface' });
    const sec2StyleUpdated = get(documentStore).template?.config.sections.find((s) => s.id === 'section-2');
    expect(sec2StyleUpdated?.styles?.bgColorToken).toBe('surface');

    // 4. reorderSectionSlot
    documentStore.updateSectionProps('section-2', {
      elementOrder: ['badge', 'title', 'subtitle', 'image', 'cta'],
    });
    documentStore.reorderSectionSlot('section-2', 0, 1);
    const sec2Order = get(documentStore).template?.config.sections.find((s) => s.id === 'section-2');
    expect(sec2Order?.props?.elementOrder).toEqual(['title', 'badge', 'subtitle', 'image', 'cta']);

    // 5. updateDesignSystemTheme
    documentStore.updateDesignSystemTheme('colors', { primary: '#10b981' });
    expect(get(documentStore).template?.config.theme?.colors?.primary).toBe('#10b981');

    // 6. updateSectionSpacing
    documentStore.updateSectionSpacing('section-2', { paddingY: 64, paddingX: 32, gap: 24 });
    const sec2Spacing = get(documentStore).template?.config.sections.find((s) => s.id === 'section-2');
    expect(sec2Spacing?.styles?.padding).toBe('64px 32px');
    expect(sec2Spacing?.styles?.gap).toBe('24px');

    // 7. updateNodeSpacing
    documentStore.updateNodeSpacing('section-2', 'title', { marginTop: 16, marginBottom: 24, padding: 8 });
    const sec2NodeSpacing = get(documentStore).template?.config.sections.find((s) => s.id === 'section-2');
    const titleNodeStyles = (sec2NodeSpacing?.props?.nodeStyles as Record<string, Record<string, string>>)?.title;
    expect(titleNodeStyles?.marginTop).toBe('16px');
    expect(titleNodeStyles?.marginBottom).toBe('24px');
    expect(titleNodeStyles?.padding).toBe('8px');
  });

  it('should validate all 8 section types with their specific layout presets', () => {
    const sectionsToTest = [
      // Header (8 presets)
      { id: 'sec-header-1', type: 'header_announcement', layoutPreset: 'default_split' },
      { id: 'sec-header-2', type: 'header_announcement', layoutPreset: 'centered_stacked' },
      { id: 'sec-header-3', type: 'header_announcement', layoutPreset: 'compact_inline' },
      { id: 'sec-header-4', type: 'header_announcement', layoutPreset: 'floating_pill' },
      { id: 'sec-header-5', type: 'header_announcement', layoutPreset: 'centered_inline' },
      { id: 'sec-header-6', type: 'header_announcement', layoutPreset: 'sidebar_drawer_trigger' },
      { id: 'sec-header-7', type: 'header_announcement', layoutPreset: 'top_contact_bar' },
      { id: 'sec-header-8', type: 'header_announcement', layoutPreset: 'minimal_borderless' },

      // Hero (8 presets)
      { id: 'sec-hero-1', type: 'hero', layoutPreset: 'split_left_text' },
      { id: 'sec-hero-2', type: 'hero', layoutPreset: 'split_right_text' },
      { id: 'sec-hero-3', type: 'hero', layoutPreset: 'centered_minimal' },
      { id: 'sec-hero-4', type: 'hero', layoutPreset: 'full_banner_overlay' },
      { id: 'sec-hero-5', type: 'hero', layoutPreset: 'hero_card_overlap' },
      { id: 'sec-hero-6', type: 'hero', layoutPreset: 'split_multi_badges' },
      { id: 'sec-hero-7', type: 'hero', layoutPreset: 'hero_triple_highlights' },
      { id: 'sec-hero-8', type: 'hero', layoutPreset: 'hero_search_focused' },

      // Features (8 presets)
      { id: 'sec-feat-1', type: 'features', layoutPreset: 'grid_3_cards' },
      { id: 'sec-feat-2', type: 'features', layoutPreset: 'horizontal_list' },
      { id: 'sec-feat-3', type: 'features', layoutPreset: 'banner_inline_bar' },
      { id: 'sec-feat-4', type: 'features', layoutPreset: 'grid_4_compact' },
      { id: 'sec-feat-5', type: 'features', layoutPreset: 'numbered_process' },
      { id: 'sec-feat-6', type: 'features', layoutPreset: 'feature_bento_grid' },
      { id: 'sec-feat-7', type: 'features', layoutPreset: 'icon_pill_chips' },
      { id: 'sec-feat-8', type: 'features', layoutPreset: 'split_image_feature' },

      // Product Catalog (8 presets)
      { id: 'sec-prod-1', type: 'product_catalog', layoutPreset: 'grid_standard' },
      { id: 'sec-prod-2', type: 'product_catalog', layoutPreset: 'carousel_scroll' },
      { id: 'sec-prod-3', type: 'product_catalog', layoutPreset: 'list_compact' },
      { id: 'sec-prod-4', type: 'product_catalog', layoutPreset: 'grid_2_col_large' },
      { id: 'sec-prod-5', type: 'product_catalog', layoutPreset: 'featured_hero_product' },
      { id: 'sec-prod-6', type: 'product_catalog', layoutPreset: 'masonry_catalog' },
      { id: 'sec-prod-7', type: 'product_catalog', layoutPreset: 'horizontal_card_slider' },
      { id: 'sec-prod-8', type: 'product_catalog', layoutPreset: 'catalog_table_menu' },

      // Testimonials (8 presets)
      { id: 'sec-testi-1', type: 'testimonials', layoutPreset: 'masonry_grid' },
      { id: 'sec-testi-2', type: 'testimonials', layoutPreset: 'single_spotlight' },
      { id: 'sec-testi-3', type: 'testimonials', layoutPreset: 'chat_bubble_flow' },
      { id: 'sec-testi-4', type: 'testimonials', layoutPreset: 'testimonial_marquee_slider' },
      { id: 'sec-testi-5', type: 'testimonials', layoutPreset: 'large_quote_cards' },
      { id: 'sec-testi-6', type: 'testimonials', layoutPreset: 'two_column_cards' },
      { id: 'sec-testi-7', type: 'testimonials', layoutPreset: 'statistics_with_review' },
      { id: 'sec-testi-8', type: 'testimonials', layoutPreset: 'compact_badge_grid' },

      // FAQ (8 presets)
      { id: 'sec-faq-1', type: 'faq', layoutPreset: 'accordion_single_col' },
      { id: 'sec-faq-2', type: 'faq', layoutPreset: 'split_faq_sidebar' },
      { id: 'sec-faq-3', type: 'faq', layoutPreset: 'grid_2_col_cards' },
      { id: 'sec-faq-4', type: 'faq', layoutPreset: 'categorized_tabs_faq' },
      { id: 'sec-faq-5', type: 'faq', layoutPreset: 'faq_contact_banner_bottom' },
      { id: 'sec-faq-6', type: 'faq', layoutPreset: 'two_column_accordion' },
      { id: 'sec-faq-7', type: 'faq', layoutPreset: 'searchable_faq_box' },
      { id: 'sec-faq-8', type: 'faq', layoutPreset: 'bubble_chat_faq' },

      // Google Maps (8 presets)
      { id: 'sec-map-1', type: 'google_maps', layoutPreset: 'fullwidth_map' },
      { id: 'sec-map-2', type: 'google_maps', layoutPreset: 'split_map_info' },
      { id: 'sec-map-3', type: 'google_maps', layoutPreset: 'compact_boxed' },
      { id: 'sec-map-4', type: 'google_maps', layoutPreset: 'card_overlay_center' },
      { id: 'sec-map-5', type: 'google_maps', layoutPreset: 'multi_branch_map' },
      { id: 'sec-map-6', type: 'google_maps', layoutPreset: 'route_guide_map' },
      { id: 'sec-map-7', type: 'google_maps', layoutPreset: 'minimal_map_action' },
      { id: 'sec-map-8', type: 'google_maps', layoutPreset: 'full_bleed_with_hours_pill' },

      // Footer (8 presets)
      { id: 'sec-foot-1', type: 'footer', layoutPreset: 'multi_column' },
      { id: 'sec-foot-2', type: 'footer', layoutPreset: 'centered_simple' },
      { id: 'sec-foot-3', type: 'footer', layoutPreset: 'cta_focused' },
      { id: 'sec-foot-4', type: 'footer', layoutPreset: 'minimal_stacked' },
      { id: 'sec-foot-5', type: 'footer', layoutPreset: 'newsletter_footer' },
      { id: 'sec-foot-6', type: 'footer', layoutPreset: 'two_column_clean' },
      { id: 'sec-foot-7', type: 'footer', layoutPreset: 'floating_bottom_bar' },
      { id: 'sec-foot-8', type: 'footer', layoutPreset: 'app_store_style_footer' },
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

