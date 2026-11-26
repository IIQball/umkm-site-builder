/**
 * Dynamic Google Fonts Loader for Builder Canvas
 * Injects or updates the <link rel="stylesheet"> tag in document head
 * when heading or body fonts are updated in the Design System Inspector.
 */

const KNOWN_GOOGLE_FONTS: Record<string, string> = {
  'league spartan': 'League+Spartan:wght@400;500;600;700;800;900',
  'poppins': 'Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500',
  'inter': 'Inter:wght@400;500;600;700',
  'plus jakarta sans': 'Plus+Jakarta+Sans:wght@400;500;600;700;800',
  'dm sans': 'DM+Sans:wght@400;500;600;700',
  'outfit': 'Outfit:wght@400;500;600;700',
  'playfair display': 'Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700',
  'merriweather': 'Merriweather:wght@300;400;700',
  'montserrat': 'Montserrat:wght@400;500;600;700;800',
  'roboto': 'Roboto:wght@300;400;500;700',
  'open sans': 'Open+Sans:wght@400;500;600;700',
  'manrope': 'Manrope:wght@400;500;600;700',
  'urbanist': 'Urbanist:wght@400;500;600;700',
  'figtree': 'Figtree:wght@400;500;600;700',
  'space grotesk': 'Space+Grotesk:wght@400;500;600;700',
  'work sans': 'Work+Sans:wght@400;500;600;700',
  'raleway': 'Raleway:wght@400;500;600;700',
  'sora': 'Sora:wght@400;500;600;700',
  'lora': 'Lora:ital,wght@0,400;0,600;1,400',
  'cormorant garamond': 'Cormorant+Garamond:wght@400;600;700',
  'cinzel': 'Cinzel:wght@400;600;700',
  'bodoni moda': 'Bodoni+Moda:ital,wght@0,400;0,600;0,700;1,400',
  'fraunces': 'Fraunces:wght@400;600;700',
  'dm serif display': 'DM+Serif+Display',
  'jetbrains mono': 'JetBrains+Mono:wght@400;500;700',
  'space mono': 'Space+Mono:wght@400;700',
};

const SYSTEM_FALLBACKS = new Set([
  'system-ui',
  '-apple-system',
  'blinkmacsystemfont',
  'sans-serif',
  'serif',
  'monospace',
  'ui-monospace',
  'arial',
  'helvetica',
  'times new roman',
  'georgia',
  'courier new',
]);

/**
 * Extracts clean primary font family names from CSS font stack string.
 * Example: "'League Spartan', 'Poppins', sans-serif" => ["League Spartan", "Poppins"]
 */
export function extractFontNames(fontStack: string): string[] {
  if (!fontStack) return [];
  return fontStack
    .split(',')
    .map((f) => f.trim().replace(/^['"]+|['"]+$/g, ''))
    .filter((f) => f && !SYSTEM_FALLBACKS.has(f.toLowerCase()));
}

/**
 * Builds a valid Google Fonts CSS URL for requested font names.
 */
export function buildGoogleFontsUrl(fontNames: string[]): string | null {
  const families: string[] = [];

  for (const name of fontNames) {
    const key = name.toLowerCase();
    const config = KNOWN_GOOGLE_FONTS[key];
    if (config) {
      if (!families.includes(config)) {
        families.push(config);
      }
    } else if (!SYSTEM_FALLBACKS.has(key)) {
      // Default weight config for any other valid font name
      const formatted = `${encodeURIComponent(name).replace(/%20/g, '+')}:wght@400;500;600;700`;
      if (!families.includes(formatted)) {
        families.push(formatted);
      }
    }
  }

  if (families.length === 0) return null;

  return `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join('&')}&display=swap`;
}

/**
 * Injects or updates dynamic Google Fonts <link> in document head.
 */
export function loadDynamicGoogleFonts(headingFont?: string, bodyFont?: string): void {
  if (typeof document === 'undefined') return;

  const fontNames = [
    ...extractFontNames(headingFont || ''),
    ...extractFontNames(bodyFont || ''),
  ];

  const fontUrl = buildGoogleFontsUrl(fontNames);
  if (!fontUrl) return;

  let linkEl = document.getElementById('builder-dynamic-google-fonts') as HTMLLinkElement | null;
  if (!linkEl) {
    linkEl = document.createElement('link');
    linkEl.id = 'builder-dynamic-google-fonts';
    linkEl.rel = 'stylesheet';
    document.head.appendChild(linkEl);
  }

  if (linkEl.href !== fontUrl) {
    linkEl.href = fontUrl;
  }
}

/**
 * Preloads all curated design system fonts into document head
 * so that font picker options preview accurately in their native styles.
 */
export function preloadDesignSystemFonts(): void {
  if (typeof document === 'undefined') return;
  const allKnown = Object.keys(KNOWN_GOOGLE_FONTS);
  const fontUrl = buildGoogleFontsUrl(allKnown);
  if (!fontUrl) return;

  let linkEl = document.getElementById('builder-preview-google-fonts') as HTMLLinkElement | null;
  if (!linkEl) {
    linkEl = document.createElement('link');
    linkEl.id = 'builder-preview-google-fonts';
    linkEl.rel = 'stylesheet';
    document.head.appendChild(linkEl);
  }

  if (linkEl.href !== fontUrl) {
    linkEl.href = fontUrl;
  }
}
