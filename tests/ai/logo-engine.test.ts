import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import OpenAI from 'openai';
import { generateLogoImage } from '@/services/ai/logo-generator.service';
import { setOpenAIClientForTesting, resetOpenAIClient } from '@/lib/openai';

describe('LogoGeneratorService - generateLogoImage', () => {
  const mockGenerate = vi.fn();
  const mockClient = {
    images: {
      generate: mockGenerate,
    },
  } as unknown as OpenAI;

  beforeEach(() => {
    vi.clearAllMocks();
    setOpenAIClientForTesting(mockClient);
  });

  afterEach(() => {
    resetOpenAIClient();
  });

  describe('Happy path & Payload Specification', () => {
    it('sends mandatory payload with gpt-image-2.5-sunburst, transparent background, and png format', async () => {
      const fakeBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      mockGenerate.mockResolvedValueOnce({
        created: 1729250000,
        background: 'transparent',
        output_format: 'png',
        quality: 'high',
        data: [
          {
            b64_json: fakeBase64,
          },
        ],
        usage: {
          input_tokens: 150,
          output_tokens: 600,
          total_tokens: 750,
          input_tokens_details: { image_tokens: 0, text_tokens: 150 },
        },
      });

      const prompt = 'Minimalist flat vector coffee logo, pure white background, negative space';
      const result = await generateLogoImage(prompt);

      expect(mockGenerate).toHaveBeenCalledTimes(1);
      const payload = mockGenerate.mock.calls[0][0];

      // Validate mandatory API parameters
      expect(payload.model).toBe('gpt-image-2.5-sunburst');
      expect(payload.background).toBe('transparent');
      expect(payload.output_format).toBe('png');
      expect(payload.size).toBe('1024x1024');
      expect(payload.quality).toBe('high');
      expect(payload.prompt).toBe(prompt);

      // Validate structured return value according to ai domain contract
      expect(result).toEqual({
        base64: fakeBase64,
        format: 'png',
        inputTokens: 150,
        outputTokens: 600,
      });
    });

    it('respects optional quality option when provided', async () => {
      mockGenerate.mockResolvedValueOnce({
        created: 1729250000,
        data: [{ b64_json: 'test-base64-data' }],
        usage: { input_tokens: 100, output_tokens: 400 },
      });

      await generateLogoImage('Geometric modern monogram logo', { quality: 'medium' });

      expect(mockGenerate).toHaveBeenCalledTimes(1);
      const payload = mockGenerate.mock.calls[0][0];
      expect(payload.quality).toBe('medium');
      expect(payload.model).toBe('gpt-image-2.5-sunburst');
      expect(payload.background).toBe('transparent');
      expect(payload.output_format).toBe('png');
    });

    it('defaults to high quality when options object is empty or quality omitted', async () => {
      mockGenerate.mockResolvedValueOnce({
        created: 1729250000,
        data: [{ b64_json: 'test-base64-data' }],
      });

      await generateLogoImage('Minimalist bakery logo', {});

      const payload = mockGenerate.mock.calls[0][0];
      expect(payload.quality).toBe('high');
    });

    it('handles missing usage object gracefully by defaulting tokens to 0', async () => {
      mockGenerate.mockResolvedValueOnce({
        created: 1729250000,
        data: [{ b64_json: 'fallback-base64-data' }],
      });

      const result = await generateLogoImage('Artisan honey logo');

      expect(result.inputTokens).toBe(0);
      expect(result.outputTokens).toBe(0);
      expect(result.format).toBe('png');
      expect(result.base64).toBe('fallback-base64-data');
    });
  });

  describe('Validation & Edge Cases', () => {
    it('throws an error if prompt is empty string or whitespace only', async () => {
      await expect(generateLogoImage('')).rejects.toThrow('Prompt is required and cannot be empty');
      await expect(generateLogoImage('   \n\t  ')).rejects.toThrow('Prompt is required and cannot be empty');
      expect(mockGenerate).not.toHaveBeenCalled();
    });

    it('throws an error when OpenAI response does not contain b64_json data', async () => {
      mockGenerate.mockResolvedValueOnce({
        created: 1729250000,
        data: [],
      });

      await expect(generateLogoImage('Valid prompt')).rejects.toThrow(
        'OpenAI returned no image data in b64_json format'
      );
    });

    it('throws an error when OpenAI response data item has missing b64_json', async () => {
      mockGenerate.mockResolvedValueOnce({
        created: 1729250000,
        data: [{}],
      });

      await expect(generateLogoImage('Valid prompt')).rejects.toThrow(
        'OpenAI returned no image data in b64_json format'
      );
    });
  });

  describe('Error Handling via handleOpenAIError', () => {
    it('handles content moderation policy violation properly', async () => {
      const moderationError = new OpenAI.APIError(
        400,
        {
          message: 'Your prompt was flagged by our content moderation policy and violates safety guidelines.',
          type: 'content_policy_violation',
          code: 'content_policy_violation',
        },
        'content_policy_violation',
        new Headers()
      );
      mockGenerate.mockRejectedValueOnce(moderationError);

      await expect(generateLogoImage('Violating logo request')).rejects.toThrow(
        /OpenAI API Error \[400\]:.*content moderation policy/i
      );
    });

    it('handles quota and rate limit errors properly', async () => {
      const quotaError = new OpenAI.APIError(
        429,
        {
          message: 'You have exceeded your monthly quota. Please check your billing plan.',
          type: 'insufficient_quota',
          code: 'insufficient_quota',
        },
        'insufficient_quota',
        new Headers()
      );
      mockGenerate.mockRejectedValue(quotaError);

      await expect(generateLogoImage('Clean coffee logo')).rejects.toThrow(
        /OpenAI API Error \[429\]:.*exceeded your monthly quota/i
      );
    });

    it('handles network connection timeout properly', async () => {
      const timeoutError = new Error('ETIMEDOUT: Connection to api.openai.com timed out');
      mockGenerate.mockRejectedValue(timeoutError);

      await expect(generateLogoImage('Clean coffee logo')).rejects.toThrow(
        'ETIMEDOUT: Connection to api.openai.com timed out'
      );
    });

    it('handles unexpected non-Error values safely', async () => {
      mockGenerate.mockRejectedValueOnce('Socket aborted abruptly');

      await expect(generateLogoImage('Clean coffee logo')).rejects.toThrow(
        'Unknown OpenAI error: Socket aborted abruptly'
      );
    });
  });
});
