import { writable, derived, get } from 'svelte/store';
import { type TemplateConfig, type TemplateSection, type TemplateTheme, DEFAULT_TEMPLATE_THEME } from '@/schemas';
import { type EditorTemplate, type EditorState, initialState, clone, ensureValidConfig } from './editorStore.types';
import { applyDeleteNode, applyAddNode, applySave, applySubmitReview } from './editorStore.mutations';

export type { EditorTemplate, EditorState };

export { ensureValidConfig };

function createEditorStore() {
  const { subscribe, set, update } = writable<EditorState>(initialState);

  const pushHistory = (state: EditorState, newConfig: TemplateConfig): EditorState => {
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
      set({ ...initialState, template, selectedSectionId: validConfig.sections[0]?.id || null });
    },

    selectSection(id: string | null) {
      update((state) => ({ ...state, selectedSectionId: id, selectedNodeId: null }));
    },

    selectNode(sectionId: string, nodeId: string | null) {
      update((state) => ({ ...state, selectedSectionId: sectionId, selectedNodeId: nodeId }));
    },

    deselectAll() {
      update((state) => ({ ...state, selectedSectionId: null, selectedNodeId: null }));
    },

    setViewMode(viewMode: 'desktop' | 'tablet' | 'mobile') {
      update((state) => ({ ...state, viewMode }));
    },

    setCanvasMargin(canvasMargin: '16px' | '24px' | '32px' | '48px') {
      update((state) => ({ ...state, canvasMargin }));
    },

    toggleColumnGrid() {
      update((state) => ({ ...state, showColumnGrid: !state.showColumnGrid }));
    },

    togglePixelGrid() {
      update((state) => ({ ...state, showPixelGrid: !state.showPixelGrid }));
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

    deleteNode(sectionId: string, nodeId: string) {
      update((state) => applyDeleteNode(state, sectionId, nodeId, pushHistory));
    },

    addNode(sectionId: string, nodeType: string) {
      update((state) => applyAddNode(state, sectionId, nodeType, pushHistory));
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

    addSection(type: TemplateSection['type']) {
      update((state) => {
        if (!state.template) return state;
        const count = state.template.config.sections.length + 1;
        const newId = `section-${Date.now()}-${count}`;
        const newSection: TemplateSection = {
          id: newId,
          type,
          styles: { padding: '48px 24px', backgroundColor: '#ffffff', color: '#0f172a', textAlign: 'center' },
          props: {},
        };
        const sections = [...state.template.config.sections, newSection];
        return { ...pushHistory(state, { ...state.template.config, sections }), selectedSectionId: newId };
      });
    },

    deleteSection(sectionId: string) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.filter((s) => s.id !== sectionId);
        const nextSelected = sections[0]?.id || null;
        return {
          ...pushHistory(state, { ...state.template.config, sections }),
          selectedSectionId: state.selectedSectionId === sectionId ? nextSelected : state.selectedSectionId,
        };
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
  };
}

export const editorStore = createEditorStore();

export const activeSection = derived(editorStore, ($store) => {
  if (!$store.template || !$store.selectedSectionId) return undefined;
  return $store.template.config.sections.find((s) => s.id === $store.selectedSectionId);
});

export const activeNodeId = derived(editorStore, ($store) => $store.selectedNodeId);
export const canUndo = derived(editorStore, ($store) => $store.history.past.length > 0);
export const canRedo = derived(editorStore, ($store) => $store.history.future.length > 0);
