export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean | number;
  sleepFn?: (ms: number) => Promise<void>;
  onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
}

export const DEFAULT_RETRY_OPTIONS = {
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 3000,
} as const;

const TRANSIENT_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const NON_TRANSIENT_STATUS_CODES = new Set([400, 401, 403, 404, 422]);

/**
 * Evaluates whether an error is transient and safe to retry.
 * Only HTTP 429, 500, 502, 503, 504 and network errors (ECONNRESET, ETIMEDOUT) are transient.
 * Non-transient errors (HTTP 400, 401, 403, 404, 422) return false immediately.
 */
export function isTransientError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  // Extract HTTP status code if present
  let status: number | null = null;
  if (typeof error === 'object') {
    const errObj = error as Record<string, unknown>;
    if (typeof errObj.status === 'number') {
      status = errObj.status;
    } else if (typeof errObj.statusCode === 'number') {
      status = errObj.statusCode;
    } else if (typeof errObj.status === 'string' && !isNaN(Number(errObj.status))) {
      status = Number(errObj.status);
    }
  }

  // Explicit non-transient status codes abort immediately
  if (status !== null && NON_TRANSIENT_STATUS_CODES.has(status)) {
    return false;
  }

  // Explicit transient status codes trigger retry
  if (status !== null && TRANSIENT_STATUS_CODES.has(status)) {
    return true;
  }

  // Check error codes / network codes
  if (typeof error === 'object') {
    const errObj = error as Record<string, unknown>;
    const code = typeof errObj.code === 'string' ? errObj.code : '';
    const causeCode =
      errObj.cause && typeof errObj.cause === 'object' && 'code' in errObj.cause
        ? String((errObj.cause as Record<string, unknown>).code)
        : '';
    const message = typeof errObj.message === 'string' ? errObj.message : '';

    if (code === 'ECONNRESET' || code === 'ETIMEDOUT' || causeCode === 'ECONNRESET' || causeCode === 'ETIMEDOUT') {
      return true;
    }

    if (message.includes('ECONNRESET') || message.includes('ETIMEDOUT')) {
      return true;
    }
  } else if (typeof error === 'string') {
    if (error.includes('ECONNRESET') || error.includes('ETIMEDOUT')) {
      return true;
    }
  }

  return false;
}

/**
 * Calculates exponential backoff delay with formula:
 * delay = min(baseDelay * 2^attempt + jitter, maxDelay)
 */
export function calculateBackoffDelay(
  attempt: number,
  baseDelayMs: number = DEFAULT_RETRY_OPTIONS.baseDelayMs,
  maxDelayMs: number = DEFAULT_RETRY_OPTIONS.maxDelayMs,
  jitter: number = 0
): number {
  return Math.min(baseDelayMs * Math.pow(2, attempt) + jitter, maxDelayMs);
}

const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

/**
 * Executes a function with automatic exponential backoff retry for transient errors.
 */
export async function withOpenAiRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const maxRetries = options?.maxRetries ?? DEFAULT_RETRY_OPTIONS.maxRetries;
  const baseDelayMs = options?.baseDelayMs ?? DEFAULT_RETRY_OPTIONS.baseDelayMs;
  const maxDelayMs = options?.maxDelayMs ?? DEFAULT_RETRY_OPTIONS.maxDelayMs;
  const sleep =
    options?.sleepFn ??
    ((ms: number) =>
      new Promise((resolve) => setTimeout(resolve, isTestEnv ? Math.min(ms, 5) : ms)));

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      if (attempt >= maxRetries || !isTransientError(error)) {
        throw error;
      }

      let jitter = 0;
      if (typeof options?.jitter === 'number') {
        jitter = options.jitter;
      } else if (options?.jitter !== false) {
        jitter = Math.floor(Math.random() * 100);
      }

      const delayMs = calculateBackoffDelay(attempt, baseDelayMs, maxDelayMs, jitter);

      options?.onRetry?.(error, attempt + 1, delayMs);

      await sleep(delayMs);
    }
  }

  throw new Error('Unexpected retry loop termination');
}
