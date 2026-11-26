import OpenAI from 'openai';
import { config } from './config/app';

let openaiInstance: OpenAI | null = null;

const DEFAULT_TIMEOUT_MS = 30 * 1000;
const DEFAULT_MAX_RETRIES = 2;

/**
 * Explicit configuration for OpenAI image generation (e.g. DALL-E 3 HD).
 * Timeout: 120,000ms (120s) to allow DALL-E 3 HD sufficient rendering time.
 * MaxRetries: 0 to strictly forbid automatic retries and avoid duplicate charges.
 */
export const IMAGE_GEN_TIMEOUT_MS = 120 * 1000;
export const IMAGE_GEN_MAX_RETRIES = 0;

export const OPENAI_IMAGE_REQUEST_OPTIONS = {
  timeout: IMAGE_GEN_TIMEOUT_MS,
  maxRetries: IMAGE_GEN_MAX_RETRIES,
} as const;

/**
 * Get or create the singleton OpenAI client instance.
 * Reads OPENAI_API_KEY from environment or app config.
 */
export function getOpenAIClient(): OpenAI {
  if (openaiInstance) {
    return openaiInstance;
  }

  const envMeta = (typeof import.meta !== 'undefined' && import.meta.env)
    ? (import.meta.env as unknown as Record<string, string | undefined>)
    : undefined;
  const envProc = typeof process !== 'undefined' && process.env ? process.env : undefined;

  const apiKey =
    envProc?.OPENAI_API_KEY ||
    envMeta?.OPENAI_API_KEY ||
    config.ai?.openaiApiKey;

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
  const isTimeout =
    (typeof error === 'object' && error !== null && (error as Record<string, unknown>).name === 'APIConnectionTimeoutError') ||
    (typeof OpenAI.APIConnectionTimeoutError === 'function' && error instanceof OpenAI.APIConnectionTimeoutError);

  if (isTimeout) {
    const timeoutErr = new Error('OpenAI API Error: Request timed out');
    timeoutErr.name = 'APIConnectionTimeoutError';
    return timeoutErr;
  }
  if (typeof OpenAI.APIError === 'function' && error instanceof OpenAI.APIError) {
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
