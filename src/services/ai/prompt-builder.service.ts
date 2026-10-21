import { z } from 'zod';
import { getOpenAIClient, handleOpenAIError } from '@/lib/openai';
import { withOpenAiRetry } from '@/lib/resilience/openai-retry';
import { ValidationError, validate } from '@/lib/utils/validation';
import { sanitizeText } from '@/lib/utils/format';
import {
  KAAN_KIZILTUG_SYSTEM_PROMPT,
  getCategoryRedFlags,
  resolveMarkTypeGuide,
} from './rules/logo-design-rules';
import type { GenerateLogoPromptInput } from '@/types/ai';

export { type GenerateLogoPromptInput } from '@/types/ai';

/**
 * Cliché trigger words that lead to cartoon mascots, literal clipart, and domestic tropes.
 */
export const CARTOON_CLICHE_TRIGGERS = [
  'princess',
  'queen',
  'king',
  'prince',
  'girl',
  'woman',
  'boy',
  'man',
  'crown',
  'tiara',
  'food',
  'dish',
  'plate',
  'bowl',
  'mascot',
  'face',
  'smiling',
  'cartoon',
  'chef hat',
] as const;

/**
 * Validation schema for GenerateLogoPromptInput
 */
export const generateLogoPromptSchema = z.object({
  storeName: z
    .string({ required_error: 'Store name is required' })
    .trim()
    .min(1, 'Store name is required and cannot be empty')
    .max(100, 'Store name must be under 100 characters')
    .transform(sanitizeText),
  category: z
    .string({ required_error: 'Category is required' })
    .trim()
    .min(1, 'Category is required and cannot be empty')
    .default('General Store')
    .transform(sanitizeText),
  conceptType: z.string().trim().optional().transform((val) => (val ? sanitizeText(val) : undefined)),
  businessCategory: z.string().trim().optional().transform((val) => (val ? sanitizeText(val) : undefined)),
  logoText: z.string().trim().optional().transform((val) => (val ? sanitizeText(val) : undefined)),
  visualStyle: z.string().trim().optional().transform((val) => (val ? sanitizeText(val) : undefined)),
  colorPalette: z.string().trim().optional().transform((val) => (val ? sanitizeText(val) : undefined)),
  lockupType: z.enum(['icon_only', 'vertical', 'horizontal']).optional(),
  fontFamily: z.string().trim().optional().default('Plus Jakarta Sans'),
  focalSubject: z.string().trim().max(30).optional().transform((val) => (val ? sanitizeText(val) : undefined)),
});

/**
 * Strips conversational fluff, markdown backticks, raw brand references, and cartoon clichés.
 */
export function cleanGeneratedPrompt(raw: string, storeName?: string, logoText?: string): string {
  let prompt = raw
    .replace(/^```[a-z]*\n?/i, '')
    .replace(/\n?```$/i, '')
    .trim();

  // Strip wrapping double or single quotes
  if (
    (prompt.startsWith('"') && prompt.endsWith('"')) ||
    (prompt.startsWith("'") && prompt.endsWith("'"))
  ) {
    prompt = prompt.slice(1, -1).trim();
  }

  // Strip conversational preambles
  prompt = prompt
    .replace(/^(here is (the|a|your) prompt:?|prompt:?|sure!?:?)\s*/i, '')
    .replace(/^["']+|["']+$/g, '')
    .trim();

  // Strip literal brand quotes or brand prefixes (e.g., for "Store", brand: "Store")
  // but preserve allowed wordmark lockup if specified
  prompt = prompt
    .replace(/(?:for\s+brand|brand:?|for)\s*["'][^"']+["']/gi, '')
    .trim();

  // Strip raw store name if explicitly present and different from logoText
  if (storeName && storeName.trim()) {
    const escaped = storeName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!logoText || logoText.trim().toLowerCase() !== storeName.trim().toLowerCase()) {
      const storeRegex = new RegExp(`(?:for|brand:?)\\s*"?${escaped}"?|"${escaped}"`, 'gi');
      prompt = prompt.replace(storeRegex, '').trim();
    }
  }

  // Strip cartoon clichés and literal object words
  for (const trigger of CARTOON_CLICHE_TRIGGERS) {
    const triggerRegex = new RegExp(`\\b${trigger}\\b`, 'gi');
    prompt = prompt.replace(triggerRegex, '');
  }

  // Clean trailing/double commas and excessive spaces
  return prompt
    .replace(/,\s*,/g, ',')
    .replace(/^\s*,\s*|,\s*$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Enforces mandatory technical specifications without duplicating them or appending raw brand names.
 */
export function ensureMandatoryKeywords(prompt: string, hasLogoText = false): string {
  let result = prompt;
  const lower = result.toLowerCase();

  const missingSpecs: string[] = [];
  if (!lower.includes('flat vector')) {
    missingSpecs.push('flat vector');
  }
  if (!lower.includes('negative space')) {
    missingSpecs.push('negative space');
  }
  if (!lower.includes('pure white background')) {
    missingSpecs.push('pure white background');
  }
  if (!hasLogoText && !lower.includes('no text')) {
    missingSpecs.push('no text');
  }
  if (!lower.includes('single geometric symbol') && !lower.includes('geometric symbol')) {
    missingSpecs.push('single geometric symbol');
  }

  if (missingSpecs.length > 0) {
    result = `${result}, ${missingSpecs.join(', ')}`;
  }

  return result
    .replace(/,\s*,/g, ',')
    .replace(/^\s*,\s*|,\s*$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Builds a radical minimalist logo generation prompt based on Kaan Kiziltug principles.
 * Uses OpenAI gpt-4o-mini with temperature 0.3 and max_tokens 200.
 */
export async function buildLogoPrompt(input: GenerateLogoPromptInput): Promise<string> {
  const validated = validate(generateLogoPromptSchema, input);

  const client = getOpenAIClient();
  const effectiveCategory = validated.businessCategory || validated.category;
  const redFlags = getCategoryRedFlags(effectiveCategory);
  const markTypeGuide = resolveMarkTypeGuide(validated.conceptType || validated.visualStyle);
  const hasLogoText = Boolean(validated.logoText && validated.logoText.trim());
  const effectiveLockupType = !hasLogoText || validated.lockupType === 'icon_only'
    ? 'icon_only'
    : (validated.lockupType || 'vertical');
  const isIconOnly = effectiveLockupType === 'icon_only';
  const effectiveFont = validated.fontFamily || 'Plus Jakarta Sans';

  let lockupDirective = '';
  if (effectiveLockupType === 'icon_only') {
    lockupDirective =
      'LOCKUP PROPORTIONS (Icon Only): Isolated central symbol occupying 50%-55% of canvas area with at least 22.5% clean empty whitespace on all borders. Strictly 0 text, NO letters, NO words.';
  } else if (effectiveLockupType === 'vertical') {
    lockupDirective = `LOCKUP PROPORTIONS (Vertical Stacked): Central symbol height 40% of canvas, wordmark cap-height 10% of canvas (exact 4:1 golden ratio), vertical gap between symbol and wordmark 20% of symbol height, minimum 45% total clean whitespace. Wordmark typography: clean bold typesetting in '${effectiveFont}' font: "${validated.logoText?.trim()}".`;
  } else {
    lockupDirective = `LOCKUP PROPORTIONS (Horizontal Side-by-Side): Symbol height 26% of canvas, wordmark cap-height 13% of canvas (exact 2:1 ratio), horizontal gap 35% of symbol width, total lockup width maximum 70% of canvas with 15% left/right margins. Wordmark typography: clean bold typesetting in '${effectiveFont}' font: "${validated.logoText?.trim()}".`;
  }

  let systemPrompt = KAAN_KIZILTUG_SYSTEM_PROMPT;
  if (validated.focalSubject) {
    systemPrompt += `\n\nUSER FOCAL SUBJECT DIRECTIVE:
- User specified focal subject: "${validated.focalSubject}".
- Translate any Indonesian terms into precise English visual concepts (e.g. 'ayam jago' -> rooster, 'daun kopi' -> coffee leaf).
- Apply Swiss reductionism: transform this object into a flat planar geometric silhouette or negative space form.
- Strictly FORBIDDEN to draw realistic fur/feather textures, cartoon eyes, or realistic textures of this object.`;
  }

  const userContent = [
    `Brand Context (Internal Only): "${validated.storeName}"`,
    `Business Category: ${effectiveCategory}`,
    `Mark Type Guidance: ${markTypeGuide}`,
    `Concept Type: ${validated.conceptType || 'pictorial_symbol'}`,
    `Lockup Layout: ${effectiveLockupType}`,
    `Typography Font: ${effectiveFont}`,
    `Lockup Specifications: ${lockupDirective}`,
    `Focal Subject: ${validated.focalSubject ? `"${validated.focalSubject}"` : 'None (Use default category and concept type)'}`,
    `Logo Wordmark Text: ${!isIconOnly ? `"${validated.logoText?.trim()}" (typeset in ${effectiveFont} font)` : 'None (Strictly NO text, pure symbol only)'}`,
    `Color Palette: ${validated.colorPalette || 'Maximum 2-3 solid flat brand colors, monochrome stamp compatible'}`,
    `Prohibited Elements: ${redFlags.join(', ')}`,
    ...(validated.focalSubject
      ? [
          'SPECIFIC FOCAL SUBJECT DIRECTIVE:',
          `- Anchor Object: "${validated.focalSubject}". Translate Indonesian terms to English visual primitives.`,
          '- Swiss Reductionism: Reduce this object into flat planar geometry or negative space silhouette.',
          '- Strict Prohibition: Do NOT draw feather/fur textures, cartoon eyes, or realistic detail. Keep purely flat planar.',
        ]
      : [
          'RADICAL SWISS ABSTRACTION & VISUAL HOOK DIRECTIVE:',
          '- Analyze Category + Brand + Mark Type to create 1 concrete, clever visual hook uniting them.',
          '- If Letter Fusion: Take initial letter of brand and fuse in negative space or shared geometry with 1 iconic category object.',
          '- If Animal Silhouette: Form an iconic animal profile from bold flat geometric planes (like Loafwright or Bramble Vet), strictly no cartoon facial features.',
          '- If Pictorial Symbol: Geometrically reduce 1 iconic object from the category into pure flat vector primitives.',
          '- If Abstract Mark: Modern geometric glyph with meaningful negative space.',
        ]),
    '- DO NOT include raw store name in quotes or say for "Brand".',
    '- STRICTLY FORBIDDEN to use literal cartoon trigger words: princess, queen, king, girl, woman, crown, food, dish, plate, bowl, mascot, face.',
    '- 100% canvas focus on central high-contrast flat vector glyph on pure white background (#FFFFFF).',
    !isIconOnly
      ? `- Include clean bold wordmark lockup typeset in '${effectiveFont}' according to specified lockup proportions.`
      : '- Mandate strictly NO text, NO letters, NO words.',
    'Task: Generate a concise, single-sentence technical diffusion prompt in English describing ONLY the pure geometric shapes, negative space, colors, and mandatory specs.',
  ].join('\n');

  try {
    const response = await withOpenAiRetry(() =>
      client.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 200,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
      })
    );

    const rawPrompt = response.choices[0]?.message?.content?.trim();
    if (!rawPrompt) {
      throw new Error('OpenAI returned an empty prompt response');
    }

    const cleaned = cleanGeneratedPrompt(rawPrompt, validated.storeName, validated.logoText);
    return ensureMandatoryKeywords(cleaned, hasLogoText);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw handleOpenAIError(error);
  }
}
