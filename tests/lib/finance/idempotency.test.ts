import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdempotencyManager, extractIdempotencyKey } from '@/lib/finance/idempotency';

describe('Idempotency Utility', () => {
  describe('extractIdempotencyKey', () => {
    it('should extract key from idempotency-key header', () => {
      const request = new Request('http://localhost:3000/api/pay', {
        headers: { 'idempotency-key': 'key_header_123' },
      });
      const result = extractIdempotencyKey(request);
      expect(result).toBe('key_header_123');
    });

    it('should extract key from x-idempotency-key header', () => {
      const request = new Request('http://localhost:3000/api/pay', {
        headers: { 'x-idempotency-key': 'key_x_header_456' },
      });
      const result = extractIdempotencyKey(request);
      expect(result).toBe('key_x_header_456');
    });

    it('should extract key from request body if header is not present', () => {
      const request = new Request('http://localhost:3000/api/pay');
      const result = extractIdempotencyKey(request, { idempotencyKey: 'key_body_789' });
      expect(result).toBe('key_body_789');
    });

    it('should prioritize header over body', () => {
      const request = new Request('http://localhost:3000/api/pay', {
        headers: { 'idempotency-key': 'key_from_header' },
      });
      const result = extractIdempotencyKey(request, { idempotencyKey: 'key_from_body' });
      expect(result).toBe('key_from_header');
    });

    it('should trim whitespace from key', () => {
      const request = new Request('http://localhost:3000/api/pay', {
        headers: { 'idempotency-key': '   clean_me   ' },
      });
      const result = extractIdempotencyKey(request);
      expect(result).toBe('clean_me');
    });

    it('should return null if key is empty or whitespace only', () => {
      const request = new Request('http://localhost:3000/api/pay', {
        headers: { 'idempotency-key': '   ' },
      });
      const result = extractIdempotencyKey(request);
      expect(result).toBeNull();
    });

    it('should return null if key exceeds 255 characters', () => {
      const longKey = 'a'.repeat(256);
      const request = new Request('http://localhost:3000/api/pay', {
        headers: { 'idempotency-key': longKey },
      });
      const result = extractIdempotencyKey(request);
      expect(result).toBeNull();
    });
  });

  describe('IdempotencyManager', () => {
    let manager: IdempotencyManager;

    beforeEach(() => {
      manager = new IdempotencyManager(5000);
      manager.clear();
    });

    it('should execute function once and return result', async () => {
      const fn = vi.fn().mockResolvedValue({ status: 'ok', id: 1 });
      const result = await manager.execute({ key: 'test_1', fn });

      expect(fn).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ status: 'ok', id: 1 });
    });

    it('should return cached result on sequential calls with the same key', async () => {
      const fn = vi.fn().mockResolvedValue({ invoiceId: 'inv_abc' });

      const res1 = await manager.execute({ key: 'idem_key_1', fn });
      const res2 = await manager.execute({ key: 'idem_key_1', fn });

      expect(fn).toHaveBeenCalledTimes(1);
      expect(res1).toEqual(res2);
    });

    it('should deduplicate concurrent in-flight requests (prevent double click)', async () => {
      let callCount = 0;
      const slowFn = vi.fn(async () => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 50));
        return { success: true, count: callCount };
      });

      // Simulate simultaneous double-clicks
      const [res1, res2] = await Promise.all([
        manager.execute({ key: 'double_click_key', fn: slowFn }),
        manager.execute({ key: 'double_click_key', fn: slowFn }),
      ]);

      expect(slowFn).toHaveBeenCalledTimes(1);
      expect(res1).toEqual({ success: true, count: 1 });
      expect(res2).toEqual({ success: true, count: 1 });
    });

    it('should check DB first if checkDb callback is provided', async () => {
      const checkDb = vi.fn().mockResolvedValue({ id: 'existing_from_db', status: 'pending' });
      const fn = vi.fn().mockResolvedValue({ id: 'new_from_fn', status: 'pending' });

      const result = await manager.execute({
        key: 'check_db_key',
        fn,
        checkDb,
      });

      expect(checkDb).toHaveBeenCalledTimes(1);
      expect(fn).not.toHaveBeenCalled();
      expect(result).toEqual({ id: 'existing_from_db', status: 'pending' });
    });

    it('should clean up in-flight entry if function throws an error', async () => {
      const failingFn = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(manager.execute({ key: 'fail_key', fn: failingFn })).rejects.toThrow('Network error');

      // Next retry should be allowed to run
      const retryFn = vi.fn().mockResolvedValue({ recovered: true });
      const retryResult = await manager.execute({ key: 'fail_key', fn: retryFn });

      expect(retryFn).toHaveBeenCalledTimes(1);
      expect(retryResult).toEqual({ recovered: true });
    });
  });
});
