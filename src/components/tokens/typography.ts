/**
 * Centralized Design System Typography Tokens (SSOT)
 * Font Families, Golden Ratio Scale (Phi = 1.618), Weights, and Line Heights
 */

export const PHI = 1.618;

export const fonts = {
  heading: "'League Spartan', 'Poppins', system-ui, -apple-system, sans-serif",
  sans: "'Poppins', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
} as const;

export const FONT_FAMILIES = [
  'League Spartan',
  'Poppins',
  'Inter',
  'Plus Jakarta Sans',
  'DM Sans',
  'Outfit',
  'Playfair Display',
  'Merriweather',
  'Montserrat',
  'Roboto',
  'JetBrains Mono',
  'System Sans',
] as const;
export type FontFamily = (typeof FONT_FAMILIES)[number];

export const FONT_FAMILY_OPTIONS = [
  { label: 'League Spartan (SSOT Default Heading)', value: "'League Spartan', 'Poppins', system-ui, -apple-system, sans-serif" },
  { label: 'Poppins (SSOT Default Body)', value: "'Poppins', system-ui, -apple-system, sans-serif" },
  { label: 'Inter (Clean & Modern)', value: 'Inter, system-ui, -apple-system, sans-serif' },
  { label: 'Plus Jakarta Sans (Geometric)', value: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif' },
  { label: 'DM Sans (Contemporary)', value: '"DM Sans", system-ui, -apple-system, sans-serif' },
  { label: 'Outfit (Trendy Minimal)', value: 'Outfit, system-ui, -apple-system, sans-serif' },
  { label: 'Playfair Display (Serif/Luxury)', value: "'Playfair Display', Georgia, serif" },
  { label: 'Merriweather (Editorial Serif)', value: 'Merriweather, Georgia, serif' },
  { label: 'Montserrat (Punchy Sans)', value: 'Montserrat, system-ui, -apple-system, sans-serif' },
  { label: 'Roboto (Neutral Sans)', value: 'Roboto, system-ui, -apple-system, sans-serif' },
  { label: 'JetBrains Mono (Code/Tech)', value: "'JetBrains Mono', monospace" },
  { label: 'System Sans', value: 'system-ui, -apple-system, sans-serif' },
] as const;

export const typographyScale = {
  h1: {
    size: '2.625rem', // 42px
    mobileSize: '2.125rem', // 34px
    lineHeight: '1.05',
    letterSpacing: '-0.04em',
    weight: '700',
    font: fonts.heading,
  },
  h2: {
    size: '1.625rem', // 26px
    mobileSize: '1.375rem', // 22px
    lineHeight: '1.15',
    letterSpacing: '-0.03em',
    weight: '700',
    font: fonts.heading,
  },
  h3: {
    size: '1.25rem', // 20px
    mobileSize: '1.125rem', // 18px
    lineHeight: '1.25',
    letterSpacing: '-0.02em',
    weight: '600',
    font: fonts.heading,
  },
  body: {
    size: '1rem', // 16px
    mobileSize: '0.875rem', // 14px
    lineHeight: '1.45',
    letterSpacing: '0',
    weight: '400',
    font: fonts.sans,
  },
  bodySm: {
    size: '0.8125rem', // 13px
    mobileSize: '0.75rem', // 12px
    lineHeight: '1.4',
    letterSpacing: '0',
    weight: '400',
    font: fonts.sans,
  },
  caption: {
    size: '0.625rem', // 10px
    mobileSize: '0.5625rem', // 9px
    lineHeight: '1.2',
    letterSpacing: '0.18em',
    weight: '700',
    textTransform: 'uppercase',
    font: fonts.heading,
  },
} as const;

export const FONT_SIZES = [
  { label: 'Caption / Badge (10px)', value: 'var(--theme-text-caption, 10px)' },
  { label: 'Body Text (16px)', value: 'var(--theme-text-body, 16px)' },
  { label: 'H3 - Subtitle / Card (20px)', value: 'var(--theme-text-h3, 20px)' },
  { label: 'H2 - Section Heading (26px)', value: 'var(--theme-text-h2, 26px)' },
  { label: 'H1 - Hero Title (42px)', value: 'var(--theme-text-h1, 42px)' },
] as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export const FONT_WEIGHTS = [
  { label: 'Normal (400)', value: '400' },
  { label: 'Medium (500)', value: '500' },
  { label: 'Semi Bold (600)', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: 'Extra Bold (800)', value: '800' },
] as const;

export const TYPOGRAPHY_SCALES = [
  { tag: 'h1', label: 'H1 (Hero Display)', defaultSize: '42px', defaultWeight: '700' },
  { tag: 'h2', label: 'H2 (Section Heading)', defaultSize: '26px', defaultWeight: '700' },
  { tag: 'h3', label: 'H3 (Card Heading)', defaultSize: '20px', defaultWeight: '600' },
  { tag: 'body', label: 'Body Text', defaultSize: '16px', defaultWeight: '400' },
  { tag: 'caption', label: 'Caption / Badge', defaultSize: '10px', defaultWeight: '700' },
] as const;
