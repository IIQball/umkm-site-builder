import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { buildLogoPrompt } from '@/services/ai/prompt-builder.service';
import { resetOpenAIClient } from '@/lib/openai';

const mockCreate = mock();

const MockOpenAI = mock(() => ({
  chat: { completions: { create: mockCreate } },
}));

mock.module('openai', () => ({
  default: MockOpenAI,
  OpenAI: MockOpenAI,
}));

describe('PromptBuilderService - Kaan Kiziltug Visual Hook & Wordmark (bun:test)', () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'mock-key';
    mockCreate.mockReset();
    resetOpenAIClient();
  });

  it('builds prompt for letter_fusion with optional short logoText and wordmark lockup', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content:
              'A flat vector letter fusion logo combining initial letter H with a minimalist chair silhouette in negative space, terracotta and cream on pure white background, bold geometric sans-serif wordmark lockup cleanly placed below the central icon',
          },
        },
      ],
    });

    const result = await buildLogoPrompt({
      storeName: 'Homely Furniture',
      businessCategory: 'Kerajinan, Furniture & Dekorasi',
      conceptType: 'letter_fusion',
      logoText: 'HOMELY LIVING',
      colorPalette: '#C85A32, #F7F4EE',
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const callArgs = mockCreate.mock.calls[0][0];
    const userMsg = callArgs.messages.find((m: { role: string }) => m.role === 'user').content;

    expect(userMsg).toContain('Business Category: Kerajinan, Furniture & Dekorasi');
    expect(userMsg).toContain('Concept Type: letter_fusion');
    expect(userMsg).toContain('Logo Wordmark Text: "HOMELY LIVING"');

    expect(result).toContain('flat vector');
    expect(result).toContain('pure white background');
    expect(result).toContain('wordmark lockup');
    expect(result).not.toContain('no text');
  });

  it('enforces strictly NO text when logoText is empty or omitted', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content:
              'A geometric pictorial symbol of an espresso portafilter reduced to flat vector arcs and circles, negative space, pure white background, single geometric symbol',
          },
        },
      ],
    });

    const result = await buildLogoPrompt({
      storeName: 'Kopi Kenangan Senja',
      businessCategory: 'Kedai Kopi & Minuman',
      conceptType: 'pictorial_symbol',
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const callArgs = mockCreate.mock.calls[0][0];
    const userMsg = callArgs.messages.find((m: { role: string }) => m.role === 'user').content;

    expect(userMsg).toContain('Logo Wordmark Text: None');
    expect(userMsg).toContain('Mandate strictly NO text');
    expect(result).toContain('no text');
    expect(result).not.toContain('wordmark lockup');
  });

  it('supports animal_character concept type with geometric planes', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content:
              'Bold flat geometric animal silhouette of an owl formed by clean semicircles and sharp angles, negative space, pure white background, no text, single geometric symbol',
          },
        },
      ],
    });

    const result = await buildLogoPrompt({
      storeName: 'Burung Hantu Cafe',
      businessCategory: 'Kedai Kopi & Minuman',
      conceptType: 'animal_character',
    });

    expect(result).toContain('animal silhouette');
    expect(result).toContain('single geometric symbol');
    expect(result).not.toContain('Burung Hantu Cafe');
  });
});
