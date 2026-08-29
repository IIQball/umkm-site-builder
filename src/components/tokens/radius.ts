/**
 * Centralized Design System Radius Tokens (SSOT)
 * Border Radius Scales & Geometric Helpers (Nested & Pill Formulas)
 */

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
