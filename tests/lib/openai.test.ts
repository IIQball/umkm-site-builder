import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getOpenAIClient,
  handleOpenAIError,
  resetOpenAIClient,
  setOpenAIClientForTesting,
} from '@/lib/openai';
import { config } from '@/lib/config/app';

describe('OpenAI Client Helper - src/lib/openai.ts', () => {
  const originalEnvApiKey = process.env.OPENAI_API_KEY;
  const originalConfigApiKey = config.ai?.openaiApiKey;

  beforeEach(() => {
    resetOpenAIClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.OPENAI_API_KEY = originalEnvApiKey;
    if (config.ai) {
      config.ai.openaiApiKey = originalConfigApiKey;
    }
    resetOpenAIClient();
  });

  it('throws an error if OPENAI_API_KEY is missing and no client is set', () => {
    delete process.env.OPENAI_API_KEY;
    if (config.ai) {
      config.ai.openaiApiKey = '';
    }
    expect(() => getOpenAIClient()).toThrow('OPENAI_API_KEY is not configured');
  });

  it('instantiates and returns singleton instance when OPENAI_API_KEY is present', () => {
    process.env.OPENAI_API_KEY = 'test-key-12345';
    if (config.ai) {
      config.ai.openaiApiKey = 'test-key-12345';
    }
    const client1 = getOpenAIClient();
    const client2 = getOpenAIClient();

    expect(client1).toBeDefined();
    expect(client1).toBe(client2);
  });

  it('allows overriding client with mock instance for testing', () => {
    const mockClient = { chat: { completions: {} } } as unknown as ReturnType<
      typeof getOpenAIClient
    >;
    setOpenAIClientForTesting(mockClient);

    expect(getOpenAIClient()).toBe(mockClient);
  });

  it('formats standard Error instances cleanly', () => {
    const standardError = new Error('Network connection timeout');
    const formatted = handleOpenAIError(standardError);
    expect(formatted.message).toBe('Network connection timeout');
  });

  it('formats non-Error primitive values safely', () => {
    const formatted = handleOpenAIError('unexpected string error payload');
    expect(formatted.message).toContain('unexpected string error payload');
  });
});
