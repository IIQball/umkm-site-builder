/**
 * In-memory rate limiter using Map.
 *
 * Counters live in one isolate, and Cloudflare Workers runs many isolates per deployment,
 * so the effective limit is per-isolate rather than global. Use a distributed store such as
 * Redis or a Durable Object if the limit ever needs to be exact.
 *
 * Expired entries are pruned during `check()` rather than on a timer: workerd forbids
 * `setInterval` in global scope, and these limiters are constructed at module scope in
 * middleware, so a timer here throws while the module is evaluating and takes down every
 * route on the Worker.
 */

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

export class InMemoryRateLimiter {
  private store: Map<string, RateLimitInfo>;
  private limit: number;
  private windowMs: number;
  private cleanupIntervalMs: number;
  private nextCleanupAt: number;

  /**
   * @param limit - Maximum number of requests allowed within the window.
   * @param windowMs - Time window in milliseconds.
   */
  constructor(limit: number, windowMs: number) {
    this.store = new Map();
    this.limit = limit;
    this.windowMs = windowMs;
    this.cleanupIntervalMs = Math.max(windowMs, 60000);
    this.nextCleanupAt = Date.now() + this.cleanupIntervalMs;
  }

  /**
   * Check and increment the rate limit for a given key (e.g. IP address).
   * @returns `true` if allowed, `false` if limit exceeded.
   */
  public check(key: string): boolean {
    const now = Date.now();

    // Amortised sweep: at most one pass per cleanup interval, on whichever request
    // happens to cross the deadline.
    if (now >= this.nextCleanupAt) {
      this.cleanup(now);
      this.nextCleanupAt = now + this.cleanupIntervalMs;
    }

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

  private cleanup(now: number) {
    for (const [key, info] of this.store.entries()) {
      if (now > info.resetTime) {
        this.store.delete(key);
      }
    }
  }
}
