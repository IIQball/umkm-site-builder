/**
 * Idempotency Utility for Payment & Financial Transactions
 * Prevents duplicate transactions and charges caused by network retries or double clicks.
 */

export interface IdempotencyExecutionOptions<T> {
  key: string;
  fn: () => Promise<T>;
  checkDb?: () => Promise<T | null>;
  ttlMs?: number;
}

export class IdempotencyManager {
  private inFlight = new Map<string, Promise<unknown>>();
  private cache = new Map<string, { result: unknown; expiresAt: number }>();
  private defaultTtlMs: number;
  private nextCleanupAt: number;
  private cleanupIntervalMs: number;

  constructor(defaultTtlMs = 10 * 60 * 1000) {
    this.defaultTtlMs = defaultTtlMs;
    this.cleanupIntervalMs = Math.max(defaultTtlMs, 60000);
    this.nextCleanupAt = Date.now() + this.cleanupIntervalMs;
  }

  /**
   * Execute an operation with idempotency protection.
   * If a request with the same key is in-flight, awaits and returns the same result.
   * If already completed within TTL or found in DB, returns cached/existing result immediately.
   */
  public async execute<T>(options: IdempotencyExecutionOptions<T>): Promise<T> {
    const { key, fn, checkDb, ttlMs = this.defaultTtlMs } = options;
    const now = Date.now();

    if (now >= this.nextCleanupAt) {
      this.cleanup(now);
      this.nextCleanupAt = now + this.cleanupIntervalMs;
    }

    // 1. In-memory cache hit
    const cached = this.cache.get(key);
    if (cached && now < cached.expiresAt) {
      return cached.result as T;
    }

    // 2. Database check (if callback provided)
    if (checkDb) {
      const dbResult = await checkDb();
      if (dbResult !== null && dbResult !== undefined) {
        this.cache.set(key, { result: dbResult, expiresAt: now + ttlMs });
        return dbResult;
      }
    }

    // 3. In-flight promise reuse (guards concurrent double-clicks)
    const inFlightPromise = this.inFlight.get(key);
    if (inFlightPromise) {
      return (await inFlightPromise) as T;
    }

    // 4. Execute operation and cache result
    const promise = fn();
    this.inFlight.set(key, promise);

    try {
      const result = await promise;
      this.cache.set(key, { result, expiresAt: Date.now() + ttlMs });
      return result;
    } finally {
      this.inFlight.delete(key);
    }
  }

  private cleanup(now: number): void {
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  public clear(): void {
    this.inFlight.clear();
    this.cache.clear();
  }
}

export const idempotencyManager = new IdempotencyManager();

/**
 * Extracts and sanitizes idempotency key from request headers or body.
 */
export function extractIdempotencyKey(
  request: Request,
  body?: { idempotencyKey?: string | null }
): string | null {
  const headerKey =
    request.headers.get('idempotency-key') ||
    request.headers.get('x-idempotency-key');
  const rawKey = headerKey || body?.idempotencyKey;

  if (!rawKey || typeof rawKey !== 'string') {
    return null;
  }

  const trimmed = rawKey.trim();
  if (trimmed.length === 0 || trimmed.length > 255) {
    return null;
  }

  return trimmed;
}
