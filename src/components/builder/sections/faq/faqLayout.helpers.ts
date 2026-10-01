/**
 * Helper SSOT tata letak section FAQ (Tanya Jawab).
 * Menjaga sinkronisasi urutan elemen antara Canvas, Tab Tata Letak, dan Panel Lapisan.
 * 1 Tanya Jawab = 1 Elemen Mandiri (Pertanyaan 1, Pertanyaan 2, dst).
 */

import type { FAQItem } from '@/types';
import { DEFAULT_FAQS } from './faq.helpers';

export const FAQ_PRESET_SLOTS: Record<string, string[]> = {
  accordion_single_col: ['badge', 'title', 'subtitle'],
  split_faq_sidebar: ['title', 'subtitle', 'faq_cs_card'],
  grid_2_col_cards: ['badge', 'title', 'subtitle'],
  accordion_two_col: ['badge', 'title', 'subtitle'],
  chat_style_faq: ['badge', 'title', 'subtitle'],
  search_filtered_faq: ['badge', 'title', 'subtitle', 'faq_search_bar'],
  categorized_tabs_faq: ['badge', 'title', 'subtitle', 'faq_tabs'],
  compact_numbered_list: ['badge', 'title', 'subtitle'],
  floating_help_center: ['badge', 'title', 'subtitle'],
  horizontal_faq_cards: ['badge', 'title', 'subtitle'],
};

/**
 * Urutan slot default spesifik untuk tiap preset tata letak FAQ.
 * Tiap pertanyaan ulasan dibuat sebagai elemen mandiri (Pertanyaan 1, 2, dst).
 */
export function getDefaultFaqSlots(preset: string, faqs?: FAQItem[]): string[] {
  const faqsArray = Array.isArray(faqs) && faqs.length > 0 ? faqs : DEFAULT_FAQS;
  const baseSlots = FAQ_PRESET_SLOTS[preset] || ['badge', 'title', 'subtitle'];
  const slots: string[] = [...baseSlots];

  // Tiap ulasan/pertanyaan adalah elemen mandiri
  faqsArray.forEach((_, idx) => {
    slots.push(`faq_item_${idx}`);
  });

  return slots;
}

/**
 * Slot yang diizinkan untuk tiap preset tata letak FAQ.
 */
export function getAllowedFaqSlots(preset: string, faqs?: FAQItem[]): string[] {
  return getDefaultFaqSlots(preset, faqs);
}

/**
 * Label Bahasa Indonesia baku untuk tiap slot elemen FAQ.
 */
export function getFaqSlotLabel(slot: string, _preset?: string, faqs?: FAQItem[]): string {
  switch (slot) {
    case 'badge':
      return 'Lencana & Tagline';
    case 'title':
      return 'Judul Utama (H2)';
    case 'subtitle':
      return 'Deskripsi Subjudul';
    case 'faq_cs_card':
      return 'Kartu Bantuan CS WhatsApp';
    case 'faq_search_bar':
      return 'Bilah Pencarian FAQ';
    case 'faq_tabs':
      return 'Tab Kategori FAQ';
    case 'faq_list':
      return 'Daftar Pertanyaan FAQ';
    default: {
      if (slot.startsWith('faq_item_') || slot.startsWith('item_')) {
        const idx = parseInt(slot.replace(/^(faq_item_|item_)/, ''), 10);
        const faqsArray = Array.isArray(faqs) && faqs.length > 0 ? faqs : DEFAULT_FAQS;
        const item = faqsArray[idx];
        if (item?.question) {
          const truncated = item.question.length > 28 ? `${item.question.slice(0, 28)}...` : item.question;
          return `Pertanyaan ${idx + 1}: ${truncated}`;
        }
        return `Pertanyaan ${idx + 1}`;
      }
      return slot;
    }
  }
}

/**
 * Normalisasi legacy slot FAQ (faq_list -> faq_item_0, 1, ...)
 */
function normalizeLegacyFaqSlot(slot: string, faqsArray: FAQItem[]): string[] {
  if (slot === 'faq_list') {
    return faqsArray.map((_, i) => `faq_item_${i}`);
  }
  if (slot.startsWith('item_')) {
    const idx = slot.replace('item_', '');
    return [`faq_item_${idx}`];
  }
  return [slot];
}

/**
 * Menghasilkan urutan slot elemen FAQ efektif yang selalu sinkron dan sesuai preset.
 */
export function getEffectiveFaqElementOrder(
  preset: string,
  rawOrder?: unknown,
  faqs?: FAQItem[],
  faqPreset?: string
): string[] {
  const faqsArray = Array.isArray(faqs) && faqs.length > 0 ? faqs : DEFAULT_FAQS;
  const defaultSlots = getDefaultFaqSlots(preset, faqsArray);

  if (!Array.isArray(rawOrder)) {
    return defaultSlots;
  }

  if (faqPreset && faqPreset !== preset) {
    return defaultSlots;
  }

  // Normalisasi legacy slots
  const normalizedRaw: string[] = [];
  for (const s of rawOrder) {
    if (typeof s === 'string') {
      normalizedRaw.push(...normalizeLegacyFaqSlot(s, faqsArray));
    }
  }

  const validSlotsSet = new Set(defaultSlots);
  const result: string[] = [];

  for (const slot of normalizedRaw) {
    if (validSlotsSet.has(slot) && !result.includes(slot)) {
      result.push(slot);
    }
  }

  return result;
}
