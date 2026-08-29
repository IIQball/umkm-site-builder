/**
 * Centralized Design System Spacing Tokens (SSOT)
 * Standard 8pt Spacing Grid & Container Padding / Breakpoint Constraints
 */

export const spacingGrid = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const safeZones = {
  desktop: '32px',
  tablet: '24px',
  mobile: '16px',
} as const;

export const containerMaxWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  '2xl': '1400px',
} as const;
