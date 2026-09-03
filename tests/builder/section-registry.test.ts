import { describe, it, expect } from 'vitest';
import {
  sectionRegistry,
  getSectionDefinition,
  getAllSectionDefinitions,
  registerSection,
  type SectionDefinition,
} from '@/components/builder/registry';

describe('Section Registry Map Architecture', () => {
  it('registers all 8 core section types in the section registry', () => {
    const expectedTypes = [
      'header_announcement',
      'hero',
      'features',
      'product_catalog',
      'testimonials',
      'faq',
      'google_maps',
      'footer',
    ];

    for (const type of expectedTypes) {
      expect(sectionRegistry[type]).toBeDefined();
      expect(sectionRegistry[type].type).toBe(type);
      expect(sectionRegistry[type].label).toBeTruthy();
      expect(sectionRegistry[type].renderComponent).toBeDefined();
      expect(sectionRegistry[type].layoutPresets.length).toBeGreaterThanOrEqual(
        type === 'header_announcement' ? 9 : 10
      );
    }
  });

  it('correctly retrieves section definition using getSectionDefinition', () => {
    const heroDef = getSectionDefinition('hero');
    expect(heroDef).toBeDefined();
    expect(heroDef?.label).toBe('Hero Banner');
    expect(heroDef?.isFullBleed).toBe(true);

    const unknownDef = getSectionDefinition('unknown_custom_type');
    expect(unknownDef).toBeUndefined();
  });

  it('returns all section definitions as an array with getAllSectionDefinitions', () => {
    const allDefs = getAllSectionDefinitions();
    expect(allDefs.length).toBeGreaterThanOrEqual(8);
    const types = allDefs.map((d) => d.type);
    expect(types).toContain('hero');
    expect(types).toContain('product_catalog');
    expect(types).toContain('footer');
  });

  it('marks header_announcement and hero as isFullBleed', () => {
    const headerDef = getSectionDefinition('header_announcement');
    const heroDef = getSectionDefinition('hero');
    const featuresDef = getSectionDefinition('features');

    expect(headerDef?.isFullBleed).toBe(true);
    expect(heroDef?.isFullBleed).toBe(true);
    expect(featuresDef?.isFullBleed).toBe(false);
  });

  it('allows dynamic registration of new custom section modules', () => {
    const dummyComponent = {} as unknown as SectionDefinition['renderComponent'];
    const dummyIcon = {} as unknown as SectionDefinition['icon'];

    const customSection: SectionDefinition = {
      type: 'custom_countdown',
      label: 'Promo Countdown Timer',
      icon: dummyIcon,
      renderComponent: dummyComponent,
      defaultConfig: {
        id: 'sec-custom-1',
        type: 'custom_countdown',
        props: { targetDate: '2026-12-31' },
      },
      layoutPresets: ['boxed', 'banner'],
      isFullBleed: false,
    };

    registerSection(customSection);

    const retrieved = getSectionDefinition('custom_countdown');
    expect(retrieved).toBeDefined();
    expect(retrieved?.label).toBe('Promo Countdown Timer');
    expect(retrieved?.type).toBe('custom_countdown');
  });

  it('contains all 10 defined layout presets for features section', () => {
    const featuresDef = getSectionDefinition('features');
    expect(featuresDef).toBeDefined();
    expect(featuresDef?.layoutPresets).toEqual([
      'grid_3_cards',
      'horizontal_list',
      'banner_inline_bar',
      'bento_grid_asymmetric',
      'alternating_zigzag_rows',
      'interactive_tabs',
      'vertical_accordion_showcase',
      'sticky_scroll_highlight',
      'dense_icon_matrix',
      'before_after_comparison',
    ]);
  });

  it('contains all 20 defined layout presets for product_catalog section', () => {
    const catalogDef = getSectionDefinition('product_catalog');
    expect(catalogDef).toBeDefined();
    expect(catalogDef?.layoutPresets).toEqual([
      'grid_standard',
      'carousel_scroll',
      'list_compact',
      'masonry_catalog',
      'bento_product_spotlight',
      'split_category_sidebar',
      'compact_mini_cards',
      'price_table_view',
      'lookbook_gallery',
      'flash_sale_countdown',
      'interactive_filter_tabs',
      'quick_buy_whatsapp_direct',
      'bundle_package_tiers',
      'single_product_deep_focus',
      'badge_stock_scarcity',
      'seasonal_hampers_gift',
      'before_after_product_effect',
      'digital_download_catalog',
      'customer_review_paired_card',
      'minimal_accordion_catalog',
    ]);
  });

  it('contains all 10 defined layout presets for testimonials section', () => {
    const testiDef = getSectionDefinition('testimonials');
    expect(testiDef).toBeDefined();
    expect(testiDef?.layoutPresets).toEqual([
      'masonry_grid',
      'single_spotlight',
      'chat_bubble_flow',
      'infinite_marquee_scroll',
      'video_review_cards',
      'social_post_cards',
      'side_by_side_3_cards',
      'logo_client_cloud',
      'split_rating_stats',
      'carousel_slider',
    ]);
  });

  it('contains all 10 defined layout presets for faq section', () => {
    const faqDef = getSectionDefinition('faq');
    expect(faqDef).toBeDefined();
    expect(faqDef?.layoutPresets).toEqual([
      'accordion_single_col',
      'split_faq_sidebar',
      'grid_2_col_cards',
      'accordion_two_col',
      'chat_style_faq',
      'search_filtered_faq',
      'categorized_tabs_faq',
      'compact_numbered_list',
      'floating_help_center',
      'horizontal_faq_cards',
    ]);
  });

  it('contains all 10 defined layout presets for google_maps section', () => {
    const mapsDef = getSectionDefinition('google_maps');
    expect(mapsDef).toBeDefined();
    expect(mapsDef?.layoutPresets).toEqual([
      'fullwidth_map',
      'split_map_info',
      'compact_boxed',
      'floating_address_card',
      'two_column_directions',
      'store_hours_highlight',
      'interactive_route_finder',
      'minimal_framed_map',
      'multi_branch_tabs',
      'card_overlay_bottom',
    ]);
  });
});

