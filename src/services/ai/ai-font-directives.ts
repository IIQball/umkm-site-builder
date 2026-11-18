/**
 * Precise diffusion prompt directives for Google Fonts used across Pinoka AI Studio.
 * Explicitly instructs diffusion models (DALL-E 3, Recraft, GPT-image) on exact
 * letterform anatomy, classification, and negative prohibitions (e.g. no serifs for sans).
 */
export const FONT_TYPOGRAPHIC_DIRECTIVES: Record<string, string> = {
  'Plus Jakarta Sans':
    'clean modern neo-grotesque sans-serif typography, crisp professional geometric letterforms, uniform clean strokes, strictly NO serifs',
  'Poppins':
    'geometric rounded friendly sans-serif lettering with circular geometric curves, clean uniform monoline strokes, strictly NO serifs, NO slabs',
  'Outfit':
    'contemporary smooth circular geometric sans-serif lettering, soft refined clean minimalist strokes, strictly NO serifs',
  'Space Grotesk':
    'quirky brutalist geometric sans-serif lettering with angular cuts and mechanical proportions, strictly NO serifs',
  'Playfair Display':
    'high-contrast transitional luxury serif typography with delicate hairline serifs and bold thick vertical stems, elegant formal style',
  'Fraunces':
    'warm expressive old-style serif lettering with soft organic curves, vintage character, and distinctive bracketed serifs',
  'Montserrat':
    'geometric bold modern sans-serif typography with clean unbracketed monoline strokes, circular O, strictly NO serifs, NO slabs, NO cursive, NO decorative curled terminals',
  'Inter':
    'neutral modern grotesque sans-serif typography with tall x-height and maximum clarity, strictly NO serifs',
  'Merriweather':
    'sturdy editorial slab-serif lettering with robust thick serifs and balanced classic proportions',
  'Cormorant Garamond':
    'delicate high-contrast classic Venetian serif typography with calligraphic grace and royal elegance',
  'DM Serif Display':
    'dramatic high-contrast display serif typography with razor-sharp delicate serifs and ultra-bold vertical stems',
  'Sora':
    'futuristic crisp geometric sans-serif typography with wide open apertures and clean monoline weight, strictly NO serifs',
};

export function resolveFontDirective(fontName?: string): string {
  if (!fontName) return 'clean modern geometric sans-serif typography, strictly NO serifs';
  return FONT_TYPOGRAPHIC_DIRECTIVES[fontName] || `${fontName} style typography with clean letterforms`;
}
