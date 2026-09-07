import { describe, it, expect } from 'vitest';
import { buildCanvasCssVars } from '@/components/builder/canvas/canvasCss.helpers';
import { buildUpdatedTheme } from '@/components/builder/stores/documentStore.actions';
import { extractFontNames, buildGoogleFontsUrl } from '@/components/builder/canvas/fontLoader.helpers';
import { DEFAULT_TEMPLATE_THEME } from '@/schemas';

describe('Global Design System & Reactive Canvas CSS Engine', () => {
  describe('buildCanvasCssVars', () => {
    it('generates all semantic color tokens, typography scales, buttons, and responsive layout vars', () => {
      const customTheme = {
        ...DEFAULT_TEMPLATE_THEME,
        colors: {
          ...DEFAULT_TEMPLATE_THEME.colors,
          primary: '#ff5b35',
          background: '#fafafa',
          surface: '#ffffff',
          textPrimary: '#111827',
          textMuted: '#6b7280',
        },
        typography: {
          ...DEFAULT_TEMPLATE_THEME.typography,
          headingFont: "'Outfit', sans-serif",
          bodyFont: "'Inter', sans-serif",
          h1: { fontSize: '48px', fontWeight: '800' },
        },
        buttons: {
          ...DEFAULT_TEMPLATE_THEME.buttons,
          borderRadius: '24px',
          primary: {
            backgroundColor: '#ff5b35',
            textColor: '#ffffff',
          },
        },
        layout: {
          maxWidth: '1280px',
          horizontalMarginDesktop: '40px',
          horizontalMarginTablet: '24px',
          horizontalMarginMobile: '16px',
        },
      };

      const cssVarsDesktop = buildCanvasCssVars(customTheme, false, 'desktop');

      // Semantic Colors
      expect(cssVarsDesktop).toContain('--color-primary: #ff5b35');
      expect(cssVarsDesktop).toContain('--color-bg-base: #fafafa');
      expect(cssVarsDesktop).toContain('--color-text-main: #111827');

      // Fonts
      expect(cssVarsDesktop).toContain("--font-heading: 'Outfit', sans-serif");
      expect(cssVarsDesktop).toContain("--font-family: 'Inter', sans-serif");

      // Scales
      expect(cssVarsDesktop).toContain('--text-h1-size: 48px');
      expect(cssVarsDesktop).toContain('--text-h1-weight: 800');

      // Buttons
      expect(cssVarsDesktop).toContain('--btn-radius: 24px');
      expect(cssVarsDesktop).toContain('--btn-primary-bg: #ff5b35');
      expect(cssVarsDesktop).toContain('--btn-primary-text: #ffffff');

      // Layout Desktop
      expect(cssVarsDesktop).toContain('--active-max-width: 1280px');
      expect(cssVarsDesktop).toContain('--active-safe-zone: 40px');

      // Layout Mobile
      const cssVarsMobile = buildCanvasCssVars(customTheme, false, 'mobile');
      expect(cssVarsMobile).toContain('--active-safe-zone: 16px');
    });

    it('generates dark mode colors when isDarkPreview is true', () => {
      const darkVars = buildCanvasCssVars(DEFAULT_TEMPLATE_THEME, true, 'desktop');
      expect(darkVars).toContain('--color-bg-base: #0b0f19');
      expect(darkVars).toContain('--color-card-base: #111827');
      expect(darkVars).toContain('--color-text-main: #f8fafc');
    });
  });

  describe('buildUpdatedTheme deep merging', () => {
    it('deeply merges typography tags without wiping out existing font weights or sizes', () => {
      const current = {
        ...DEFAULT_TEMPLATE_THEME,
        typography: {
          ...DEFAULT_TEMPLATE_THEME.typography,
          h1: { fontSize: '42px', fontWeight: '700', lineHeight: '1.2' },
        },
      };

      const updated = buildUpdatedTheme(current, {
        typography: {
          h1: { fontSize: '50px' },
        } as unknown as typeof DEFAULT_TEMPLATE_THEME['typography'],
      });

      expect(updated.typography?.h1?.fontSize).toBe('50px');
      expect(updated.typography?.h1?.fontWeight).toBe('700');
      expect(updated.typography?.h1?.lineHeight).toBe('1.2');
    });
  });

  describe('Google Fonts Helpers', () => {
    it('extracts font family names cleanly from CSS font stack strings', () => {
      const names = extractFontNames("'League Spartan', 'Poppins', system-ui, -apple-system, sans-serif");
      expect(names).toEqual(['League Spartan', 'Poppins']);
    });

    it('builds valid Google Fonts URL for requested font families', () => {
      const url = buildGoogleFontsUrl(['League Spartan', 'Poppins']);
      expect(url).toContain('https://fonts.googleapis.com/css2?');
      expect(url).toContain('family=League+Spartan');
      expect(url).toContain('family=Poppins');
    });

    it('returns null if only system fallback fonts are requested', () => {
      const url = buildGoogleFontsUrl(['system-ui', 'sans-serif']);
      expect(url).toBeNull();
    });
  });
});
