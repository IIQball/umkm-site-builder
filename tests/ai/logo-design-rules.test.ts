import { describe, it, expect } from 'bun:test';
import {
  getCategoryRedFlags,
  resolveMarkTypeGuide,
} from '@/services/ai/rules/logo-design-rules';

describe('Kaan Kiziltug Rule Resolution Helpers (bun:test)', () => {
  it('resolves coffee red flags for coffee category', () => {
    const redFlags = getCategoryRedFlags('Kopi & Kafe');
    expect(redFlags.some((f) => f.includes('steaming coffee cup'))).toBe(true);
    expect(redFlags.some((f) => f.includes('scattered coffee beans'))).toBe(true);
  });

  it('resolves culinary red flags for food/resto category', () => {
    const redFlags = getCategoryRedFlags('Resto & Warung Makan');
    expect(redFlags.some((f) => f.includes('chef hats'))).toBe(true);
    expect(redFlags.some((f) => f.includes('crossed spoon and fork'))).toBe(true);
  });

  it('resolves retail & kelontong red flags for shop/fashion category', () => {
    const redFlags = getCategoryRedFlags('Toko Kelontong Berkah');
    expect(redFlags.some((f) => f.includes('shopping bags'))).toBe(true);
    expect(redFlags.some((f) => f.includes('grocery shopping carts'))).toBe(true);
  });

  it('resolves processed goods and services red flags including general anti-slop rules', () => {
    const herbalFlags = getCategoryRedFlags('Produk Olahan Jamu Herbal');
    expect(herbalFlags.some((f) => f.includes('generic leaf clipart'))).toBe(true);
    expect(herbalFlags.some((f) => f.includes('text or lettering'))).toBe(true);
    expect(herbalFlags.some((f) => f.includes('cartoon mascot'))).toBe(true);
    expect(herbalFlags.some((f) => f.includes('emblem badge'))).toBe(true);

    const serviceFlags = getCategoryRedFlags('Jasa Bengkel Motor');
    expect(serviceFlags.some((f) => f.includes('generic gear wheels'))).toBe(true);
  });

  it('resolves mark type guide according to visual style including Indonesian UMKM aliases', () => {
    expect(resolveMarkTypeGuide('letter_fusion')).toContain('Letter Fusion');
    expect(resolveMarkTypeGuide('Monogram Initials')).toContain('Letter Fusion');
    expect(resolveMarkTypeGuide('tipografi')).toContain('Letter Fusion');
    expect(resolveMarkTypeGuide('animal_character')).toContain('Animal / Character');
    expect(resolveMarkTypeGuide('Mascot Silhouette')).toContain('Animal / Character');
    expect(resolveMarkTypeGuide('maskot')).toContain('Animal / Character');
    expect(resolveMarkTypeGuide('Heritage Batik')).toContain('Neo-Heritage Minimalist');
    expect(resolveMarkTypeGuide('tradisional')).toContain('Neo-Heritage Minimalist');
    expect(resolveMarkTypeGuide('pictorial_symbol')).toContain('Pictorial Symbol');
    expect(resolveMarkTypeGuide('abstract_mark')).toContain('Abstract Geometric Mark');
    expect(resolveMarkTypeGuide('minimalis')).toContain('Abstract Geometric Mark');
    expect(resolveMarkTypeGuide()).toContain('Pictorial Symbol');
  });
});
