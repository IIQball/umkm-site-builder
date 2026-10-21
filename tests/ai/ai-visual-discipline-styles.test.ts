import { describe, it, expect, mock, spyOn, beforeEach, afterEach } from 'bun:test';
import OpenAI from 'openai';
import * as openaiUploads from 'openai/uploads';
import {
  buildProductPosterPrompt,
  generateProductPoster,
  POSTER_STYLE_DIRECTIVES,
  STRICT_POSTER_NEGATIVE_DIRECTIVE,
  POSTER_HIERARCHY_DIRECTIVE,
} from '@/services/ai/product-poster.service';
import {
  buildProductMockupPrompt,
  generateProductMockup,
  MOCKUP_PRESENTATION_DIRECTIVES,
  MOCKUP_LABEL_DISCIPLINE_DIRECTIVE,
} from '@/services/ai/product-mockup.service';
import { buildLogoPrompt } from '@/services/ai/prompt-builder.service';
import { POSTER_STYLES } from '@/lib/validators/ai-poster';
import { MOCKUP_PRESENTATION_STYLES } from '@/lib/validators/ai-packaging';
import { LOGO_FONT_FAMILIES } from '@/lib/validators/ai-logo';
import * as cloudinaryUploader from '@/services/media/cloudinary-uploader';
import { setOpenAIClientForTesting, resetOpenAIClient } from '@/lib/openai';

describe('AI Visual Discipline & Anti-Slop (bun:test)', () => {
  const mockGenerate = mock();
  const mockEdit = mock();
  const mockCreate = mock();

  const mockClient = {
    images: {
      generate: mockGenerate,
      edit: mockEdit,
    },
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  } as unknown as OpenAI;

  let uploadBase64ImageSpy: ReturnType<typeof spyOn>;
  let toFileSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    mockGenerate.mockReset();
    mockEdit.mockReset();
    mockCreate.mockReset();
    setOpenAIClientForTesting(mockClient);

    toFileSpy = spyOn(openaiUploads, 'toFile');
    uploadBase64ImageSpy = spyOn(cloudinaryUploader, 'uploadBase64Image');
  });

  afterEach(() => {
    resetOpenAIClient();
    toFileSpy.mockRestore();
    uploadBase64ImageSpy.mockRestore();
  });

  describe('Part 1: Logo Lockup Proportions & Typography', () => {
    it('enforces icon_only 50%-55% footprint, 22.5% whitespace, and 0 text', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: 'Flat geometric vector symbol, pure white background, no text' } }],
      });

      const prompt = await buildLogoPrompt({
        storeName: 'Kopi Kenangan Senja',
        businessCategory: 'Kedai Kopi & Minuman',
        lockupType: 'icon_only',
        logoText: 'KOPI SENJA',
      });

      const callArgs = mockCreate.mock.calls[0][0];
      const userContent = callArgs.messages.find((m: { role: string }) => m.role === 'user').content;

      expect(userContent).toContain('50%-55%');
      expect(userContent).toContain('22.5%');
      expect(userContent).toContain('Strictly 0 text, NO letters, NO words');
      expect(prompt).toContain('no text');
    });

    it('enforces vertical lockup 4:1 ratio (40% symbol, 10% cap-height), 20% gap, 45% whitespace', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: 'Flat vector logo with vertical wordmark lockup' } }],
      });

      await buildLogoPrompt({
        storeName: 'Kopi Kenangan Senja',
        businessCategory: 'Kedai Kopi & Minuman',
        lockupType: 'vertical',
        logoText: 'KOPI SENJA',
        fontFamily: 'Fraunces',
      });

      const userContent = mockCreate.mock.calls[0][0].messages.find((m: { role: string }) => m.role === 'user').content;
      expect(userContent).toContain('height 40%');
      expect(userContent).toContain('cap-height 10%');
      expect(userContent).toContain('4:1 golden ratio');
      expect(userContent).toContain('gap between symbol and wordmark 20%');
      expect(userContent).toContain('minimum 45% total clean whitespace');
      expect(userContent).toContain("'Fraunces'");
    });

    it('enforces horizontal lockup 2:1 ratio (26% symbol, 13% cap-height), 35% gap, 70% max width', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: 'Flat vector logo with horizontal side-by-side wordmark lockup' } }],
      });

      await buildLogoPrompt({
        storeName: 'Kopi Kenangan Senja',
        businessCategory: 'Kedai Kopi & Minuman',
        lockupType: 'horizontal',
        logoText: 'KOPI SENJA',
        fontFamily: 'Space Grotesk',
      });

      const userContent = mockCreate.mock.calls[0][0].messages.find((m: { role: string }) => m.role === 'user').content;
      expect(userContent).toContain('height 26%');
      expect(userContent).toContain('cap-height 13%');
      expect(userContent).toContain('2:1 ratio');
      expect(userContent).toContain('horizontal gap 35%');
      expect(userContent).toContain('maximum 70% of canvas with 15% left/right margins');
      expect(userContent).toContain("'Space Grotesk'");
    });

    it('supports all 6 OFL commercial font families', async () => {
      for (const font of LOGO_FONT_FAMILIES) {
        mockCreate.mockResolvedValueOnce({
          choices: [{ message: { content: 'Flat vector logo' } }],
        });

        await buildLogoPrompt({
          storeName: 'Studio Desain',
          lockupType: 'vertical',
          logoText: 'STUDIO',
          fontFamily: font,
        });

        const userContent = mockCreate.mock.calls[mockCreate.mock.calls.length - 1][0].messages.find(
          (m: { role: string }) => m.role === 'user'
        ).content;
        expect(userContent).toContain(`'${font}'`);
      }
    });
  });

  describe('Part 2: 10 Curated Poster Styles & Strict Anti-Slop', () => {
    it('builds prompts for all 10 curated poster styles with correct art direction', () => {
      for (const style of POSTER_STYLES) {
        const prompt = buildProductPosterPrompt({
          productName: 'Kopi Tubruk',
          titleText: 'Aroma Asli Nusantara',
          subText: 'Biji Pilihan',
          posterStyle: style,
        });

        expect(prompt).toContain(POSTER_STYLE_DIRECTIVES[style].scene);
        expect(prompt).toContain(POSTER_STYLE_DIRECTIVES[style].typography);
        expect(prompt).toContain(POSTER_HIERARCHY_DIRECTIVE);
        expect(prompt).toContain(STRICT_POSTER_NEGATIVE_DIRECTIVE);
      }
    });

    it('enforces Rule of Thirds (<=65% content area, 35-40% whitespace) and text ratios in poster service', async () => {
      mockGenerate.mockResolvedValueOnce({
        created: 1729420000,
        data: [{ b64_json: 'test-poster-base64' }],
        usage: { input_tokens: 50, output_tokens: 500 },
      });
      uploadBase64ImageSpy.mockResolvedValueOnce({
        publicId: 'pinoka/posters/poster_01',
        secureUrl: 'https://res.cloudinary.com/test/poster_01.png',
        bytes: 20000,
      });

      await generateProductPoster('Promo Makanan Enak');

      const calledPayload = mockGenerate.mock.calls[0][0];
      expect(calledPayload.prompt).toContain('Rule of Thirds');
      expect(calledPayload.prompt).toContain('maximum 65%');
      expect(calledPayload.prompt).toContain('35%-40% clean empty negative space');
      expect(calledPayload.prompt).toContain('Headline text must not exceed 14%');
      expect(calledPayload.prompt).toContain('tagline/subtext must be approximately 40%');
      expect(calledPayload.prompt).toContain('NO HDR oversaturation');
      expect(calledPayload.prompt).toContain('NO scattered messy coffee beans');
      expect(calledPayload.prompt).toContain('NO impossible outdoor mountain');
      expect(calledPayload.prompt).toContain('NO tacky brush-stroke');
      expect(calledPayload.prompt).toContain('NO cheap clipart dividers');
    });
  });

  describe('Part 3: 6 Mockup Presentation Styles & Label Discipline', () => {
    it('builds prompts for all 6 presentation styles with scene setups', () => {
      for (const style of MOCKUP_PRESENTATION_STYLES) {
        const prompt = buildProductMockupPrompt({
          packagingType: 'standing_pouch',
          productLabel: 'Keripik Tempe',
          presentationStyle: style,
        });

        expect(prompt).toContain(MOCKUP_PRESENTATION_DIRECTIVES[style]);
        expect(prompt).toContain(MOCKUP_LABEL_DISCIPLINE_DIRECTIVE);
      }
    });

    it('enforces <=40% label discipline, bans scenic full-bleed paintings, and bans scattered beans', async () => {
      const inputBuffer = Buffer.from('test-image-bytes');
      mockEdit.mockResolvedValueOnce({
        created: 1729420000,
        data: [{ b64_json: 'test-mockup-base64' }],
      });
      uploadBase64ImageSpy.mockResolvedValueOnce({
        publicId: 'pinoka/mockups/mockup_01',
        secureUrl: 'https://res.cloudinary.com/test/mockup_01.png',
        bytes: 18000,
      });

      await generateProductMockup(inputBuffer, 'Standing pouch mockup', {
        presentationStyle: 'clean_studio',
        packagingType: 'standing_pouch',
        productLabel: 'Kopi Robusta',
      });

      const calledPayload = mockEdit.mock.calls[0][0];
      expect(calledPayload.prompt).toContain('MAXIMUM 40%');
      expect(calledPayload.prompt).toContain('DO NOT paint full-bleed photorealistic landscape');
      expect(calledPayload.prompt).toContain('NO loose coffee beans, tea leaves');
    });
  });
});
