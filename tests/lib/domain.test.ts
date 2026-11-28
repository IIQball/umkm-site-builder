import { describe, expect, it } from 'vitest';
import { extractSubdomain, getMainDomain, getStoreDirectUrl } from '@/lib/domain';

describe('domain helpers', () => {
  it.each([
    ['pinoka.my.id', null],
    ['pinoka.my.id:443', null],
    ['www.pinoka.my.id', null],
    ['Kopi.pinoka.my.id:443', 'kopi'],
    ['pinoka.co.id', null],
    ['kopi.pinoka.co.id', 'kopi'],
    ['pinoka.pinokaofficial.workers.dev', null],
    ['kopi.pinoka.pinokaofficial.workers.dev', 'kopi'],
    ['kopi.my.example', 'kopi'],
  ])('extracts the tenant from %s', (host, tenant) => {
    expect(extractSubdomain(host)).toBe(tenant);
  });

  it.each([
    ['pinoka.my.id', 'pinoka.my.id'],
    ['www.pinoka.my.id', 'pinoka.my.id'],
    ['kopi.pinoka.my.id:443', 'pinoka.my.id:443'],
  ])('finds the site domain for %s', (host, domain) => {
    expect(getMainDomain(host)).toBe(domain);
  });

  it('builds storefront URLs under the site domain', () => {
    expect(getStoreDirectUrl('kopi', 'pinoka.my.id')).toBe('https://kopi.pinoka.my.id');
  });
});
