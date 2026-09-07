/**
 * Centralized Design System Shadows & Elevation Tokens (SSOT)
 */

export const shadowTokens = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
  md: '0 4px 10px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
  lg: '0 10px 20px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
  glow: {
    indigo: '0 10px 25px -5px rgba(85, 81, 255, 0.25)',
    emerald: '0 10px 25px -5px rgba(16, 185, 129, 0.25)',
    amber: '0 10px 25px -5px rgba(245, 158, 11, 0.25)',
    rose: '0 10px 25px -5px rgba(244, 63, 94, 0.25)',
    violet: '0 10px 25px -5px rgba(139, 92, 246, 0.25)',
    sky: '0 10px 25px -5px rgba(14, 165, 233, 0.25)',
  },
} as const;

export type ShadowTokenKey = keyof typeof shadowTokens;

export const SHADOW_PRESETS = [
  { label: 'Tanpa Shadow', value: shadowTokens.none },
  { label: 'Soft Shadow (sm)', value: shadowTokens.xs },
  { label: 'Medium Shadow (md)', value: shadowTokens.md },
  { label: 'Large Shadow (lg)', value: shadowTokens.lg },
] as const;

export type ShadowPreset = (typeof SHADOW_PRESETS)[number];
