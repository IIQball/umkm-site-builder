import { getEffectiveWhatsAppNumber, generateWhatsAppLink } from '@/lib/whatsapp';

export interface MapBranchItem {
  id: string;
  name: string;
  title?: string;
  address: string;
  googleMapsUrl?: string;
}

export const DEFAULT_MAP_ADDRESS = 'Jl. Raya Sukowati No. 42, Krajan Kidul, Banyuwangi, Jawa Timur';
export const DEFAULT_MAP_TITLE = 'Kunjungi Outlet Resmi Kami';
export const DEFAULT_STORE_NAME = 'Warung Khas Banyuwangi';
export const DEFAULT_STORE_HOURS = 'Buka Setiap Hari (08.00 - 21.00 WIB)';

export const DEFAULT_BRANCHES: MapBranchItem[] = [
  {
    id: 'branch_1',
    name: 'Cabang Utama (Pusat Kota)',
    title: 'Dapur Utama & Pusat Oleh-Oleh',
    address: 'Jl. Ahmad Yani No. 12, Pusat Kota, Banyuwangi',
    googleMapsUrl: 'https://maps.google.com/maps?q=Banyuwangi&t=&z=14&ie=UTF8&iwloc=&output=embed',
  },
  {
    id: 'branch_2',
    name: 'Cabang Rogojampi',
    title: 'Outlet Rogojampi',
    address: 'Jl. Raya Rogojampi No. 45, Rogojampi, Banyuwangi',
    googleMapsUrl: 'https://maps.google.com/maps?q=Rogojampi&t=&z=14&ie=UTF8&iwloc=&output=embed',
  },
  {
    id: 'branch_3',
    name: 'Cabang Genteng',
    title: 'Outlet Genteng',
    address: 'Jl. Gajah Mada No. 88, Genteng, Banyuwangi',
    googleMapsUrl: 'https://maps.google.com/maps?q=Genteng+Banyuwangi&t=&z=14&ie=UTF8&iwloc=&output=embed',
  },
];

export const getCleanWaNumber = getEffectiveWhatsAppNumber;

export function buildWhatsAppHelpLink(waNumber?: string, message: string = 'Halo admin, saya ingin bertanya tentang rute dan jam operasional toko.'): string {
  const clean = getEffectiveWhatsAppNumber(waNumber);
  return generateWhatsAppLink(clean, message);
}

export function cleanIndonesianAddress(address?: string): string {
  if (!address) return '';
  return address
    .replace(/^RT\/?RW\s*[\d/]+\s*,?\s*/gi, '')
    .replace(/Kel\.\/Desa\s*/gi, '')
    .replace(/Desa\s*/gi, '')
    .replace(/Kec\.\s*/gi, '')
    .replace(/Kab\.\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildMapEmbedUrl(
  addressOrUrl?: string,
  zoom: number = 15,
  lat?: number | null,
  lng?: number | null,
  storeName?: string | null,
  fallbackAddress?: string | null
): string {
  // 1. Valid pre-built embed URL
  if (addressOrUrl && addressOrUrl.includes('output=embed')) return addressOrUrl;

  // 2. Canonical Google Maps place URL (e.g. from resolved shortlink)
  // Extracts the exact place query to avoid synthetic coordinate click errors
  if (addressOrUrl && (addressOrUrl.includes('google.com/maps') || addressOrUrl.includes('maps.google.com'))) {
    try {
      const url = new URL(addressOrUrl);
      const placeMatch = url.pathname.match(/\/place\/([^/@]+)/);
      if (placeMatch) {
        const query = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
        return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=id&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
      }
      const q = url.searchParams.get('q');
      if (q) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&hl=id&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
      }
    } catch {
      void 0;
    }
  }

  // 3. Store name + Clean Address query (drops pin on real place entity with full info)
  const rawTextAddress = fallbackAddress || (addressOrUrl && !addressOrUrl.startsWith('http') ? addressOrUrl : '');
  const cleanAddr = cleanIndonesianAddress(rawTextAddress);
  if (storeName && cleanAddr) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(`${storeName.trim()}, ${cleanAddr}`)}&hl=id&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
  }

  // 4. Clean text address
  if (cleanAddr) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(cleanAddr)}&hl=id&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
  }

  // 5. Store name alone
  if (storeName && storeName.trim() !== DEFAULT_STORE_NAME) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(storeName.trim())}&hl=id&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
  }

  // 6. Coordinates fallback
  if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
    return `https://maps.google.com/maps?q=${lat},${lng}&hl=id&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
  }

  return `https://maps.google.com/maps?q=Banyuwangi&hl=id&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
}

export function buildDirectMapsUrl(addressOrUrl?: string, lat?: number | null, lng?: number | null): string {
  if (addressOrUrl && (addressOrUrl.startsWith('http://') || addressOrUrl.startsWith('https://'))) {
    return addressOrUrl;
  }
  if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  if (addressOrUrl) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressOrUrl)}`;
  }
  return 'https://maps.google.com';
}
