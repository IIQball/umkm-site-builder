import { describe, it, expect, beforeEach } from 'vitest';
import { zoomStore } from '@/lib/stores/zoomStore';
import { getBankBrandConfig } from '@/components/designer/bankBranding.helpers';
import { PRESETS_BY_SECTION_TYPE, SECTION_TYPE_LABELS } from '@/components/builder/inspector/layoutPresets.data';
import { getPresetSchematicSvg } from '@/components/builder/inspector/layoutSchematics.helpers';
import { get } from 'svelte/store';

describe('Global Zoom Controls & Centered Layout Tests', () => {
  beforeEach(() => {
    zoomStore.resetZoom();
  });

  it('initializes with default zoom of 1.0 (100%)', () => {
    expect(get(zoomStore)).toBe(1.0);
  });

  it('clamps minimum zoom-out strictly to 0.25 (25%)', () => {
    // Attempt to zoom out repeatedly beyond 25%
    for (let i = 0; i < 20; i++) {
      zoomStore.zoomOut();
    }
    expect(get(zoomStore)).toBe(0.25);

    // Explicit setZoom below 0.25 must be clamped to 0.25
    zoomStore.setZoom(0.1);
    expect(get(zoomStore)).toBe(0.25);

    zoomStore.setZoom(0.0);
    expect(get(zoomStore)).toBe(0.25);
  });

  it('clamps maximum zoom-in strictly to 2.0 (200%)', () => {
    // Explicit setZoom above 2.0 must be clamped to 2.0
    zoomStore.setZoom(3.5);
    expect(get(zoomStore)).toBe(2.0);

    for (let i = 0; i < 10; i++) {
      zoomStore.zoomIn();
    }
    expect(get(zoomStore)).toBe(2.0);
  });

  it('increments and decrements zoom in 10% steps', () => {
    zoomStore.resetZoom();
    expect(get(zoomStore)).toBe(1.0);

    zoomStore.zoomIn();
    expect(get(zoomStore)).toBe(1.1);

    zoomStore.zoomOut();
    expect(get(zoomStore)).toBe(1.0);

    zoomStore.zoomOut();
    expect(get(zoomStore)).toBe(0.9);
  });

  it('resets back to 1.0 upon resetZoom()', () => {
    zoomStore.setZoom(0.5);
    expect(get(zoomStore)).toBe(0.5);

    zoomStore.resetZoom();
    expect(get(zoomStore)).toBe(1.0);
  });
});

describe('Bank Card Branding & Dynamic Accents Tests', () => {
  it('correctly maps Indonesian banks to official brand configs', () => {
    const bca = getBankBrandConfig('BCA');
    expect(bca.code).toBe('BCA');
    expect(bca.borderClass).toContain('blue');
    expect(bca.logoSvg).toContain('<svg');
    expect(bca.logoSvg).toContain('#0060AF');

    const mandiri = getBankBrandConfig('Bank Mandiri');
    expect(mandiri.code).toBe('MANDIRI');
    expect(mandiri.logoSvg).toContain('MANDIRI');

    const bni = getBankBrandConfig('BNI 46');
    expect(bni.code).toBe('BNI');
    expect(bni.logoSvg).toContain('BNI');

    const bri = getBankBrandConfig('Bank BRI');
    expect(bri.code).toBe('BRI');
    expect(bri.logoSvg).toContain('BRI');

    const cimb = getBankBrandConfig('CIMB Niaga');
    expect(cimb.code).toBe('CIMB Niaga');
    expect(cimb.logoSvg).toContain('CIMB');

    const permata = getBankBrandConfig('Permata Bank');
    expect(permata.code).toBe('Permata');
    expect(permata.logoSvg).toContain('#008751');
  });

  it('falls back to DEFAULT config for unknown or empty banks', () => {
    const fallback = getBankBrandConfig(null);
    expect(fallback.code).toBe('BANK');

    const unknown = getBankBrandConfig('Bank Antartika');
    expect(unknown.code).toBe('BANK');
  });
});

describe('Web Builder Layout Selector & Schematics Tests', () => {
  it('defines presets for all 8 builder section types', () => {
    const sectionTypes = [
      'header_announcement',
      'hero',
      'features',
      'product_catalog',
      'testimonials',
      'faq',
      'google_maps',
      'footer',
    ];

    sectionTypes.forEach((type) => {
      expect(PRESETS_BY_SECTION_TYPE[type]).toBeDefined();
      expect(PRESETS_BY_SECTION_TYPE[type].length).toBeGreaterThan(0);
      expect(SECTION_TYPE_LABELS[type]).toBeDefined();
    });
  });

  it('generates valid and distinct SVG wireframes matching actual rendered layouts', () => {
    // Hero: Split vs Centered/Stacked
    const heroSplit = getPresetSchematicSvg('hero', 'split_left_text');
    expect(heroSplit).toContain('<svg');
    expect(heroSplit).toContain('</svg>');

    const heroCentered = getPresetSchematicSvg('hero', 'centered_minimal');
    expect(heroCentered).toContain('<svg');
    expect(heroCentered).not.toEqual(heroSplit);

    const heroBanner = getPresetSchematicSvg('hero', 'full_banner_overlay');
    expect(heroBanner).toContain('<svg');
    expect(heroBanner).not.toEqual(heroSplit);

    const heroEmail = getPresetSchematicSvg('hero', 'inline_email_capture');
    expect(heroEmail).toContain('<svg');

    // Features: Grid vs List vs Ribbon Bar vs Comparison
    const featuresGrid = getPresetSchematicSvg('features', 'grid_3_cards');
    const featuresRibbon = getPresetSchematicSvg('features', 'banner_inline_bar');
    const featuresComparison = getPresetSchematicSvg('features', 'before_after_comparison');
    expect(featuresGrid).toContain('<svg');
    expect(featuresRibbon).toContain('<svg');
    expect(featuresComparison).toContain('<svg');
    expect(featuresRibbon).not.toEqual(featuresGrid);
    expect(featuresComparison).not.toEqual(featuresGrid);

    // Catalog: Grid vs Compact Rows vs Table vs Sidebar
    const catalogGrid = getPresetSchematicSvg('product_catalog', 'grid_standard');
    const catalogList = getPresetSchematicSvg('product_catalog', 'list_compact');
    const catalogTable = getPresetSchematicSvg('product_catalog', 'price_table_view');
    const catalogSidebar = getPresetSchematicSvg('product_catalog', 'split_category_sidebar');
    expect(catalogGrid).toContain('<svg');
    expect(catalogList).toContain('<svg');
    expect(catalogTable).toContain('<svg');
    expect(catalogSidebar).toContain('<svg');
    expect(catalogList).not.toEqual(catalogGrid);
    expect(catalogTable).not.toEqual(catalogGrid);
    expect(catalogSidebar).not.toEqual(catalogGrid);

    // FAQ: Single Column vs Split Sidebar vs 2-Col
    const faqAccordion = getPresetSchematicSvg('faq', 'accordion_single_col');
    const faqSidebar = getPresetSchematicSvg('faq', 'split_faq_sidebar');
    const faqTwoCol = getPresetSchematicSvg('faq', 'accordion_two_col');
    expect(faqAccordion).toContain('<svg');
    expect(faqSidebar).toContain('<svg');
    expect(faqTwoCol).toContain('<svg');
    expect(faqSidebar).not.toEqual(faqAccordion);
    expect(faqTwoCol).not.toEqual(faqAccordion);

    // Header & Footer
    const headerStacked = getPresetSchematicSvg('header_announcement', 'centered_stacked');
    const headerPill = getPresetSchematicSvg('header_announcement', 'floating_pill_island');
    expect(headerStacked).toContain('<svg');
    expect(headerPill).toContain('<svg');

    const footerCentered = getPresetSchematicSvg('footer', 'centered_simple');
    const footerMulti = getPresetSchematicSvg('footer', 'multi_column');
    expect(footerCentered).toContain('<svg');
    expect(footerMulti).toContain('<svg');
    expect(footerCentered).not.toEqual(footerMulti);
  });

  it('verifies product_catalog in registry relies solely on layout presets without extra styles sub-tabs', async () => {
    const { sectionRegistry } = await import('@/components/builder/registry');
    expect(sectionRegistry.product_catalog).toBeDefined();
    expect(sectionRegistry.product_catalog.stylesComponent).toBeUndefined();
  });
});
