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
