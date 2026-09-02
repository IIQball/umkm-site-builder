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

  return [
    `--theme-primary: ${colors.primary || '#3b82f6'}`,
    `--theme-secondary: ${colors.secondary || '#64748b'}`,
    `--theme-bg: ${isDarkPreview ? '#090d16' : (colors.background || '#ffffff')}`,
    `--theme-surface: ${isDarkPreview ? '#111827' : (colors.surface || '#f8fafc')}`,
    `--theme-text-primary: ${isDarkPreview ? '#f8fafc' : (colors.textPrimary || '#0f172a')}`,
    `--theme-text-muted: ${isDarkPreview ? '#94a3b8' : (colors.textMuted || '#64748b')}`,
    `--theme-font-heading: ${typography.headingFont || 'Inter, sans-serif'}`,
    `--theme-font-body: ${typography.bodyFont || 'Inter, sans-serif'}`,
    `--theme-text-h1: ${typography.h1?.fontSize || `${goldenRatio.h1}px`}`,
    `--theme-text-h2: ${typography.h2?.fontSize || `${goldenRatio.h2}px`}`,
    `--theme-text-h3: ${typography.h3?.fontSize || `${goldenRatio.h3}px`}`,
    `--theme-text-body: ${typography.body?.fontSize || `${goldenRatio.body}px`}`,
    `--theme-text-caption: ${typography.caption?.fontSize || `${goldenRatio.caption}px`}`,
    `--theme-btn-height: 40px`,
    `--theme-btn-radius: ${buttons.borderRadius || '8px'}`,
    `--theme-btn-primary-bg: ${buttons.primary?.backgroundColor || colors.primary || '#3b82f6'}`,
    `--theme-btn-primary-text: ${buttons.primary?.textColor || '#ffffff'}`,
    `--theme-btn-secondary-bg: ${buttons.secondary?.backgroundColor || '#f1f5f9'}`,
    `--theme-btn-secondary-text: ${buttons.secondary?.textColor || '#0f172a'}`,
    `--theme-btn-outline-border: ${buttons.outline?.borderColor || colors.primary || '#3b82f6'}`,
    `--theme-btn-outline-text: ${buttons.outline?.textColor || colors.primary || '#3b82f6'}`,
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
