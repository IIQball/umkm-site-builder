import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
  ColorTokenSchema,
  HeaderAnnouncementPresetSchema,
  HeroPresetSchema,
  FeaturesPresetSchema,
  ProductCatalogPresetSchema,
  TestimonialsPresetSchema,
  FAQPresetSchema,
  GoogleMapsPresetSchema,
  FooterPresetSchema,
  TemplateSectionSchema,
  DEFAULT_TEMPLATE_SECTIONS,
} from '@/schemas';
import {
  canvasStore,
  documentStore,
  editorStore,
  activeSection,
  activeNodeId,
  canUndo,
  canRedo,
} from '@/components/builder/stores/editorStore';

describe('Token-Based Presets & Store Separation', () => {
  it('should validate valid and invalid ColorTokens', () => {
    const validTokens = [
      'primary',
      'secondary',
      'accent',
      'background',
      'surface',
      'text_primary',
      'text_muted',
      'transparent',
    ];
    for (const token of validTokens) {
      expect(ColorTokenSchema.safeParse(token).success).toBe(true);
    }
    expect(ColorTokenSchema.safeParse('#ff0000').success).toBe(false);
    expect(ColorTokenSchema.safeParse('custom-color').success).toBe(false);
  });

  it('should validate layout presets per section type', () => {
    expect(HeaderAnnouncementPresetSchema.safeParse('default_split').success).toBe(true);
    expect(HeaderAnnouncementPresetSchema.safeParse('centered_stacked').success).toBe(true);
    expect(HeaderAnnouncementPresetSchema.safeParse('compact_inline').success).toBe(true);

    expect(HeroPresetSchema.safeParse('split_left_text').success).toBe(true);
    expect(HeroPresetSchema.safeParse('full_banner_overlay').success).toBe(true);

    expect(FeaturesPresetSchema.safeParse('grid_3_cards').success).toBe(true);
    expect(FeaturesPresetSchema.safeParse('horizontal_list').success).toBe(true);

    expect(ProductCatalogPresetSchema.safeParse('grid_standard').success).toBe(true);
    expect(ProductCatalogPresetSchema.safeParse('carousel_scroll').success).toBe(true);

    expect(TestimonialsPresetSchema.safeParse('masonry_grid').success).toBe(true);
    expect(TestimonialsPresetSchema.safeParse('single_spotlight').success).toBe(true);

    expect(FAQPresetSchema.safeParse('accordion_single_col').success).toBe(true);
    expect(FAQPresetSchema.safeParse('grid_2_col_cards').success).toBe(true);

    expect(GoogleMapsPresetSchema.safeParse('fullwidth_map').success).toBe(true);
    expect(GoogleMapsPresetSchema.safeParse('split_map_info').success).toBe(true);

    expect(FooterPresetSchema.safeParse('multi_column').success).toBe(true);
    expect(FooterPresetSchema.safeParse('cta_focused').success).toBe(true);
  });

  it('should validate sections with layoutPreset and token-based styles', () => {
    const section = {
      id: 'map-1',
      type: 'google_maps',
      layoutPreset: 'fullwidth_map',
      props: {
        address: 'Jl. Sudirman No. 1, Jakarta',
        zoom: 15,
      },
      styles: {
        bgColorToken: 'surface',
        textColorToken: 'text_primary',
        borderColorToken: 'primary',
      },
    };

    const parsed = TemplateSectionSchema.safeParse(section);
    expect(parsed.success).toBe(true);
  });
});

describe('Split Store: canvasStore (Ephemeral) & documentStore (Persistent)', () => {
  beforeEach(() => {
    canvasStore.reset();
    documentStore.init({
      id: 'tpl-test',
      name: 'Test Template',
      price: 50000,
      config: {
        theme: {},
        sections: DEFAULT_TEMPLATE_SECTIONS,
      },
    });
  });

  it('canvasStore mutations must NOT change isDirty and must NOT push history', () => {
    expect(get(documentStore).isDirty).toBe(false);
    expect(get(documentStore).history.past.length).toBe(0);

    canvasStore.selectSection('section-2');
    canvasStore.selectNode('section-2', 'title');
    canvasStore.setViewMode('mobile');
    canvasStore.setZoom(75);
    canvasStore.toggleGrid();
    canvasStore.setHovered('title');

    // Visual state changed
    const canvas = get(canvasStore);
    expect(canvas.selectedSectionId).toBe('section-2');
    expect(canvas.selectedNodeId).toBe('title');
    expect(canvas.viewMode).toBe('mobile');
    expect(canvas.zoom).toBe(75);
    expect(canvas.gridActive).toBe(true);
    expect(canvas.hoveredNodeId).toBe('title');

    // Ephemeral mutates must NOT affect document persistence
    expect(get(documentStore).isDirty).toBe(false);
    expect(get(documentStore).history.past.length).toBe(0);
  });

  it('documentStore mutations MUST change isDirty and push history', () => {
    expect(get(documentStore).isDirty).toBe(false);

    // 1. updateSectionLayoutPreset
    documentStore.updateSectionLayoutPreset('section-2', 'centered_minimal');
    expect(get(documentStore).isDirty).toBe(true);
    expect(get(documentStore).history.past.length).toBe(1);
    const sec2 = get(documentStore).template?.config.sections.find((s) => s.id === 'section-2');
    expect(sec2?.layoutPreset).toBe('centered_minimal');

    // 2. updateNodeStyleToken
    documentStore.updateNodeStyleToken('section-2', 'title', 'textColorToken', 'accent');
    const sec2Updated = get(documentStore).template?.config.sections.find((s) => s.id === 'section-2');
    const nodeStyles = sec2Updated?.props?.nodeStyles as Record<string, Record<string, string>> | undefined;
    expect(nodeStyles?.title?.textColorToken).toBe('accent');

    // 3. updateSectionStyles with token
    documentStore.updateSectionStyles('section-2', { bgColorToken: 'surface' });
    const sec2StyleUpdated = get(documentStore).template?.config.sections.find((s) => s.id === 'section-2');
    expect(sec2StyleUpdated?.styles?.bgColorToken).toBe('surface');

    // 4. reorderSectionSlot
    documentStore.updateSectionProps('section-2', {
      elementOrder: ['badge', 'title', 'subtitle', 'image', 'cta'],
    });
    documentStore.reorderSectionSlot('section-2', 0, 1);
    const sec2Order = get(documentStore).template?.config.sections.find((s) => s.id === 'section-2');
    expect(sec2Order?.props?.elementOrder).toEqual(['title', 'badge', 'subtitle', 'image', 'cta']);
  });

  it('derived stores (activeSection, activeNodeId, canUndo, canRedo) should update properly', () => {
    canvasStore.selectSection('section-3');
    canvasStore.selectNode('section-3', 'item_0');

    expect(get(activeSection)?.id).toBe('section-3');
    expect(get(activeNodeId)).toBe('item_0');
    expect(get(canUndo)).toBe(false);

    documentStore.updateSectionProps('section-3', { subtitle: 'Updated Subtitle' });
    expect(get(canUndo)).toBe(true);
    expect(get(canRedo)).toBe(false);

    editorStore.undo();
    expect(get(canRedo)).toBe(true);
  });
});
