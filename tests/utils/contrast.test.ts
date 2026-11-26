import { describe, it, expect } from 'vitest';
import {
  normalizeHex,
  hexToRgb,
  rgbToHex,
  getRelativeLuminance,
  getContrastRatio,
  passesWcagAA,
  passesWcagAAA,
  evaluateContrast,
  recommendAccessibleColor,
} from '@/lib/utils/contrast';

describe('WCAG 2.1 Contrast & Accessibility Linter', () => {
  describe('Hex Normalization & RGB Conversion', () => {
    it('normalizes 3-char hex with or without hash prefix', () => {
      expect(normalizeHex('#fff')).toBe('ffffff');
      expect(normalizeHex('000')).toBe('000000');
      expect(normalizeHex('#abc')).toBe('aabbcc');
    });

    it('converts hex to RGB channels correctly', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#0369a1')).toEqual({ r: 3, g: 105, b: 161 });
    });

    it('converts RGB back to hex string correctly', () => {
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
      expect(rgbToHex({ r: 3, g: 105, b: 161 })).toBe('#0369a1');
    });
  });

  describe('Relative Luminance Calculation (W3C standard)', () => {
    it('calculates 0 for pure black and 1 for pure white', () => {
      expect(getRelativeLuminance('#000000')).toBeCloseTo(0, 4);
      expect(getRelativeLuminance('#ffffff')).toBeCloseTo(1, 4);
    });

    it('calculates accurate relative luminance for theme primary colors', () => {
      const lumOldPrimary = getRelativeLuminance('#0284c7');
      const lumNewPrimary = getRelativeLuminance('#0369a1');

      // #0284c7 is lighter than #0369a1
      expect(lumOldPrimary).toBeGreaterThan(lumNewPrimary);
      expect(lumOldPrimary).toBeCloseTo(0.2078, 2);
      expect(lumNewPrimary).toBeCloseTo(0.1252, 2);
    });
  });

  describe('Contrast Ratio & Threshold Evaluation', () => {
    it('calculates 21:1 for black on white', () => {
      expect(getContrastRatio('#000000', '#ffffff')).toBe(21);
      expect(getContrastRatio('#ffffff', '#ffffff')).toBe(1);
    });

    it('proves #0284c7 fails WCAG AA normal text while #0369a1 passes', () => {
      const ratioOld = getContrastRatio('#0284c7', '#ffffff');
      const ratioNew = getContrastRatio('#0369a1', '#ffffff');

      expect(ratioOld).toBeLessThan(4.5);
      expect(passesWcagAA(ratioOld, false)).toBe(false);

      expect(ratioNew).toBeGreaterThanOrEqual(4.5);
      expect(passesWcagAA(ratioNew, false)).toBe(true);
    });

    it('evaluates Level AA and Level AAA thresholds for normal and large text', () => {
      expect(passesWcagAA(4.5, false)).toBe(true);
      expect(passesWcagAA(4.49, false)).toBe(false);
      expect(passesWcagAA(3.0, true)).toBe(true);
      expect(passesWcagAA(2.99, true)).toBe(false);

      expect(passesWcagAAA(7.0, false)).toBe(true);
      expect(passesWcagAAA(6.99, false)).toBe(false);
      expect(passesWcagAAA(4.5, true)).toBe(true);
      expect(passesWcagAAA(4.49, true)).toBe(false);
    });

    it('evaluateContrast returns complete assessment object', () => {
      const evalPass = evaluateContrast('#0369a1', '#ffffff', false);
      expect(evalPass.passesAA).toBe(true);
      expect(evalPass.requiredRatio).toBe(4.5);
      expect(evalPass.grade).toMatch(/AA|AAA/);

      const evalFail = evaluateContrast('#0284c7', '#ffffff', false);
      expect(evalFail.passesAA).toBe(false);
      expect(evalFail.grade).toBe('FAIL');

      const evalLargePass = evaluateContrast('#0284c7', '#ffffff', true);
      expect(evalLargePass.passesAA).toBe(true);
      expect(evalLargePass.grade).toBe('AA Large');
    });
  });

  describe('recommendAccessibleColor Auto-Adjustment', () => {
    it('returns original color if it already meets target ratio', () => {
      const adjusted = recommendAccessibleColor('#0369a1', '#ffffff', 4.5);
      expect(adjusted).toBe('#0369a1');
    });

    it('auto-darkens #0284c7 on light background until >= 4.5:1', () => {
      const adjusted = recommendAccessibleColor('#0284c7', '#ffffff', 4.5);
      const ratio = getContrastRatio(adjusted, '#ffffff');

      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(passesWcagAA(ratio, false)).toBe(true);
    });

    it('auto-lightens dark foreground on dark background until >= 4.5:1', () => {
      const adjusted = recommendAccessibleColor('#1e293b', '#0f172a', 4.5);
      const ratio = getContrastRatio(adjusted, '#0f172a');

      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(passesWcagAA(ratio, false)).toBe(true);
    });
  });
});

