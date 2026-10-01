/**
 * Helper SSOT tata letak section testimoni pelanggan.
 * Menjaga sinkronisasi urutan elemen antara Canvas, Tab Tata Letak, dan Panel Lapisan.
 * 1 Testimoni = 1 Elemen Mandiri (Review 1, Review 2, dst).
 */

import type { TestimonialItem } from '@/types';
import { DEFAULT_TESTIMONIALS } from './testimonials.helpers';

export const TESTIMONIALS_PRESET_SLOTS: Record<string, string[]> = {
  masonry_grid: ['badge', 'title', 'subtitle'],
  single_spotlight: ['badge', 'title', 'subtitle'],
  chat_bubble_flow: ['badge', 'title', 'subtitle'],
  infinite_marquee_scroll: ['badge', 'title', 'subtitle'],
  video_review_cards: ['badge', 'title', 'subtitle'],
  social_post_cards: ['badge', 'title', 'subtitle'],
  side_by_side_3_cards: ['badge', 'title', 'subtitle'],
  logo_client_cloud: ['badge', 'title', 'subtitle', 'testi_logo_cloud'],
  split_rating_stats: ['badge', 'title', 'subtitle', 'testi_stats'],
  carousel_slider: ['badge', 'title', 'subtitle'],
};

/**
 * Urutan slot default spesifik untuk tiap preset tata letak testimoni.
 * Tiap review dibuat sebagai elemen mandiri (Review 1, Review 2, dst).
 */
export function getDefaultTestimonialsSlots(preset: string, testimonials?: TestimonialItem[]): string[] {
  const testisArray = Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  const baseSlots = TESTIMONIALS_PRESET_SLOTS[preset] || ['badge', 'title', 'subtitle'];
  const slots: string[] = [...baseSlots];

  // Tiap ulasan adalah elemen mandiri
  testisArray.forEach((_, idx) => {
    slots.push(`testi_item_${idx}`);
  });

  return slots;
}

/**
 * Label Bahasa Indonesia baku untuk tiap slot elemen testimoni.
 */
export function getTestimonialsSlotLabel(slot: string, _preset?: string, testimonials?: TestimonialItem[]): string {
  switch (slot) {
    case 'badge':
      return 'Lencana & Tagline';
    case 'title':
      return 'Judul Utama (H2)';
    case 'subtitle':
      return 'Deskripsi Subjudul';
    case 'testi_stats':
      return 'Skor Rating Agregat';
    case 'testi_slider_track':
      return 'Alur Slider Ulasan';
    case 'testi_logo_cloud':
      return 'Daftar Logo Kemitraan';
    case 'testi_spotlight_quote':
      return 'Kutipan Ulasan Utama';
    case 'testi_spotlight_author':
      return 'Identitas Pelanggan';
    case 'testimonials_grid':
      return 'Daftar Ulasan';
    default: {
      if (slot.startsWith('testi_item_')) {
        const idx = parseInt(slot.replace('testi_item_', ''), 10);
        const testisArray = Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
        const item = testisArray[idx];
        if (item?.customerName) {
          return `Review ${idx + 1}: ${item.customerName}`;
        }
        return `Review ${idx + 1}`;
      }
      return slot;
    }
  }
}

/**
 * Normalisasi legacy slot testimoni (testimonials_grid -> testi_item_0, 1, ...)
 */
function normalizeLegacyTestimonialsSlot(slot: string, testisArray: TestimonialItem[]): string[] {
  if (slot === 'testimonials_grid') {
    return testisArray.map((_, i) => `testi_item_${i}`);
  }
  return [slot];
}

/**
 * Menghasilkan urutan slot elemen testimoni efektif yang selalu sinkron dan sesuai preset.
 */
export function getEffectiveTestimonialsElementOrder(
  preset: string,
  rawOrder?: unknown,
  testimonials?: TestimonialItem[],
  testimonialsPreset?: string
): string[] {
  const testisArray = Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  const defaultSlots = getDefaultTestimonialsSlots(preset, testisArray);

  if (!Array.isArray(rawOrder) || rawOrder.length === 0) {
    return [...defaultSlots];
  }

  // Jika preset sama atau tidak didefinisikan
  const isSamePreset = !testimonialsPreset || testimonialsPreset === preset;
  if (isSamePreset) {
    const expanded: string[] = [];
    for (const s of rawOrder as string[]) {
      for (const norm of normalizeLegacyTestimonialsSlot(s, testisArray)) {
        if (defaultSlots.includes(norm) && !expanded.includes(norm)) {
          expanded.push(norm);
        }
      }
    }

    // Pastikan ulasan baru yang belum tercatat di rawOrder otomatis ditambahkan
    for (let i = 0; i < testisArray.length; i++) {
      const slotName = `testi_item_${i}`;
      if (defaultSlots.includes(slotName) && !expanded.includes(slotName)) {
        expanded.push(slotName);
      }
    }

    return expanded.length > 0 ? expanded : [...defaultSlots];
  }

  // Jika baru ganti layout, adaptasikan slot yang cocok
  const rawList = rawOrder as string[];
  const valid = rawList.filter((s) => defaultSlots.includes(s));
  for (const s of defaultSlots) {
    if (!valid.includes(s)) valid.push(s);
  }
  return valid;
}
