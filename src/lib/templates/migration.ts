/**
 * Template Config Schema Versioning & Migration Layer
 * 
 * Provides a resilient migration pipeline for template configurations.
 * Guarantees that legacy or malformed JSON payloads are gracefully upgraded to
 * the latest schema version without runtime crashes.
 */

import {
  CURRENT_SCHEMA_VERSION,
  DEFAULT_TEMPLATE_SECTIONS,
  DEFAULT_TEMPLATE_THEME,
  type TemplateConfig,
  type TemplateSection,
  type TemplateTheme,
} from '@/schemas';

export const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const VALID_SECTION_TYPES: TemplateSection['type'][] = [
  'header_announcement',
  'hero',
  'features',
  'product_catalog',
  'testimonials',
  'faq',
  'google_maps',
  'footer',
];

export function getDefaultLayoutPreset(type: TemplateSection['type']): string {
  switch (type) {
    case 'header_announcement':
      return 'default_split';
    case 'hero':
      return 'split_left_text';
    case 'features':
      return 'grid_3_cards';
    case 'product_catalog':
      return 'grid_standard';
    case 'testimonials':
      return 'masonry_grid';
    case 'faq':
      return 'accordion_single_col';
    case 'google_maps':
      return 'fullwidth_map';
    case 'footer':
      return 'multi_column';
    default:
      return 'default';
  }
}

/**
 * Checks whether a raw template configuration lacks schema versioning or is outdated.
 */
export function isLegacyConfig(rawConfig: unknown): boolean {
  if (!rawConfig || typeof rawConfig !== 'object' || Array.isArray(rawConfig)) {
    return true;
  }
  const config = rawConfig as Record<string, unknown>;
  return (
    typeof config.schemaVersion !== 'number' ||
    config.schemaVersion < CURRENT_SCHEMA_VERSION
  );
}

/**
 * Migrates a theme object to the standard current theme format.
 * Deeply backfills missing color tokens, typography scales, buttons, and layout safe zones.
 */
export function normalizeTheme(rawTheme: unknown): TemplateTheme {
  if (!rawTheme || typeof rawTheme !== 'object' || Array.isArray(rawTheme)) {
    return clone(DEFAULT_TEMPLATE_THEME);
  }

  const themeObj = rawTheme as Record<string, unknown>;
  const rawColors = (typeof themeObj.colors === 'object' && themeObj.colors ? themeObj.colors : {}) as Record<string, unknown>;
  const rawTypography = (typeof themeObj.typography === 'object' && themeObj.typography ? themeObj.typography : {}) as Record<string, unknown>;
  const rawButtons = (typeof themeObj.buttons === 'object' && themeObj.buttons ? themeObj.buttons : {}) as Record<string, unknown>;
  const rawLayout = (typeof themeObj.layout === 'object' && themeObj.layout ? themeObj.layout : {}) as Record<string, unknown>;

  // Handle legacy flat properties if colors/typography nested objects are missing them
  const primaryColor = (rawColors.primary as string) || (themeObj.primaryColor as string) || DEFAULT_TEMPLATE_THEME.colors?.primary;
  const fontFamily = (rawTypography.bodyFont as string) || (themeObj.fontFamily as string) || DEFAULT_TEMPLATE_THEME.fontFamily;

  return {
    primaryColor,
    fontFamily,
    colors: {
      ...DEFAULT_TEMPLATE_THEME.colors,
      ...rawColors,
      primary: primaryColor,
    },
    typography: {
      ...DEFAULT_TEMPLATE_THEME.typography,
      ...rawTypography,
      headingFont: (rawTypography.headingFont as string) || (themeObj.fontFamily as string) || DEFAULT_TEMPLATE_THEME.typography?.headingFont,
      bodyFont: fontFamily,
      h1: { ...DEFAULT_TEMPLATE_THEME.typography?.h1, ...((rawTypography.h1 as Record<string, unknown>) || {}) },
      h2: { ...DEFAULT_TEMPLATE_THEME.typography?.h2, ...((rawTypography.h2 as Record<string, unknown>) || {}) },
      h3: { ...DEFAULT_TEMPLATE_THEME.typography?.h3, ...((rawTypography.h3 as Record<string, unknown>) || {}) },
      body: { ...DEFAULT_TEMPLATE_THEME.typography?.body, ...((rawTypography.body as Record<string, unknown>) || {}) },
      caption: { ...DEFAULT_TEMPLATE_THEME.typography?.caption, ...((rawTypography.caption as Record<string, unknown>) || {}) },
    },
    buttons: {
      ...DEFAULT_TEMPLATE_THEME.buttons,
      ...rawButtons,
      primary: { ...DEFAULT_TEMPLATE_THEME.buttons?.primary, ...((rawButtons.primary as Record<string, unknown>) || {}) },
      secondary: { ...DEFAULT_TEMPLATE_THEME.buttons?.secondary, ...((rawButtons.secondary as Record<string, unknown>) || {}) },
      outline: { ...DEFAULT_TEMPLATE_THEME.buttons?.outline, ...((rawButtons.outline as Record<string, unknown>) || {}) },
    },
    layout: {
      ...DEFAULT_TEMPLATE_THEME.layout,
      ...rawLayout,
    },
  };
}

/**
 * Normalizes an individual section object.
 */
export function normalizeSection(rawSection: unknown, index: number): TemplateSection {
  if (!rawSection || typeof rawSection !== 'object' || Array.isArray(rawSection)) {
    return {
      id: `section-${index + 1}`,
      type: 'hero',
      layoutPreset: 'split_left_text',
      props: {},
      styles: { padding: '0px' },
    };
  }

  const secObj = rawSection as Record<string, unknown>;
  const rawType = typeof secObj.type === 'string' ? (secObj.type as TemplateSection['type']) : 'hero';
  const type: TemplateSection['type'] = VALID_SECTION_TYPES.includes(rawType) ? rawType : 'hero';

  const id = typeof secObj.id === 'string' && secObj.id.trim() ? secObj.id.trim() : `section-${index + 1}`;
  const layoutPreset = typeof secObj.layoutPreset === 'string' && secObj.layoutPreset.trim()
    ? secObj.layoutPreset.trim()
    : getDefaultLayoutPreset(type);

  const rawProps = typeof secObj.props === 'object' && secObj.props !== null && !Array.isArray(secObj.props)
    ? (secObj.props as Record<string, unknown>)
    : {};

  const rawStyles = typeof secObj.styles === 'object' && secObj.styles !== null && !Array.isArray(secObj.styles)
    ? (secObj.styles as Record<string, unknown>)
    : {};

  return {
    id,
    type,
    layoutPreset,
    props: rawProps,
    styles: {
      padding: '0px',
      ...rawStyles,
    },
  };
}

/**
 * Main migration pipeline function.
 * Accepts any raw configuration input and produces a strictly conforming,
 * versioned TemplateConfig object.
 */
export function migrateTemplateConfig(rawConfig: unknown): TemplateConfig {
  if (!rawConfig || typeof rawConfig !== 'object' || Array.isArray(rawConfig)) {
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      theme: clone(DEFAULT_TEMPLATE_THEME),
      sections: clone(DEFAULT_TEMPLATE_SECTIONS),
    };
  }

  const configObj = rawConfig as Record<string, unknown>;

  // 1. Normalize Theme
  const theme = normalizeTheme(configObj.theme);

  // 2. Normalize Sections
  let sections: TemplateSection[];
  if (Array.isArray(configObj.sections) && configObj.sections.length > 0) {
    sections = configObj.sections.map((s, idx) => normalizeSection(s, idx));
  } else {
    sections = clone(DEFAULT_TEMPLATE_SECTIONS);
  }

  // 3. Return upgraded config with current schema version
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    theme,
    sections,
  };
}

/**
 * Alias for migrateTemplateConfig to preserve backward compatibility.
 */
export const ensureValidConfig = migrateTemplateConfig;
