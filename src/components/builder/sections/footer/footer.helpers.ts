import type { ComponentType } from 'svelte';
import {
  MessageSquare,
  MapPin,
  ListFilter,
  FileText,
  Sparkles,
  Clock,
  Send,
  Share2,
} from 'lucide-svelte';
import type { TemplateSection } from '@/schemas';
import type { LayerNodeItem, FooterMenuLink, FooterSocialLink } from '@/types';

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

export function cleanWaNumber(raw?: string): string {
  if (!raw) return '';
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('08')) {
    digits = '62' + digits.slice(1);
  }
  return digits;
}

export function buildWhatsAppFooterLink(waNumber?: string, storeName?: string, message?: string): string {
  const digits = cleanWaNumber(waNumber || DEFAULT_WA_NUMBER);
  if (!digits) return '#';
  const name = storeName || DEFAULT_BRAND_NAME;
  const defaultText = `Halo ${name}, saya ingin bertanya mengenai toko Anda.`;
  const text = encodeURIComponent(message || defaultText);
  return `https://wa.me/${digits}?text=${text}`;
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

export function getFooterLayerNodes(section: TemplateSection): LayerNodeItem[] {
  const preset =
    (section.layoutPreset as string) ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    'multi_column';

  switch (preset) {
    case 'centered_simple':
    case 'minimal_single_row':
    case 'giant_wordmark':
      return [
        { id: 'footer_brand', name: 'Identitas Toko', icon: Sparkles as unknown as ComponentType },
        { id: 'footer_contact', name: 'Tautan Sosial / Tombol Kontak', icon: MessageSquare as unknown as ComponentType },
        { id: 'footer_copyright', name: 'Hak Cipta / Wordmark', icon: FileText as unknown as ComponentType },
      ];

    case 'cta_focused':
      return [
        { id: 'footer_floating_cta', name: 'Banner Floating CTA', icon: Sparkles as unknown as ComponentType },
        { id: 'footer_contact', name: 'Ringkasan Alamat & Kontak', icon: MapPin as unknown as ComponentType },
        { id: 'footer_copyright', name: 'Baris Hak Cipta', icon: FileText as unknown as ComponentType },
      ];

    case 'newsletter_centric':
      return [
        { id: 'footer_newsletter', name: 'Form Langganan Promo WA', icon: Send as unknown as ComponentType },
        { id: 'footer_copyright', name: 'Baris Hak Cipta', icon: FileText as unknown as ComponentType },
      ];

    case 'live_status_badge':
      return [
        { id: 'footer_status_badge', name: 'Bilah Status Operasional Toko', icon: Clock as unknown as ComponentType },
        { id: 'footer_contact', name: 'Tombol Chat Cepat', icon: MessageSquare as unknown as ComponentType },
      ];

    case 'split_map_footer':
      return [
        { id: 'footer_contact', name: 'Informasi Kontak Toko (Kiri)', icon: MapPin as unknown as ComponentType },
        { id: 'footer_mini_map', name: 'Frame Peta Mini (Kanan)', icon: MapPin as unknown as ComponentType },
        { id: 'footer_copyright', name: 'Baris Hak Cipta', icon: FileText as unknown as ComponentType },
      ];

    case 'social_links_grid':
      return [
        { id: 'footer_socials', name: 'Judul & Ubin Media Sosial', icon: Share2 as unknown as ComponentType },
        { id: 'footer_copyright', name: 'Baris Hak Cipta', icon: FileText as unknown as ComponentType },
      ];

    case 'boxed_card_footer':
      return [
        { id: 'footer_brand', name: 'Identitas Toko & Kartu Resmi', icon: Sparkles as unknown as ComponentType },
        { id: 'footer_contact', name: 'Grup Tombol Aksi', icon: MessageSquare as unknown as ComponentType },
        { id: 'footer_copyright', name: 'Baris Hak Cipta', icon: FileText as unknown as ComponentType },
      ];

    case 'multi_column':
    default:
      return [
        { id: 'footer_brand', name: 'Profil & Deskripsi Toko', icon: Sparkles as unknown as ComponentType },
        { id: 'footer_contact', name: 'Kontak & Alamat', icon: MapPin as unknown as ComponentType },
        { id: 'footer_navigation', name: 'Navigasi Menu Cepat', icon: ListFilter as unknown as ComponentType },
        { id: 'footer_copyright', name: 'Baris Hak Cipta', icon: FileText as unknown as ComponentType },
      ];
  }
}
