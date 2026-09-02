/**
 * In-memory rate limiter using Map.
 * Note: This is an in-memory implementation for a single process.
 * In a serverless or multi-instance environment, a distributed store (like Redis) is recommended.
 */

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

export class InMemoryRateLimiter {
  private store: Map<string, RateLimitInfo>;
  private limit: number;
  private windowMs: number;

  /**
   * @param limit - Maximum number of requests allowed within the window.
   * @param windowMs - Time window in milliseconds.
   */
  constructor(limit: number, windowMs: number) {
    this.store = new Map();
    this.limit = limit;
    this.windowMs = windowMs;

    // Periodically clean up expired entries to prevent memory leaks
    setInterval(() => this.cleanup(), Math.max(windowMs, 60000));
  }

  /**
   * Check and increment the rate limit for a given key (e.g. IP address).
   * @returns `true` if allowed, `false` if limit exceeded.
   */
  public check(key: string): boolean {
    const now = Date.now();
    const info = this.store.get(key);

    if (!info) {
      this.store.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (now > info.resetTime) {
      // Window expired, reset count
      info.count = 1;
      info.resetTime = now + this.windowMs;
      return true;
    }

    if (info.count >= this.limit) {
      return false; // Limit exceeded
    }

    info.count++;
    return true;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, info] of this.store.entries()) {
      if (now > info.resetTime) {
        this.store.delete(key);
      }
    }
  }
}
