import { describe, it, expect } from 'vitest';
import {
  getDefaultFeaturesSlots,
  getAllowedFeaturesSlots,
  getEffectiveFeaturesElementOrder,
  getFeaturesSlotLabel,
  getFeaturesSplitSlot,
  isFeaturesVisualOnLeft,
  getFeaturesSlotDirection,
  isFeaturesSplitLayout,
} from '@/components/builder/sections/features/featuresLayout.helpers';
import { getAddedSlotDefaultProps } from '@/components/builder/inspector/sectionSlot.helpers';

describe('Features Section Layout & Slot Ordering Engine', () => {
  it('returns specific slots tailored to each layout preset', () => {
    expect(getDefaultFeaturesSlots('grid_3_cards')).toEqual([
      'badge', 'title', 'subtitle', 'feature_cards',
    ]);
    expect(getDefaultFeaturesSlots('horizontal_list')).toEqual([
      'badge', 'title', 'subtitle', 'feature_rows',
    ]);
    expect(getDefaultFeaturesSlots('banner_inline_bar')).toEqual([
      'ribbon_bar',
    ]);
    expect(getDefaultFeaturesSlots('bento_grid_asymmetric')).toEqual([
      'badge', 'title', 'subtitle', 'bento_spotlight', 'bento_cards', 'image',
    ]);
    expect(getDefaultFeaturesSlots('alternating_zigzag_rows')).toEqual([
      'badge', 'title', 'subtitle', 'zigzag_items',
    ]);
    expect(getDefaultFeaturesSlots('interactive_tabs')).toEqual([
      'badge', 'title', 'subtitle', 'tab_nav', 'tab_card', 'image',
    ]);
    expect(getDefaultFeaturesSlots('vertical_accordion_showcase')).toEqual([
      'badge', 'title', 'subtitle', 'accordion_list', 'image',
    ]);
    expect(getDefaultFeaturesSlots('sticky_scroll_highlight')).toEqual([
      'badge', 'title', 'subtitle', 'cta', 'scroll_cards',
    ]);
    expect(getDefaultFeaturesSlots('dense_icon_matrix')).toEqual([
      'badge', 'title', 'subtitle', 'icon_matrix',
    ]);
    expect(getDefaultFeaturesSlots('before_after_comparison')).toEqual([
      'badge', 'title', 'subtitle', 'before_card', 'after_card',
    ]);
  });

  it('correctly identifies split horizontal layouts', () => {
    expect(isFeaturesSplitLayout('horizontal_list')).toBe(true);
    expect(isFeaturesSplitLayout('sticky_scroll_highlight')).toBe(true);
    expect(isFeaturesSplitLayout('vertical_accordion_showcase')).toBe(true);
    expect(isFeaturesSplitLayout('interactive_tabs')).toBe(true);
    expect(isFeaturesSplitLayout('before_after_comparison')).toBe(true);
    expect(isFeaturesSplitLayout('grid_3_cards')).toBe(false);
    expect(isFeaturesSplitLayout('banner_inline_bar')).toBe(false);
  });

  it('identifies the correct split visual slot', () => {
    expect(getFeaturesSplitSlot('horizontal_list')).toBe('feature_rows');
    expect(getFeaturesSplitSlot('sticky_scroll_highlight')).toBe('scroll_cards');
    expect(getFeaturesSplitSlot('vertical_accordion_showcase')).toBe('image');
    expect(getFeaturesSplitSlot('interactive_tabs')).toBe('image');
    expect(getFeaturesSplitSlot('before_after_comparison')).toBe('before_card');
    expect(getFeaturesSplitSlot('grid_3_cards')).toBeNull();
  });

  it('determines visual element placement (left vs right)', () => {
    expect(isFeaturesVisualOnLeft('horizontal_list', ['feature_rows', 'title'])).toBe(true);
    expect(isFeaturesVisualOnLeft('horizontal_list', ['title', 'feature_rows'])).toBe(false);
    expect(isFeaturesVisualOnLeft('vertical_accordion_showcase', ['image', 'accordion_list'])).toBe(true);
    expect(isFeaturesVisualOnLeft('vertical_accordion_showcase', ['accordion_list', 'image'])).toBe(false);
    expect(isFeaturesVisualOnLeft('before_after_comparison', ['after_card', 'before_card'])).toBe(true);
  });

  it('determines slot reordering arrow direction (horizontal vs vertical)', () => {
    expect(getFeaturesSlotDirection('horizontal_list', 'feature_rows')).toBe('horizontal');
    expect(getFeaturesSlotDirection('horizontal_list', 'subtitle')).toBe('vertical');
    expect(getFeaturesSlotDirection('before_after_comparison', 'before_card')).toBe('horizontal');
    expect(getFeaturesSlotDirection('before_after_comparison', 'after_card')).toBe('horizontal');
    expect(getFeaturesSlotDirection('interactive_tabs', 'image')).toBe('horizontal');
    expect(getFeaturesSlotDirection('interactive_tabs', 'tab_card')).toBe('horizontal');
    expect(getFeaturesSlotDirection('interactive_tabs', 'tab_nav')).toBe('vertical');
    expect(getFeaturesSlotDirection('grid_3_cards', 'feature_cards')).toBe('vertical');
  });

  it('resolves effective element order and normalizes legacy slots', () => {
    const rawOrder = ['image', 'title', 'unknown_slot', 'accordion_list'];
    const effective = getEffectiveFeaturesElementOrder('vertical_accordion_showcase', rawOrder, 'vertical_accordion_showcase');
    expect(effective).toEqual(['image', 'title', 'accordion_list']);

    // Legacy features_grid expansion for interactive tabs
    const legacyOrder = ['badge', 'title', 'features_grid'];
    const tabsEffective = getEffectiveFeaturesElementOrder('interactive_tabs', legacyOrder, 'interactive_tabs');
    expect(tabsEffective).toEqual(['badge', 'title', 'tab_nav', 'tab_card']);

    // Legacy banner_inline_bar sanitization (removes unwanted default badge/title/subtitle)
    const legacyRibbon = ['badge', 'title', 'subtitle', 'ribbon_bar'];
    const sanitizedRibbon = getEffectiveFeaturesElementOrder('banner_inline_bar', legacyRibbon, 'banner_inline_bar');
    expect(sanitizedRibbon).toEqual(['ribbon_bar']);
  });

  it('provides allowed slots for each layout preset including optional slots', () => {
    expect(getAllowedFeaturesSlots('banner_inline_bar')).toEqual([
      'ribbon_bar', 'badge', 'title', 'subtitle',
    ]);
  });

  it('falls back to default slots when current order has no valid slots', () => {
    const effective = getEffectiveFeaturesElementOrder('grid_3_cards', ['unknown1', 'unknown2']);
    expect(effective).toEqual(['badge', 'title', 'subtitle', 'feature_cards']);
  });

  it('provides human-readable labels for all features slots', () => {
    expect(getFeaturesSlotLabel('badge')).toBe('Lencana & Tagline');
    expect(getFeaturesSlotLabel('title')).toBe('Judul Utama (Heading)');
    expect(getFeaturesSlotLabel('feature_cards')).toBe('Grid Kartu Fitur (3 Kolom)');
    expect(getFeaturesSlotLabel('ribbon_bar')).toBe('Pita Baris Fitur (Ribbon 64px)');
    expect(getFeaturesSlotLabel('before_card')).toBe('Kartu Sebelum (Produk Pasaran)');
    expect(getFeaturesSlotLabel('after_card')).toBe('Kartu Sesudah (Solusi Dapur Kami)');
    expect(getFeaturesSlotLabel('tab_nav')).toBe('Bilah Pilihan Tab (Tab Bar)');
  });

  it('restores default props when slot is re-added via getAddedSlotDefaultProps', () => {
    const titleProps = getAddedSlotDefaultProps('title', 'features');
    expect(titleProps.title).toBe('Kenapa Memilih Produk UMKM Kami?');

    const badgeProps = getAddedSlotDefaultProps('badge', 'features');
    expect(badgeProps.badge).toBe('FITUR UNGGULAN');

    const imgProps = getAddedSlotDefaultProps('image', 'features');
    expect(imgProps.imageUrl).toBeDefined();
  });
});
