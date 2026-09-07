import { describe, it, expect } from 'vitest';
import { CheckSubdomainInput } from '../../src/lib/stores/schemas';

describe('CheckSubdomainInput schema', () => {
  it('accepts valid subdomains', () => {
    const valid = ['kopi-budi', 'toko123', 'abc', 'a-b-c', 'my-store-name'];
    for (const subdomain of valid) {
      const result = CheckSubdomainInput.safeParse({ subdomain });
      expect(result.success, `expected "${subdomain}" to be valid`).toBe(true);
    }
  });

  it('rejects subdomains shorter than 3 characters', () => {
    const result = CheckSubdomainInput.safeParse({ subdomain: 'ab' });
    expect(result.success).toBe(false);
  });

  it('rejects subdomains longer than 63 characters', () => {
    const result = CheckSubdomainInput.safeParse({ subdomain: 'a'.repeat(64) });
    expect(result.success).toBe(false);
  });

  it('rejects subdomains with uppercase letters', () => {
    const result = CheckSubdomainInput.safeParse({ subdomain: 'KopiBudi' });
    expect(result.success).toBe(false);
  });

  it('rejects subdomains with special characters', () => {
    const result = CheckSubdomainInput.safeParse({ subdomain: 'kopi_budi' });
    expect(result.success).toBe(false);
  });

  it('accepts valid subdomains with numbers and hyphens', () => {
    const result = CheckSubdomainInput.safeParse({ subdomain: 'kopi-budi-123' });
    expect(result.success).toBe(true);
  });

  it('rejects empty string', () => {
    const result = CheckSubdomainInput.safeParse({ subdomain: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing subdomain field', () => {
    const result = CheckSubdomainInput.safeParse({});
    expect(result.success).toBe(false);
  });

  it('accepts exactly 3 characters', () => {
    const result = CheckSubdomainInput.safeParse({ subdomain: 'abc' });
    expect(result.success).toBe(true);
  });

  it('accepts exactly 63 characters', () => {
    const result = CheckSubdomainInput.safeParse({ subdomain: 'a'.repeat(63) });
    expect(result.success).toBe(true);
  });
});
