/**
 * Kaan Kiziltug Radical Minimalism Logo Design Ruleset
 * Tailored for Indonesian UMKM (Pinoka SaaS Platform)
 */

export const CATEGORY_RED_FLAGS = {
  culinary: [
    'chef hats',
    'crossed spoon and fork',
    'cartoon smiling plates',
    'cartoon animal chefs',
    'literal cooking pots or flame bowls',
  ],
  coffee: [
    'cliché steaming coffee cup with wavy steam lines',
    'generic scattered coffee beans',
    'literal coffee mugs',
    'coffee bean coffee cup hybrid',
  ],
  retail: [
    'generic paper or plastic shopping bags',
    'grocery shopping carts or trolleys',
    'wire clothing hangers',
    'generic barcode or price tags',
  ],
  processed_goods: [
    'generic leaf clipart',
    'complex botanical drawings with micro-veins',
    'rainbow farm landscapes',
  ],
  services: [
    'generic handshake clipart',
    'generic gear wheels',
    'crossed wrench and hammer',
  ],
  general: [
    'clipart style illustrations',
    'intricate photorealistic textures',
    'thin delicate hairlines that disappear at small scale',
    'generic leaves or globes',
    'complex 3D renders',
  ],
} as const;

export const MARK_TYPES = {
  LETTERFORM_MONOGRAM: {
    name: 'Letterform/Monogram',
    description:
      'Geometric monogram created from brand initials, employing bold negative space geometry and architectural balance.',
  },
  PICTORIAL_SYMBOL: {
    name: 'Pictorial Symbol',
    description:
      'Radical minimalist symbolic icon capturing the brand soul through pure geometric abstraction, avoiding literal clichés.',
  },
  MASCOT_SILHOUETTE: {
    name: 'Mascot Silhouette',
    description:
      'Sturdy graphic silhouette or geometric vector profile with zero micro-facial lines, zero cartoon eyes, and pure solid shapes.',
  },
  NEO_HERITAGE_MINIMALIST: {
    name: 'Neo-Heritage Minimalist',
    description:
      'Indonesian cultural heritage motifs (batik, tenun, nusantara crafts) distilled into ultra-modern, clean geometric vector lines.',
  },
} as const;

export type MarkTypeKey = keyof typeof MARK_TYPES;

export const SCALABILITY_16PX_RULES = [
  'Sturdy, confident silhouette with solid visual mass',
  'Zero micro-details, zero intricate textures, zero fine filigree',
  'High visual contrast between positive mark and negative space',
  'Flawlessly legible and instantly recognizable at 16x16px favicon scale',
  'Safe for circular crop in WhatsApp profile avatar without clipped elements',
] as const;

export const COLOR_DISCIPLINE_RULES = [
  'Strict maximum of 2 to 3 solid flat colors (including brand hue and pure white background)',
  'Zero 3D gradients, zero drop shadows, zero glossy plastic reflections, zero skeuomorphism',
  'Must pass the 1-color stamp test: 100% identifiable when printed as a monochrome single-color stamp',
] as const;

export const UMKM_COLOR_PALETTES = {
  WARM_TERRACOTTA: 'Terracotta (#C85A32), Warm Cream (#F7F4EE), and Deep Charcoal',
  COFFEE_HERITAGE: 'Deep Espresso Brown, Warm Beige, and Solid Cream',
  BOTANICAL_NATURE: 'Earthy Forest Green, Soft Olive, and Warm White',
  MODERN_NAVY: 'Deep Royal Navy, Crisp Off-White, and Muted Gold Accent',
  MONOCHROME_STAMP: 'Single-color solid black (#000000) on pure white background (#FFFFFF)',
} as const;

/**
 * Resolves forbidden cliché symbols based on store category.
 */
export function getCategoryRedFlags(category: string): string[] {
  const normalized = category.toLowerCase().trim();

  if (
    normalized.includes('kopi') ||
    normalized.includes('coffee') ||
    normalized.includes('cafe') ||
    normalized.includes('kafe')
  ) {
    return [...CATEGORY_RED_FLAGS.coffee, ...CATEGORY_RED_FLAGS.general];
  }

  if (
    normalized.includes('kuliner') ||
    normalized.includes('makan') ||
    normalized.includes('food') ||
    normalized.includes('resto') ||
    normalized.includes('bakery') ||
    normalized.includes('warung')
  ) {
    return [...CATEGORY_RED_FLAGS.culinary, ...CATEGORY_RED_FLAGS.general];
  }

  if (
    normalized.includes('ritel') ||
    normalized.includes('retail') ||
    normalized.includes('fashion') ||
    normalized.includes('baju') ||
    normalized.includes('toko') ||
    normalized.includes('shop') ||
    normalized.includes('kelontong')
  ) {
    return [...CATEGORY_RED_FLAGS.retail, ...CATEGORY_RED_FLAGS.general];
  }

  if (
    normalized.includes('olahan') ||
    normalized.includes('herbal') ||
    normalized.includes('jamu') ||
    normalized.includes('tani') ||
    normalized.includes('kebun')
  ) {
    return [...CATEGORY_RED_FLAGS.processed_goods, ...CATEGORY_RED_FLAGS.general];
  }

  if (
    normalized.includes('jasa') ||
    normalized.includes('service') ||
    normalized.includes('bengkel') ||
    normalized.includes('laundry') ||
    normalized.includes('salon')
  ) {
    return [...CATEGORY_RED_FLAGS.services, ...CATEGORY_RED_FLAGS.general];
  }

  return [...CATEGORY_RED_FLAGS.general];
}

/**
 * Resolves mark type guidance based on style preference or fallback.
 */
export function resolveMarkTypeGuide(visualStyle?: string): string {
  if (!visualStyle) {
    return `${MARK_TYPES.PICTORIAL_SYMBOL.name}: ${MARK_TYPES.PICTORIAL_SYMBOL.description}`;
  }

  const normalized = visualStyle.toLowerCase();
  if (normalized.includes('monogram') || normalized.includes('letter')) {
    return `${MARK_TYPES.LETTERFORM_MONOGRAM.name}: ${MARK_TYPES.LETTERFORM_MONOGRAM.description}`;
  }
  if (normalized.includes('mascot') || normalized.includes('maskot')) {
    return `${MARK_TYPES.MASCOT_SILHOUETTE.name}: ${MARK_TYPES.MASCOT_SILHOUETTE.description}`;
  }
  if (
    normalized.includes('heritage') ||
    normalized.includes('batik') ||
    normalized.includes('tradisional') ||
    normalized.includes('nusantara')
  ) {
    return `${MARK_TYPES.NEO_HERITAGE_MINIMALIST.name}: ${MARK_TYPES.NEO_HERITAGE_MINIMALIST.description}`;
  }

  return `${MARK_TYPES.PICTORIAL_SYMBOL.name}: ${MARK_TYPES.PICTORIAL_SYMBOL.description}`;
}

/**
 * Master System Prompt embedding Kaan Kiziltug design principles for gpt-4o-mini.
 */
export const KAAN_KIZILTUG_SYSTEM_PROMPT = `You are a world-class brand identity designer adhering strictly to Kaan Kiziltug's radical minimalism.
You generate precise, high-performance text-to-image prompts in English for crafting timeless UMKM brand logos.

CORE DESIGN RULES:
1. SCALABILITY AT 16PX:
   - Sturdy, confident vector silhouette with bold negative space.
   - Zero micro-details, zero fine lines, zero intricate decorative patterns.
   - Highly legible at 16x16px favicon and circular WhatsApp avatar.

2. COLOR DISCIPLINE:
   - Maximum 2 to 3 solid flat colors.
   - Strictly NO 3D gradients, NO drop shadows, NO glossy plastic highlights, NO bevels.
   - Must pass the 1-color stamp test (flawless in monochrome black).

3. FORBIDDEN CLICHÉS (Category Red Flags):
   - Food/Culinary: NO chef hats, NO crossed forks/spoons, NO smiling cartoon plates.
   - Coffee: NO cliché steaming mugs with wavy steam lines, NO generic scattered coffee beans.
   - Retail: NO generic shopping bags, NO wire hangers, NO shopping carts.

4. MANDATORY KEYWORDS & SPECS:
   - Must explicitly mandate: flat vector, negative space, pure white background, and the brand name.

OUTPUT CONSTRAINTS:
- Return ONLY the raw technical prompt string in English.
- NO conversational filler (never say "Here is your prompt", "Sure", etc.).
- NO surrounding quotation marks.
- NO markdown formatting or code blocks.`;
