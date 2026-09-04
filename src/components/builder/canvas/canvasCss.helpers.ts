import type { TemplateTheme } from '@/schemas';
import { calculateGoldenRatioTypography } from '@/lib/utils/designMath';

export const buildCanvasCssVars = (
  theme: TemplateTheme,
  isDarkPreview: boolean,
  viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): string => {
  const colors = theme?.colors || {};
  const typography = theme?.typography || {};
  const buttons = theme?.buttons || {};
  const layout = theme?.layout || {};

  const baseFontSize = parseInt(String(typography.body?.fontSize || '16'), 10) || 16;
  const goldenRatio = calculateGoldenRatioTypography(baseFontSize);

  const primaryColor = colors.primary || '#3b82f6';
  const secondaryColor = colors.secondary || '#64748b';
  const headingFont = typography.headingFont || "'League Spartan', 'Poppins', system-ui, -apple-system, sans-serif";
  const bodyFont = typography.bodyFont || "'Poppins', system-ui, -apple-system, sans-serif";

  // Active Layout Dimensions
  const activeSafeZone = viewMode === 'mobile'
    ? (layout.horizontalMarginMobile || '16px')
    : viewMode === 'tablet'
      ? (layout.horizontalMarginTablet || '24px')
      : (layout.horizontalMarginDesktop || '32px');

  const activeGutter = viewMode === 'desktop' ? '24px' : viewMode === 'tablet' ? '16px' : '12px';
  const activeMaxWidth = layout.maxWidth || '1200px';

  // Typography Scales
  const h1Size = typography.h1?.fontSize || `${goldenRatio.h1}px`;
  const h1Weight = typography.h1?.fontWeight || '700';
  const h2Size = typography.h2?.fontSize || `${goldenRatio.h2}px`;
  const h2Weight = typography.h2?.fontWeight || '700';
  const h3Size = typography.h3?.fontSize || `${goldenRatio.h3}px`;
  const h3Weight = typography.h3?.fontWeight || '600';
  const bodySize = typography.body?.fontSize || `${goldenRatio.body}px`;
  const bodyWeight = typography.body?.fontWeight || '400';
  const captionSize = typography.caption?.fontSize || `${goldenRatio.caption}px`;
  const captionWeight = typography.caption?.fontWeight || '700';

  // Button Values
  const btnRadius = buttons.borderRadius || '16px';
  const btnPrimaryBg = buttons.primary?.backgroundColor || primaryColor;
  const btnPrimaryText = buttons.primary?.textColor || '#ffffff';
  const btnSecondaryBg = buttons.secondary?.backgroundColor || (isDarkPreview ? '#1f2937' : '#f1f5f9');
  const btnSecondaryText = buttons.secondary?.textColor || (isDarkPreview ? '#f8fafc' : '#0f172a');
  const btnOutlineBorder = buttons.outline?.borderColor || primaryColor;
  const btnOutlineText = buttons.outline?.textColor || primaryColor;

  return [
    // 1. Semantic Color Tokens
    `--color-primary: ${primaryColor}`,
    `--color-primary-dark: #1d4ed8`,
    `--color-primary-light: #3b82f6`,
    `--color-secondary: ${secondaryColor}`,
    `--color-bg-base: ${isDarkPreview ? '#0b0f19' : (colors.background || '#ffffff')}`,
    `--color-card-base: ${isDarkPreview ? '#111827' : (colors.surface || '#ffffff')}`,
    `--color-nested-base: ${isDarkPreview ? '#1f2937' : '#f1f5f9'}`,
    `--color-text-main: ${isDarkPreview ? '#f8fafc' : (colors.textPrimary || '#0f172a')}`,
    `--color-text-secondary: ${isDarkPreview ? '#cbd5e1' : '#334155'}`,
    `--color-text-muted: ${isDarkPreview ? '#94a3b8' : (colors.textMuted || '#64748b')}`,
    `--color-border: ${isDarkPreview ? 'rgba(248, 250, 252, 0.07)' : 'rgba(15, 23, 42, 0.08)'}`,
    `--color-border-light: ${isDarkPreview ? 'rgba(248, 250, 252, 0.04)' : 'rgba(15, 23, 42, 0.05)'}`,

    // 2. Font Family Tokens
    `--font-heading: ${headingFont}`,
    `--font-family: ${bodyFont}`,
    `--font-sans: ${bodyFont}`,

    // 3. Typography Scale & Weight Tokens
    `--text-h1-size: ${h1Size}`,
    `--text-h1-weight: ${h1Weight}`,
    `--text-h2-size: ${h2Size}`,
    `--text-h2-weight: ${h2Weight}`,
    `--text-h3-size: ${h3Size}`,
    `--text-h3-weight: ${h3Weight}`,
    `--text-body-size: ${bodySize}`,
    `--text-body-weight: ${bodyWeight}`,
    `--text-caption-size: ${captionSize}`,
    `--text-caption-weight: ${captionWeight}`,

    // 4. Button & Radius Tokens
    `--btn-radius: ${btnRadius}`,
    `--btn-primary-bg: ${btnPrimaryBg}`,
    `--btn-primary-text: ${btnPrimaryText}`,
    `--btn-secondary-bg: ${btnSecondaryBg}`,
    `--btn-secondary-text: ${btnSecondaryText}`,
    `--btn-outline-border: ${btnOutlineBorder}`,
    `--btn-outline-text: ${btnOutlineText}`,

    // 5. Layout & Safe Zone Dimensions
    `--active-max-width: ${activeMaxWidth}`,
    `--active-safe-zone: ${activeSafeZone}`,
    `--active-gutter: ${activeGutter}`,
    `--active-margin: ${activeSafeZone}`,

    // 6. Theme Aliases for Full Backward Compatibility
    `--theme-primary: ${primaryColor}`,
    `--theme-secondary: ${secondaryColor}`,
    `--theme-bg: ${isDarkPreview ? '#0b0f19' : (colors.background || '#ffffff')}`,
    `--theme-surface: ${isDarkPreview ? '#111827' : (colors.surface || '#ffffff')}`,
    `--theme-text-primary: ${isDarkPreview ? '#f8fafc' : (colors.textPrimary || '#0f172a')}`,
    `--theme-text-muted: ${isDarkPreview ? '#94a3b8' : (colors.textMuted || '#64748b')}`,
    `--theme-font-heading: ${headingFont}`,
    `--theme-font-body: ${bodyFont}`,
    `--theme-text-h1: ${h1Size}`,
    `--theme-text-h2: ${h2Size}`,
    `--theme-text-h3: ${h3Size}`,
    `--theme-text-body: ${bodySize}`,
    `--theme-text-caption: ${captionSize}`,
    `--theme-btn-radius: ${btnRadius}`,
    `--theme-btn-primary-bg: ${btnPrimaryBg}`,
    `--theme-btn-primary-text: ${btnPrimaryText}`,
    `--theme-btn-secondary-bg: ${btnSecondaryBg}`,
    `--theme-btn-secondary-text: ${btnSecondaryText}`,
    `--theme-btn-outline-border: ${btnOutlineBorder}`,
    `--theme-btn-outline-text: ${btnOutlineText}`,
    `--theme-max-width: ${activeMaxWidth}`,
    `--theme-safe-zone-desktop: ${layout.horizontalMarginDesktop || '32px'}`,
    `--theme-safe-zone-tablet: ${layout.horizontalMarginTablet || '24px'}`,
    `--theme-safe-zone-mobile: ${layout.horizontalMarginMobile || '16px'}`,
  ].join('; ');
};
