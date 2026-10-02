import { describe, it, expect } from 'vitest';
import { validateStoreInfo, DEFAULT_WA_CHECKOUT_TEMPLATE } from '../../src/components/onboarding/onboarding.helpers';

describe('onboarding helpers', () => {
  const validData = {
    storeName: 'Warung Bu Joko',
    categoryId: 'cat_culinary',
    waNumber: '6281234567890',
    googleMapsUrl: 'https://maps.google.com/?q=banyuwangi',
    address: 'Jl. Ahmad Yani No. 12',
    regionData: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
      district: 'Banyuwangi',
      subDistrict: 'Kepatihan',
      hamlet: 'Kampung Mandar',
      street: 'Jl. Ahmad Yani RT 01 RW 02',
    },
  };

  it('validates correct store information', () => {
    const res = validateStoreInfo(validData);
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });

  it('rejects short store name', () => {
    const res = validateStoreInfo({ ...validData, storeName: 'Ko' });
    expect(res.isValid).toBe(false);
    expect(res.errors.storeName).toBeDefined();
  });

  it('rejects missing category', () => {
    const res = validateStoreInfo({ ...validData, categoryId: '' });
    expect(res.isValid).toBe(false);
    expect(res.errors.categoryId).toBeDefined();
  });

  it('rejects invalid WhatsApp numbers', () => {
    const res = validateStoreInfo({ ...validData, waNumber: '0812345678' });
    expect(res.isValid).toBe(false);
    expect(res.errors.waNumber).toBeDefined();
  });

  it('rejects invalid Google Maps URL', () => {
    const res = validateStoreInfo({ ...validData, googleMapsUrl: 'bukan-url' });
    expect(res.isValid).toBe(false);
    expect(res.errors.googleMapsUrl).toBeDefined();
  });

  it('rejects missing region data', () => {
    const res = validateStoreInfo({
      ...validData,
      regionData: { ...validData.regionData, district: '' },
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.district).toBeDefined();
  });

  it('provides default wa checkout template', () => {
    expect(DEFAULT_WA_CHECKOUT_TEMPLATE).toContain('Halo');
  });
});
