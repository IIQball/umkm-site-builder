import { describe, it, expect } from 'vitest';
import type { TemplateSection, TemplateConfig } from '@/schemas';
import { getSectionNodes } from '@/components/builder/layer/layerPanel.helpers';
import {
  getDefaultFeaturesSlots,
  getFeaturesSlotLabel,
  getEffectiveFeaturesElementOrder,
} from '@/components/builder/sections/features/featuresLayout.helpers';
import { applyDeleteNode, applyAddNode } from '@/components/builder/stores/editorStore.mutations';
import type { DocumentState } from '@/components/builder/stores/editorStore.types';

describe('Features Sidebar Sync (Left LAPISAN vs Right Tata Letak Inspector)', () => {
  const presets = [
    'grid_3_cards',
    'horizontal_list',
    'banner_inline_bar',
    'bento_grid_asymmetric',
    'alternating_zigzag_rows',
    'interactive_tabs',
    'vertical_accordion_showcase',
    'sticky_scroll_highlight',
    'dense_icon_matrix',
    'before_after_comparison',
  ];

  it('all 10 features presets have matching slot counts and 1:1 Bahasa Indonesia labels in left and right sidebars', () => {
    for (const preset of presets) {
      const defaultSlots = getDefaultFeaturesSlots(preset);
      const section: TemplateSection = {
        id: `feat-${preset}`,
        type: 'features',
        layoutPreset: preset,
        props: { layoutPreset: preset, elementOrder: [...defaultSlots] },
      };

      const leftNodes = getSectionNodes(section);
      const effectiveOrder = getEffectiveFeaturesElementOrder(preset, defaultSlots);
      const rightLabels = effectiveOrder.map((s) => getFeaturesSlotLabel(s, preset));

      expect(leftNodes.length).toBe(rightLabels.length);

      const leftNames = leftNodes.map((n) => n.name);
      expect(leftNames).toEqual(rightLabels);
    }
  });

  it('bento_grid_asymmetric has exact 1:1 Indonesian labels in both sidebars', () => {
    const section: TemplateSection = {
      id: 'feat-bento',
      type: 'features',
      layoutPreset: 'bento_grid_asymmetric',
      props: {
        layoutPreset: 'bento_grid_asymmetric',
        elementOrder: ['badge', 'title', 'subtitle', 'bento_spotlight', 'bento_cards'],
      },
    };

    const leftNodes = getSectionNodes(section);
    const leftNames = leftNodes.map((n) => n.name);
    const rightNames = ['badge', 'title', 'subtitle', 'bento_spotlight', 'bento_cards'].map((s) =>
      getFeaturesSlotLabel(s, 'bento_grid_asymmetric')
    );

    expect(leftNames).toEqual(rightNames);
    expect(leftNames).toContain('Kartu Sorotan Utama (Span 8)');
    expect(leftNames).toContain('Kartu Fitur Pendukung (Span 4)');
    expect(leftNames).toContain('Judul Utama (Heading)');
  });

  it('before_after_comparison has matching before_card and after_card labels', () => {
    const section: TemplateSection = {
      id: 'feat-compare',
      type: 'features',
      layoutPreset: 'before_after_comparison',
      props: {
        layoutPreset: 'before_after_comparison',
        elementOrder: ['badge', 'title', 'subtitle', 'before_card', 'after_card'],
      },
    };

    const leftNodes = getSectionNodes(section);
    const leftNames = leftNodes.map((n) => n.name);

    expect(leftNames).toContain('Kartu Sebelum (Produk Pasaran)');
    expect(leftNames).toContain('Kartu Sesudah (Solusi Dapur Kami)');
  });

  it('specialized layouts have exact contextual slot labels', () => {
    expect(getFeaturesSlotLabel('scroll_cards', 'sticky_scroll_highlight')).toBe('Daftar Kartu Fitur Mengalir');
    expect(getFeaturesSlotLabel('tab_nav', 'interactive_tabs')).toBe('Bilah Pilihan Tab (Tab Bar)');
    expect(getFeaturesSlotLabel('tab_card', 'interactive_tabs')).toBe('Kartu Detail Tab Aktif');
    expect(getFeaturesSlotLabel('accordion_list', 'vertical_accordion_showcase')).toBe('Daftar Akordeon Fitur');
    expect(getFeaturesSlotLabel('icon_matrix', 'dense_icon_matrix')).toBe('Matriks Ubin Ikon Kompak');
    expect(getFeaturesSlotLabel('ribbon_bar', 'banner_inline_bar')).toBe('Pita Baris Fitur (Ribbon 64px)');
  });

  it('deleting a slot removes it from elementOrder and updates left/right sidebars, adding it restores it', () => {
    const pushHistory = (state: DocumentState, config: TemplateConfig): DocumentState => ({
      ...state,
      template: { ...state.template!, config },
    });
    const initialSection: TemplateSection = {
      id: 'sec-features',
      type: 'features',
      layoutPreset: 'bento_grid_asymmetric',
      props: {
        layoutPreset: 'bento_grid_asymmetric',
        elementOrder: ['badge', 'title', 'subtitle', 'bento_spotlight', 'bento_cards'],
      },
    };

    const state: DocumentState = {
      template: {
        id: 'tpl-1',
        name: 'Test',
        description: '',
        price: 0,
        thumbnailUrl: '',
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

    // Delete bento_spotlight
    const deletedState = applyDeleteNode(state, 'sec-features', 'bento_spotlight', pushHistory);
    const updatedSection = deletedState.template!.config.sections[0];
    const updatedOrder = updatedSection.props?.elementOrder as string[];

    expect(updatedOrder).not.toContain('bento_spotlight');
    expect(updatedOrder).toHaveLength(4);

    const remainingLeftNodes = getSectionNodes(updatedSection);
    expect(remainingLeftNodes).toHaveLength(4);
    expect(remainingLeftNodes.map((n) => n.name)).not.toContain('Kartu Sorotan Utama (Span 8)');

    // Add it back via applyAddNode
    const addResult = applyAddNode(deletedState, 'sec-features', 'bento_spotlight', pushHistory);
    const restoredSection = addResult.state.template!.config.sections[0];
    const restoredOrder = restoredSection.props?.elementOrder as string[];

    expect(restoredOrder).toContain('bento_spotlight');
    expect(restoredOrder).toHaveLength(5);

    const restoredLeftNodes = getSectionNodes(restoredSection);
    expect(restoredLeftNodes).toHaveLength(5);
    expect(restoredLeftNodes.map((n) => n.name)).toContain('Kartu Sorotan Utama (Span 8)');
  });
});
