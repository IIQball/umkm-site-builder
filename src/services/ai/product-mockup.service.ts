import { toFile } from 'openai';
import { getOpenAIClient, handleOpenAIError, OPENAI_IMAGE_REQUEST_OPTIONS } from '@/lib/openai';
import { sanitizeText } from '@/lib/utils/format';
import { withOpenAiRetry } from '@/lib/resilience/openai-retry';
import { uploadBase64Image } from '@/services/media/cloudinary-uploader';
import type {
  MockupPresentationStyle,
  PackagingType,
} from '@/lib/validators/ai-packaging';

export interface GenerateProductMockupOptions {
  size?: '1024x1024' | '1024x1536';
  model?: string;
  presentationStyle?: MockupPresentationStyle;
  packagingType?: PackagingType | string;
  productLabel?: string;
}

export interface GeneratedProductMockupResult {
  imageUrl: string;
  publicId: string;
  inputTokens: number;
  outputTokens: number;
}

export const MAX_REFERENCE_IMAGE_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

export const MOCKUP_PRESENTATION_DIRECTIVES: Record<MockupPresentationStyle, string> = {
  clean_studio:
    'E-commerce studio environment, solid light warm-gray background (#F6F5F2), soft diffused softbox lighting, zero extra clutter, 0 scattered props, pristine commercial product photography.',
  monolith_podium:
    'Architectural matte cast-concrete stone podium stand, neutral gray background (#E2E8F0), elegant soft window gobo leaf shadow pattern across the wall, refined sunlit editorial atmosphere.',
  vietnam_tabletop:
    'Minimalist Saigon cafe tabletop, natural light-toned wood tabletop, gentle soft morning side daylight streaming from a nearby cafe window, quiet organic artisanal aesthetic.',
  eco_craft:
    'Warm organic backdrop with textured natural linen fabric runner and subtle earthy terracotta wall accent (#D4A373), warm diffused ambient light, authentic eco-friendly craft vibe.',
  dark_spotlight:
    'Exclusive dark luxury studio setting, deep matte dark charcoal backdrop (#1C1C1E), single dramatic directional rim light emphasizing package edges and silhouette, zero ambient light spill.',
  floating_hero:
    'Dynamic hero product levitation, the package is suspended in mid-air angled at 12 degrees, crisp studio 3-point lighting casting a soft natural drop shadow on solid matte floor.',
};

export const MOCKUP_LABEL_DISCIPLINE_DIRECTIVE =
  'LABEL DISCIPLINE & COMPOSITION: The printed label on the package body must be a modern minimalist typographic sticker/print occupying MAXIMUM 40% of the front package surface area with clean legible brand typography and crisp margins. DO NOT paint full-bleed photorealistic landscape paintings, scenic murals, or giant illustrative artwork across the entire pouch body. STRICT NEGATIVE CONSTRAINTS: NO loose coffee beans, tea leaves, fruit slices, or dirt scattered randomly around the base or table. Keep table surface completely clean and focused exclusively on the product package.';

export interface BuildProductMockupPromptParams {
  packagingType?: string;
  productLabel?: string;
  presentationStyle?: MockupPresentationStyle;
  basePrompt?: string;
}

export function buildProductMockupPrompt(params: BuildProductMockupPromptParams): string {
  const style = params.presentationStyle || 'clean_studio';
  const styleDirective =
    MOCKUP_PRESENTATION_DIRECTIVES[style] || MOCKUP_PRESENTATION_DIRECTIVES.clean_studio;
  const pkg = params.packagingType
    ? `Commercial 3D realistic packaging mockup of ${params.packagingType.replace(/_/g, ' ')}.`
    : 'Commercial 3D realistic packaging mockup.';
  const label = params.productLabel ? ` Package label title: "${params.productLabel.trim()}".` : '';
  const custom = params.basePrompt ? ` ${params.basePrompt.trim()}` : '';

  return `${pkg}${label}${custom} Presentation scene: ${styleDirective} ${MOCKUP_LABEL_DISCIPLINE_DIRECTIVE}`.trim();
}

const DEFAULT_MODEL = 'gpt-image-2.5-sunburst';
const DEFAULT_SIZE = '1024x1024';
const CLOUDINARY_MOCKUP_FOLDER = 'pinoka/mockups';

/**
 * Generates an edited product mockup using OpenAI's image model,
 * uploads the resulting render to Cloudinary, and returns a structured DTO.
 */
export async function generateProductMockup(
  imageBuffer: Buffer,
  prompt: string,
  options?: GenerateProductMockupOptions
): Promise<GeneratedProductMockupResult> {
  if (!imageBuffer || !Buffer.isBuffer(imageBuffer) || imageBuffer.length === 0) {
    throw new Error('Image buffer is required and cannot be empty');
  }

  if (imageBuffer.length > MAX_REFERENCE_IMAGE_SIZE_BYTES) {
    throw new Error('Image reference size exceeds 4 MB limit');
  }

  const sanitizedPrompt = typeof prompt === 'string' ? sanitizeText(prompt) : '';
  if (!sanitizedPrompt) {
    throw new Error('Prompt is required and cannot be empty');
  }

  const effectivePrompt = options?.presentationStyle
    ? buildProductMockupPrompt({
        basePrompt: sanitizedPrompt,
        presentationStyle: options.presentationStyle,
        packagingType: options.packagingType,
        productLabel: options.productLabel,
      })
    : (sanitizedPrompt.includes('LABEL DISCIPLINE')
        ? sanitizedPrompt
        : `${sanitizedPrompt}. ${MOCKUP_LABEL_DISCIPLINE_DIRECTIVE}`);

  const client = getOpenAIClient();
  const size = options?.size ?? DEFAULT_SIZE;
  const model = options?.model ?? DEFAULT_MODEL;

  let b64Data: string;
  let inputTokens = 0;
  let outputTokens = 0;

  try {
    const response = await withOpenAiRetry(
      async () => {
        const uploadableFile = await toFile(imageBuffer, 'product-input.png', {
          type: 'image/png',
        });

        return client.images.edit(
          {
            model,
            image: uploadableFile,
            prompt: effectivePrompt,
            size,
          },
          OPENAI_IMAGE_REQUEST_OPTIONS
        );
      },
      { maxRetries: 0 }
    );

    const extractedBase64 = response.data?.[0]?.b64_json || response.data?.[0]?.url;
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
