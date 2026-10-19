import OpenAI from 'openai';
import { config } from './config/app';

let openaiInstance: OpenAI | null = null;

const DEFAULT_TIMEOUT_MS = 30 * 1000;
const DEFAULT_MAX_RETRIES = 2;

/**
 * Get or create the singleton OpenAI client instance.
 * Reads OPENAI_API_KEY from environment or app config.
 */
export function getOpenAIClient(): OpenAI {
  if (openaiInstance) {
    return openaiInstance;
  }

  const apiKey =
    (typeof process !== 'undefined' ? process.env?.OPENAI_API_KEY : undefined) ||
    config.ai?.openaiApiKey ||
    (import.meta.env as unknown as Record<string, string | undefined>)?.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured in environment variables');
  }

  openaiInstance = new OpenAI({
    apiKey,
    timeout: DEFAULT_TIMEOUT_MS,
    maxRetries: DEFAULT_MAX_RETRIES,
  });

  return openaiInstance;
}

/**
 * Standard error formatter for OpenAI SDK operations.
 */
export function handleOpenAIError(error: unknown): Error {
  if (error instanceof OpenAI.APIError) {
    return new Error(`OpenAI API Error [${error.status || 'unknown'}]: ${error.message}`);
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error(`Unknown OpenAI error: ${String(error)}`);
}

/**
 * Allows overriding or resetting the singleton client during unit testing.
 */
export function setOpenAIClientForTesting(client: OpenAI | null): void {
  openaiInstance = client;
}

/**
 * Resets the singleton instance back to null.
 */
export function resetOpenAIClient(): void {
  openaiInstance = null;
}

/**
 * Proxied client object for ergonomic access.
 */
export const openai = {
  get client(): OpenAI {
    return getOpenAIClient();
  },
};

export default getOpenAIClient;
