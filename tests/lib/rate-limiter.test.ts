import { describe, it, expect, vi, afterEach } from 'vitest';
import { InMemoryRateLimiter } from '@/lib/utils/rate-limiter';

type WithStore = { store: Map<string, unknown> };

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('InMemoryRateLimiter', () => {
  it('does not schedule a timer when constructed', () => {
    // Regression guard: these limiters are constructed at module scope in middleware, and
    // workerd rejects setInterval in global scope. A timer here throws while the module is
    // evaluating, which takes down every route on the Worker with an empty 500.
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    new InMemoryRateLimiter(5, 60_000);
    expect(setIntervalSpy).not.toHaveBeenCalled();
  });

  it('allows requests up to the limit and blocks the next one', () => {
    const limiter = new InMemoryRateLimiter(3, 60_000);
    expect([limiter.check('ip'), limiter.check('ip'), limiter.check('ip')]).toEqual([
      true,
      true,
      true,
    ]);
    expect(limiter.check('ip')).toBe(false);
  });

  it('counts each key separately', () => {
    const limiter = new InMemoryRateLimiter(1, 60_000);
    expect(limiter.check('a')).toBe(true);
    expect(limiter.check('b')).toBe(true);
    expect(limiter.check('a')).toBe(false);
  });

  it('allows again once the window has passed', () => {
    vi.useFakeTimers();
    const limiter = new InMemoryRateLimiter(1, 60_000);
    expect(limiter.check('ip')).toBe(true);
    expect(limiter.check('ip')).toBe(false);

    vi.advanceTimersByTime(60_001);
    expect(limiter.check('ip')).toBe(true);
  });

  it('prunes expired entries during check, with no timer running', () => {
    vi.useFakeTimers();
    const limiter = new InMemoryRateLimiter(5, 60_000);
    limiter.check('stale-1');
    limiter.check('stale-2');
    expect((limiter as unknown as WithStore).store.size).toBe(2);

    // Past both the entry window and the cleanup interval, so the next check sweeps.
    vi.advanceTimersByTime(120_001);
    limiter.check('fresh');

    const { store } = limiter as unknown as WithStore;
    expect(store.has('stale-1')).toBe(false);
    expect(store.has('stale-2')).toBe(false);
    expect(store.has('fresh')).toBe(true);
  });
});
