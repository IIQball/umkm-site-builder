import { describe, it, expect, mock, spyOn, beforeEach, afterEach } from 'bun:test';
import type OpenAI from 'openai';
import {
  withOpenAiRetry,
  isTransientError,
  calculateBackoffDelay,
} from '@/lib/resilience/openai-retry';
import {
  generateProductMockup,
  MAX_REFERENCE_IMAGE_SIZE_BYTES,
} from '@/services/ai/product-mockup.service';
import { setOpenAIClientForTesting, resetOpenAIClient } from '@/lib/openai';
import * as cloudinaryUploader from '@/services/media/cloudinary-uploader';

describe('OpenAI Retry Resilience Utility (bun:test)', () => {
  beforeEach(() => {
    // Clear state
  });

  describe('isTransientError classification', () => {
    it('identifies transient HTTP status codes as retryable', () => {
      expect(isTransientError({ status: 429 })).toBe(true);
      expect(isTransientError({ status: 500 })).toBe(true);
      expect(isTransientError({ status: 502 })).toBe(true);
      expect(isTransientError({ status: 503 })).toBe(true);
      expect(isTransientError({ status: 504 })).toBe(true);
      expect(isTransientError({ statusCode: 429 })).toBe(true);
      expect(isTransientError({ status: '429' })).toBe(true);
      expect(isTransientError({ status: '503' })).toBe(true);
    });

    it('identifies transient network codes as retryable', () => {
      expect(isTransientError({ code: 'ECONNRESET' })).toBe(true);
      expect(isTransientError({ code: 'ETIMEDOUT' })).toBe(true);
      expect(isTransientError({ cause: { code: 'ECONNRESET' } })).toBe(true);
      expect(isTransientError(new Error('Connection reset: ECONNRESET'))).toBe(true);
      expect(isTransientError(new Error('Request timed out: ETIMEDOUT'))).toBe(true);
      expect(isTransientError('ECONNRESET connection terminated')).toBe(true);
      expect(isTransientError('ETIMEDOUT gateway connection')).toBe(true);
    });

    it('identifies non-transient HTTP status codes as non-retryable', () => {
      expect(isTransientError({ status: 400 })).toBe(false);
      expect(isTransientError({ status: 401 })).toBe(false);
      expect(isTransientError({ status: 403 })).toBe(false);
      expect(isTransientError({ status: 404 })).toBe(false);
      expect(isTransientError({ status: 422 })).toBe(false);
      expect(isTransientError({ status: '400' })).toBe(false);
    });

    it('returns false for null, undefined, and non-transient standard errors', () => {
      expect(isTransientError(null)).toBe(false);
      expect(isTransientError(undefined)).toBe(false);
      expect(isTransientError(new Error('Syntax validation failure'))).toBe(false);
      expect(isTransientError('Random unexpected string')).toBe(false);
    });
  });

  describe('calculateBackoffDelay exponential formula', () => {
    it('applies exponential backoff formula: min(baseDelay * 2^attempt + jitter, maxDelay)', () => {
      expect(calculateBackoffDelay(0, 500, 3000, 0)).toBe(500);
      expect(calculateBackoffDelay(1, 500, 3000, 0)).toBe(1000);
      expect(calculateBackoffDelay(2, 500, 3000, 0)).toBe(2000);
      expect(calculateBackoffDelay(3, 500, 3000, 0)).toBe(3000);
    });

    it('adds jitter value while respecting maxDelayMs ceiling', () => {
      expect(calculateBackoffDelay(0, 500, 3000, 50)).toBe(550);
      expect(calculateBackoffDelay(1, 500, 3000, 25)).toBe(1025);
      expect(calculateBackoffDelay(3, 500, 3000, 100)).toBe(3000);
    });
  });

  describe('withOpenAiRetry execution flow', () => {
    it('executes successfully on the first attempt without retry', async () => {
      const mockFn = mock().mockResolvedValue('immediate-success');
      const onRetry = mock();

      const result = await withOpenAiRetry(mockFn, { onRetry });

      expect(result).toBe('immediate-success');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(onRetry).not.toHaveBeenCalled();
    });

    it('recovers on 2nd retry after simulating HTTP 429 and 503 transient errors', async () => {
      const error429 = Object.assign(new Error('Rate limited'), { status: 429 });
      const error503 = Object.assign(new Error('Service unavailable'), { status: 503 });

      const mockFn = mock()
        .mockRejectedValueOnce(error429)
        .mockRejectedValueOnce(error503)
        .mockResolvedValueOnce('recovered-payload');

      const onRetry = mock();
      const result = await withOpenAiRetry(mockFn, {
        maxRetries: 3,
        baseDelayMs: 10,
        maxDelayMs: 100,
        jitter: 0,
        onRetry,
      });

      expect(result).toBe('recovered-payload');
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(onRetry).toHaveBeenCalledTimes(2);

      expect(onRetry).toHaveBeenNthCalledWith(1, error429, 1, 10);
      expect(onRetry).toHaveBeenNthCalledWith(2, error503, 2, 20);
    });

    it('rejects immediately without retry when receiving HTTP 400 or 401', async () => {
      const error400 = Object.assign(new Error('Bad Request: Invalid prompt parameters'), { status: 400 });
      const mockFn400 = mock().mockRejectedValueOnce(error400);
      const onRetry = mock();

      await expect(withOpenAiRetry(mockFn400, { onRetry })).rejects.toThrow('Bad Request');
      expect(mockFn400).toHaveBeenCalledTimes(1);
      expect(onRetry).not.toHaveBeenCalled();

      const error401 = Object.assign(new Error('Unauthorized: Invalid API Key'), { status: 401 });
      const mockFn401 = mock().mockRejectedValueOnce(error401);

      await expect(withOpenAiRetry(mockFn401, { onRetry })).rejects.toThrow('Unauthorized');
      expect(mockFn401).toHaveBeenCalledTimes(1);
      expect(onRetry).not.toHaveBeenCalled();
    });

    it('throws the final error when retry limit is exhausted', async () => {
      const persistentError = Object.assign(new Error('Persistent 503 gateway outage'), { status: 503 });
      const mockFn = mock().mockRejectedValue(persistentError);
      const onRetry = mock();

      await expect(
        withOpenAiRetry(mockFn, {
          maxRetries: 3,
          baseDelayMs: 5,
          maxDelayMs: 20,
          onRetry,
        })
      ).rejects.toThrow('Persistent 503 gateway outage');

      expect(mockFn).toHaveBeenCalledTimes(4);
      expect(onRetry).toHaveBeenCalledTimes(3);
    });
  });

  describe('Payload & Reference Image Validation (4 MB Limit)', () => {
    let mockEdit: ReturnType<typeof mock>;

    beforeEach(() => {
      mockEdit = mock();
      setOpenAIClientForTesting({
        images: {
          edit: mockEdit,
        },
      } as unknown as OpenAI);

      spyOn(cloudinaryUploader, 'uploadBase64Image').mockResolvedValue({
        publicId: 'pinoka/mockups/test',
        secureUrl: 'https://res.cloudinary.com/test.webp',
        bytes: 1024,
      });
    });

    afterEach(() => {
      resetOpenAIClient();
    });

    it('rejects reference image payloads strictly exceeding 4 MB limit', async () => {
      const oversizedBuffer = Buffer.alloc(MAX_REFERENCE_IMAGE_SIZE_BYTES + 1);

      await expect(
        generateProductMockup(oversizedBuffer, 'Clean luxury perfume bottle')
      ).rejects.toThrow('Image reference size exceeds 4 MB limit');

      expect(mockEdit).not.toHaveBeenCalled();
    });

    it('allows reference image payloads within the 4 MB limit', async () => {
      const validBuffer = Buffer.from('mock-product-image-bytes');
      mockEdit.mockResolvedValueOnce({
        data: [{ b64_json: 'fake-b64-json' }],
        usage: { input_tokens: 100, output_tokens: 200 },
      });

      const result = await generateProductMockup(validBuffer, 'Clean cosmetic jar mockup');

      expect(result.imageUrl).toBe('https://res.cloudinary.com/test.webp');
      expect(result.inputTokens).toBe(100);
      expect(result.outputTokens).toBe(200);
      expect(mockEdit).toHaveBeenCalledTimes(1);
    });
  });
});
