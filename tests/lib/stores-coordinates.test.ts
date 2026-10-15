import { describe, it, expect } from 'vitest';
import {
  extractCoordinatesFromUrl,
  findDistrictCoordinates,
  findCoordinatesInAddress,
  resolveStoreCoordinates,
} from '@/lib/stores/coordinates';
import { DEFAULT_PLATFORM_REGION } from '@/config/platform';

describe('Store Coordinates Utility', () => {
  describe('extractCoordinatesFromUrl', () => {
    it('should extract from ?q=lat,lng query param', () => {
      const url = 'https://maps.google.com/?q=-8.2192,114.3692';
      const result = extractCoordinatesFromUrl(url);
      expect(result).toEqual({ lat: -8.2192, lng: 114.3692 });
    });

    it('should extract from place path with @lat,lng', () => {
      const url = 'https://www.google.com/maps/place/Toko/@-8.2208615,114.158199,17z';
      const result = extractCoordinatesFromUrl(url);
      expect(result).toEqual({ lat: -8.2208615, lng: 114.158199 });
    });

    it('should extract from Google place data parameters !3d and !4d', () => {
      const url = 'https://www.google.com/maps/place/data=!4m6!3m5!1s0x0!8m2!3d-8.3044!4d114.2921';
      const result = extractCoordinatesFromUrl(url);
      expect(result).toEqual({ lat: -8.3044, lng: 114.2921 });
    });

    it('should extract from ?ll=lat,lng center param', () => {
      const url = 'https://maps.google.com/maps?ll=-8.3639,114.1511';
      const result = extractCoordinatesFromUrl(url);
      expect(result).toEqual({ lat: -8.3639, lng: 114.1511 });
    });

    it('should return null for invalid or empty URLs', () => {
      expect(extractCoordinatesFromUrl(null)).toBeNull();
      expect(extractCoordinatesFromUrl('')).toBeNull();
      expect(extractCoordinatesFromUrl('https://example.com')).toBeNull();
    });
  });

  describe('findDistrictCoordinates', () => {
    it('should match district name directly', () => {
      const result = findDistrictCoordinates('Songgon');
      expect(result).toEqual({ lat: -8.2208, lng: 114.1588 });
    });

    it('should match district name with "Kecamatan" prefix', () => {
      const result = findDistrictCoordinates('Kecamatan Rogojampi');
      expect(result).toEqual({ lat: -8.3044, lng: 114.2921 });
    });

    it('should match district name with "Kec." prefix', () => {
      const result = findDistrictCoordinates('Kec. Genteng');
      expect(result).toEqual({ lat: -8.3639, lng: 114.1511 });
    });

    it('should match "Banyuwangi" to Banyuwangi (Kota)', () => {
      const result = findDistrictCoordinates('Banyuwangi');
      expect(result).toEqual({ lat: -8.2192, lng: 114.3692 });
    });

    it('should return null for unknown district', () => {
      expect(findDistrictCoordinates('Konoha')).toBeNull();
      expect(findDistrictCoordinates(null)).toBeNull();
    });
  });

  describe('findCoordinatesInAddress', () => {
    it('should extract coordinates from address containing district name', () => {
      const address = 'RT/RW 004/002, Dusun Pasar, Kel./Desa Sumber Arum, Kec. Songgon, Kab. Banyuwangi';
      const result = findCoordinatesInAddress(address);
      expect(result).toEqual({ lat: -8.2208, lng: 114.1588 });
    });

    it('should extract coordinates from standard street address', () => {
      const address = 'Jl. Raya Rogojampi No. 10, Banyuwangi';
      const result = findCoordinatesInAddress(address);
      expect(result).toEqual({ lat: -8.3044, lng: 114.2921 });
    });

    it('should return null if no district is found in address', () => {
      expect(findCoordinatesInAddress('Jl. Kenangan Indah')).toBeNull();
      expect(findCoordinatesInAddress(null)).toBeNull();
    });
  });

  describe('resolveStoreCoordinates', () => {
    it('should prioritize direct Google Maps URL coordinates', async () => {
      const result = await resolveStoreCoordinates({
        googleMapsUrl: 'https://maps.google.com/?q=-8.2285,114.3168',
        district: 'Genteng',
        address: 'Jl. Raya Songgon No. 1',
      });
      expect(result).toEqual({ lat: -8.2285, lng: 114.3168 });
    });

    it('should fall back to district if URL has no coordinates', async () => {
      const result = await resolveStoreCoordinates({
        googleMapsUrl: 'https://example.com/invalid',
        district: 'Genteng',
      });
      expect(result).toEqual({ lat: -8.3639, lng: 114.1511 });
    });

    it('should fall back to address if district is missing', async () => {
      const result = await resolveStoreCoordinates({
        address: 'Jl. Raya Srono No. 5',
      });
      expect(result).toEqual({ lat: -8.3986, lng: 114.2588 });
    });

    it('should fall back to regional center when all parameters fail', async () => {
      const result = await resolveStoreCoordinates({});
      expect(result).toEqual({
        lat: DEFAULT_PLATFORM_REGION.center.lat,
        lng: DEFAULT_PLATFORM_REGION.center.lng,
      });
    });
  });
});
