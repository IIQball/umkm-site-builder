import { describe, it, expect } from 'vitest';
import {
  migrateTemplateConfig,
  isLegacyConfig,
  getDefaultLayoutPreset,
  normalizeTheme,
  normalizeSection,
} from '@/lib/templates';
import {
  CURRENT_SCHEMA_VERSION,
  DEFAULT_TEMPLATE_THEME,
  DEFAULT_TEMPLATE_SECTIONS,
  TemplateConfigSchema,
} from '@/schemas';

describe('Template Schema Versioning & Migration Pipeline', () => {
  describe('isLegacyConfig', () => {
    it('returns true for null, undefined, primitives, or arrays', () => {
      expect(isLegacyConfig(null)).toBe(true);
      expect(isLegacyConfig(undefined)).toBe(true);
      expect(isLegacyConfig('string')).toBe(true);
      expect(isLegacyConfig(123)).toBe(true);
      expect(isLegacyConfig([])).toBe(true);
    });

    it('returns true for config missing schemaVersion or with version 0', () => {
      expect(isLegacyConfig({})).toBe(true);
      expect(isLegacyConfig({ theme: {}, sections: [] })).toBe(true);
      expect(isLegacyConfig({ schemaVersion: 0 })).toBe(true);
    });

    it('returns false for config with schemaVersion equal to or greater than CURRENT_SCHEMA_VERSION', () => {
      expect(isLegacyConfig({ schemaVersion: CURRENT_SCHEMA_VERSION })).toBe(false);
      expect(isLegacyConfig({ schemaVersion: 2 })).toBe(false);
    });
  });

  describe('getDefaultLayoutPreset', () => {
    it('returns standard layout preset for each section type', () => {
      expect(getDefaultLayoutPreset('header_announcement')).toBe('default_split');
      expect(getDefaultLayoutPreset('hero')).toBe('split_left_text');
      expect(getDefaultLayoutPreset('features')).toBe('grid_3_cards');
      expect(getDefaultLayoutPreset('product_catalog')).toBe('grid_standard');
      expect(getDefaultLayoutPreset('testimonials')).toBe('masonry_grid');
      expect(getDefaultLayoutPreset('faq')).toBe('accordion_single_col');
      expect(getDefaultLayoutPreset('google_maps')).toBe('fullwidth_map');
      expect(getDefaultLayoutPreset('footer')).toBe('multi_column');
    });
  });

  describe('normalizeTheme', () => {
    it('returns default theme when given empty or non-object', () => {
      const theme = normalizeTheme(null);
      expect(theme).toEqual(DEFAULT_TEMPLATE_THEME);
    });

    it('migrates legacy flat primaryColor and fontFamily', () => {
      const legacyTheme = {
        primaryColor: '#ef4444',
        fontFamily: 'Roboto, sans-serif',
      };

      const normalized = normalizeTheme(legacyTheme);
      expect(normalized.primaryColor).toBe('#ef4444');
      expect(normalized.colors?.primary).toBe('#ef4444');
      expect(normalized.fontFamily).toBe('Roboto, sans-serif');
      expect(normalized.typography?.headingFont).toBe('Roboto, sans-serif');
      expect(normalized.typography?.bodyFont).toBe('Roboto, sans-serif');
    });

    it('deeply preserves existing custom colors and backfills missing tokens', () => {
      const partialTheme = {
        colors: {
          primary: '#10b981',
          accent: '#8b5cf6',
        },
      };

      const normalized = normalizeTheme(partialTheme);
      expect(normalized.colors?.primary).toBe('#10b981');
      expect(normalized.colors?.accent).toBe('#8b5cf6');
      expect(normalized.colors?.secondary).toBe(DEFAULT_TEMPLATE_THEME.colors?.secondary);
      expect(normalized.colors?.background).toBe(DEFAULT_TEMPLATE_THEME.colors?.background);
      expect(normalized.colors?.surface).toBe(DEFAULT_TEMPLATE_THEME.colors?.surface);
    });

    it('backfills typography scale and button definitions', () => {
      const normalized = normalizeTheme({});
      expect(normalized.typography?.h1?.fontSize).toBe('42px');
      expect(normalized.typography?.h2?.fontSize).toBe('26px');
      expect(normalized.typography?.h3?.fontSize).toBe('20px');
      expect(normalized.buttons?.borderRadius).toBe('8px');
      expect(normalized.buttons?.primary?.backgroundColor).toBe('#3b82f6');
      expect(normalized.layout?.maxWidth).toBe('1200px');
      expect(normalized.layout?.horizontalMarginDesktop).toBe('32px');
    });
  });

  describe('normalizeSection', () => {
    it('creates fallback hero section when given empty or non-object', () => {
      const section = normalizeSection(null, 0);
      expect(section.id).toBe('section-1');
      expect(section.type).toBe('hero');
      expect(section.layoutPreset).toBe('split_left_text');
      expect(section.props).toEqual({});
      expect(section.styles?.padding).toBe('0px');
    });

    it('normalizes section with missing id, layoutPreset, or styles', () => {
      const rawSection = {
        type: 'features',
        props: { title: 'Fitur Utama' },
      };

      const section = normalizeSection(rawSection, 2);
      expect(section.id).toBe('section-3');
      expect(section.type).toBe('features');
      expect(section.layoutPreset).toBe('grid_3_cards');
      expect(section.props).toEqual({ title: 'Fitur Utama' });
      expect(section.styles?.padding).toBe('0px');
    });

    it('falls back invalid section type to hero', () => {
      const rawSection = {
        id: 'sec-custom',
        type: 'invalid_type_unknown',
      };

      const section = normalizeSection(rawSection, 0);
      expect(section.id).toBe('sec-custom');
      expect(section.type).toBe('hero');
    });

    it('preserves valid custom section styles and layout presets', () => {
      const rawSection = {
        id: 'custom-hero',
        type: 'hero',
        layoutPreset: 'centered_minimal',
        props: { title: 'Toko Kopi' },
        styles: {
          padding: '16px',
          bgColorToken: 'primary',
          textColorToken: 'text_primary',
        },
      };

      const section = normalizeSection(rawSection, 0);
      expect(section.id).toBe('custom-hero');
      expect(section.layoutPreset).toBe('centered_minimal');
      expect(section.styles?.bgColorToken).toBe('primary');
      expect(section.styles?.padding).toBe('16px');
    });
  });

  describe('migrateTemplateConfig', () => {
    it('returns valid default config when given invalid input', () => {
      const migrated = migrateTemplateConfig(null);
      expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
      expect(migrated.theme).toEqual(DEFAULT_TEMPLATE_THEME);
      expect(migrated.sections).toHaveLength(DEFAULT_TEMPLATE_SECTIONS.length);
    });

    it('migrates legacy template without schemaVersion to CURRENT_SCHEMA_VERSION', () => {
      const legacyConfig = {
        theme: {
          primaryColor: '#6366f1',
        },
        sections: [
          {
            id: 'h-1',
            type: 'hero',
            props: { title: 'Selamat Datang' },
          },
        ],
      };

      const migrated = migrateTemplateConfig(legacyConfig);
      expect(migrated.schemaVersion).toBe(1);
      expect(migrated.theme?.colors?.primary).toBe('#6366f1');
      expect(migrated.sections).toHaveLength(1);
      expect(migrated.sections[0].id).toBe('h-1');
      expect(migrated.sections[0].layoutPreset).toBe('split_left_text');
    });

    it('conforms strictly to TemplateConfigSchema validation', () => {
      const legacyComplexConfig = {
        theme: {
          fontFamily: 'Outfit, sans-serif',
          colors: {
            primary: '#0ea5e9',
          },
        },
        sections: [
          {
            type: 'header_announcement',
            props: { showAnnouncement: false },
          },
          {
            type: 'product_catalog',
            props: { products: [] },
          },
        ],
      };

      const migrated = migrateTemplateConfig(legacyComplexConfig);
      const parsed = TemplateConfigSchema.safeParse(migrated);

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.schemaVersion).toBe(1);
        expect(parsed.data.sections).toHaveLength(2);
      }
    });

    it('is idempotent when config is already migrated', () => {
      const initial = migrateTemplateConfig({
        theme: { colors: { primary: '#f97316' } },
        sections: [{ type: 'hero', props: { title: 'Warung Kopi' } }],
      });

      const secondPass = migrateTemplateConfig(initial);
      expect(secondPass).toEqual(initial);
    });
  });
});
