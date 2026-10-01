/**
 * Helper SSOT tata letak Footer Section.
 * Menjaga sinkronisasi 1:1 antara Panel Lapisan (Kiri) dan Tab Tata Letak (Kanan).
 * Elemen yang ditampilkan di kedua panel HANYA elemen yang ada pada layout aktif.
 */

import type { ComponentType } from 'svelte';
import {
  Sparkles,
  MessageSquare,
  ListFilter,
  FileText,
  Send,
  Clock,
  MapPin,
  Share2,
} from 'lucide-svelte';
import type { TemplateSection } from '@/schemas';
import type { LayerNodeItem } from '@/types';

export const FOOTER_PRESET_SLOTS: Record<string, string[]> = {
  multi_column: ['footer_brand', 'footer_contact', 'footer_navigation', 'footer_copyright'],
  centered_simple: ['footer_brand', 'footer_contact', 'footer_copyright'],
  cta_focused: ['footer_floating_cta', 'footer_contact', 'footer_copyright'],
  minimal_single_row: ['footer_brand', 'footer_copyright', 'footer_contact'],
  giant_wordmark: ['footer_brand', 'footer_contact', 'footer_copyright'],
  newsletter_centric: ['footer_newsletter', 'footer_copyright'],
  live_status_badge: ['footer_status_badge', 'footer_contact', 'footer_copyright'],
  split_map_footer: ['footer_contact', 'footer_mini_map', 'footer_copyright'],
  social_links_grid: ['footer_socials', 'footer_contact', 'footer_copyright'],
  boxed_card_footer: ['footer_brand', 'footer_contact', 'footer_copyright'],
};

export const FOOTER_SLOT_ICONS: Record<string, ComponentType> = {
  footer_brand: Sparkles,
  footer_contact: MessageSquare,
  footer_navigation: ListFilter,
  footer_copyright: FileText,
  footer_floating_cta: Sparkles,
  footer_newsletter: Send,
  footer_status_badge: Clock,
  footer_mini_map: MapPin,
  footer_socials: Share2,
  brand_bio: Sparkles,
  contact_info: MapPin,
  navigation_links: ListFilter,
  copyright: FileText,
};

export function getDefaultFooterSlots(preset: string): string[] {
  return [...(FOOTER_PRESET_SLOTS[preset] || FOOTER_PRESET_SLOTS.multi_column)];
}

export function getAllowedFooterSlots(preset: string): string[] {
  return getDefaultFooterSlots(preset);
}

const LEGACY_SLOT_MAP: Record<string, string> = {
  brand_bio: 'footer_brand',
  contact_info: 'footer_contact',
  navigation_links: 'footer_navigation',
  copyright: 'footer_copyright',
};

export function getEffectiveFooterElementOrder(
  preset: string,
  elementOrder?: string[]
): string[] {
  const allowed = getAllowedFooterSlots(preset);
  if (!Array.isArray(elementOrder)) {
    return allowed;
  }
  const normalized = elementOrder.map((s) => LEGACY_SLOT_MAP[s] || s);
  return normalized.filter((s) => allowed.includes(s));
}

export function getFooterSlotLabel(slot: string, preset?: string): string {
  switch (slot) {
    case 'footer_brand':
    case 'brand_bio':
      if (preset === 'giant_wordmark') return 'Wordmark Nama Brand Raksasa';
      if (preset === 'boxed_card_footer') return 'Identitas Toko & Kartu Resmi';
      if (preset === 'minimal_single_row') return 'Identitas & Logo Toko';
      if (preset === 'centered_simple') return 'Identitas & Tagline Toko';
      return 'Profil & Identitas Toko';
    case 'footer_contact':
    case 'contact_info':
      if (preset === 'centered_simple' || preset === 'live_status_badge') return 'Tombol Chat WhatsApp';
      if (preset === 'boxed_card_footer') return 'Grup Tombol Aksi (CTA)';
      if (preset === 'minimal_single_row') return 'Tautan Media Sosial';
      if (preset === 'giant_wordmark') return 'Tagline & Kontak WhatsApp';
      if (preset === 'split_map_footer') return 'Informasi Kontak & Alamat (Kiri)';
      if (preset === 'social_links_grid') return 'Tombol Chat via WhatsApp';
      if (preset === 'cta_focused') return 'Ringkasan Alamat & Kontak';
      return 'Kontak & Jam Operasional';
    case 'footer_navigation':
    case 'navigation_links':
      return 'Menu Navigasi Footer';
    case 'footer_copyright':
    case 'copyright':
      return 'Hak Cipta & Powered by Pinoka';
    case 'footer_floating_cta':
      return 'Banner Penawaran (Floating CTA)';
    case 'footer_newsletter':
      return 'Formulir Langganan Promo WA';
    case 'footer_status_badge':
      return 'Bilah Status Operasional Toko';
    case 'footer_mini_map':
      return 'Bingkai Peta Mini Lokasi (Kanan)';
    case 'footer_socials':
      return 'Ubin Tautan Media Sosial';
    default:
      return slot;
  }
}

export function getFooterLayerNodes(section: TemplateSection): LayerNodeItem[] {
  const preset =
    (section.layoutPreset as string) ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    'multi_column';

  const order = getEffectiveFooterElementOrder(preset, section.props?.elementOrder as string[] | undefined);
  return order.map((slot) => ({
    id: slot,
    name: getFooterSlotLabel(slot, preset),
    icon: FOOTER_SLOT_ICONS[slot] || Sparkles,
  }));
}
