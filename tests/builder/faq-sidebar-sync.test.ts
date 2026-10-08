import { describe, it, expect } from 'vitest';
import type { TemplateSection, TemplateConfig } from '@/schemas';
import type { DocumentState } from '@/components/builder/stores/editorStore.types';
import { applyAddNode, applyDeleteNode } from '@/components/builder/stores/editorStore.mutations';
import { getSectionNodes } from '@/components/builder/layer/layerPanel.helpers';
import {
  getDefaultFaqSlots,
  getFaqSlotLabel,
  getEffectiveFaqElementOrder,
  FAQ_PRESET_SLOTS,
} from '@/components/builder/sections/faq/faqLayout.helpers';
import {
  resolveFaqItemStyle,
  isFaqCardMarginAllowed,
} from '@/components/builder/sections/faq/faqStyles.helpers';
import { DEFAULT_FAQS } from '@/components/builder/sections/faq/faq.helpers';
import { DEFAULT_TEMPLATE_SECTIONS } from '@/schemas/templates/template.defaults';

describe('FAQ Section Heading Hierarchy & Defaults', () => {
  it('verifies default template FAQ section defaults and heading hierarchy labels', () => {
    const faqSection = DEFAULT_TEMPLATE_SECTIONS.find((s) => s.type === 'faq');
    expect(faqSection).toBeDefined();
    expect(faqSection?.props?.badgeText).toBe('Pusat Bantuan & FAQ');
    expect(faqSection?.props?.title).toBe('Pertanyaan Sering Diajukan');
    expect(faqSection?.props?.subtitle).toBe('Temukan jawaban cepat atas pertanyaan seputar pemesanan, produk, dan pengiriman kami.');

    // Title slot label must specify H2
    expect(getFaqSlotLabel('title')).toBe('Judul Utama (H2)');
    expect(getFaqSlotLabel('badge')).toBe('Lencana & Tagline');
    expect(getFaqSlotLabel('subtitle')).toBe('Deskripsi Subjudul');
  });
});

describe('FAQ Left Sidebar (Lapisan) & Right Sidebar (Elemen Section) 1:1 Synchronization', () => {
  const sampleFaqs = [
    { id: 'faq_1', question: 'Berapa lama estimasi pengiriman?', answer: '1-3 hari kerja.', category: 'Pengiriman' },
    { id: 'faq_2', question: 'Metode pembayaran apa saja?', answer: 'Transfer bank, QRIS, dan COD.', category: 'Pembayaran' },
    { id: 'faq_3', question: 'Apakah produk bergaransi?', answer: 'Ya, garansi 100% uang kembali.', category: 'Garansi' },
  ];

  const allPresets = [
    'accordion_single_col',
    'split_faq_sidebar',
    'grid_2_col_cards',
    'accordion_two_col',
    'chat_style_faq',
    'search_filtered_faq',
    'categorized_tabs_faq',
    'compact_numbered_list',
    'floating_help_center',
    'horizontal_faq_cards',
  ];

  it('matches left Lapisan and right Elemen Section 1:1 across all 10 presets', () => {
    for (const preset of allPresets) {
      const section: TemplateSection = {
        id: `faq-${preset}`,
        type: 'faq',
        layoutPreset: preset,
        props: {
          badgeText: 'Pusat Bantuan',
          title: 'FAQ Kami',
          subtitle: 'Pertanyaan seputar layanan',
          faqs: sampleFaqs,
        },
      };

      const leftNodes = getSectionNodes(section);
      const rightSlots = getDefaultFaqSlots(preset, sampleFaqs);

      expect(leftNodes.length).toBe(rightSlots.length);

      const leftIds = leftNodes.map((n) => n.id);
      expect(leftIds).toEqual(rightSlots);

      const leftNames = leftNodes.map((n) => n.name);
      const rightLabels = rightSlots.map((s) => getFaqSlotLabel(s, preset, sampleFaqs));
      expect(leftNames).toEqual(rightLabels);
    }
  });

  it('displays individual question items with question snippet in slot label', () => {
    const slots = getDefaultFaqSlots('accordion_single_col', sampleFaqs);
    expect(slots).toEqual(['badge', 'title', 'subtitle', 'faq_item_0', 'faq_item_1', 'faq_item_2']);

    expect(getFaqSlotLabel('faq_item_0', 'accordion_single_col', sampleFaqs)).toBe('Pertanyaan 1: Berapa lama estimasi pengiri...');
    expect(getFaqSlotLabel('faq_item_1', 'accordion_single_col', sampleFaqs)).toBe('Pertanyaan 2: Metode pembayaran apa saja?');
    expect(getFaqSlotLabel('faq_item_2', 'accordion_single_col', sampleFaqs)).toBe('Pertanyaan 3: Apakah produk bergaransi?');
  });

  it('preserves reordering and normalizes legacy faq_list slots', () => {
    const customOrder = ['title', 'badge', 'faq_list', 'subtitle'];
    const effective = getEffectiveFaqElementOrder('accordion_single_col', customOrder, sampleFaqs);

    expect(effective.indexOf('title')).toBeLessThan(effective.indexOf('badge'));
    expect(effective).toContain('faq_item_0');
    expect(effective).toContain('faq_item_1');
    expect(effective).toContain('faq_item_2');
    expect(effective).not.toContain('faq_list');
  });

  it('supports special layout slots like faq_cs_card, faq_search_bar, and faq_tabs', () => {
    expect(FAQ_PRESET_SLOTS['split_faq_sidebar']).toContain('faq_cs_card');
    expect(getFaqSlotLabel('faq_cs_card')).toBe('Kartu Bantuan CS WhatsApp');

    expect(FAQ_PRESET_SLOTS['search_filtered_faq']).toContain('faq_search_bar');
    expect(getFaqSlotLabel('faq_search_bar')).toBe('Bilah Pencarian FAQ');

    expect(FAQ_PRESET_SLOTS['categorized_tabs_faq']).toContain('faq_tabs');
    expect(getFaqSlotLabel('faq_tabs')).toBe('Tab Kategori FAQ');
  });
});

describe('FAQ Styles & Margin Gating Rules', () => {
  it('correctly resolves item style with cascading priority', () => {
    const item = { id: 'faq_1', question: 'Pertanyaan', answer: 'Jawaban' };
    const nodeStyles = {
      faq_1: { color: 'var(--theme-primary)', marginTop: '10px', marginBottom: '20px' },
      faq_item_0: { color: 'var(--theme-secondary)' },
    };

    const resolved = resolveFaqItemStyle(item, 0, nodeStyles);
    expect(resolved.color).toBe('var(--theme-primary)');
    expect(resolved.marginTop).toBe('10px');
    expect(resolved.marginBottom).toBe('20px');
  });

  it('falls back to faq_item_idx when id is absent in nodeStyles', () => {
    const item = { id: 'faq_99', question: 'Pertanyaan', answer: 'Jawaban' };
    const nodeStyles = {
      faq_item_2: { color: '#abcdef', marginTop: '4px', marginBottom: '8px' },
    };

    const resolved = resolveFaqItemStyle(item, 2, nodeStyles);
    expect(resolved.color).toBe('#abcdef');
    expect(resolved.marginTop).toBe('4px');
    expect(resolved.marginBottom).toBe('8px');
  });

  it('allows margins on standard header elements for all presets', () => {
    for (const slot of ['badge', 'title', 'subtitle', 'faq_search_bar', 'faq_tabs']) {
      expect(isFaqCardMarginAllowed('accordion_single_col', slot)).toBe(true);
      expect(isFaqCardMarginAllowed('grid_2_col_cards', slot)).toBe(true);
    }
  });

  it('disallows margins on single side card (faq_cs_card in split_faq_sidebar)', () => {
    expect(isFaqCardMarginAllowed('split_faq_sidebar', 'faq_cs_card')).toBe(false);
  });

  it('allows margins on vertical stack question cards', () => {
    const verticalPresets = [
      'accordion_single_col',
      'chat_style_faq',
      'compact_numbered_list',
      'search_filtered_faq',
      'categorized_tabs_faq',
      'split_faq_sidebar',
    ];

    for (const preset of verticalPresets) {
      expect(isFaqCardMarginAllowed(preset, 'faq_item_0')).toBe(true);
      expect(isFaqCardMarginAllowed(preset, 'faq_item_1')).toBe(true);
    }
  });

  it('disallows margins on non-vertical grid and horizontal question cards', () => {
    const gridOrHorizontalPresets = [
      'grid_2_col_cards',
      'accordion_two_col',
      'floating_help_center',
      'horizontal_faq_cards',
    ];

    for (const preset of gridOrHorizontalPresets) {
      expect(isFaqCardMarginAllowed(preset, 'faq_item_0')).toBe(false);
      expect(isFaqCardMarginAllowed(preset, 'faq_item_1')).toBe(false);
    }
  });
});

describe('FAQ Add & Delete Node Mutations', () => {
  const pushHistory = (state: DocumentState, config: TemplateConfig): DocumentState => ({
    ...state,
    template: { ...state.template!, config },
  });

  it('seeds from DEFAULT_FAQS and appends a new question when adding node', () => {
    const initialSection: TemplateSection = {
      id: 'faq-sec-empty',
      type: 'faq',
      layoutPreset: 'accordion_single_col',
      props: {},
    };

    const initialState: DocumentState = {
      template: {
        id: 'tpl-1',
        name: 'Test Template',
        description: '',
        thumbnailUrl: '',
        price: 0,
        status: 'draft',
        config: { schemaVersion: 1, sections: [initialSection] },
      },
      isDirty: false,
      isSaving: false,
      saveSuccess: false,
      error: null,
      history: { past: [], future: [] },
    };

    const afterAdd = applyAddNode(initialState, 'faq-sec-empty', 'item', pushHistory);
    const updatedSec = afterAdd.state.template?.config.sections.find((s: TemplateSection) => s.id === 'faq-sec-empty');
    const faqs = updatedSec?.props?.faqs as typeof DEFAULT_FAQS;

    expect(faqs.length).toBe(DEFAULT_FAQS.length + 1);
    expect(faqs[0].question).toBe(DEFAULT_FAQS[0].question);
    expect(faqs[faqs.length - 1].question).toBe('Pertanyaan Baru?');
    expect(afterAdd.selectedNodeId).toBe(`faq_item_${faqs.length - 1}`);
  });

  it('seeds from DEFAULT_FAQS and removes target question when deleting node', () => {
    const initialSection: TemplateSection = {
      id: 'faq-sec-empty',
      type: 'faq',
      layoutPreset: 'accordion_single_col',
      props: {},
    };

    const initialState: DocumentState = {
      template: {
        id: 'tpl-1',
        name: 'Test Template',
        description: '',
        thumbnailUrl: '',
        price: 0,
        status: 'draft',
        config: { schemaVersion: 1, sections: [initialSection] },
      },
      isDirty: false,
      isSaving: false,
      saveSuccess: false,
      error: null,
      history: { past: [], future: [] },
    };

    const afterDelete = applyDeleteNode(initialState, 'faq-sec-empty', 'faq_item_1', pushHistory);
    const updatedSec = afterDelete.template?.config.sections.find((s: TemplateSection) => s.id === 'faq-sec-empty');
    const faqs = updatedSec?.props?.faqs as typeof DEFAULT_FAQS;

    expect(faqs.length).toBe(DEFAULT_FAQS.length - 1);
    expect(faqs[0].question).toBe(DEFAULT_FAQS[0].question);
    expect(faqs[1].question).toBe(DEFAULT_FAQS[2].question);
  });
});
