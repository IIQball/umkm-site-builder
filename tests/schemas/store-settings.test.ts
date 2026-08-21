import { describe, it, expect } from 'vitest';
import { StoreSettingsInput } from '../../src/lib/stores/schemas';

describe('StoreSettingsInput schema', () => {
  it('accepts valid store settings data', () => {
    const valid = {
      name: 'Kopi Budi',
      waNumber: '6281234567890',
      googleMapsUrl: 'https://maps.google.com/?q=123',
    };
    const result = StoreSettingsInput.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('accepts valid store settings without googleMapsUrl', () => {
    const valid = {
      name: 'Kopi Budi',
      waNumber: '6281234567890',
    };
    const result = StoreSettingsInput.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects names shorter than 3 characters', () => {
    const invalid = {
      name: 'Ko',
      waNumber: '6281234567890',
    };
    const result = StoreSettingsInput.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects invalid WhatsApp numbers', () => {
    const invalid = [
      '081234567890', // Must start with 628
      '+6281234567890', // No +
      '62812', // Too short
      '6281234567890123', // Too long
      '628abcdefghij' // Not numeric
    ];
    
    for (const waNumber of invalid) {
      const result = StoreSettingsInput.safeParse({
        name: 'Kopi Budi',
        waNumber,
      });
      expect(result.success, `Expected ${waNumber} to be invalid`).toBe(false);
    }
  });

  it('rejects invalid Google Maps URLs', () => {
    const invalid = {
      name: 'Kopi Budi',
      waNumber: '6281234567890',
      googleMapsUrl: 'not-a-url',
    };
    const result = StoreSettingsInput.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
