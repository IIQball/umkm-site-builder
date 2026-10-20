import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildLogoPrompt } from '@/services/ai/prompt-builder.service';
import { ValidationError } from '@/lib/utils/validation';
import {
  getCategoryRedFlags,
  resolveMarkTypeGuide,
  UMKM_COLOR_PALETTES,
} from '@/services/ai/rules/logo-design-rules';
import {
  getOpenAIClient,
  handleOpenAIError,
  resetOpenAIClient,
  setOpenAIClientForTesting,
} from '@/lib/openai';

const mockCreate = vi.fn();

class MockAPIError extends Error {
  status?: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

const MockOpenAI = vi.fn().mockImplementation(() => ({
  chat: {
    completions: {
      create: mockCreate,
    },
  },
}));

(MockOpenAI as unknown as Record<string, unknown>).APIError = MockAPIError;

vi.mock('openai', () => ({
  default: MockOpenAI,
  OpenAI: MockOpenAI,
  APIError: MockAPIError,
}));

describe('PromptBuilderService - buildLogoPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetOpenAIClient();
  });

  describe('Happy path & Prompt Quality', () => {
    it('generates a clean prompt with required technical keywords and brand name', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content:
                'Minimalist flat vector logo for "Kopi Nusantara", negative space coffee cherry silhouette, pure white background, 2-color terracotta and dark roast',
            },
          },
        ],
      });

      const result = await buildLogoPrompt({
        storeName: 'Kopi Nusantara',
        category: 'Kopi & Kafe',
        visualStyle: 'Pictorial Symbol',
        colorPalette: UMKM_COLOR_PALETTES.WARM_TERRACOTTA,
      });

      expect(mockCreate).toHaveBeenCalledTimes(1);
      const callArgs = mockCreate.mock.calls[0][0];

      expect(callArgs.model).toBe('gpt-4o-mini');
      expect(callArgs.temperature).toBe(0.3);
      expect(callArgs.max_tokens).toBe(200);

      const systemMessage = callArgs.messages.find((m: { role: string }) => m.role === 'system');
      expect(systemMessage.content).toContain('Kaan Kiziltug');
      expect(systemMessage.content).toContain('SCALABILITY AT 16PX');
      expect(systemMessage.content).toContain('COLOR DISCIPLINE');

      const userMessage = callArgs.messages.find((m: { role: string }) => m.role === 'user');
      expect(userMessage.content).toContain('Kopi Nusantara');
      expect(userMessage.content).toContain('Kopi & Kafe');

      expect(result).toContain('Kopi Nusantara');
      expect(result).toContain('flat vector');
      expect(result).toContain('negative space');
      expect(result).toContain('pure white background');
      expect(result).not.toMatch(/^(here is|sure|prompt:)/i);
    });

    it('strips conversational preambles, wrapping quotation marks, and markdown blocks', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content:
                '```markdown\n"Here is your prompt: Modern flat vector geometric letterform monogram for Toko Berkah, pure white background, negative space balance"\n```',
            },
          },
        ],
      });

      const result = await buildLogoPrompt({
        storeName: 'Toko Berkah',
        category: 'Retail & Toko',
      });

      expect(result).not.toContain('```');
      expect(result).not.toContain('Here is your prompt');
      expect(result.startsWith('"')).toBe(false);
      expect(result.endsWith('"')).toBe(false);
      expect(result).toContain('Toko Berkah');
      expect(result).toContain('flat vector');
      expect(result).toContain('negative space');
      expect(result).toContain('pure white background');
    });

    it('does not duplicate mandatory keywords if already present in model response', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content:
                'A flat vector emblem with negative space for brand "Sari Rasa", pure white background',
            },
          },
        ],
      });

      const result = await buildLogoPrompt({
        storeName: 'Sari Rasa',
        category: 'Kuliner',
      });

      const flatVectorCount = (result.match(/flat vector/gi) || []).length;
      const negativeSpaceCount = (result.match(/negative space/gi) || []).length;
      const pureWhiteCount = (result.match(/pure white background/gi) || []).length;

      expect(flatVectorCount).toBe(1);
      expect(negativeSpaceCount).toBe(1);
      expect(pureWhiteCount).toBe(1);
    });

    it('appends missing mandatory keywords if omitted by model', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'A minimalist geometric emblem for brand "Kue Ibu"',
            },
          },
        ],
      });

      const result = await buildLogoPrompt({
        storeName: 'Kue Ibu',
        category: 'Bakery',
      });

      expect(result).toContain('flat vector');
      expect(result).toContain('negative space');
      expect(result).toContain('pure white background');
      expect(result).toContain('Kue Ibu');
    });
  });

  describe('Input Validation & Edge Cases', () => {
    it('throws ValidationError when storeName is empty or whitespace', async () => {
      await expect(buildLogoPrompt({ storeName: '', category: 'Kuliner' })).rejects.toThrow(
        ValidationError
      );
      await expect(buildLogoPrompt({ storeName: '   \n  ', category: 'Kuliner' })).rejects.toThrow(
        ValidationError
      );
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('sanitizes special and control characters from storeName while preserving valid brand punctuation', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content:
                'Flat vector logo for "Café L\'Étoile & Co.", negative space, pure white background',
            },
          },
        ],
      });

      const result = await buildLogoPrompt({
        storeName: '  \x00Café   L\'Étoile \x1F& Co.  \x08',
        category: 'Food & Beverage',
      });

      expect(result).toContain('Café L\'Étoile & Co.');

      const userMessage = mockCreate.mock.calls[0][0].messages.find(
        (m: { role: string }) => m.role === 'user'
      );
      expect(userMessage.content).toContain('Brand Name: "Café L\'Étoile & Co."');
    });

    it('handles empty response from OpenAI gracefully', async () => {
      mockCreate.mockResolvedValueOnce({ choices: [{ message: { content: '' } }] });

      await expect(buildLogoPrompt({ storeName: 'Toko Maju', category: 'Retail' })).rejects.toThrow(
        'empty prompt response'
      );
    });

    it('propagates OpenAI API errors properly', async () => {
      mockCreate.mockRejectedValue(new MockAPIError(429, 'Rate limit exceeded'));

      await expect(buildLogoPrompt({ storeName: 'Toko Maju', category: 'Retail' })).rejects.toThrow(
        'Rate limit exceeded'
      );
    });
  });

  describe('OpenAI Helper Client & Error Formatting', () => {
    it('reuses singleton client and allows test overrides', () => {
      const client1 = getOpenAIClient();
      const client2 = getOpenAIClient();
      expect(client1).toBe(client2);

      const customMock = { chat: { completions: {} } } as unknown as ReturnType<
        typeof getOpenAIClient
      >;
      setOpenAIClientForTesting(customMock);
      expect(getOpenAIClient()).toBe(customMock);
    });

    it('formats APIError, standard Error, and unknown errors', () => {
      const apiErr = new MockAPIError(401, 'Unauthorized API key');
      expect(handleOpenAIError(apiErr).message).toContain(
        'OpenAI API Error [401]: Unauthorized API key'
      );

      const regularErr = new Error('Socket timeout');
      expect(handleOpenAIError(regularErr).message).toBe('Socket timeout');

      const primitiveErr = handleOpenAIError('unexpected string error');
      expect(primitiveErr.message).toContain('unexpected string error');
    });
  });

  describe('Kaan Kiziltug Rule Resolution Helpers', () => {
    it('resolves coffee red flags for coffee category', () => {
      const redFlags = getCategoryRedFlags('Kopi & Kafe');
      expect(redFlags.some((f) => f.includes('steaming coffee cup'))).toBe(true);
      expect(redFlags.some((f) => f.includes('scattered coffee beans'))).toBe(true);
    });

    it('resolves culinary red flags for food/resto category', () => {
      const redFlags = getCategoryRedFlags('Resto & Warung Makan');
      expect(redFlags.some((f) => f.includes('chef hats'))).toBe(true);
      expect(redFlags.some((f) => f.includes('crossed spoon and fork'))).toBe(true);
    });

    it('resolves retail & kelontong red flags for shop/fashion category', () => {
      const redFlags = getCategoryRedFlags('Toko Kelontong Berkah');
      expect(redFlags.some((f) => f.includes('shopping bags'))).toBe(true);
      expect(redFlags.some((f) => f.includes('grocery shopping carts'))).toBe(true);
    });

    it('resolves processed goods and services red flags', () => {
      const herbalFlags = getCategoryRedFlags('Produk Olahan Jamu Herbal');
      expect(herbalFlags.some((f) => f.includes('generic leaf clipart'))).toBe(true);

      const serviceFlags = getCategoryRedFlags('Jasa Bengkel Motor');
      expect(serviceFlags.some((f) => f.includes('generic gear wheels'))).toBe(true);
    });

    it('resolves mark type guide according to visual style', () => {
      expect(resolveMarkTypeGuide('Monogram Initials')).toContain('Letterform/Monogram');
      expect(resolveMarkTypeGuide('Mascot Silhouette')).toContain('Mascot Silhouette');
      expect(resolveMarkTypeGuide('Heritage Batik')).toContain('Neo-Heritage Minimalist');
      expect(resolveMarkTypeGuide()).toContain('Pictorial Symbol');
    });
  });
});
