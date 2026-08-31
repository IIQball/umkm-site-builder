import { describe, it, expect } from 'vitest';
import { extractSubdomain } from '@/lib/routing/subdomain';

describe('extractSubdomain', () => {
  describe('main domain cases', () => {
    it('returns null for main domain', () => {
      expect(extractSubdomain('umkm.site', 'umkm.site')).toBeNull();
    });

    it('extracts www as subdomain', () => {
      expect(extractSubdomain('www.umkm.site', 'umkm.site')).toBe('www');
    });

    it('is case-insensitive', () => {
      expect(extractSubdomain('UMKM.SITE', 'umkm.site')).toBeNull();
      expect(extractSubdomain('umkm.site', 'UMKM.SITE')).toBeNull();
    });
  });

  describe('subdomain extraction', () => {
    it('extracts single-level subdomain', () => {
      expect(extractSubdomain('store.umkm.site', 'umkm.site')).toBe('store');
    });

    it('extracts subdomain from multi-level host', () => {
      expect(extractSubdomain('my-shop.example.com', 'example.com')).toBe('my-shop');
    });

    it('handles hyphens in subdomain', () => {
      expect(extractSubdomain('my-awesome-store.umkm.site', 'umkm.site')).toBe('my-awesome-store');
    });

    it('handles numbers in subdomain', () => {
      expect(extractSubdomain('store123.umkm.site', 'umkm.site')).toBe('store123');
    });
  });

  describe('localhost and IP address cases', () => {
    it('returns null for localhost', () => {
      expect(extractSubdomain('localhost', 'localhost:4321')).toBeNull();
    });

    it('returns null for localhost with port', () => {
      expect(extractSubdomain('localhost:3000', 'localhost:4321')).toBeNull();
    });

    it('returns null for 127.0.0.1', () => {
      expect(extractSubdomain('127.0.0.1', 'localhost')).toBeNull();
    });

    it('returns null for 127.0.0.1 with port', () => {
      expect(extractSubdomain('127.0.0.1:4321', 'localhost:4321')).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('returns null for empty host', () => {
      expect(extractSubdomain('', 'umkm.site')).toBeNull();
    });

    it('returns null for empty main domain', () => {
      expect(extractSubdomain('store.umkm.site', '')).toBeNull();
    });

    it('returns null for both empty', () => {
      expect(extractSubdomain('', '')).toBeNull();
    });

    it('trims whitespace', () => {
      expect(extractSubdomain('  store.umkm.site  ', '  umkm.site  ')).toBe('store');
    });

    it('handles host with port number', () => {
      expect(extractSubdomain('store.umkm.site:3000', 'umkm.site')).toBe('store');
    });

    it('returns null when host has fewer parts than main domain', () => {
      expect(extractSubdomain('com', 'example.com')).toBeNull();
    });
  });
});
