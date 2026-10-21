import { toFile } from 'openai/uploads';
import { getOpenAIClient, handleOpenAIError, OPENAI_IMAGE_REQUEST_OPTIONS } from '@/lib/openai';
import { withOpenAiRetry } from '@/lib/resilience/openai-retry';
import { isModelOrParameterRejection } from './model-adapter';
import { uploadBase64Image } from '@/services/media/cloudinary-uploader';
import type { PosterStyle } from '@/lib/validators/ai-poster';

export interface GenerateProductPosterOptions {
  size?: '1024x1024' | '1024x1536';
  quality?: 'medium' | 'high';
  model?: string;
  imageBuffer?: Buffer | null;
  posterStyle?: PosterStyle;
}

export interface GeneratedProductPosterResult {
  imageUrl: string;
  publicId: string;
  inputTokens: number;
  outputTokens: number;
}

export const POSTER_STYLE_DIRECTIVES: Record<PosterStyle, { scene: string; typography: string }> = {
  vietnam_editorial: {
    scene: 'Warm textured linen fabric background (#EDE8DF), directional natural morning daylight from large window, soft subtle shadows',
    typography: 'Asymmetric Swiss-Saigon typography layout, elegant editorial serif headline (Fraunces) paired with modern sans-serif body (Plus Jakarta Sans)',
  },
  thai_commercial: {
    scene: 'Bold vibrant matte saturated color blocking background (#FF6B35), high-energy studio commercial lighting with crisp clean fill light',
    typography: 'Dynamic asymmetric high-impact typography, bold display title (Kanit) paired with clean geometric body (DM Sans)',
  },
  neo_brutalism: {
    scene: 'Neo-brutalist graphic layout, clean 2px solid black modular grid borders, hard solid offset drop shadows with zero blur, flat pastel color blocks (#FDE047)',
    typography: 'Space Grotesk headline in bold uppercase with IBM Plex Mono secondary information labels',
  },
  swiss_grid: {
    scene: 'Strict Swiss International Style modular column grid, clean studio white background (#F8FAFC), even diffused studio softbox light',
    typography: 'Flush-left bold headline placed cleanly at the top margin in Plus Jakarta Sans Bold, disciplined Swiss typography hierarchy',
  },
  japanese_muji: {
    scene: 'Japanese zakka minimalist aesthetic, warm earthy organic linen and raw paper tone (#F4F1EA), soft diffused ambient daylight, zero unnecessary clutter',
    typography: 'Understated refined serif headline (Cormorant Garamond) paired with ultra-clean Noto Sans',
  },
  kopitiam_retro: {
    scene: 'Nusantara kopitiam vintage heritage aesthetic, aged warm cream paper backdrop (#F7F0E4), deep emerald green and rich maroon borders with refined thin double-line framing',
    typography: 'Classic heritage display typography (Playfair Display) paired with clean utilitarian sans-serif (Work Sans)',
  },
  korean_pastel: {
    scene: 'Korean aesthetic cafe atmosphere, soft buttery cream and sage pastel palette, warm high-key sunlight with architectural window blind gobo shadow patterns',
    typography: 'Warm rounded geometric headline (Outfit) paired with gentle editorial serif (Lora)',
  },
  dark_luxury: {
    scene: 'Dark matte luxury studio, rich deep matte charcoal background (#18181B), single directional rim light highlighting product silhouette, zero ambient spill',
    typography: 'High-contrast modern serif typography in muted champagne gold (#D4AF37) using Bodoni Moda paired with Manrope',
  },
  tropical_podium: {
    scene: 'Minimalist architectural stone and terracotta podium, warm neutral backdrop, single sharp organic monstera leaf shadow cast across the wall, clean crisp lighting',
    typography: 'Editorial botanical luxury title (DM Serif Display) paired with clean geometric Plus Jakarta Sans',
  },
  pop_halftone: {
    scene: 'Bold pop-art commercial promo, clean diagonal split two-tone matte backdrop, dynamic low-angle hero product angle, graphic poster energy',
    typography: 'Punchy expressive title (Bricolage Grotesque) paired with sharp Plus Jakarta Sans',
  },
};

export const STRICT_POSTER_NEGATIVE_DIRECTIVE =
  'STRICT NEGATIVE CONSTRAINTS: NO HDR oversaturation or garish HDR glow, NO fake volumetric smoke or heavy vapor fog, NO scattered messy coffee beans or loose tea leaves randomly strewn across the table, NO impossible outdoor mountain or jungle landscape backgrounds behind indoor tabletops, NO tacky brush-stroke ribbons or distressed banner textures, NO cheap clipart dividers or cartoon embellishments, NO cluttered background props, NO unreadable typography.';

export const POSTER_HIERARCHY_DIRECTIVE =
  'COMPOSITION & TYPOGRAPHIC HIERARCHY: Strict Rule of Thirds layout where total content area occupies maximum 65% of canvas width/height, preserving 35%-40% clean empty negative space for readability. Headline text must not exceed 14% of canvas height, tagline/subtext must be approximately 40% of headline size.';

export interface BuildProductPosterPromptParams {
  productName?: string;
  titleText: string;
  subText?: string;
  posterStyle?: PosterStyle;
}

export function buildProductPosterPrompt(params: BuildProductPosterPromptParams): string {
  const style = params.posterStyle || 'vietnam_editorial';
  const styleConfig = POSTER_STYLE_DIRECTIVES[style] || POSTER_STYLE_DIRECTIVES.vietnam_editorial;
  const productLabel = params.productName?.trim() ? `Product: "${params.productName.trim()}". ` : '';
  const headline = params.titleText.trim();
  const tagline = params.subText?.trim() ? ` Tagline: "${params.subText.trim()}".` : '';

  return [
    `Commercial promotional product poster. ${productLabel}Headline text: "${headline}".${tagline}`,
    `Style & Lighting: ${styleConfig.scene}.`,
    `Typography & Layout: ${styleConfig.typography}.`,
    POSTER_HIERARCHY_DIRECTIVE,
    STRICT_POSTER_NEGATIVE_DIRECTIVE,
  ].join(' ');
}

const DEFAULT_MODEL = 'gpt-image-2.5-sunburst';
const DEFAULT_SIZE = '1024x1024';
const DEFAULT_QUALITY = 'high';
const CLOUDINARY_POSTER_FOLDER = 'pinoka/posters';

/**
 * Generates an appetizing promotional culinary poster using OpenAI text-to-image (images.generate)
 * or image edit (images.edit) if a product reference image is provided.
 * Uploads resulting render to Cloudinary ('pinoka/posters') and returns structured DTO.
 */
export async function generateProductPoster(
  prompt: string,
  options?: GenerateProductPosterOptions
): Promise<GeneratedProductPosterResult> {
  const sanitizedPrompt = typeof prompt === 'string' ? prompt.trim() : '';
  if (!sanitizedPrompt) {
    throw new Error('Prompt is required and cannot be empty');
  }

  const effectivePrompt = options?.posterStyle
    ? buildProductPosterPrompt({
        titleText: sanitizedPrompt,
        posterStyle: options.posterStyle,
      })
    : (sanitizedPrompt.includes('STRICT NEGATIVE CONSTRAINTS')
        ? sanitizedPrompt
        : `${sanitizedPrompt}. ${POSTER_HIERARCHY_DIRECTIVE} ${STRICT_POSTER_NEGATIVE_DIRECTIVE}`);

  const client = getOpenAIClient();
  const quality = options?.quality ?? DEFAULT_QUALITY;
  const size = options?.size ?? DEFAULT_SIZE;
  const model = options?.model ?? DEFAULT_MODEL;
  const imageBuffer = options?.imageBuffer;

  let base64Data: string;
  let inputTokens = 0;
  let outputTokens = 0;

  try {
    const response = await withOpenAiRetry(
      async () => {
        if (imageBuffer && Buffer.isBuffer(imageBuffer) && imageBuffer.length > 0) {
          const uploadableFile = await toFile(imageBuffer, 'poster-product.png', {
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
        }

        return client.images.generate(
          {
            model,
            prompt: effectivePrompt,
            size,
            quality,
            output_format: 'png',
          },
          OPENAI_IMAGE_REQUEST_OPTIONS
        );
      },
      { maxRetries: 0 }
    );

    const rawData = response.data?.[0]?.b64_json || response.data?.[0]?.url;
    if (!rawData) {
      throw new Error('OpenAI returned no image data in b64_json format');
    }

    base64Data = rawData;
    inputTokens = response.usage?.input_tokens ?? 0;
    outputTokens = response.usage?.output_tokens ?? 0;
  } catch (error: unknown) {
    if (isModelOrParameterRejection(error)) {
      // eslint-disable-next-line no-console
      console.warn(
        `[PosterGenerator] Model '${model}' rejected. Adapting to official model (dall-e-3)...`
      );
      try {
        const fallbackResponse = await withOpenAiRetry(
          () =>
            client.images.generate(
              {
                model: 'dall-e-3',
                prompt: effectivePrompt,
                size: size === '1024x1536' ? '1024x1792' : '1024x1024',
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

        base64Data = fallbackData;
      } catch (fallbackError: unknown) {
        throw handleOpenAIError(fallbackError);
      }
    } else {
      throw handleOpenAIError(error);
    }
  }

  const uploadResult = await uploadBase64Image(base64Data, CLOUDINARY_POSTER_FOLDER);

  return {
    imageUrl: uploadResult.secureUrl,
    publicId: uploadResult.publicId,
    inputTokens,
    outputTokens,
  };
}
