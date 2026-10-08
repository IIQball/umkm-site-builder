/**
 * Design System Mathematical Helper Functions
 */

/**
 * Calculates nested border radius using the concentric corner rule:
 * R_inner = max(0, R_outer - Padding)
 */
export function calculateNestedRadius(outerRadiusPx: number, paddingPx: number): number {
  return Math.max(0, outerRadiusPx - paddingPx);
}

/**
 * Calculates full pill border radius:
 * R = Height / 2
 */
export function calculatePillRadius(heightPx: number): number {
  return Math.round(heightPx / 2);
}

/**
 * Calculates typography scale based on the Golden Ratio (phi = 1.618)
 * from base font size (default: 16px).
 */
export function calculateGoldenRatioTypography(baseFont: number = 16) {
  const phi = 1.618;
  return {
    h1: Math.round(baseFont * phi * phi), // ~42px for 16px
    h2: Math.round(baseFont * phi),        // ~26px for 16px
    h3: Math.round(baseFont * 1.25),       // ~20px for 16px
    body: baseFont,                        // 16px
    caption: Math.round(baseFont / phi),   // ~10px for 16px
  };
}

/**
 * Determines whether a color hex string is perceptually dark based on HSP / luminance formula.
 */
export function isDarkColor(color?: unknown): boolean {
  if (typeof color !== 'string' || !color || color === 'transparent') return false;
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16) || 0;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }
  return false;
}

