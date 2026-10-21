import { getOpenAIClient, handleOpenAIError, OPENAI_IMAGE_REQUEST_OPTIONS } from '@/lib/openai';
import { withOpenAiRetry } from '@/lib/resilience/openai-retry';
import { isModelOrParameterRejection } from './model-adapter';
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
 * If OpenAI API rejects the custom model or parameters, falls back to official dall-e-3 adapter.
 * Configured with 120s timeout and 0 automatic retries to prevent duplicate billing.
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
    const response = await withOpenAiRetry(
      () =>
        client.images.generate(
          {
            model,
            prompt: sanitizedPrompt,
            size: DEFAULT_SIZE,
            quality,
            background: DEFAULT_BACKGROUND,
            output_format: DEFAULT_OUTPUT_FORMAT,
          },
          OPENAI_IMAGE_REQUEST_OPTIONS
        ),
      { maxRetries: 0 }
    );

    const imageData = response.data?.[0]?.b64_json || response.data?.[0]?.url;
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
    if (isModelOrParameterRejection(error)) {
      // eslint-disable-next-line no-console
      console.warn(
        `[LogoGenerator] Custom model '${model}' rejected by OpenAI API. Adapting to official OpenAI model (dall-e-3)...`
      );
      try {
        const fallbackResponse = await withOpenAiRetry(
          () =>
            client.images.generate(
              {
                model: 'dall-e-3',
                prompt: sanitizedPrompt,
                size: '1024x1024',
                quality: quality === 'high' ? 'hd' : 'standard',
                response_format: 'b64_json',
              },
              OPENAI_IMAGE_REQUEST_OPTIONS
            ),
          { maxRetries: 0 }
        );

        const fallbackData = fallbackResponse.data?.[0]?.b64_json || fallbackResponse.data?.[0]?.url;
        if (!fallbackData) {
          throw new Error('OpenAI returned no image data in b64_json format');
        }

        return {
          base64: fallbackData,
          format: 'png',
          inputTokens: 0,
          outputTokens: 0,
        };
      } catch (fallbackError: unknown) {
        throw handleOpenAIError(fallbackError);
      }
    }

    throw handleOpenAIError(error);
  }
}
