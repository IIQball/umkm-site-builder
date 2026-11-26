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
    'text or lettering inside the image',
    'human faces or facial features',
    'cartoon mascot tropes',
    'clipart style illustrations',
    'emblem badge frames or shield borders',
    'intricate photorealistic textures',
    'thin delicate hairlines that disappear at small scale',
    'complex 3D renders or gradients',
  ],
} as const;

export const MARK_TYPES = {
  LETTER_FUSION: {
    name: 'Letter Fusion (Letterform + Object)',
    description:
      'Brand initial letterform cleverly fused with a distinct business category object in negative space or shared geometry (e.g., initial H merged with chair, initial T merged with book). Standalone architectural glyph.',
  },
  ANIMAL_CHARACTER: {
    name: 'Animal / Character Silhouette',
    description:
      'Minimalist animal silhouette or graphic character profile constructed strictly from bold geometric flat planes (like Loafwright or Bramble Vet), zero human faces, zero micro-facial lines, zero cartoon eyes.',
  },
  PICTORIAL_SYMBOL: {
    name: 'Pictorial Symbol',
    description:
      'Radical minimalist symbolic mark capturing 1 iconic business category object reduced into pure geometric primitives (arcs, circles, clean angles) and negative space, avoiding literal clipart.',
  },
  ABSTRACT_MARK: {
    name: 'Abstract Geometric Mark',
    description:
      'Modern geometric mark with meaningful negative space and architectural balance conveying phenomena like connection, growth, stability, or flow.',
  },
  // Legacy aliases for backward compatibility
  LETTERFORM_MONOGRAM: {
    name: 'Letterform/Monogram',
    description:
      'Geometric monogram created from brand initials, employing bold negative space geometry and architectural balance. Standalone abstract glyph.',
  },
  MASCOT_SILHOUETTE: {
    name: 'Mascot Silhouette',
    description:
      'Sturdy graphic silhouette or animal vector profile with pure solid shapes, zero human faces, zero micro-facial lines, and zero cartoon eyes.',
  },
  NEO_HERITAGE_MINIMALIST: {
    name: 'Neo-Heritage Minimalist',
    description:
      'Indonesian cultural heritage motifs distilled into ultra-modern, clean geometric vector lines without traditional clutter.',
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

export const CANVAS_DISCIPLINE_RULES = [
  '100% canvas focus on a single isolated, centered geometric symbol mark',
  'Strictly NO text, NO letters, NO words, NO typography inside the image',
  'Strictly NO cartoon mascots, NO human faces, NO clipart, NO emblem or shield borders',
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
export function resolveMarkTypeGuide(styleOrConcept?: string): string {
  if (!styleOrConcept) {
    return `${MARK_TYPES.PICTORIAL_SYMBOL.name}: ${MARK_TYPES.PICTORIAL_SYMBOL.description}`;
  }

  const normalized = styleOrConcept.toLowerCase().trim();
  if (
    normalized === 'letter_fusion' ||
    normalized.includes('fusion') ||
    normalized.includes('monogram') ||
    normalized.includes('letter') ||
    normalized.includes('tipografi')
  ) {
    return `${MARK_TYPES.LETTER_FUSION.name}: ${MARK_TYPES.LETTER_FUSION.description}`;
  }
  if (
    normalized === 'animal_character' ||
    normalized.includes('animal') ||
    normalized.includes('mascot') ||
    normalized.includes('maskot')
  ) {
    return `${MARK_TYPES.ANIMAL_CHARACTER.name}: ${MARK_TYPES.ANIMAL_CHARACTER.description}`;
  }
  if (
    normalized === 'abstract_mark' ||
    normalized.includes('abstract') ||
    normalized.includes('minimalis')
  ) {
    return `${MARK_TYPES.ABSTRACT_MARK.name}: ${MARK_TYPES.ABSTRACT_MARK.description}`;
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
export const KAAN_KIZILTUG_SYSTEM_PROMPT = `You are a world-class brand identity designer adhering strictly to Kaan Kiziltug's radical minimalism and Swiss graphic design principles.
You generate precise, high-performance text-to-image prompts in English for diffusion models (DALL-E 3) to craft timeless brand logos.

CORE DESIGN DIRECTIVES:
1. BRIEF -> VISUAL METAPHOR -> RADICAL SWISS ABSTRACTION:
   - Analyze the Business Category + Brand Concept + Mark Type to create 1 concrete, clever visual hook uniting them.
   - If Concept is 'letter_fusion': Fuse the initial letter of the brand in negative space or shared geometry with 1 iconic object from the category (e.g., initial H merged with chair, initial T merged with book).
   - If Concept is 'animal_character': Form an iconic silhouette of an animal or character from bold flat geometric planes (like Loafwright or Bramble Vet), strictly no cartoon facial features.
   - If Concept is 'pictorial_symbol': Geometrically reduce 1 iconic object from the business category into a flat vector mark.
   - If Concept is 'abstract_mark': Modern geometric glyph with meaningful negative space (connection, growth, flow).
   - NEVER output the raw brand name in quotes or say for "Brand".
   - NEVER output literal cartoon trigger words (e.g. 'princess', 'queen', 'girl', 'woman', 'crown', 'food', 'dish', 'plate', 'bowl').

2. SCALABILITY AT 16PX & CANVAS FOCUS:
   - 100% of the canvas is focused on the central geometric symbol mark with solid visual mass.
   - Ample clean negative space, centered composition, near-square footprint.
   - Flawlessly legible at 16x16px favicon scale and inside circular WhatsApp profile avatars.

3. TYPOGRAPHY & WORDMARK LOCKUP (CONDITIONAL):
   - If short logo text (1-2 words) is specified in user brief, include: 'bold geometric sans-serif wordmark lockup cleanly placed below the central icon'.
   - If NO logo text was requested, strictly mandate: 'no text, no letters, no wordmark, single centered graphic symbol'.

4. COLOR DISCIPLINE:
   - Maximum 2 to 3 solid flat colors on pure white background (#FFFFFF).
   - Strictly NO 3D gradients, NO drop shadows, NO glossy plastic highlights, NO bevels.
   - Must pass the 1-color stamp test: 100% identifiable when printed as a monochrome single-color stamp.

5. FORBIDDEN CLICHÉS:
   - NO chef hats, NO crossed forks/spoons, NO smiling cartoon plates.
   - NO steaming mugs with wavy steam lines, NO generic scattered beans.
   - NO shopping carts, NO wire hangers, NO handshake clipart.

6. MANDATORY KEYWORDS & SPECS:
   - Must mandate: flat vector, negative space, pure white background, single geometric symbol.

OUTPUT CONSTRAINTS:
- Return ONLY the raw technical prompt string in English.
- NO conversational filler. NO surrounding quotation marks. NO markdown.`;
