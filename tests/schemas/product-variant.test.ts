import { describe, it, expect } from 'vitest';
import {
  VariantOptionSchema,
  VariantGroupSchema,
  ProductVariantsSchema,
} from '../../src/schemas/product-variant.schema';

describe('VariantOptionSchema', () => {
  it('accepts valid option', () => {
    const result = VariantOptionSchema.safeParse({
      name: 'Large',
      priceAdjustment: 5000,
      isAvailable: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Large');
      expect(result.data.priceAdjustment).toBe(5000);
      expect(result.data.isAvailable).toBe(true);
    }
  });

  it('applies defaults for priceAdjustment and isAvailable', () => {
    const result = VariantOptionSchema.safeParse({ name: 'Small' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priceAdjustment).toBe(0);
      expect(result.data.isAvailable).toBe(true);
    }
  });

  it('rejects empty name', () => {
    const result = VariantOptionSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('allows negative priceAdjustment for discounts', () => {
    const result = VariantOptionSchema.safeParse({
      name: 'Economy',
      priceAdjustment: -3000,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priceAdjustment).toBe(-3000);
    }
  });

  it('rejects name exceeding 100 characters', () => {
    const result = VariantOptionSchema.safeParse({
      name: 'x'.repeat(101),
    });
    expect(result.success).toBe(false);
  });
});

describe('VariantGroupSchema', () => {
  it('accepts valid group with multiple options', () => {
    const result = VariantGroupSchema.safeParse({
      groupName: 'Ukuran',
      options: [
        { name: 'S', priceAdjustment: 0 },
        { name: 'M', priceAdjustment: 0 },
        { name: 'L', priceAdjustment: 5000 },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.options).toHaveLength(3);
    }
  });

  it('rejects empty group name', () => {
    const result = VariantGroupSchema.safeParse({
      groupName: '',
      options: [{ name: 'Red' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects group name exceeding 50 characters', () => {
    const result = VariantGroupSchema.safeParse({
      groupName: 'x'.repeat(51),
      options: [{ name: 'Red' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects group with empty options array', () => {
    const result = VariantGroupSchema.safeParse({
      groupName: 'Color',
      options: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects group with more than 20 options', () => {
    const options = Array.from({ length: 21 }, (_, i) => ({
      name: `Option ${i}`,
    }));
    const result = VariantGroupSchema.safeParse({
      groupName: 'Size',
      options,
    });
    expect(result.success).toBe(false);
  });
});

describe('ProductVariantsSchema', () => {
  it('accepts empty array (no variants)', () => {
    const result = ProductVariantsSchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it('accepts valid array of groups', () => {
    const result = ProductVariantsSchema.safeParse([
      {
        groupName: 'Ukuran',
        options: [{ name: 'S' }, { name: 'M' }, { name: 'L' }],
      },
      {
        groupName: 'Warna',
        options: [{ name: 'Merah' }, { name: 'Biru' }],
      },
    ]);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(2);
    }
  });

  it('rejects more than 5 groups', () => {
    const groups = Array.from({ length: 6 }, (_, i) => ({
      groupName: `Group ${i}`,
      options: [{ name: 'Option' }],
    }));
    const result = ProductVariantsSchema.safeParse(groups);
    expect(result.success).toBe(false);
  });

  it('accepts exactly 5 groups', () => {
    const groups = Array.from({ length: 5 }, (_, i) => ({
      groupName: `Group ${i}`,
      options: [{ name: 'Option' }],
    }));
    const result = ProductVariantsSchema.safeParse(groups);
    expect(result.success).toBe(true);
  });

  it('rejects groups with invalid nested options', () => {
    const result = ProductVariantsSchema.safeParse([
      {
        groupName: 'Size',
        options: [{ name: '' }],
      },
    ]);
    expect(result.success).toBe(false);
  });
});
