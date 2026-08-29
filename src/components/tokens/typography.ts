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

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;
