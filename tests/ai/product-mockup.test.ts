import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import OpenAI from 'openai';
import * as openaiUploads from 'openai/uploads';
import { generateProductMockup } from '@/services/ai/product-mockup.service';
import * as cloudinaryUploader from '@/services/media/cloudinary-uploader';
import { setOpenAIClientForTesting, resetOpenAIClient } from '@/lib/openai';

describe('ProductMockupService - generateProductMockup', () => {
  const mockEdit = vi.fn();
  const mockClient = {
    images: {
      edit: mockEdit,
    },
  } as unknown as OpenAI;

  let uploadBase64ImageSpy: ReturnType<typeof vi.spyOn>;
  let toFileSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    setOpenAIClientForTesting(mockClient);

    toFileSpy = vi.spyOn(openaiUploads, 'toFile');
    uploadBase64ImageSpy = vi.spyOn(cloudinaryUploader, 'uploadBase64Image');
  });

  afterEach(() => {
    resetOpenAIClient();
    vi.restoreAllMocks();
  });

  describe('Happy path & Model Parameters', () => {
    it('processes image buffer via toFile, calls gpt-image-2.5-sunburst, uploads to Cloudinary, and returns structured DTO', async () => {
      const inputBuffer = Buffer.from('fake-product-raw-pixels');
      const fakeRenderedBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      mockEdit.mockResolvedValueOnce({
        created: 1729420000,
        data: [
          {
            b64_json: fakeRenderedBase64,
          },
        ],
        usage: {
          input_tokens: 140,
          output_tokens: 650,
          total_tokens: 790,
          input_tokens_details: { image_tokens: 40, text_tokens: 100 },
        },
      });

      uploadBase64ImageSpy.mockResolvedValueOnce({
        publicId: 'pinoka/mockups/mockup_sample_01',
        secureUrl: 'https://res.cloudinary.com/test-cloud/image/upload/v1/pinoka/mockups/mockup_sample_01.png',
        bytes: 10240,
      });

      const prompt = 'Clean minimalist cosmetic bottle mockup on stone pedestal with soft morning lighting';
      const result = await generateProductMockup(inputBuffer, prompt);

      // 1. Verify imageBuffer processed through toFile
      expect(toFileSpy).toHaveBeenCalledTimes(1);
      expect(toFileSpy).toHaveBeenCalledWith(
        inputBuffer,
        'product-input.png',
        expect.objectContaining({ type: 'image/png' })
      );

      // 2. Verify OpenAI client.images.edit payload
      expect(mockEdit).toHaveBeenCalledTimes(1);
      const editPayload = mockEdit.mock.calls[0][0];
      expect(editPayload.model).toBe('gpt-image-2.5-sunburst');
      expect(editPayload.prompt).toBe(prompt);
      expect(editPayload.size).toBe('1024x1024');
      expect(editPayload.image).toBeDefined();

      // 3. Verify Cloudinary uploadBase64Image payload
      expect(uploadBase64ImageSpy).toHaveBeenCalledTimes(1);
      expect(uploadBase64ImageSpy).toHaveBeenCalledWith(fakeRenderedBase64, 'pinoka/mockups');

      // 4. Verify structured DTO returned to caller
      expect(result).toEqual({
        imageUrl: 'https://res.cloudinary.com/test-cloud/image/upload/v1/pinoka/mockups/mockup_sample_01.png',
        publicId: 'pinoka/mockups/mockup_sample_01',
        inputTokens: 140,
        outputTokens: 650,
      });
    });

    it('respects optional size parameter when custom size is provided', async () => {
      const inputBuffer = Buffer.from('test-buffer');
      mockEdit.mockResolvedValueOnce({
        created: 1729420000,
        data: [{ b64_json: 'test-base64-render' }],
        usage: { input_tokens: 200, output_tokens: 800 },
      });

      uploadBase64ImageSpy.mockResolvedValueOnce({
        publicId: 'pinoka/mockups/portrait_mockup',
        secureUrl: 'https://res.cloudinary.com/test-cloud/image/upload/portrait.png',
        bytes: 15000,
      });

      const result = await generateProductMockup(inputBuffer, 'Vertical packaging mockup', {
        size: '1024x1536',
      });

      const editPayload = mockEdit.mock.calls[0][0];
      expect(editPayload.size).toBe('1024x1536');
      expect(editPayload.model).toBe('gpt-image-2.5-sunburst');
      expect(result.imageUrl).toBe('https://res.cloudinary.com/test-cloud/image/upload/portrait.png');
    });

    it('defaults token counts to 0 when OpenAI response omits usage data', async () => {
      const inputBuffer = Buffer.from('test-buffer');
      mockEdit.mockResolvedValueOnce({
        created: 1729420000,
        data: [{ b64_json: 'test-base64-render' }],
      });

      uploadBase64ImageSpy.mockResolvedValueOnce({
        publicId: 'pinoka/mockups/default_tokens',
        secureUrl: 'https://res.cloudinary.com/test-cloud/image/upload/default.png',
        bytes: 8000,
      });

      const result = await generateProductMockup(inputBuffer, 'Organic tea pouch mockup');
      expect(result.inputTokens).toBe(0);
      expect(result.outputTokens).toBe(0);
    });
  });

  describe('Validation & Edge Cases', () => {
    it('throws error when image buffer is empty', async () => {
      const emptyBuffer = Buffer.alloc(0);

      await expect(
        generateProductMockup(emptyBuffer, 'Valid prompt')
      ).rejects.toThrow('Image buffer is required and cannot be empty');

      expect(mockEdit).not.toHaveBeenCalled();
      expect(uploadBase64ImageSpy).not.toHaveBeenCalled();
    });

    it('throws error when image buffer is null or not a Buffer', async () => {
      await expect(generateProductMockup(null as unknown as Buffer, 'Valid prompt')).rejects.toThrow(
        'Image buffer is required and cannot be empty'
      );

      await expect(generateProductMockup('not-a-buffer' as unknown as Buffer, 'Valid prompt')).rejects.toThrow(
        'Image buffer is required and cannot be empty'
      );
    });

    it('throws error when prompt is empty string or only whitespace', async () => {
      const inputBuffer = Buffer.from('non-empty-buffer');

      await expect(generateProductMockup(inputBuffer, '')).rejects.toThrow(
        'Prompt is required and cannot be empty'
      );

      await expect(generateProductMockup(inputBuffer, '    \n\t  ')).rejects.toThrow(
        'Prompt is required and cannot be empty'
      );

      expect(mockEdit).not.toHaveBeenCalled();
    });

    it('throws error when OpenAI response does not contain b64_json', async () => {
      const inputBuffer = Buffer.from('valid-image-data');
      mockEdit.mockResolvedValueOnce({
        created: 1729420000,
        data: [],
      });

      await expect(generateProductMockup(inputBuffer, 'Valid prompt')).rejects.toThrow(
        'OpenAI returned no image data in b64_json format'
      );

      expect(uploadBase64ImageSpy).not.toHaveBeenCalled();
    });

    it('throws error when OpenAI response item is empty', async () => {
      const inputBuffer = Buffer.from('valid-image-data');
      mockEdit.mockResolvedValueOnce({
        created: 1729420000,
        data: [{}],
      });

      await expect(generateProductMockup(inputBuffer, 'Valid prompt')).rejects.toThrow(
        'OpenAI returned no image data in b64_json format'
      );

      expect(uploadBase64ImageSpy).not.toHaveBeenCalled();
    });
  });

  describe('Cloudinary Failure Handling', () => {
    it('throws clean error when Cloudinary connection or upload fails', async () => {
      const inputBuffer = Buffer.from('valid-image-data');
      mockEdit.mockResolvedValueOnce({
        created: 1729420000,
        data: [{ b64_json: 'valid-base64-render' }],
        usage: { input_tokens: 100, output_tokens: 500 },
      });

      uploadBase64ImageSpy.mockRejectedValueOnce(
        new Error('Cloudinary upload failed: Connection to Cloudinary timed out')
      );

      await expect(
        generateProductMockup(inputBuffer, 'Coffee cup mockup')
      ).rejects.toThrow('Cloudinary upload failed: Connection to Cloudinary timed out');
    });
  });

  describe('OpenAI Error Handling', () => {
    it('handles content policy moderation error properly', async () => {
      const inputBuffer = Buffer.from('valid-image-data');
      const moderationError = new OpenAI.APIError(
        400,
        {
          message: 'Your request was rejected due to content moderation policies.',
          type: 'content_policy_violation',
          code: 'content_policy_violation',
        },
        'content_policy_violation',
        new Headers()
      );

      mockEdit.mockRejectedValueOnce(moderationError);

      await expect(generateProductMockup(inputBuffer, 'Unsafe prompt')).rejects.toThrow(
        /OpenAI API Error \[400\]:.*content moderation policies/i
      );

      expect(uploadBase64ImageSpy).not.toHaveBeenCalled();
    });

    it('handles rate limit and quota exhaustion error properly', async () => {
      const inputBuffer = Buffer.from('valid-image-data');
      const quotaError = new OpenAI.APIError(
        429,
        {
          message: 'You have exceeded your monthly quota.',
          type: 'insufficient_quota',
          code: 'insufficient_quota',
        },
        'insufficient_quota',
        new Headers()
      );

      mockEdit.mockRejectedValueOnce(quotaError);

      await expect(generateProductMockup(inputBuffer, 'Valid prompt')).rejects.toThrow(
        /OpenAI API Error \[429\]:.*monthly quota/i
      );
    });

    it('handles unexpected non-Error values gracefully', async () => {
      const inputBuffer = Buffer.from('valid-image-data');
      mockEdit.mockRejectedValueOnce('Network pipe broken');

      await expect(generateProductMockup(inputBuffer, 'Valid prompt')).rejects.toThrow(
        'Unknown OpenAI error: Network pipe broken'
      );
    });
  });
});
