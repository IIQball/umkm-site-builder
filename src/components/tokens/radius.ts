/**
 * Centralized Design System Radius Tokens (SSOT)
 * Border Radius Scales & Geometric Helpers (Nested & Pill Formulas)
 */

export const RADIUS_STEPS = [0, 4, 8, 12, 16, 20, 24, 32, 9999] as const;
export type RadiusStep = (typeof RADIUS_STEPS)[number];

export const RADIUS_PRESETS = [
  { label: 'None (0px)', value: 0 },
  { label: 'Small (4px)', value: 4 },
  { label: 'Base (8px)', value: 8 },
  { label: 'Medium (12px)', value: 12 },
  { label: 'Large (16px)', value: 16 },
  { label: 'XL (20px)', value: 20 },
  { label: '2XL (24px)', value: 24 },
  { label: '3XL (32px)', value: 32 },
  { label: 'Full / Pill (9999px)', value: 9999 },
] as const;

export const radiusTokens = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
} as const;

export type RadiusTokenKey = keyof typeof radiusTokens;

/**
 * Concentric corner rule for nested radius:
 * R_inner = max(0, R_outer - Padding)
 */
export function calculateNestedRadius(outerRadiusPx: number, paddingPx: number): number {
  return Math.max(0, outerRadiusPx - paddingPx);
}

/**
 * Full pill border radius:
 * R = Height / 2
 */
export function calculatePillRadius(heightPx: number): number {
  return Math.round(heightPx / 2);
}
