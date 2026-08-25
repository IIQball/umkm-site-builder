import { writable, derived, get } from 'svelte/store';
import {
  type TemplateConfig,
  type TemplateSection,
  type TemplateTheme,
  DEFAULT_TEMPLATE_THEME,
} from '@/schemas';
import {
  type EditorTemplate,
  type CanvasState,
  type DocumentState,
  type EditorState,
  initialCanvasState,
  initialDocumentState,
  initialState,
  clone,
  ensureValidConfig,
} from './editorStore.types';
import { applyDeleteNode, applyAddNode, applySave, applySubmitReview } from './editorStore.mutations';

export type { EditorTemplate, CanvasState, DocumentState, EditorState };
export { ensureValidConfig, initialCanvasState, initialDocumentState, initialState };

/**
 * 1. canvasStore (Ephemeral / Visual State)
 * Selection, viewport, zoom, grid, and preview flags.
 * Mutations here DO NOT push history and DO NOT modify isDirty.
 */
function createCanvasStore() {
  const { subscribe, set, update } = writable<CanvasState>(initialCanvasState);

  return {
    subscribe,
    set,
    update,

    selectSection(id: string | null) {
      update((state) => ({ ...state, selectedSectionId: id, selectedNodeId: null }));
    },

    selectNode(sectionId: string, nodeId: string | null) {
      update((state) => ({ ...state, selectedSectionId: sectionId, selectedNodeId: nodeId }));
    },

    setHovered(nodeId: string | null) {
      update((state) => ({ ...state, hoveredNodeId: nodeId }));
    },

    setViewMode(viewMode: 'desktop' | 'tablet' | 'mobile') {
      update((state) => ({ ...state, viewMode }));
    },

    setZoom(zoom: number) {
      update((state) => ({ ...state, zoom }));
    },

    toggleGrid() {
      update((state) => {
        const next = !state.gridActive;
        return { ...state, gridActive: next, showColumnGrid: next };
      });
    },

    toggleColumnGrid() {
      update((state) => {
        const next = !state.showColumnGrid;
        return { ...state, showColumnGrid: next, gridActive: next };
      });
    },

    togglePixelGrid() {
      update((state) => ({ ...state, showPixelGrid: !state.showPixelGrid }));
    },

    setCanvasMargin(canvasMargin: '16px' | '24px' | '32px' | '48px') {
      update((state) => ({ ...state, canvasMargin }));
    },

    setPreviewTheme(previewTheme: 'light' | 'dark') {
      update((state) => ({ ...state, previewTheme }));
    },

    togglePreviewTheme() {
      update((state) => ({
        ...state,
        previewTheme: state.previewTheme === 'light' ? 'dark' : 'light',
      }));
    },

    deselectAll() {
      update((state) => ({
        ...state,
        selectedSectionId: null,
        selectedNodeId: null,
        hoveredNodeId: null,
      }));
    },

    reset() {
      set(initialCanvasState);
    },
  };
}

export const canvasStore = createCanvasStore();

const getDefaultLayoutPreset = (type: TemplateSection['type']): string => {
  switch (type) {
    case 'header_announcement': return 'default_split';
    case 'hero': return 'split_left_text';
    case 'features': return 'grid_3_cards';
    case 'product_catalog': return 'grid_standard';
    case 'testimonials': return 'masonry_grid';
    case 'faq': return 'accordion_single_col';
    case 'google_maps': return 'fullwidth_map';
    case 'footer': return 'multi_column';
    default: return 'default';
  }
};

/**
 * 2. documentStore / editorStore (Persistent Template Data)
 * Configuration, theme tokens, sections, slots, presets, and history.
 */
function createDocumentStore() {
  const { subscribe, set, update } = writable<DocumentState>(initialDocumentState);

  const pushHistory = (state: DocumentState, newConfig: TemplateConfig): DocumentState => {
    if (!state.template) return state;
    const past = [...state.history.past, clone(state.template.config)].slice(-20);
    return {
      ...state,
      template: { ...state.template, config: newConfig },
      history: { past, future: [] },
      isDirty: true,
    };
  };

  return {
    subscribe,
    set,
    update,

    init(rawTemplate: Partial<EditorTemplate> & { id: string; config?: unknown }) {
      if (!rawTemplate) return;
      const validConfig = ensureValidConfig(rawTemplate.config);
      const template: EditorTemplate = {
        id: rawTemplate.id,
        name: rawTemplate.name || 'Untitled Template',
        description: rawTemplate.description || '',
        thumbnailUrl: rawTemplate.thumbnailUrl || null,
        price: typeof rawTemplate.price === 'number' ? rawTemplate.price : 0,
        status: rawTemplate.status || 'draft',
        config: validConfig,
      };
      set({ ...initialDocumentState, template });
      canvasStore.selectSection(validConfig.sections[0]?.id || null);
    },

    updateSectionLayoutPreset(sectionId: string, preset: string) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) =>
          s.id === sectionId ? { ...s, layoutPreset: preset } : s
        );
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    reorderSectionSlot(sectionId: string, fromIndex: number, toIndex: number) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const currentProps = { ...(s.props || {}) };
          const order = Array.isArray(currentProps.elementOrder)
            ? [...currentProps.elementOrder]
            : ['badge', 'title', 'subtitle', 'image', 'cta'];
          if (fromIndex < 0 || fromIndex >= order.length || toIndex < 0 || toIndex >= order.length) return s;
          const [moved] = order.splice(fromIndex, 1);
          order.splice(toIndex, 0, moved);
          currentProps.elementOrder = order;
          return { ...s, props: currentProps };
        });
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    updateSectionProps(sectionId: string, props: Record<string, unknown>) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) =>
          s.id === sectionId ? { ...s, props: { ...s.props, ...props } } : s
        );
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    updateSectionStyles(sectionId: string, styles: Record<string, unknown>) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) =>
          s.id === sectionId ? { ...s, styles: { ...(s.styles || {}), ...styles } } : s
        );
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    updateNodeStyleToken(sectionId: string, nodeId: string, property: string, tokenKey: string) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const currentProps = s.props || {};
          const currentStyles = (currentProps.nodeStyles as Record<string, Record<string, unknown>>) || {};
          const updatedForNode = { ...(currentStyles[nodeId] || {}), [property]: tokenKey };
          return {
            ...s,
            props: { ...currentProps, nodeStyles: { ...currentStyles, [nodeId]: updatedForNode } },
          };
        });
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    updateNodeStyles(sectionId: string, nodeId: string, styles: Record<string, unknown>) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const currentProps = s.props || {};
          const currentStyles = (currentProps.nodeStyles as Record<string, Record<string, unknown>>) || {};
          const updatedForNode = { ...(currentStyles[nodeId] || {}), ...styles };
          return {
            ...s,
            props: { ...currentProps, nodeStyles: { ...currentStyles, [nodeId]: updatedForNode } },
          };
        });
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    updateGlobalTheme(themeUpdates: Partial<TemplateTheme>) {
      update((state) => {
        if (!state.template) return state;
        const currentTheme = (state.template.config.theme || {}) as Partial<TemplateTheme>;
        const updates = themeUpdates || {};
        const newTheme: TemplateTheme = {
          ...DEFAULT_TEMPLATE_THEME,
          ...currentTheme,
          ...updates,
          colors: { ...(currentTheme.colors || {}), ...(updates.colors || {}) },
          typography: { ...(currentTheme.typography || {}), ...(updates.typography || {}) },
          buttons: {
            ...(currentTheme.buttons || {}),
            ...(updates.buttons || {}),
            primary: { ...(currentTheme.buttons?.primary || {}), ...(updates.buttons?.primary || {}) },
            secondary: { ...(currentTheme.buttons?.secondary || {}), ...(updates.buttons?.secondary || {}) },
            outline: { ...(currentTheme.buttons?.outline || {}), ...(updates.buttons?.outline || {}) },
          },
          layout: { ...(currentTheme.layout || {}), ...(updates.layout || {}) },
        };
        return pushHistory(state, { ...state.template.config, theme: newTheme });
      });
    },

    updateTemplateName(name: string) {
      update((state) => {
        if (!state.template) return state;
        return { ...state, template: { ...state.template, name }, isDirty: true };
      });
    },

    deleteNode(sectionId: string, nodeId: string) {
      update((state) => applyDeleteNode(state, sectionId, nodeId, pushHistory));
      canvasStore.selectNode(sectionId, null);
    },

    addNode(sectionId: string, nodeType: string) {
      update((state) => {
        const { state: nextState, selectedNodeId } = applyAddNode(state, sectionId, nodeType, pushHistory);
        if (selectedNodeId) {
          canvasStore.selectNode(sectionId, selectedNodeId);
        }
        return nextState;
      });
    },

    updateSection(updatedSection: TemplateSection) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) =>
          s.id === updatedSection.id ? updatedSection : s
        );
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    addSection(type: TemplateSection['type']) {
      update((state) => {
        if (!state.template) return state;
        const count = state.template.config.sections.length + 1;
        const newId = `section-${Date.now()}-${count}`;
        const newSection: TemplateSection = {
          id: newId,
          type,
          layoutPreset: getDefaultLayoutPreset(type),
          styles: { padding: '48px 24px', bgColorToken: 'surface', textColorToken: 'text_primary', textAlign: 'center' },
          props: {},
        };
        const sections = [...state.template.config.sections, newSection];
        canvasStore.selectSection(newId);
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    deleteSection(sectionId: string) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.filter((s) => s.id !== sectionId);
        const nextSelected = sections[0]?.id || null;
        canvasStore.selectSection(nextSelected);
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    reorderSection(sectionId: string, direction: 'up' | 'down') {
      update((state) => {
        if (!state.template) return state;
        const sections = [...state.template.config.sections];
        const index = sections.findIndex((s) => s.id === sectionId);
        if (index === -1) return state;

        if (direction === 'up' && index > 0) {
          const temp = sections[index];
          sections[index] = sections[index - 1];
          sections[index - 1] = temp;
        } else if (direction === 'down' && index < sections.length - 1) {
          const temp = sections[index];
          sections[index] = sections[index + 1];
          sections[index + 1] = temp;
        }

        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    reorderArrayItem(sectionId: string, arrayKey: string, fromIndex: number, toIndex: number) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const array = [...((s.props?.[arrayKey] as unknown[]) || [])];
          if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) return s;
          const [movedItem] = array.splice(fromIndex, 1);
          array.splice(toIndex, 0, movedItem);
          return { ...s, props: { ...s.props, [arrayKey]: array } };
        });
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    undo() {
      update((state) => {
        if (state.history.past.length === 0 || !state.template) return state;
        const previous = state.history.past[state.history.past.length - 1];
        const newPast = state.history.past.slice(0, -1);
        const newFuture = [clone(state.template.config), ...state.history.future];
        return {
          ...state,
          template: { ...state.template, config: previous },
          history: { past: newPast, future: newFuture },
          isDirty: true,
        };
      });
    },

    redo() {
      update((state) => {
        if (state.history.future.length === 0 || !state.template) return state;
        const next = state.history.future[0];
        const newFuture = state.history.future.slice(1);
        const newPast = [...state.history.past, clone(state.template.config)];
        return {
          ...state,
          template: { ...state.template, config: next },
          history: { past: newPast, future: newFuture },
          isDirty: true,
        };
      });
    },

    async save() {
      await applySave(get({ subscribe }), update);
    },

    async submitReview(): Promise<boolean> {
      return await applySubmitReview(get({ subscribe }), update);
    },

    // Backward-compatibility delegators for canvas visual state
    selectSection(id: string | null) {
      canvasStore.selectSection(id);
    },
    selectNode(sectionId: string, nodeId: string | null) {
      canvasStore.selectNode(sectionId, nodeId);
    },
    deselectAll() {
      canvasStore.deselectAll();
    },
    setViewMode(viewMode: 'desktop' | 'tablet' | 'mobile') {
      canvasStore.setViewMode(viewMode);
    },
    setCanvasMargin(canvasMargin: '16px' | '24px' | '32px' | '48px') {
      canvasStore.setCanvasMargin(canvasMargin);
    },
    toggleColumnGrid() {
      canvasStore.toggleColumnGrid();
    },
    togglePixelGrid() {
      canvasStore.togglePixelGrid();
    },
    togglePreviewTheme() {
      canvasStore.togglePreviewTheme();
    },
    setPreviewTheme(previewTheme: 'light' | 'dark') {
      canvasStore.setPreviewTheme(previewTheme);
    },
  };
}

export const documentStore = createDocumentStore();
export const editorStore = documentStore;

export const activeSection = derived(
  [documentStore, canvasStore],
  ([$doc, $canvas]) => {
    if (!$doc.template || !$canvas.selectedSectionId) return undefined;
    return $doc.template.config.sections.find((s) => s.id === $canvas.selectedSectionId);
  }
);

export const activeNodeId = derived(canvasStore, ($canvas) => $canvas.selectedNodeId);
export const canUndo = derived(documentStore, ($doc) => $doc.history.past.length > 0);
export const canRedo = derived(documentStore, ($doc) => $doc.history.future.length > 0);
