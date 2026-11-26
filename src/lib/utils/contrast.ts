/**
 * WCAG 2.1 Color Contrast & Accessibility Linter
 * Implements official W3C relative luminance and contrast ratio algorithms.
 * Specification: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */

export interface ContrastEvaluation {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  requiredRatio: number;
  grade: 'AAA' | 'AA' | 'AA Large' | 'FAIL';
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Normalizes hex string into 6-character lowercase hex without '#' prefix.
 */
export function normalizeHex(hex: string): string {
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  return clean.padEnd(6, '0').slice(0, 6).toLowerCase();
}

/**
 * Parses a hex color string into RGB integer channels [0, 255].
 */
export function hexToRgb(hex: string): RGB {
  const normalized = normalizeHex(hex);
  return {
    r: parseInt(normalized.slice(0, 2), 16) || 0,
    g: parseInt(normalized.slice(2, 4), 16) || 0,
    b: parseInt(normalized.slice(4, 6), 16) || 0,
  };
}

/**
 * Formats RGB channels into standard #rrggbb hex string.
 */
export function rgbToHex(rgb: RGB): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Calculates normalized linear channel value according to sRGB linearization formula.
 */
function linearizeChannel(val: number): number {
  const c = val / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calculates relative luminance (L) of an sRGB color as defined by W3C WCAG 2.1.
 * Returns a value in [0, 1] where Black is 0 and White is 1.
 */
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const rLinear = linearizeChannel(r);
  const gLinear = linearizeChannel(g);
  const bLinear = linearizeChannel(b);
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculates WCAG 2.1 contrast ratio between two colors: (L1 + 0.05) / (L2 + 0.05).
 * Returns a value in range [1, 21].
 */
export function getContrastRatio(colorA: string, colorB: string): number {
  const lumA = getRelativeLuminance(colorA);
  const lumB = getRelativeLuminance(colorB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Checks if a contrast ratio satisfies WCAG 2.1 Level AA threshold.
 * - Normal text requires >= 4.5:1
 * - Large/Bold text (>= 18pt or >= 14pt bold) requires >= 3.0:1
 */
export function passesWcagAA(ratio: number, isLargeText: boolean = false): boolean {
  const threshold = isLargeText ? 3.0 : 4.5;
  return ratio >= threshold;
}

/**
 * Checks if a contrast ratio satisfies WCAG 2.1 Level AAA threshold.
 * - Normal text requires >= 7.0:1
 * - Large/Bold text requires >= 4.5:1
 */
export function passesWcagAAA(ratio: number, isLargeText: boolean = false): boolean {
  const threshold = isLargeText ? 4.5 : 7.0;
  return ratio >= threshold;
}

/**
 * Evaluates contrast between foreground and background against WCAG standards.
 */
export function evaluateContrast(
  foregroundHex: string,
  backgroundHex: string,
  isLargeText: boolean = false
): ContrastEvaluation {
  const ratio = getContrastRatio(foregroundHex, backgroundHex);
  const requiredRatio = isLargeText ? 3.0 : 4.5;
  const passesAA = passesWcagAA(ratio, isLargeText);
  const passesAAA = passesWcagAAA(ratio, isLargeText);

  let grade: ContrastEvaluation['grade'] = 'FAIL';
  if (passesAAA) grade = 'AAA';
  else if (passesAA) grade = isLargeText ? 'AA Large' : 'AA';

  return {
    ratio,
    passesAA,
    passesAAA,
    requiredRatio,
    grade,
  };
}

/**
 * Automatically adjusts a foreground color to meet a target contrast ratio against background.
 * Darkens or lightens using linear interpolation until target ratio is achieved.
 */
export function recommendAccessibleColor(
  foregroundHex: string,
  backgroundHex: string,
  targetRatio: number = 4.5
): string {
  const currentRatio = getContrastRatio(foregroundHex, backgroundHex);
  if (currentRatio >= targetRatio) {
    return foregroundHex.startsWith('#') ? foregroundHex.toLowerCase() : `#${foregroundHex.toLowerCase()}`;
  }

  const bgLum = getRelativeLuminance(backgroundHex);
  const shouldDarken = bgLum > 0.5;
  const rgb = hexToRgb(foregroundHex);

  // Binary search stepping for optimal luminance adjustment (max 20 iterations)
  let low = 0;
  let high = 1;
  let bestColor = shouldDarken ? '#000000' : '#ffffff';

  for (let i = 0; i < 20; i++) {
    const factor = (low + high) / 2;
    const adjustedRgb: RGB = shouldDarken
      ? {
          r: Math.round(rgb.r * (1 - factor)),
          g: Math.round(rgb.g * (1 - factor)),
          b: Math.round(rgb.b * (1 - factor)),
        }
      : {
          r: Math.round(rgb.r + (255 - rgb.r) * factor),
          g: Math.round(rgb.g + (255 - rgb.g) * factor),
          b: Math.round(rgb.b + (255 - rgb.b) * factor),
        };

    const candidateHex = rgbToHex(adjustedRgb);
    const candidateRatio = getContrastRatio(candidateHex, backgroundHex);

    if (candidateRatio >= targetRatio) {
      bestColor = candidateHex;
      high = factor; // Try less adjustment
    } else {
      low = factor; // Need stronger adjustment
    }
  }

  return bestColor;
}

