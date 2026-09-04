import { getEffectiveWhatsAppNumber, buildWhatsAppUrl } from '@/lib/whatsapp';

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
  return buildWhatsAppUrl(clean, message);
}

export function buildMapEmbedUrl(addressOrUrl?: string, zoom: number = 14): string {
  if (!addressOrUrl) {
    return `https://maps.google.com/maps?q=Banyuwangi&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
  }
  if (addressOrUrl.includes('output=embed')) {
    return addressOrUrl;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(addressOrUrl)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
}

export function buildDirectMapsUrl(addressOrUrl?: string): string {
  if (!addressOrUrl) {
    return 'https://maps.google.com';
  }
  if (addressOrUrl.startsWith('http://') || addressOrUrl.startsWith('https://')) {
    return addressOrUrl;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressOrUrl)}`;
}
