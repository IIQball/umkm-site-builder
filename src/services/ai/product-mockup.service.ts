import { toFile } from 'openai/uploads';
import { getOpenAIClient, handleOpenAIError } from '@/lib/openai';
import { sanitizeText } from '@/lib/utils/format';
import { uploadBase64Image } from '@/services/media/cloudinary-uploader';

export interface GenerateProductMockupOptions {
  size?: '1024x1024' | '1024x1536';
}

export interface GeneratedProductMockupResult {
  imageUrl: string;
  publicId: string;
  inputTokens: number;
  outputTokens: number;
}

const DEFAULT_MODEL = 'gpt-image-2.5-sunburst';
const DEFAULT_SIZE = '1024x1024';
const CLOUDINARY_MOCKUP_FOLDER = 'pinoka/mockups';

/**
 * Generates an edited product mockup using OpenAI's gpt-image-2.5-sunburst model,
 * uploads the resulting render to Cloudinary, and returns a structured DTO.
 *
 * @param imageBuffer - Raw binary buffer of the product/base image
 * @param prompt - Technical diffusion prompt describing mockup instructions
 * @param options - Generation options (e.g. image size)
 * @returns Structured DTO containing Cloudinary asset details and token usage
 */
export async function generateProductMockup(
  imageBuffer: Buffer,
  prompt: string,
  options?: GenerateProductMockupOptions
): Promise<GeneratedProductMockupResult> {
  if (!imageBuffer || !Buffer.isBuffer(imageBuffer) || imageBuffer.length === 0) {
    throw new Error('Image buffer is required and cannot be empty');
  }

  const sanitizedPrompt = typeof prompt === 'string' ? sanitizeText(prompt) : '';
  if (!sanitizedPrompt) {
    throw new Error('Prompt is required and cannot be empty');
  }

  const client = getOpenAIClient();
  const size = options?.size ?? DEFAULT_SIZE;

  let b64Data: string;
  let inputTokens = 0;
  let outputTokens = 0;

  try {
    const uploadableFile = await toFile(imageBuffer, 'product-input.png', {
      type: 'image/png',
    });

    const response = await client.images.edit({
      model: DEFAULT_MODEL,
      image: uploadableFile,
      prompt: sanitizedPrompt,
      size,
    });

    const extractedBase64 = response.data?.[0]?.b64_json;
    if (!extractedBase64) {
      throw new Error('OpenAI returned no image data in b64_json format');
    }

    b64Data = extractedBase64;
    inputTokens = response.usage?.input_tokens ?? 0;
    outputTokens = response.usage?.output_tokens ?? 0;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('OpenAI returned no image data')) {
      throw error;
    }
    throw handleOpenAIError(error);
  }

  const uploadResult = await uploadBase64Image(b64Data, CLOUDINARY_MOCKUP_FOLDER);

  return {
    imageUrl: uploadResult.secureUrl,
    publicId: uploadResult.publicId,
    inputTokens,
    outputTokens,
  };
}
