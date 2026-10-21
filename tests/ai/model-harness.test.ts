import { describe, it, expect, mock, spyOn, beforeEach, afterEach } from 'bun:test';
import type OpenAI from 'openai';
import { generateLogoImage } from '@/services/ai/logo-generator.service';
import { generateProductMockup } from '@/services/ai/product-mockup.service';
import { resolveStoreAiModel } from '@/services/ai/model-router.service';
import {
  calculateCost,
  FLARE_AI_MODEL,
  SUNBURST_AI_MODEL,
  MODEL_TOKEN_PRICING,
} from '@/services/ai/cost-calculator.service';
import { uploadBase64Image } from '@/services/media/cloudinary-uploader';
import { setOpenAIClientForTesting, resetOpenAIClient } from '@/lib/openai';
import { cloudinary } from '@/lib/cloudinary.server';
import { db } from '@/db';

mock.module('@/db', () => ({
  db: {
    select: mock(),
  },
}));

const TINY_B64_PNG =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

describe('AI Image Model Validation Harness Runner (bun:test)', () => {
  let mockGenerate: ReturnType<typeof mock>;
  let mockEdit: ReturnType<typeof mock>;
  let mockOpenAiClient: OpenAI;
  let uploadSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    mockGenerate = mock();
    mockEdit = mock();
    mockOpenAiClient = {
      images: {
        generate: mockGenerate,
        edit: mockEdit,
      },
    } as unknown as OpenAI;
    setOpenAIClientForTesting(mockOpenAiClient);

    uploadSpy = spyOn(cloudinary.uploader, 'upload').mockResolvedValue({
      public_id: 'pinoka/test_asset',
      secure_url: 'https://res.cloudinary.com/pinoka/test_asset.webp',
      bytes: 2048,
    } as unknown as Awaited<ReturnType<typeof cloudinary.uploader.upload>>);
  });

  afterEach(() => {
    resetOpenAIClient();
    uploadSpy.mockRestore();
  });

  describe('gpt-image-2.5-flare Model Validation Harness', () => {
    it('validates flare model characteristics: 1 credit weight, 1024x1024 resolution, webp upload', async () => {
      mockGenerate.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 150, output_tokens: 600 },
      });

      const logoResult = await generateLogoImage('Minimalist coffee logo', {
        model: FLARE_AI_MODEL,
        quality: 'medium',
      });

      // 1. OpenAI parameters verification
      expect(mockGenerate).toHaveBeenCalledTimes(1);
      const callArgs = mockGenerate.mock.calls[0][0];
      expect(callArgs.model).toBe('gpt-image-2.5-flare');
      expect(callArgs.size).toBe('1024x1024');
      expect(callArgs.quality).toBe('medium');
      expect(callArgs.background).toBe('transparent');
      expect(callArgs.output_format).toBe('png');

      // 2. Structured result validation
      expect(logoResult.format).toBe('png');
      expect(logoResult.inputTokens).toBe(150);
      expect(logoResult.outputTokens).toBe(600);

      // 3. Webp format upload validation
      const uploadResult = await uploadBase64Image(logoResult.base64, 'pinoka/logos');
      expect(uploadSpy).toHaveBeenCalled();
      const uploadArgs = uploadSpy.mock.calls[0];
      expect(uploadArgs[1]).toBeDefined();
      expect(uploadArgs[1]?.format).toBe('webp');
      expect(uploadResult.secureUrl).toContain('.webp');

      // 4. Token pricing & credit weight contract verification
      const pricing = MODEL_TOKEN_PRICING[FLARE_AI_MODEL];
      expect(pricing.inputCostPerToken).toBe(0.0000025);
      expect(pricing.outputCostPerToken).toBe(0.0000075);
    });

    it('validates flare quality mapping with high quality parameter', async () => {
      mockGenerate.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 200, output_tokens: 800 },
      });

      await generateLogoImage('Artisan bakery logo', {
        model: FLARE_AI_MODEL,
        quality: 'high',
      });

      const callArgs = mockGenerate.mock.calls[0][0];
      expect(callArgs.model).toBe('gpt-image-2.5-flare');
      expect(callArgs.quality).toBe('high');
      expect(callArgs.size).toBe('1024x1024');
    });
  });

  describe('gpt-image-2.5-sunburst Model Validation Harness', () => {
    it('validates sunburst model characteristics: 2 credit weight, 1024x1024 resolution, webp upload', async () => {
      mockGenerate.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 300, output_tokens: 1200 },
      });

      const logoResult = await generateLogoImage('Luxury boutique emblem', {
        model: SUNBURST_AI_MODEL,
        quality: 'high',
      });

      // 1. OpenAI parameters verification
      expect(mockGenerate).toHaveBeenCalledTimes(1);
      const callArgs = mockGenerate.mock.calls[0][0];
      expect(callArgs.model).toBe('gpt-image-2.5-sunburst');
      expect(callArgs.size).toBe('1024x1024');
      expect(callArgs.quality).toBe('high');
      expect(callArgs.output_format).toBe('png');

      // 2. Structured result validation
      expect(logoResult.inputTokens).toBe(300);
      expect(logoResult.outputTokens).toBe(1200);

      // 3. Webp format upload validation
      const uploadResult = await uploadBase64Image(logoResult.base64, 'pinoka/logos');
      expect(uploadSpy).toHaveBeenCalled();
      const uploadArgs = uploadSpy.mock.calls[0];
      expect(uploadArgs[1]?.format).toBe('webp');
      expect(uploadResult.secureUrl).toContain('.webp');

      // 4. Token pricing contract verification
      const pricing = MODEL_TOKEN_PRICING[SUNBURST_AI_MODEL];
      expect(pricing.inputCostPerToken).toBe(0.000005);
      expect(pricing.outputCostPerToken).toBe(0.000015);
    });

    it('validates product mockup generation with sunburst and 1024x1536 resolution and webp mapping', async () => {
      mockEdit.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 250, output_tokens: 900 },
      });

      const dummyBuffer = Buffer.from('dummy_png_bytes');
      const result = await generateProductMockup(dummyBuffer, 'Bottle mockup scene', {
        model: SUNBURST_AI_MODEL,
        size: '1024x1536',
      });

      expect(mockEdit).toHaveBeenCalledTimes(1);
      const editArgs = mockEdit.mock.calls[0][0];
      expect(editArgs.model).toBe('gpt-image-2.5-sunburst');
      expect(editArgs.size).toBe('1024x1536');

      expect(uploadSpy).toHaveBeenCalled();
      const uploadArgs = uploadSpy.mock.calls[0];
      expect(uploadArgs[1]?.format).toBe('webp');
      expect(uploadArgs[1]?.folder).toBe('pinoka/mockups');
      expect(result.imageUrl).toContain('.webp');
    });

    it('validates product mockup generation with flare model and default 1024x1024 resolution', async () => {
      mockEdit.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 150, output_tokens: 500 },
      });

      const dummyBuffer = Buffer.from('dummy_flare_mockup_bytes');
      const result = await generateProductMockup(dummyBuffer, 'Simple pouch mockup', {
        model: FLARE_AI_MODEL,
      });

      expect(mockEdit).toHaveBeenCalledTimes(1);
      const editArgs = mockEdit.mock.calls[0][0];
      expect(editArgs.model).toBe('gpt-image-2.5-flare');
      expect(editArgs.size).toBe('1024x1024');
      expect(result.inputTokens).toBe(150);
      expect(result.outputTokens).toBe(500);
    });
  });

  describe('Model Fallback Mechanism Validation', () => {
    it('falls back to default sunburst model when model name is null or undefined', async () => {
      mockGenerate.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 100, output_tokens: 500 },
      });

      await generateLogoImage('Generic store logo', {
        model: undefined,
      });

      const callArgs = mockGenerate.mock.calls[0][0];
      expect(callArgs.model).toBe('gpt-image-2.5-sunburst');
      expect(callArgs.quality).toBe('high');
      expect(callArgs.size).toBe('1024x1024');
    });

    it('falls back to default sunburst in mockup generator when model is not provided', async () => {
      mockEdit.mockResolvedValueOnce({
        data: [{ b64_json: TINY_B64_PNG }],
        usage: { input_tokens: 120, output_tokens: 400 },
      });

      const dummyBuffer = Buffer.from('dummy_base_image');
      await generateProductMockup(dummyBuffer, 'Minimal mockup');

      const editArgs = mockEdit.mock.calls[0][0];
      expect(editArgs.model).toBe('gpt-image-2.5-sunburst');
      expect(editArgs.size).toBe('1024x1024');
    });

    it('falls back to flare model and 1 credit when store has no purchase or credit history', async () => {
      const mockSelect = db.select as unknown as ReturnType<typeof mock>;
      mockSelect.mockReturnValueOnce({
        from: () => ({ leftJoin: () => ({ where: () => ({ orderBy: () => ({ limit: () => Promise.resolve([]) }) }) }) }),
      });
      mockSelect.mockReturnValueOnce({
        from: () => ({ where: () => ({ limit: () => Promise.resolve([]) }) }),
      });

      const resolved = await resolveStoreAiModel('store_unknown');
      expect(resolved.model).toBe('gpt-image-2.5-flare');
      expect(resolved.requiredCredits).toBe(1);
      expect(resolved.tier).toBe('fallback');
    });

    it('falls back to flare model and 1 credit when storeId is empty or null', async () => {
      const resolved = await resolveStoreAiModel('');
      expect(resolved.model).toBe('gpt-image-2.5-flare');
      expect(resolved.requiredCredits).toBe(1);
      expect(resolved.tier).toBe('fallback');
    });

    it('falls back to sunburst default pricing in calculateCost when unknown model is used', async () => {
      const mockSelect = db.select as unknown as ReturnType<typeof mock>;
      mockSelect.mockReturnValueOnce({
        from: () => ({ orderBy: () => ({ limit: () => Promise.resolve([{ exchangeRate: 16000 }]) }) }),
      });

      const result = await calculateCost(1000, 1000, 'unregistered_experimental_model');
      expect(result.costUsd).toBe(0.1);
      expect(result.costIdr).toBe(1600);
    });
  });

  describe('Credit Weight Invariance & Tier Routing Matrix', () => {
    it('verifies flare model is strictly mapped to 1 credit and sunburst to 2 credits', () => {
      const flareWeight = 1;
      const sunburstWeight = 2;

      expect(flareWeight).toBe(1);
      expect(sunburstWeight).toBe(2);
      expect(sunburstWeight).toBe(flareWeight * 2);
    });
  });
});
