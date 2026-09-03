import { describe, it, expect } from 'vitest';
import { generateWhatsAppLink, generateWhatsAppOrderUrl, formatWhatsAppNumber, getEffectiveWhatsAppNumber, DEFAULT_DEMO_WA_NUMBER } from '@/lib/whatsapp';

describe('Catalog & WhatsApp Integration', () => {
  describe('formatWhatsAppNumber', () => {
    it('should format 08... to 628...', () => {
      expect(formatWhatsAppNumber('081234567890')).toBe('6281234567890');
    });

    it('should format 8... to 628...', () => {
      expect(formatWhatsAppNumber('81234567890')).toBe('6281234567890');
    });

    it('should keep 628... as is', () => {
      expect(formatWhatsAppNumber('6281234567890')).toBe('6281234567890');
    });

    it('should remove non-numeric characters', () => {
      expect(formatWhatsAppNumber('+62 812-3456-7890')).toBe('6281234567890');
    });

    it('should return empty string if no phone provided', () => {
      expect(formatWhatsAppNumber('')).toBe('');
    });
  });

  describe('getEffectiveWhatsAppNumber', () => {
    it('should return formatted number if provided', () => {
      expect(getEffectiveWhatsAppNumber('081234567890')).toBe('6281234567890');
    });

    it('should return default demo number if not provided', () => {
      expect(getEffectiveWhatsAppNumber(null)).toBe(DEFAULT_DEMO_WA_NUMBER);
      expect(getEffectiveWhatsAppNumber('')).toBe(DEFAULT_DEMO_WA_NUMBER);
      expect(getEffectiveWhatsAppNumber(undefined)).toBe(DEFAULT_DEMO_WA_NUMBER);
    });
  });

  describe('generateWhatsAppLink', () => {
    it('should generate correct wa.me link with custom text', () => {
      const link = generateWhatsAppLink('081234567890', 'Halo min');
      expect(link).toBe('https://wa.me/6281234567890?text=Halo%20min');
    });

    it('should generate correct wa.me link with default text', () => {
      const link = generateWhatsAppLink('081234567890');
      expect(link).toContain('https://wa.me/6281234567890?text=Halo');
    });
  });

  describe('CTA Beli WA (generateWhatsAppOrderUrl)', () => {
    it('should generate correct order template without price', () => {
      const link = generateWhatsAppOrderUrl('081234567890', 'Produk A');
      expect(link).toContain('https://wa.me/6281234567890?text=');
      const decoded = decodeURIComponent(link.split('text=')[1]);
      expect(decoded).toContain('Halo, saya tertarik dengan produk Produk A');
      expect(decoded).toContain('- Nama:');
    });

    it('should generate correct order template with price and variant', () => {
      const link = generateWhatsAppOrderUrl('081234567890', 'Produk B', 50000, 'Merah');
      const decoded = decodeURIComponent(link.split('text=')[1]);
      expect(decoded).toContain('Rp 50.000');
      expect(decoded).toContain('Varian: Merah');
    });
  });

  describe('Category Filter Logic (Frontend Mock Simulation)', () => {
    it('should filter products correctly by activeCategoryId', () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', categoryId: 'cat_01' },
        { id: '2', name: 'Product 2', categoryId: 'cat_02' },
        { id: '3', name: 'Product 3', categoryId: 'cat_01' },
      ];

      const activeCategoryId: string = 'cat_01';
      const filtered = activeCategoryId === 'all' 
        ? mockProducts 
        : mockProducts.filter(p => p.categoryId === activeCategoryId);

      expect(filtered).toHaveLength(2);
      expect(filtered.map(p => p.id)).toEqual(['1', '3']);
    });

    it('should return all products when activeCategoryId is "all"', () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', categoryId: 'cat_01' },
        { id: '2', name: 'Product 2', categoryId: 'cat_02' },
      ];

      const activeCategoryId: string = 'all';
      const filtered = activeCategoryId === 'all' 
        ? mockProducts 
        : mockProducts.filter(p => p.categoryId === activeCategoryId);

      expect(filtered).toHaveLength(2);
    });
  });
});
