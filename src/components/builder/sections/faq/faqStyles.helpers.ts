/**
 * Helper resolusi styling dinamis untuk elemen & kartu FAQ.
 * Mengikuti token Global Design System dan aturan seleksi nodeStyles.
 */

import type { FAQItem } from '@/types';

export interface ResolvedFaqItemStyle {
  color: string;
  backgroundColor: string;
  borderColor: string;
  marginTop: string;
  marginBottom: string;
}

/**
 * Mengambil styling spesifik per item kartu FAQ berdasarkan prioritas nodeStyles:
 * 1. ID spesifik ulasan (misal: faq_1)
 * 2. Slot indeks (misal: faq_item_0 atau item_0)
 * 3. Fallback slot daftar pertanyaan (faq_list)
 */
export function resolveFaqItemStyle(
  faq: Partial<FAQItem> | undefined,
  index: number,
  nodeStyles?: Record<string, Record<string, string>>
): ResolvedFaqItemStyle {
  if (!nodeStyles || typeof nodeStyles !== 'object') {
    return {
      color: '',
      backgroundColor: '',
      borderColor: '',
      marginTop: '0px',
      marginBottom: '0px',
    };
  }

  const byId = faq?.id ? nodeStyles[faq.id] : undefined;
  const byFaqSlot = nodeStyles[`faq_item_${index}`];
  const byItemSlot = nodeStyles[`item_${index}`];
  const byGeneric = nodeStyles['faq_list'] || {};

  const merged = {
    ...byGeneric,
    ...byItemSlot,
    ...byFaqSlot,
    ...byId,
  };

  return {
    color: merged.color || '',
    backgroundColor: merged.backgroundColor || merged.bgColorToken || '',
    borderColor: merged.borderColor || '',
    marginTop: merged.marginTop || '0px',
    marginBottom: merged.marginBottom || '0px',
  };
}

/**
 * Aturan Pembatasan (Gating) Margin Kartu FAQ:
 * - Elemen teks header ('badge', 'title', 'subtitle'): Diizinkan.
 * - Kartu Bantuan CS ('faq_cs_card'): Posisi di sebelah kiri dan hanya 1 kartu -> DINONAKTIFKAN (false).
 * - Kartu Tanya Jawab ('faq_item_'):
 *   - Tata letak bertumpuk atas-bawah (vertical stack, >= 2 kartu): DIIZINKAN (true).
 *     Contoh: accordion_single_col, chat_style_faq, compact_numbered_list, search_filtered_faq, categorized_tabs_faq, split_faq_sidebar.
 *   - Tata letak grid / multi-kolom samping / horizontal (lebih dari 1 kartu tidak atas-bawah): DINONAKTIFKAN (false).
 *     Contoh: grid_2_col_cards, accordion_two_col, floating_help_center, horizontal_faq_cards.
 */
export function isFaqCardMarginAllowed(preset: string, nodeId: string): boolean {
  if (nodeId === 'badge' || nodeId === 'title' || nodeId === 'subtitle') {
    return true;
  }

  if (nodeId === 'faq_cs_card') {
    return false;
  }

  if (nodeId === 'faq_search_bar' || nodeId === 'faq_tabs') {
    return true;
  }

  if (nodeId.startsWith('faq_item_') || nodeId.startsWith('item_')) {
    const nonVerticalPresets = [
      'grid_2_col_cards',
      'accordion_two_col',
      'floating_help_center',
      'horizontal_faq_cards',
    ];
    return !nonVerticalPresets.includes(preset);
  }

  return true;
}
