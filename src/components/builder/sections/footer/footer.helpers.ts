import type { TemplateSection } from '@/schemas';
import type { FooterMenuLink, FooterSocialLink } from '@/types';
import { normalizeWhatsAppNumber, getEffectiveWhatsAppNumber, generateWhatsAppLink } from '@/lib/whatsapp';

export const DEFAULT_BRAND_NAME = 'Warung Berkah';
export const DEFAULT_TAGLINE = 'Pelopor kuliner & aneka camilan khas tradisional dengan resep otentik nusantara. Diproses higienis setiap hari.';
export const DEFAULT_ADDRESS = 'Jl. Raya Sukowati No. 42, Banyuwangi';
export const DEFAULT_STORE_HOURS = '08.00 - 21.00 WIB';
export const DEFAULT_WA_NUMBER = '6281234567890';

export const DEFAULT_MENU_LINKS: FooterMenuLink[] = [
  { label: 'Beranda', url: '#hero' },
  { label: 'Keunggulan', url: '#features' },
  { label: 'Katalog Produk', url: '#products' },
  { label: 'Ulasan Pelanggan', url: '#testimonials' },
  { label: 'Tanya Jawab (FAQ)', url: '#faq' },
  { label: 'Lokasi Gerai', url: '#maps' },
];

export function getDynamicLandingNavLinks(sections?: TemplateSection[]): FooterMenuLink[] {
  if (!sections || sections.length === 0) return DEFAULT_MENU_LINKS;
  const links: FooterMenuLink[] = [];
  const typeMap: Record<string, { label: string; url: string }> = {
    hero: { label: 'Beranda', url: '#hero' },
    features: { label: 'Keunggulan', url: '#features' },
    product_catalog: { label: 'Katalog Produk', url: '#products' },
    testimonials: { label: 'Ulasan Pelanggan', url: '#testimonials' },
    faq: { label: 'Tanya Jawab (FAQ)', url: '#faq' },
    google_maps: { label: 'Lokasi Gerai', url: '#maps' },
  };

  for (const s of sections) {
    if (typeMap[s.type] && !links.some((l) => l.url === typeMap[s.type].url)) {
      links.push(typeMap[s.type]);
    }
  }

  return links.length > 0 ? links : DEFAULT_MENU_LINKS;
}

export const DEFAULT_SOCIAL_LINKS: FooterSocialLink[] = [
  { platform: 'whatsapp', url: 'https://wa.me/6281234567890', label: 'WhatsApp', handle: '0812-3456-7890', subtext: 'Fast Response' },
  { platform: 'instagram', url: 'https://instagram.com/warungberkah', label: 'Instagram', handle: '@warungberkah', subtext: 'Galeri Foto' },
  { platform: 'tiktok', url: 'https://tiktok.com/@warungberkah', label: 'TikTok', handle: '@warungberkah', subtext: 'Video Menu' },
  { platform: 'facebook', url: 'https://facebook.com/warungberkah', label: 'Facebook', handle: 'Warung Berkah', subtext: 'Halaman Toko' },
];

export const cleanWaNumber = normalizeWhatsAppNumber;

export function buildWhatsAppFooterLink(waNumber?: string, storeName?: string, message?: string): string {
  const digits = getEffectiveWhatsAppNumber(waNumber || DEFAULT_WA_NUMBER);
  const name = storeName || DEFAULT_BRAND_NAME;
  const defaultText = `Halo ${name}, saya ingin bertanya mengenai toko Anda.`;
  return generateWhatsAppLink(digits, message || defaultText);
}

export function buildMiniMapEmbedUrl(queryOrUrl?: string): string {
  if (!queryOrUrl) {
    return `https://maps.google.com/maps?q=${encodeURIComponent('Banyuwangi')}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  }
  if (queryOrUrl.includes('google.com/maps') && queryOrUrl.includes('output=embed')) {
    return queryOrUrl;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(queryOrUrl)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
}

export function formatCopyrightText(customText?: string, storeName?: string): string {
  const year = new Date().getFullYear();
  if (customText && customText.trim()) {
    return customText.replace('{year}', String(year));
  }
  const name = storeName || DEFAULT_BRAND_NAME;
  return `© ${year} ${name}. Seluruh Hak Cipta Dilindungi.`;
}

export interface FooterAttributionOptions {
  store?: {
    id?: string;
    registeredBy?: string | null;
    managedByAdmin?: { name: string } | null;
    registrar?: { name: string } | null;
  } | null;
  designerAdminName?: string;
  isLiveStorefront?: boolean;
}

export function formatAttributionText(options: FooterAttributionOptions = {}): string {
  const { store, designerAdminName, isLiveStorefront } = options;
  if (isLiveStorefront || store?.id) {
    const adminName = store?.managedByAdmin?.name || store?.registrar?.name;
    if (adminName && adminName.trim()) {
      return `Powered by Pinoka | Didampingi oleh ${adminName.trim()}`;
    }
    return 'Powered by Pinoka';
  }

  const previewAdmin = designerAdminName !== undefined && designerAdminName !== null
    ? designerAdminName.trim()
    : 'Admin Pendamping';

  if (!previewAdmin) {
    return 'Powered by Pinoka';
  }
  return `Powered by Pinoka | Didampingi oleh ${previewAdmin}`;
}

export { getFooterLayerNodes } from './footerLayout.helpers';
