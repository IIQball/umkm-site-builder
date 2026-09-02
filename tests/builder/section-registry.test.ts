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
});
