import type { TemplateTheme } from '@/schemas'
import { calculateGoldenRatioTypography } from '@/lib/utils/designMath'

export const buildCanvasCssVars = (
  theme: Partial<TemplateTheme> = {},
  isDarkPreview: boolean = false,
  viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): string => {
  const colors = theme?.colors || {}
  const typography = theme?.typography || {}
  const buttons = theme?.buttons || {}
  const layout = theme?.layout || {}

  const baseFontSize = parseInt(String(typography.body?.fontSize || '16'), 10) || 16
  const goldenRatio = calculateGoldenRatioTypography(baseFontSize)

  const primaryColor = colors.primary || (isDarkPreview ? '#00A3EF' : '#36C6FD')
  const secondaryColor = colors.secondary || (isDarkPreview ? '#B90162' : '#FC018B')
  const defaultHeadingFont = "'League Spartan', 'Poppins', system-ui, -apple-system, sans-serif"
  const defaultBodyFont = "'Poppins', system-ui, -apple-system, sans-serif"
  const formatFont = (f?: string, fallback = 'sans-serif') => {
    if (!f) return fallback;
    const clean = f.trim();
    if (clean.includes(',')) return clean;
    return `'${clean.replace(/^['"]+|['"]+$/g, '')}', ${fallback}`;
  };
  const headingFont = formatFont(typography.headingFont, defaultHeadingFont)
  const bodyFont = formatFont(typography.bodyFont, defaultBodyFont)

  // Active Layout Dimensions
  const activeSafeZone = viewMode === 'mobile'
    ? (layout.horizontalMarginMobile || '16px')
    : viewMode === 'tablet'
      ? (layout.horizontalMarginTablet || '24px')
      : (layout.horizontalMarginDesktop || '32px')

  const activeGutter = viewMode === 'desktop' ? '24px' : viewMode === 'tablet' ? '16px' : '12px'
  const activeMaxWidth = layout.maxWidth || '1200px'

  // Typography Scales
  const h1Size = typography.h1?.fontSize || `${goldenRatio.h1}px`
  const h1Weight = typography.h1?.fontWeight || '700'
  const h2Size = typography.h2?.fontSize || `${goldenRatio.h2}px`
  const h2Weight = typography.h2?.fontWeight || '700'
  const h3Size = typography.h3?.fontSize || `${goldenRatio.h3}px`
  const h3Weight = typography.h3?.fontWeight || '600'
  const bodySize = typography.body?.fontSize || `${goldenRatio.body}px`
  const bodyWeight = typography.body?.fontWeight || '400'
  const captionSize = typography.caption?.fontSize || `${goldenRatio.caption}px`
  const captionWeight = typography.caption?.fontWeight || '700'

  // Button Values (Following Button.ts: Primary = full color, Secondary = outline, Tertiary = underline text)
  const btnRadius = buttons.borderRadius || '8px'
  const btnPrimaryBg = primaryColor
  const btnPrimaryText = buttons.primary?.textColor || '#ffffff'
  const btnSecondaryBg = 'transparent'
  const btnSecondaryBorder = isDarkPreview ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.15)'
  const btnSecondaryText = buttons.secondary?.textColor || buttons.outline?.textColor || (isDarkPreview ? '#f8fafc' : '#0f172a')
  const btnOutlineBorder = btnSecondaryBorder
  const btnOutlineText = btnSecondaryText
  const btnTertiaryText = buttons.tertiary?.textColor || (isDarkPreview ? '#cbd5e1' : '#334155')

  return [
    // 1. Semantic Color Tokens
    `--color-primary: ${primaryColor}`,
    `--color-primary-dark: ${isDarkPreview ? '#0284c7' : '#00A2EE'}`,
    `--color-primary-light: ${isDarkPreview ? '#36C6FD' : '#7dd3fc'}`,
    `--color-secondary: ${secondaryColor}`,
    `--color-bg-base: ${isDarkPreview ? '#0b0f19' : (colors.background || '#ffffff')}`,
    `--color-card-base: ${isDarkPreview ? '#111827' : (colors.surface || '#ffffff')}`,
    `--color-nested-base: ${isDarkPreview ? '#1f2937' : '#f1f5f9'}`,
    `--color-text-main: ${isDarkPreview ? '#f8fafc' : (colors.textPrimary || '#0f172a')}`,
    `--color-text-secondary: ${isDarkPreview ? '#cbd5e1' : '#334155'}`,
    `--color-text-muted: ${isDarkPreview ? '#94a3b8' : (colors.textMuted || '#64748b')}`,
    `--color-border: ${isDarkPreview ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'}`,
    `--color-border-light: ${isDarkPreview ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)'}`,
    `--color-border-rgb: ${isDarkPreview ? '255 255 255' : '15 23 42'}`,
    `--color-border-light-rgb: ${isDarkPreview ? '255 255 255' : '15 23 42'}`,

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
    `--btn-secondary-border: ${btnSecondaryBorder}`,
    `--btn-secondary-text: ${btnSecondaryText}`,
    `--btn-outline-border: ${btnOutlineBorder}`,
    `--btn-outline-text: ${btnOutlineText}`,
    `--btn-tertiary-text: ${btnTertiaryText}`,

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
    `--theme-btn-secondary-border: ${btnSecondaryBorder}`,
    `--theme-btn-secondary-text: ${btnSecondaryText}`,
    `--theme-btn-outline-border: ${btnOutlineBorder}`,
    `--theme-btn-outline-text: ${btnOutlineText}`,
    `--theme-btn-tertiary-text: ${btnTertiaryText}`,
    `--theme-max-width: ${activeMaxWidth}`,
    `--theme-safe-zone-desktop: ${layout.horizontalMarginDesktop || '32px'}`,
    `--theme-safe-zone-tablet: ${layout.horizontalMarginTablet || '24px'}`,
    `--theme-safe-zone-mobile: ${layout.horizontalMarginMobile || '16px'}`,
  ].join(String.fromCharCode(59) + ' ')
}

/**
 * Generates full CSS rules for storefront pages based on theme colorMode.
 * Supports 'auto' (prefers-color-scheme + html[data-theme]), 'light', or 'dark'.
 */
export const buildStorefrontCssTheme = (theme: Partial<TemplateTheme> = {}): string => {
  const mode = theme?.colorMode || 'auto';
  const lightVars = buildCanvasCssVars(theme, false, 'desktop');
  const darkVars = buildCanvasCssVars(theme, true, 'desktop');

  if (mode === 'light') {
    return `:root { ${lightVars}; }`;
  }

  if (mode === 'dark') {
    return `:root { ${darkVars}; }`;
  }

  return [
    `:root { ${lightVars}; }`,
    `@media (prefers-color-scheme: dark) { :root { ${darkVars}; } }`,
    `html[data-theme="dark"] { ${darkVars}; }`,
    `html[data-theme="light"] { ${lightVars}; }`,
  ].join('\n');
};

