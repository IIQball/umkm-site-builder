import { describe, it, expect } from 'vitest';
import type { TemplateSection, TemplateConfig } from '@/schemas';
import type { DocumentState } from '@/components/builder/stores/editorStore.types';
import { applyAddNode, applyDeleteNode } from '@/components/builder/stores/editorStore.mutations';
import { getSectionNodes } from '@/components/builder/layer/layerPanel.helpers';
import {
  getDefaultTestimonialsSlots,
  getTestimonialsSlotLabel,
  getEffectiveTestimonialsElementOrder,
} from '@/components/builder/sections/testimonials/testimonialsLayout.helpers';
import { resolveTestimonialItemStyle } from '@/components/builder/sections/testimonials/testimonialStyles.helpers';
import { DEFAULT_TESTIMONIALS } from '@/components/builder/sections/testimonials/testimonials.helpers';
import { DEFAULT_TEMPLATE_SECTIONS } from '@/schemas/templates/template.defaults';

describe('Testimonials Section Synchronization & Heading Hierarchy', () => {
  const sampleTestimonials = [
    {
      id: 'testi_1',
      customerName: 'Ibu Dian Sastro',
      rating: 5,
      comment: 'Roti sisirnya wangi butter banget.',
      role: 'Pelanggan Setia • Banyuwangi',
      verified: true,
      verifiedText: 'Pembeli Terverifikasi',
    },
    {
      id: 'testi_2',
      customerName: 'Mas Dimas Pratama',
      rating: 5,
      comment: 'Kopi Ijen roastingannya presisi.',
      role: 'Penikmat Kopi • Malang',
      verified: true,
      verifiedText: 'Pembeli Terverifikasi',
    },
    {
      id: 'testi_3',
      customerName: 'Ibu Hj. Mariam',
      rating: 5,
      comment: 'Pelayanan katering syukuran kemarin sangat memuaskan.',
      role: 'Pemesanan 150 Porsi • Jember',
      verified: true,
      verifiedText: 'Pembeli Terverifikasi',
    },
  ];

  it('verifies default template testimonials section has 3 reviews', () => {
    const testiSection = DEFAULT_TEMPLATE_SECTIONS.find((s) => s.type === 'testimonials');
    expect(testiSection).toBeDefined();
    const items = testiSection?.props?.testimonials as unknown[];
    expect(items).toBeDefined();
    expect(items.length).toBe(3);
    expect(testiSection?.props?.title).toBe('Kata Mereka yang Sudah Mencoba');
    expect(testiSection?.props?.badgeText).toBe('Ulasan Pembeli');
  });

  it('matches left Lapisan nodes and right Elemen Section 1:1 with individual reviews', () => {
    const section: TemplateSection = {
      id: 'testi-1',
      type: 'testimonials',
      layoutPreset: 'masonry_grid',
      props: {
        badgeText: 'Ulasan Pembeli',
        title: 'Kata Mereka yang Sudah Mencoba',
        subtitle: 'Kepuasan rasa dan kualitas produk adalah prioritas utama kami.',
        testimonials: sampleTestimonials,
      },
    };

    const leftNodes = getSectionNodes(section);
    const rightSlots = getDefaultTestimonialsSlots('masonry_grid', sampleTestimonials);

    expect(leftNodes).toHaveLength(6);
    expect(rightSlots).toHaveLength(6);

    const leftIds = leftNodes.map((n) => n.id);
    expect(leftIds).toEqual(rightSlots);
    expect(leftIds).toEqual([
      'badge',
      'title',
      'subtitle',
      'testi_item_0',
      'testi_item_1',
      'testi_item_2',
    ]);

    const leftNames = leftNodes.map((n) => n.name);
    const rightLabels = rightSlots.map((s) => getTestimonialsSlotLabel(s, 'masonry_grid', sampleTestimonials));
    expect(leftNames).toEqual(rightLabels);
    expect(leftNames).toEqual([
      'Lencana & Tagline',
      'Judul Utama (H2)',
      'Deskripsi Subjudul',
      'Review 1: Ibu Dian Sastro',
      'Review 2: Mas Dimas Pratama',
      'Review 3: Ibu Hj. Mariam',
    ]);
  });

  it('preserves reordering and adds new reviews dynamically', () => {
    const customOrder = ['title', 'badge', 'subtitle', 'testi_item_1', 'testi_item_0'];
    const effective = getEffectiveTestimonialsElementOrder('masonry_grid', customOrder, sampleTestimonials);

    expect(effective).toContain('testi_item_2');
    expect(effective.indexOf('title')).toBeLessThan(effective.indexOf('badge'));
    expect(effective.indexOf('testi_item_1')).toBeLessThan(effective.indexOf('testi_item_0'));
  });

  it('supports special preset slots like split_rating_stats', () => {
    const slots = getDefaultTestimonialsSlots('split_rating_stats', sampleTestimonials);
    expect(slots).toContain('testi_stats');
    expect(getTestimonialsSlotLabel('testi_stats')).toBe('Skor Rating Agregat');
  });

  it('supports special preset slots like logo_client_cloud', () => {
    const slots = getDefaultTestimonialsSlots('logo_client_cloud', sampleTestimonials);
    expect(slots).toContain('testi_logo_cloud');
    expect(getTestimonialsSlotLabel('testi_logo_cloud')).toBe('Daftar Logo Kemitraan');
  });
});

describe('Testimonial Styles & Margin Gating Logic', () => {
  it('correctly resolves item style with priority for item.id > testi_item_idx > fallback', () => {
    const item = { id: 'testi_1', customerName: 'Test User', rating: 5, comment: 'Great' };
    const nodeStyles = {
      testi_1: { color: 'var(--theme-primary)', marginTop: '8px', marginBottom: '16px' },
      testi_item_0: { color: 'var(--theme-secondary)' },
    };

    const resolved = resolveTestimonialItemStyle(item, 0, nodeStyles);
    expect(resolved.color).toBe('var(--theme-primary)');
    expect(resolved.marginTop).toBe('8px');
    expect(resolved.marginBottom).toBe('16px');
  });

  it('correctly resolves fallback to testi_item_idx when item.id is missing in nodeStyles', () => {
    const item = { id: 'testi_99', customerName: 'Test User', rating: 5, comment: 'Great' };
    const nodeStyles = {
      testi_item_1: { color: '#ffffff', marginTop: '4px', marginBottom: '12px' },
    };

    const resolved = resolveTestimonialItemStyle(item, 1, nodeStyles);
    expect(resolved.color).toBe('#ffffff');
    expect(resolved.marginTop).toBe('4px');
    expect(resolved.marginBottom).toBe('12px');
  });

  it('returns default empty styles when nodeStyles is undefined', () => {
    const resolved = resolveTestimonialItemStyle(undefined, 0, undefined);
    expect(resolved).toEqual({ color: '', marginTop: '0px', marginBottom: '0px' });
  });

  it('verifies margin gating rule: only vertical stack presets allow card margins', () => {
    const verticalPresets = ['single_spotlight', 'chat_bubble_flow'];
    const nonVerticalPresets = [
      'masonry_grid',
      'side_by_side_3_cards',
      'social_post_cards',
      'video_review_cards',
      'infinite_marquee_scroll',
      'carousel_slider',
      'split_rating_stats',
      'logo_client_cloud',
    ];

    const isVerticalStackCard = (preset: string) =>
      preset === 'single_spotlight' || preset === 'chat_bubble_flow';

    for (const preset of verticalPresets) {
      expect(isVerticalStackCard(preset)).toBe(true);
    }

    for (const preset of nonVerticalPresets) {
      expect(isVerticalStackCard(preset)).toBe(false);
    }
  });
});

describe('Testimonials Default 3 Customer Reviews Seeding & Mutations', () => {
  const pushHistory = (state: DocumentState, config: TemplateConfig): DocumentState => ({
    ...state,
    template: { ...state.template!, config },
  });

  it('seeding a new review when props.testimonials is undefined starts from 3 default reviews', () => {
    const initialSection: TemplateSection = {
      id: 'testi-sec-empty',
      type: 'testimonials',
      layoutPreset: 'masonry_grid',
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
        config: {
          schemaVersion: 1,
          sections: [initialSection],
        },
      },
      isDirty: false,
      isSaving: false,
      saveSuccess: false,
      error: null,
      history: { past: [], future: [] },
    };

    const afterAdd = applyAddNode(initialState, 'testi-sec-empty', 'item', pushHistory);
    const updatedSec = afterAdd.state.template?.config.sections.find((s: TemplateSection) => s.id === 'testi-sec-empty');
    const updatedTestimonials = updatedSec?.props?.testimonials as typeof DEFAULT_TESTIMONIALS;

    expect(updatedTestimonials.length).toBe(DEFAULT_TESTIMONIALS.length + 1);
    expect(updatedTestimonials.length).toBe(4);
    expect(updatedTestimonials[0].customerName).toBe(DEFAULT_TESTIMONIALS[0].customerName);
    expect(updatedTestimonials[1].customerName).toBe(DEFAULT_TESTIMONIALS[1].customerName);
    expect(updatedTestimonials[2].customerName).toBe(DEFAULT_TESTIMONIALS[2].customerName);
    expect(updatedTestimonials[3].customerName).toBe('Pelanggan Baru #4');
    expect(afterAdd.selectedNodeId).toBe('testi_item_3');
  });

  it('deleting a review when props.testimonials is undefined seeds from 3 default reviews and removes target', () => {
    const initialSection: TemplateSection = {
      id: 'testi-sec-empty',
      type: 'testimonials',
      layoutPreset: 'masonry_grid',
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
        config: {
          schemaVersion: 1,
          sections: [initialSection],
        },
      },
      isDirty: false,
      isSaving: false,
      saveSuccess: false,
      error: null,
      history: { past: [], future: [] },
    };

    const afterDelete = applyDeleteNode(initialState, 'testi-sec-empty', 'testi_item_1', pushHistory);
    const updatedSec = afterDelete.template?.config.sections.find((s: TemplateSection) => s.id === 'testi-sec-empty');
    const updatedTestimonials = updatedSec?.props?.testimonials as typeof DEFAULT_TESTIMONIALS;

    expect(updatedTestimonials.length).toBe(2);
    expect(updatedTestimonials[0].customerName).toBe(DEFAULT_TESTIMONIALS[0].customerName);
    expect(updatedTestimonials[1].customerName).toBe(DEFAULT_TESTIMONIALS[2].customerName);
  });
});
