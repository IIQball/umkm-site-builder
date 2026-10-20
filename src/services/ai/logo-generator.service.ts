import { getOpenAIClient, handleOpenAIError } from '@/lib/openai';
import { withOpenAiRetry } from '@/lib/resilience/openai-retry';
import type { GenerateLogoImageOptions, GeneratedLogoResult } from '@/types/ai';

export { type GenerateLogoImageOptions, type GeneratedLogoResult } from '@/types/ai';

const DEFAULT_MODEL = 'gpt-image-2.5-sunburst';
const DEFAULT_SIZE = '1024x1024';
const DEFAULT_QUALITY = 'high';
const DEFAULT_BACKGROUND = 'transparent';
const DEFAULT_OUTPUT_FORMAT = 'png';

/**
 * Generates a high-quality minimalist logo image using OpenAI gpt-image-2.5-sunburst.
 * Enforces transparent background, PNG output format, and 1024x1024 resolution.
 *
 * @param prompt - Technical diffusion prompt describing the logo design
 * @param options - Generation options such as image quality tier ('medium' | 'high')
 * @returns Structured result containing base64 data, format, and token usage
 */
export async function generateLogoImage(
  prompt: string,
  options?: GenerateLogoImageOptions
): Promise<GeneratedLogoResult> {
  const sanitizedPrompt = typeof prompt === 'string' ? prompt.trim() : '';
  if (!sanitizedPrompt) {
    throw new Error('Prompt is required and cannot be empty');
  }

  const client = getOpenAIClient();
  const quality = options?.quality ?? DEFAULT_QUALITY;
  const model = options?.model ?? DEFAULT_MODEL;

  try {
    const response = await withOpenAiRetry(() =>
      client.images.generate({
        model,
        prompt: sanitizedPrompt,
        size: DEFAULT_SIZE,
        quality,
        background: DEFAULT_BACKGROUND,
        output_format: DEFAULT_OUTPUT_FORMAT,
      })
    );

    const imageData = response.data?.[0]?.b64_json;
    if (!imageData) {
      throw new Error('OpenAI returned no image data in b64_json format');
    }

    const inputTokens = response.usage?.input_tokens ?? 0;
    const outputTokens = response.usage?.output_tokens ?? 0;

    return {
      base64: imageData,
      format: 'png',
      inputTokens,
      outputTokens,
    };
  } catch (error: unknown) {
    throw handleOpenAIError(error);
  }
}
