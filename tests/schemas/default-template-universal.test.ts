import { describe, it, expect } from 'vitest';
import {
  DEFAULT_TEMPLATE_ID,
  DEFAULT_TEMPLATE_SLUG,
  DEFAULT_TEMPLATE_NAME,
  DEFAULT_TEMPLATE_CONFIG,
  DEFAULT_TEMPLATE_SECTIONS,
  DEFAULT_TEMPLATE_THEME,
  TemplateConfigSchema,
} from '@/schemas';

describe('Default Universal Template Invariants', () => {
  it('exports valid default template identifiers', () => {
    expect(DEFAULT_TEMPLATE_ID).toBe('tpl-default-universal');
    expect(DEFAULT_TEMPLATE_SLUG).toBe('template-standar-universal');
    expect(DEFAULT_TEMPLATE_NAME).toBe('Template Standar Universal');
  });

  it('validates DEFAULT_TEMPLATE_CONFIG against TemplateConfigSchema', () => {
    const result = TemplateConfigSchema.safeParse(DEFAULT_TEMPLATE_CONFIG);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sections).toHaveLength(8);
      expect(result.data.schemaVersion).toBe(1);
    }
  });

  it('has clean universal typography without niche restrictions', () => {
    expect(DEFAULT_TEMPLATE_THEME.fontFamily).toBe('Inter, sans-serif');
    expect(DEFAULT_TEMPLATE_THEME.typography?.headingFont).toBe('Inter, sans-serif');
    expect(DEFAULT_TEMPLATE_THEME.typography?.bodyFont).toBe('Inter, sans-serif');
    expect(DEFAULT_TEMPLATE_THEME.typography?.h1?.fontSize).toBe('42px');
    expect(DEFAULT_TEMPLATE_THEME.typography?.body?.fontSize).toBe('16px');
  });

  it('contains neutral, category-agnostic copy in default sections', () => {
    const rawContent = JSON.stringify(DEFAULT_TEMPLATE_SECTIONS).toLowerCase();

    // Verify banned niche-specific words are NOT present
    const bannedNicheWords = ['roti', 'kopi', 'katering', 'butter', 'bumbu', 'seret', 'sarapan'];
    for (const word of bannedNicheWords) {
      expect(rawContent).not.toContain(word);
    }

    // Verify essential universal sections are present
    const sectionTypes = DEFAULT_TEMPLATE_SECTIONS.map((s) => s.type);
    expect(sectionTypes).toEqual([
      'header_announcement',
      'hero',
      'features',
      'product_catalog',
      'testimonials',
      'faq',
      'google_maps',
      'footer',
    ]);
  });
});

