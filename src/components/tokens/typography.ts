/**
 * Centralized Design System Typography Tokens (SSOT)
 * Font Families, Golden Ratio Scale (Phi = 1.618), Weights, and Line Heights
 */

export const PHI = 1.618;

export const fonts = {
  heading: "'League Spartan', 'Poppins', system-ui, -apple-system, sans-serif",
  sans: "'Poppins', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
} as const;

export const FONT_FAMILIES = [
  'League Spartan',
  'Poppins',
  'Inter',
  'Plus Jakarta Sans',
  'DM Sans',
  'Outfit',
  'Montserrat',
  'Manrope',
  'Urbanist',
  'Figtree',
  'Space Grotesk',
  'Work Sans',
  'Raleway',
  'Open Sans',
  'Roboto',
  'Sora',
  'Playfair Display',
  'Merriweather',
  'Lora',
  'Cormorant Garamond',
  'Cinzel',
  'Bodoni Moda',
  'Fraunces',
  'DM Serif Display',
  'JetBrains Mono',
  'Space Mono',
  'System Sans',
  'System Serif',
] as const;
export type FontFamily = (typeof FONT_FAMILIES)[number];

export const FONT_FAMILY_OPTIONS = [
  { label: 'League Spartan (SSOT Default Heading)', value: "'League Spartan', 'Poppins', system-ui, -apple-system, sans-serif", sublabel: 'Sans-Serif • Bold Geometric', style: "font-family: 'League Spartan', sans-serif;" },
  { label: 'Poppins (SSOT Default Body)', value: "'Poppins', system-ui, -apple-system, sans-serif", sublabel: 'Sans-Serif • Friendly & Balanced', style: "font-family: 'Poppins', sans-serif;" },
  { label: 'Inter (Clean & Modern UI)', value: 'Inter, system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • Neutral High-Legibility', style: "font-family: 'Inter', sans-serif;" },
  { label: 'Plus Jakarta Sans (Geometric Modern)', value: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • Modern SaaS & Corporate', style: "font-family: 'Plus Jakarta Sans', sans-serif;" },
  { label: 'DM Sans (Contemporary Clean)', value: '"DM Sans", system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • Low Contrast Geometric', style: "font-family: 'DM Sans', sans-serif;" },
  { label: 'Outfit (Trendy Minimal)', value: 'Outfit, system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • Modern Display & Branding', style: "font-family: 'Outfit', sans-serif;" },
  { label: 'Montserrat (Punchy Urban)', value: 'Montserrat, system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • Bold Urban Geometric', style: "font-family: 'Montserrat', sans-serif;" },
  { label: 'Manrope (Modern Semi-Geometric)', value: 'Manrope, system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • Clean Tech & Startup', style: "font-family: 'Manrope', sans-serif;" },
  { label: 'Urbanist (Minimalist Geometric)', value: 'Urbanist, system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • Elegant Low Contrast', style: "font-family: 'Urbanist', sans-serif;" },
  { label: 'Figtree (Friendly & Crisp)', value: 'Figtree, system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • Humanist Modern UI', style: "font-family: 'Figtree', sans-serif;" },
  { label: 'Space Grotesk (Tech Neo-Grotesque)', value: '"Space Grotesk", system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • Trendy Creative & Web3', style: "font-family: 'Space Grotesk', sans-serif;" },
  { label: 'Work Sans (Screen Optimized)', value: '"Work Sans", system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • Early Grotesque Legibility', style: "font-family: 'Work Sans', sans-serif;" },
  { label: 'Raleway (Stylized & Elegant)', value: 'Raleway, system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • Elegant Headings', style: "font-family: 'Raleway', sans-serif;" },
  { label: 'Open Sans (Universal Neutral)', value: '"Open Sans", system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • Classic Web Reading', style: "font-family: 'Open Sans', sans-serif;" },
  { label: 'Roboto (Neutral Sans)', value: 'Roboto, system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • Android Clean Modern', style: "font-family: 'Roboto', sans-serif;" },
  { label: 'Sora (Clarity Geometric)', value: 'Sora, system-ui, -apple-system, sans-serif', sublabel: 'Sans-Serif • High-Legibility Tech', style: "font-family: 'Sora', sans-serif;" },
  { label: 'Playfair Display (Luxury Editorial)', value: "'Playfair Display', Georgia, serif", sublabel: 'Serif • High-Contrast Luxury', style: "font-family: 'Playfair Display', serif;" },
  { label: 'Merriweather (Screen Editorial)', value: 'Merriweather, Georgia, serif', sublabel: 'Serif • Warm High-Legibility', style: "font-family: 'Merriweather', serif;" },
  { label: 'Lora (Calligraphic Contemporary)', value: 'Lora, Georgia, serif', sublabel: 'Serif • Balanced & Literary', style: "font-family: 'Lora', serif;" },
  { label: 'Cormorant Garamond (High Elegance)', value: '"Cormorant Garamond", Garamond, serif', sublabel: 'Serif • Classical Garamond Revival', style: "font-family: 'Cormorant Garamond', serif;" },
  { label: 'Cinzel (Classical Roman)', value: 'Cinzel, Georgia, serif', sublabel: 'Serif • Classical Roman Luxury', style: "font-family: 'Cinzel', serif;" },
  { label: 'Bodoni Moda (Ultra-Fashion Didone)', value: '"Bodoni Moda", Georgia, serif', sublabel: 'Serif • Fashion & Boutique Headings', style: "font-family: 'Bodoni Moda', serif;" },
  { label: 'Fraunces (Expressive Vintage)', value: 'Fraunces, Georgia, serif', sublabel: 'Serif • Warm Personality Vintage', style: "font-family: 'Fraunces', serif;" },
  { label: 'DM Serif Display (Punchy Serif)', value: '"DM Serif Display", Georgia, serif', sublabel: 'Serif • High-Impact Display', style: "font-family: 'DM Serif Display', serif;" },
  { label: 'JetBrains Mono (Code & Data)', value: "'JetBrains Mono', monospace", sublabel: 'Monospace • Developer & Technical', style: "font-family: 'JetBrains Mono', monospace;" },
  { label: 'Space Mono (Retro Tech)', value: '"Space Mono", monospace', sublabel: 'Monospace • Geometric Retro Tech', style: "font-family: 'Space Mono', monospace;" },
  { label: 'System Sans (Native OS)', value: 'system-ui, -apple-system, sans-serif', sublabel: 'System • Native OS Sans-Serif', style: "font-family: system-ui, sans-serif;" },
  { label: 'System Serif (Native Classic)', value: "Georgia, Cambria, 'Times New Roman', serif", sublabel: 'System • Native OS Serif', style: "font-family: Georgia, serif;" },
] as const;

export const typographyScale = {
  h1: {
    size: '2.625rem', // 42px
    mobileSize: '2.125rem', // 34px
    lineHeight: '1.05',
    letterSpacing: '-0.04em',
    weight: '700',
    font: fonts.heading,
  },
  h2: {
    size: '1.625rem', // 26px
    mobileSize: '1.375rem', // 22px
    lineHeight: '1.15',
    letterSpacing: '-0.03em',
    weight: '700',
    font: fonts.heading,
  },
  h3: {
    size: '1.25rem', // 20px
    mobileSize: '1.125rem', // 18px
    lineHeight: '1.25',
    letterSpacing: '-0.02em',
    weight: '600',
    font: fonts.heading,
  },
  body: {
    size: '1rem', // 16px
    mobileSize: '0.875rem', // 14px
    lineHeight: '1.45',
    letterSpacing: '0',
    weight: '400',
    font: fonts.sans,
  },
  bodySm: {
    size: '0.8125rem', // 13px
    mobileSize: '0.75rem', // 12px
    lineHeight: '1.4',
    letterSpacing: '0',
    weight: '400',
    font: fonts.sans,
  },
  caption: {
    size: '0.625rem', // 10px
    mobileSize: '0.5625rem', // 9px
    lineHeight: '1.2',
    letterSpacing: '0.18em',
    weight: '700',
    textTransform: 'uppercase',
    font: fonts.heading,
  },
} as const;

export const FONT_SIZES = [
  { label: 'Caption / Badge (10px)', value: 'var(--theme-text-caption, 10px)' },
  { label: 'Body Text (16px)', value: 'var(--theme-text-body, 16px)' },
  { label: 'H3 - Subtitle / Card (20px)', value: 'var(--theme-text-h3, 20px)' },
  { label: 'H2 - Section Heading (26px)', value: 'var(--theme-text-h2, 26px)' },
  { label: 'H1 - Hero Title (42px)', value: 'var(--theme-text-h1, 42px)' },
] as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export const FONT_WEIGHTS = [
  { label: 'Normal (400)', value: '400' },
  { label: 'Medium (500)', value: '500' },
  { label: 'Semi Bold (600)', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: 'Extra Bold (800)', value: '800' },
] as const;

export const TYPOGRAPHY_SCALES = [
  { tag: 'h1', label: 'H1 (Hero Display)', defaultSize: '42px', defaultWeight: '700' },
  { tag: 'h2', label: 'H2 (Section Heading)', defaultSize: '26px', defaultWeight: '700' },
  { tag: 'h3', label: 'H3 (Card Heading)', defaultSize: '20px', defaultWeight: '600' },
  { tag: 'body', label: 'Body Text', defaultSize: '16px', defaultWeight: '400' },
  { tag: 'caption', label: 'Caption / Badge', defaultSize: '10px', defaultWeight: '700' },
] as const;
