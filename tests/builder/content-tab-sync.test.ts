import { describe, it, expect } from 'vitest';
import type { TemplateSection } from '@/schemas';
import { getSectionNodes } from '@/components/builder/layer/layerPanel.helpers';
import { getEffectiveFooterElementOrder } from '@/components/builder/sections/footer/footerLayout.helpers';
import { getEffectiveHeroElementOrder } from '@/components/builder/sections/hero/heroLayout.helpers';
import { getEffectiveFeaturesElementOrder } from '@/components/builder/sections/features/featuresLayout.helpers';
import { getEffectiveCatalogElementOrder } from '@/components/builder/sections/catalog/catalogLayout.helpers';
import { getEffectiveTestimonialsElementOrder } from '@/components/builder/sections/testimonials/testimonialsLayout.helpers';
import { getEffectiveFaqElementOrder } from '@/components/builder/sections/faq/faqLayout.helpers';
import { getEffectiveMapsElementOrder } from '@/components/builder/sections/maps/mapsLayout.helpers';

describe('Content Tab Layout Synchronization for All Sections', () => {
  it('footer content slots exactly match layout preset slots', () => {
    const footerPresets = [
      'multi_column', 'centered_simple', 'cta_focused', 'minimal_single_row',
      'giant_wordmark', 'newsletter_centric', 'live_status_badge', 'split_map_footer',
      'social_links_grid', 'boxed_card_footer',
    ];

    for (const preset of footerPresets) {
      const section: TemplateSection = {
        id: 'footer-1',
        type: 'footer',
        layoutPreset: preset,
      };
      const layerNodes = getSectionNodes(section);
      const effectiveSlots = getEffectiveFooterElementOrder(preset);

      expect(effectiveSlots).toEqual(layerNodes.map((n) => n.id));
    }
  });

  it('hero content slots match layout preset slots', () => {
    const heroPresets = [
      'split_left_text', 'split_right_text', 'centered_minimal', 'full_banner_overlay',
      'interactive_terminal_code', 'dual_product_showcase', 'social_proof_community',
    ];

    for (const preset of heroPresets) {
      const slots = getEffectiveHeroElementOrder(preset);
      expect(slots.length).toBeGreaterThan(0);
      expect(slots.includes('title')).toBe(true);
      if (preset === 'interactive_terminal_code') {
        expect(slots.includes('terminal')).toBe(true);
        expect(slots.includes('badge')).toBe(false);
      }
      if (preset === 'dual_product_showcase') {
        expect(slots.includes('product_cards')).toBe(true);
        expect(slots.includes('cta')).toBe(false);
      }
    }
  });

  it('features content slots match layout preset slots', () => {
    const featuresPresets = [
      'grid_3_cards', 'horizontal_list', 'banner_inline_bar', 'bento_grid_asymmetric',
      'alternating_zigzag_rows', 'interactive_tabs', 'vertical_accordion_showcase',
      'sticky_scroll_highlight', 'dense_icon_matrix', 'before_after_comparison',
    ];

    for (const preset of featuresPresets) {
      const slots = getEffectiveFeaturesElementOrder(preset);
      expect(slots.length).toBeGreaterThan(0);
      if (preset === 'banner_inline_bar') {
        expect(slots).toEqual(['ribbon_bar']);
      }
      if (preset === 'sticky_scroll_highlight') {
        expect(slots.includes('cta')).toBe(true);
        expect(slots.includes('scroll_cards')).toBe(true);
      }
    }
  });

  it('catalog content slots match layout preset slots', () => {
    const catalogPresets = [
      'grid_standard', 'flash_sale_countdown', 'bundle_package_tiers',
      'price_table_view', 'single_product_deep_focus',
    ];

    for (const preset of catalogPresets) {
      const slots = getEffectiveCatalogElementOrder(preset);
      expect(slots.length).toBeGreaterThan(0);
      if (preset === 'flash_sale_countdown') {
        expect(slots.includes('catalog_timer')).toBe(true);
      }
      if (preset === 'bundle_package_tiers') {
        expect(slots.includes('catalog_bundle_tier')).toBe(true);
        expect(slots.includes('catalog_cta')).toBe(true);
      }
      if (preset === 'price_table_view') {
        expect(slots.includes('catalog_price_rows')).toBe(true);
      }
      if (preset === 'single_product_deep_focus') {
        expect(slots.includes('product_desc')).toBe(true);
      }
    }
  });

  it('testimonials content slots match layout preset slots', () => {
    const testiPresets = [
      'masonry_grid', 'logo_client_cloud', 'split_rating_stats',
    ];

    for (const preset of testiPresets) {
      const slots = getEffectiveTestimonialsElementOrder(preset);
      expect(slots.length).toBeGreaterThan(0);
      if (preset === 'split_rating_stats') {
        expect(slots.includes('testi_stats')).toBe(true);
      }
      if (preset === 'logo_client_cloud') {
        expect(slots.includes('testi_logo_cloud')).toBe(true);
      }
    }
  });

  it('faq content slots match layout preset slots', () => {
    const faqPresets = [
      'accordion_single_col', 'split_faq_sidebar', 'search_filtered_faq', 'categorized_tabs_faq',
    ];

    for (const preset of faqPresets) {
      const slots = getEffectiveFaqElementOrder(preset);
      expect(slots.length).toBeGreaterThan(0);
      if (preset === 'split_faq_sidebar') {
        expect(slots.includes('faq_cs_card')).toBe(true);
        expect(slots.includes('badge')).toBe(false);
      }
      if (preset === 'search_filtered_faq') {
        expect(slots.includes('faq_search_bar')).toBe(true);
      }
      if (preset === 'categorized_tabs_faq') {
        expect(slots.includes('faq_tabs')).toBe(true);
      }
    }
  });

  it('maps content slots match layout preset slots', () => {
    const mapsPresets = [
      'fullwidth_map', 'compact_boxed', 'two_column_directions', 'store_hours_highlight', 'minimal_framed_map',
    ];

    for (const preset of mapsPresets) {
      const slots = getEffectiveMapsElementOrder(preset);
      expect(slots.length).toBeGreaterThan(0);
      if (preset === 'minimal_framed_map') {
        expect(slots.includes('maps_cta_button')).toBe(false);
        expect(slots.includes('badge')).toBe(false);
      }
      if (preset === 'store_hours_highlight') {
        expect(slots.includes('maps_hours_card')).toBe(true);
        expect(slots.includes('maps_cta_button')).toBe(false);
      }
      if (preset === 'two_column_directions') {
        expect(slots.includes('maps_directions_card')).toBe(true);
      }
    }
  });
});
