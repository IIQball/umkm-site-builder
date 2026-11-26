/**
 * AI Model Adapter & Fallback Helper
 * Handles mapping between internal model identifiers (e.g. gpt-image-2.5-flare / sunburst)
 * and official OpenAI image generation models (dall-e-3 / dall-e-2) when public API rejects internal aliases.
 */

const MODEL_REJECTION_PATTERNS = [
  'does not exist',
  'not exist',
  'not found',
  'invalid_model',
  'unsupported model',
  'unknown parameter',
  'extra inputs are not permitted',
  'unrecognized request argument',
  'model_not_found',
  'invalid_value',
];

/**
 * Checks whether an OpenAI error is caused by a rejected model name or unsupported parameter.
 * Strictly excludes moderation policy flags, rate limits, or billing quota exhaustions.
 */
export function isModelOrParameterRejection(error: unknown): boolean {
  if (!error) return false;

  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();

  // Guard against non-model errors
  if (
    lower.includes('content moderation') ||
    lower.includes('policy') ||
    lower.includes('quota') ||
    lower.includes('rate limit') ||
    lower.includes('insufficient_quota')
  ) {
    return false;
  }

  return MODEL_REJECTION_PATTERNS.some((pattern) => lower.includes(pattern));
}

/**
 * Maps an internal image model identifier to an official OpenAI model name.
 */
export function mapToOfficialOpenAiModel(model?: string): 'dall-e-3' | 'dall-e-2' | string {
  if (!model) return 'dall-e-3';
  if (model === 'gpt-image-2.5-sunburst' || model === 'gpt-image-2.5-flare') {
    return 'dall-e-3';
  }
  return model;
}
