export const DEFAULT_DB_TIMEOUT_MS = 10_000;

/**
 * Error thrown when a database operation exceeds its configured execution deadline.
 */
export class DatabaseTimeoutError extends Error {
  readonly status = 504;
  readonly code = 'GATEWAY_TIMEOUT';
  readonly operation: string;
  readonly timeoutMs: number;

  constructor(operation: string, timeoutMs: number) {
    super(`Database operation "${operation}" timed out after ${timeoutMs}ms`);
    this.name = 'DatabaseTimeoutError';
    this.operation = operation;
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Wraps an asynchronous database call with a bounded timeout and timer cleanup.
 */
export async function withDbTimeout<T>(
  operation: string,
  fn: () => Promise<T>,
  timeoutMs = DEFAULT_DB_TIMEOUT_MS
): Promise<T> {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return fn();
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new DatabaseTimeoutError(operation, timeoutMs));
    }, timeoutMs);
  });

  try {
    return await Promise.race([fn(), timeoutPromise]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

