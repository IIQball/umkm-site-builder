import { writable, get } from 'svelte/store';
import {
  type TemplateSection,
  type TemplateTheme,
} from '@/schemas';
import {
  type EditorTemplate,
  type DocumentState,
  initialDocumentState,
  clone,
  ensureValidConfig,
} from './editorStore.types';
import { applyDeleteNode, applyAddNode, applySave, applySubmitReview } from './editorStore.mutations';
import { canvasStore } from './canvasStore';
import {
  getDefaultLayoutPreset,
  createHistoryManager,
  applyThemeUpdates,
  applyReorderSectionSlot,
  applyReorderArrayItem,
  applyNodeStyleToken,
  applySectionSpacing,
  applyNodeSpacing,
} from './documentStore.actions';

export * from './documentStore.actions';

/**
 * documentStore (Persistent Template Data)
 * Configuration, theme tokens, sections, slots, presets, and history.
 */
export function createDocumentStore() {
  const { subscribe, set, update } = writable<DocumentState>(initialDocumentState);
  const { pushHistory } = createHistoryManager();

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
      update((state) => applyReorderSectionSlot(state, sectionId, fromIndex, toIndex, pushHistory));
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

    updateNodeStyleToken(sectionId: string, nodeId: string, tokenKey: string, value: string) {
      update((state) => applyNodeStyleToken(state, sectionId, nodeId, tokenKey, value, pushHistory));
    },

    updateSectionSpacing(sectionId: string, spacing: { paddingY?: number; paddingX?: number; gap?: number }) {
      update((state) => applySectionSpacing(state, sectionId, spacing, pushHistory));
    },

    updateNodeSpacing(sectionId: string, nodeId: string, spacing: { marginTop?: number; marginBottom?: number; padding?: number }) {
      update((state) => applyNodeSpacing(state, sectionId, nodeId, spacing, pushHistory));
    },

    updateTheme(themeUpdates: Partial<TemplateTheme>) {
      update((state) => applyThemeUpdates(state, themeUpdates, pushHistory));
    },

    updateGlobalTheme(themeUpdates: Partial<TemplateTheme>) {
      update((state) => applyThemeUpdates(state, themeUpdates, pushHistory));
    },

    updateDesignSystemTheme(key: 'colors' | 'typography' | 'buttons' | 'layout', updates: Record<string, unknown>) {
      update((state) => applyThemeUpdates(state, { [key]: updates } as Partial<TemplateTheme>, pushHistory));
    },

    updateThemeColors(colorUpdates: Record<string, string>) {
      update((state) => applyThemeUpdates(state, { colors: colorUpdates }, pushHistory));
    },

    updateThemeTypography(typoUpdates: Record<string, unknown>) {
      update((state) => applyThemeUpdates(state, { typography: typoUpdates }, pushHistory));
    },

    updateThemeButtons(buttonUpdates: Record<string, unknown>) {
      update((state) => applyThemeUpdates(state, { buttons: buttonUpdates }, pushHistory));
    },

    updateThemeLayout(layoutUpdates: Record<string, unknown>) {
      update((state) => applyThemeUpdates(state, { layout: layoutUpdates }, pushHistory));
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
          styles: { padding: '0px', paddingTop: '0px', paddingBottom: '0px', paddingLeft: '0px', paddingRight: '0px', bgColorToken: 'surface', textColorToken: 'text_primary', textAlign: 'center' },
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
      update((state) => applyReorderArrayItem(state, sectionId, arrayKey, fromIndex, toIndex, pushHistory));
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
    setActiveMargin(activeMargin: '16px' | '24px' | '32px' | '48px') {
      canvasStore.setActiveMargin(activeMargin);
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
    toggleLeftSidebar() {
      canvasStore.toggleLeftSidebar();
    },
    toggleRightSidebar() {
      canvasStore.toggleRightSidebar();
    },
    toggleEditorTheme() {
      canvasStore.toggleEditorTheme();
    },
  };
}

export const documentStore = createDocumentStore();
