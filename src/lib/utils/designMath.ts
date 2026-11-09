/**
 * Design System Mathematical Helper Functions
 */

import { calculateNestedRadius, calculatePillRadius } from '@/components/tokens/radius';
import { hexToRgb } from './contrast';

export { calculateNestedRadius, calculatePillRadius };

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
    const { r, g, b } = hexToRgb(color);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }
  return false;
}


