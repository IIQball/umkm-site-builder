import type { TemplateTheme } from '@/schemas';
import { calculateGoldenRatioTypography } from '@/lib/utils/designMath';

export const buildCanvasCssVars = (
  theme: TemplateTheme,
  isDarkPreview: boolean,
  viewMode: 'desktop' | 'tablet' | 'mobile'
): string => {
  const colors = theme.colors || {};
  const typography = theme.typography || {};
  const buttons = theme.buttons || {};
  const layout = theme.layout || {};

  const baseFontSize = parseInt(String(typography.body?.fontSize || '16'), 10) || 16;
  const goldenRatio = calculateGoldenRatioTypography(baseFontSize);

  const primaryColor = colors.primary || '#2563eb';
  const headingFont = typography.headingFont || "'League Spartan', 'Poppins', system-ui, -apple-system, sans-serif";
  const bodyFont = typography.bodyFont || "'Poppins', system-ui, -apple-system, sans-serif";

  return [
    // SSOT Semantic Variables
    `--font-heading: ${headingFont}`,
    `--font-family: ${bodyFont}`,
    `--color-primary: ${primaryColor}`,
    `--color-primary-dark: #1d4ed8`,
    `--color-primary-light: #3b82f6`,
    `--color-bg-base: ${isDarkPreview ? '#0b0f19' : (colors.background || '#f8fafc')}`,
    `--color-card-base: ${isDarkPreview ? '#111827' : (colors.surface || '#ffffff')}`,
    `--color-nested-base: ${isDarkPreview ? '#1f2937' : '#f1f5f9'}`,
    `--color-text-main: ${isDarkPreview ? '#f8fafc' : (colors.textPrimary || '#0f172a')}`,
    `--color-text-secondary: ${isDarkPreview ? '#cbd5e1' : '#334155'}`,
    `--color-text-muted: ${isDarkPreview ? '#94a3b8' : (colors.textMuted || '#64748b')}`,
    `--color-border: ${isDarkPreview ? 'rgba(248, 250, 252, 0.07)' : 'rgba(15, 23, 42, 0.08)'}`,
    `--color-border-light: ${isDarkPreview ? 'rgba(248, 250, 252, 0.04)' : 'rgba(15, 23, 42, 0.05)'}`,

    // Theme Compatibility Tokens
    `--theme-primary: ${primaryColor}`,
    `--theme-secondary: ${colors.secondary || '#64748b'}`,
    `--theme-bg: ${isDarkPreview ? '#0b0f19' : (colors.background || '#f8fafc')}`,
    `--theme-surface: ${isDarkPreview ? '#111827' : (colors.surface || '#ffffff')}`,
    `--theme-text-primary: ${isDarkPreview ? '#f8fafc' : (colors.textPrimary || '#0f172a')}`,
    `--theme-text-muted: ${isDarkPreview ? '#94a3b8' : (colors.textMuted || '#64748b')}`,
    `--theme-font-heading: ${headingFont}`,
    `--theme-font-body: ${bodyFont}`,
    `--theme-text-h1: ${typography.h1?.fontSize || `${goldenRatio.h1}px`}`,
    `--theme-text-h2: ${typography.h2?.fontSize || `${goldenRatio.h2}px`}`,
    `--theme-text-h3: ${typography.h3?.fontSize || `${goldenRatio.h3}px`}`,
    `--theme-text-body: ${typography.body?.fontSize || `${goldenRatio.body}px`}`,
    `--theme-text-caption: ${typography.caption?.fontSize || `${goldenRatio.caption}px`}`,
    `--theme-btn-height: 40px`,
    `--theme-btn-radius: ${buttons.borderRadius || '16px'}`,
    `--theme-btn-primary-bg: ${buttons.primary?.backgroundColor || primaryColor}`,
    `--theme-btn-primary-text: ${buttons.primary?.textColor || '#ffffff'}`,
    `--theme-btn-secondary-bg: ${buttons.secondary?.backgroundColor || '#f1f5f9'}`,
    `--theme-btn-secondary-text: ${buttons.secondary?.textColor || '#0f172a'}`,
    `--theme-btn-outline-border: ${buttons.outline?.borderColor || primaryColor}`,
    `--theme-btn-outline-text: ${buttons.outline?.textColor || primaryColor}`,
    `--theme-grid-gutter: 24px`,
    `--theme-max-width: ${layout.maxWidth || '1200px'}`,
    `--theme-safe-zone-desktop: ${layout.horizontalMarginDesktop || '32px'}`,
    `--theme-safe-zone-tablet: ${layout.horizontalMarginTablet || '24px'}`,
    `--theme-safe-zone-mobile: ${layout.horizontalMarginMobile || '16px'}`,
    `--active-safe-zone: ${viewMode === 'mobile' ? (layout.horizontalMarginMobile || '16px') : viewMode === 'tablet' ? (layout.horizontalMarginTablet || '24px') : (layout.horizontalMarginDesktop || '32px')}`,
    `--active-margin: ${viewMode === 'mobile' ? (layout.horizontalMarginMobile || '16px') : viewMode === 'tablet' ? (layout.horizontalMarginTablet || '24px') : (layout.horizontalMarginDesktop || '32px')}`,
    `--theme-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)`,
    `--theme-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)`,
    `--theme-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)`,
  ].join('; ');
};
