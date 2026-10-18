import { z } from 'zod';
import { getOpenAIClient, handleOpenAIError } from '@/lib/openai';
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
  visualStyle: z.string().trim().optional().transform((val) => (val ? sanitizeText(val) : undefined)),
  colorPalette: z.string().trim().optional().transform((val) => (val ? sanitizeText(val) : undefined)),
});

/**
 * Strips conversational fluff, markdown backticks, and enclosing quotes.
 */
function cleanGeneratedPrompt(raw: string): string {
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

  return prompt;
}

/**
 * Enforces mandatory technical specifications without duplicating them.
 */
function ensureMandatoryKeywords(prompt: string, brandName: string): string {
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

  if (missingSpecs.length > 0) {
    result = `${result}, ${missingSpecs.join(', ')}`;
  }

  // Ensure brand name is referenced if not already present
  if (!result.toLowerCase().includes(brandName.toLowerCase())) {
    result = `${result}, brand: "${brandName}"`;
  }

  return result;
}

/**
 * Builds a radical minimalist logo generation prompt based on Kaan Kiziltug principles.
 * Uses OpenAI gpt-4o-mini with temperature 0.3 and max_tokens 200.
 */
export async function buildLogoPrompt(input: GenerateLogoPromptInput): Promise<string> {
  const validated = validate(generateLogoPromptSchema, input);

  const client = getOpenAIClient();
  const redFlags = getCategoryRedFlags(validated.category);
  const markTypeGuide = resolveMarkTypeGuide(validated.visualStyle);

  const userContent = [
    `Brand Name: "${validated.storeName}"`,
    `Business Category: ${validated.category}`,
    `Mark Type Guidance: ${markTypeGuide}`,
    `Color Palette: ${validated.colorPalette || 'Maximum 2-3 solid flat brand colors, monochrome stamp compatible'}`,
    `Prohibited Elements: ${redFlags.join(', ')}`,
    'Task: Generate a concise, single-sentence technical diffusion prompt in English for a radical minimalist logo.',
  ].join('\n');

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 200,
      messages: [
        { role: 'system', content: KAAN_KIZILTUG_SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
    });

    const rawPrompt = response.choices[0]?.message?.content?.trim();
    if (!rawPrompt) {
      throw new Error('OpenAI returned an empty prompt response');
    }

    const cleaned = cleanGeneratedPrompt(rawPrompt);
    return ensureMandatoryKeywords(cleaned, validated.storeName);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw handleOpenAIError(error);
  }
}
