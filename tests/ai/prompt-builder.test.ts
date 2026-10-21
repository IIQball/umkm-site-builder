import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { buildLogoPrompt, cleanGeneratedPrompt } from '@/services/ai/prompt-builder.service';
import { ValidationError } from '@/lib/utils/validation';
import { UMKM_COLOR_PALETTES } from '@/services/ai/rules/logo-design-rules';
import { resetOpenAIClient } from '@/lib/openai';

const mockCreate = mock();

class MockAPIError extends Error {
  status?: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

const MockOpenAI = mock(() => ({
  chat: { completions: { create: mockCreate } },
}));

(MockOpenAI as unknown as Record<string, unknown>).APIError = MockAPIError;

mock.module('openai', () => ({
  default: MockOpenAI,
  OpenAI: MockOpenAI,
  APIError: MockAPIError,
}));

describe('PromptBuilderService - buildLogoPrompt (bun:test)', () => {
  beforeEach(() => {
    mockCreate.mockReset();
    resetOpenAIClient();
  });

  describe('Happy path & Radical Geometric Abstraction', () => {
    it('generates a clean prompt without raw brand name or cartoon clichés', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content:
                'Radical minimalist geometric glyph with interlocking arcs, solid terracotta and charcoal, balanced negative space, pure white background, no text, single geometric symbol',
            },
          },
        ],
      });

      const result = await buildLogoPrompt({
        storeName: 'Warung Princess Wipols',
        category: 'Kuliner & Makanan',
        visualStyle: 'Pictorial Symbol',
        colorPalette: UMKM_COLOR_PALETTES.WARM_TERRACOTTA,
      });

      expect(mockCreate).toHaveBeenCalledTimes(1);
      const callArgs = mockCreate.mock.calls[0][0];

      expect(callArgs.model).toBe('gpt-4o-mini');
      expect(callArgs.temperature).toBe(0.3);
      expect(callArgs.max_tokens).toBe(200);

      const systemMsg = callArgs.messages.find((m: { role: string }) => m.role === 'system').content;
      expect(systemMsg).toContain('Kaan Kiziltug');
      expect(systemMsg).toContain('RADICAL SWISS ABSTRACTION');
      expect(systemMsg).toContain('SCALABILITY AT 16PX');
      expect(systemMsg).toContain('no text, no letters');
      expect(systemMsg).toContain('literal cartoon trigger words');

      const userMsg = callArgs.messages.find((m: { role: string }) => m.role === 'user').content;
      expect(userMsg).toContain('Warung Princess Wipols');
      expect(userMsg).toContain('RADICAL SWISS ABSTRACTION & VISUAL HOOK DIRECTIVE');

      // Crucial: output prompt must not contain raw store name or cartoon triggers
      expect(result).not.toContain('Warung Princess Wipols');
      expect(result).not.toContain('princess');
      expect(result).not.toContain('crown');
      expect(result).toContain('flat vector');
      expect(result).toContain('negative space');
      expect(result).toContain('pure white background');
      expect(result).toContain('no text');
      expect(result).toContain('single geometric symbol');
    });

    it('strips conversational preambles, raw brand quotes, and cartoon cliché words', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content:
                '```markdown\n"Here is your prompt: Flat vector logo for "Warung Princess Wipols" with queen crown silhouette and food dish plate, pure white background, negative space"\n```',
            },
          },
        ],
      });

      const result = await buildLogoPrompt({
        storeName: 'Warung Princess Wipols',
        category: 'Kuliner',
      });

      expect(result).not.toContain('```');
      expect(result).not.toContain('Here is your prompt');
      expect(result).not.toContain('Warung Princess Wipols');
      expect(result).not.toContain('queen');
      expect(result).not.toContain('crown');
      expect(result).not.toContain('food');
      expect(result).not.toContain('dish');
      expect(result).not.toContain('plate');
      expect(result.startsWith('"')).toBe(false);
      expect(result.endsWith('"')).toBe(false);
      expect(result.toLowerCase()).toContain('flat vector');
      expect(result).toContain('negative space');
      expect(result).toContain('pure white background');
      expect(result).toContain('no text');
      expect(result).toContain('single geometric symbol');
    });

    it('does not duplicate mandatory keywords if already present in model response', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content:
                'A flat vector negative space single geometric symbol, pure white background, no text',
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
      const noTextCount = (result.match(/no text/gi) || []).length;
      const geometricSymbolCount = (result.match(/single geometric symbol/gi) || []).length;

      expect(flatVectorCount).toBe(1);
      expect(negativeSpaceCount).toBe(1);
      expect(pureWhiteCount).toBe(1);
      expect(noTextCount).toBe(1);
      expect(geometricSymbolCount).toBe(1);
    });

    it('appends missing mandatory keywords if omitted by model without appending brand name', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: 'A minimalist geometric silhouette combining two clean arcs' } }],
      });

      const result = await buildLogoPrompt({ storeName: 'Kue Ibu', category: 'Bakery' });

      expect(result).toContain('flat vector');
      expect(result).toContain('negative space');
      expect(result).toContain('pure white background');
      expect(result).toContain('no text');
      expect(result).toContain('single geometric symbol');
      expect(result).not.toContain('Kue Ibu');
    });
  });

  describe('Input Validation & Edge Cases', () => {
    it('throws ValidationError when storeName is empty or whitespace', async () => {
      await expect(buildLogoPrompt({ storeName: '', category: 'Kuliner' })).rejects.toThrow(ValidationError);
      await expect(buildLogoPrompt({ storeName: '   \n  ', category: 'Kuliner' })).rejects.toThrow(ValidationError);
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('sanitizes special and control characters from storeName while preserving valid brand punctuation', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content:
                'Flat vector abstract architectural glyph, negative space, pure white background, no text, single geometric symbol',
            },
          },
        ],
      });

      const result = await buildLogoPrompt({
        storeName: "  \x00Café   L'Étoile \x1F& Co.  \x08",
        category: 'Food & Beverage',
      });

      expect(result.toLowerCase()).toContain('flat vector');
      const userMsg = mockCreate.mock.calls[0][0].messages.find((m: { role: string }) => m.role === 'user').content;
      expect(userMsg).toContain('Brand Context (Internal Only): "Café L\'Étoile & Co."');
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

  describe('Focal Subject Injection & Swiss Reductionism', () => {
    it('injects focalSubject directives and translations into system prompt and user prompt', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content:
                'Minimalist rooster silhouette mark formed from sharp planar triangles, flat monochrome, negative space, pure white background, no text, single geometric symbol',
            },
          },
        ],
      });

      const result = await buildLogoPrompt({
        storeName: 'Ayam Juara',
        category: 'Kuliner & Makanan',
        focalSubject: 'Ayam jago',
      });

      expect(mockCreate).toHaveBeenCalledTimes(1);
      const callArgs = mockCreate.mock.calls[0][0];

      const systemMsg = callArgs.messages.find((m: { role: string }) => m.role === 'system').content;
      expect(systemMsg).toContain('USER FOCAL SUBJECT DIRECTIVE');
      expect(systemMsg).toContain('Ayam jago');
      expect(systemMsg).toContain('rooster');
      expect(systemMsg).toContain('Swiss reductionism');
      expect(systemMsg).toContain('Strictly FORBIDDEN to draw realistic fur/feather textures');

      const userMsg = callArgs.messages.find((m: { role: string }) => m.role === 'user').content;
      expect(userMsg).toContain('Focal Subject: "Ayam jago"');
      expect(userMsg).toContain('SPECIFIC FOCAL SUBJECT DIRECTIVE');
      expect(userMsg).toContain('Anchor Object: "Ayam jago"');

      expect(result).toContain('flat vector');
      expect(result).toContain('pure white background');
      expect(result).toContain('no text');
    });

    it('falls back to default radical Swiss abstraction when focalSubject is omitted', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content:
                'Geometric coffee emblem in pure flat vector, negative space, pure white background, no text, single geometric symbol',
            },
          },
        ],
      });

      await buildLogoPrompt({
        storeName: 'Kopi Nusantara',
        category: 'Kopi & Kafe',
      });

      const callArgs = mockCreate.mock.calls[0][0];
      const systemMsg = callArgs.messages.find((m: { role: string }) => m.role === 'system').content;
      expect(systemMsg).not.toContain('USER FOCAL SUBJECT DIRECTIVE');

      const userMsg = callArgs.messages.find((m: { role: string }) => m.role === 'user').content;
      expect(userMsg).toContain('Focal Subject: None');
      expect(userMsg).toContain('RADICAL SWISS ABSTRACTION & VISUAL HOOK DIRECTIVE');
    });
  });

  describe('Prompt Cleanup Utilities', () => {
    it('cleanGeneratedPrompt helper purges raw brand name and cartoon triggers', () => {
      const dirty = 'Flat vector logo for "Warung Princess" with queen tiara crown, dish bowl, negative space';
      const cleaned = cleanGeneratedPrompt(dirty, 'Warung Princess');
      expect(cleaned).not.toContain('Warung Princess');
      expect(cleaned).not.toContain('queen');
      expect(cleaned).not.toContain('tiara');
      expect(cleaned).not.toContain('crown');
      expect(cleaned).not.toContain('dish');
      expect(cleaned).not.toContain('bowl');
    });
  });
});
