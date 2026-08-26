import { writable, get } from 'svelte/store';
import {
  type TemplateConfig,
  type TemplateSection,
  type TemplateTheme,
  DEFAULT_TEMPLATE_THEME,
} from '@/schemas';
import {
  type EditorTemplate,
  type DocumentState,
  initialDocumentState,
  clone,
  ensureValidTemplate,
} from './editorStore.types';
import { applyDeleteNode, applyAddNode, applySave, applySubmitReview } from './editorStore.mutations';
import {
  updateSectionPropsInTemplate,
  updateSectionStylesInTemplate,
  updateNodeStyleTokenInTemplate,
  ensureSectionExists,
} from './documentStore.helpers';

function buildHistoryArray(items: EditorTemplate[], currentIndex: number) {
  const arr = [...items] as EditorTemplate[] & { past: EditorTemplate[]; future: EditorTemplate[] };
  arr.past = items.slice(0, currentIndex);
  arr.future = items.slice(currentIndex + 1);
  return arr;
}

let lastThemeUpdateTime = 0;
const THEME_MERGE_WINDOW_MS = 400;

export function createDocumentStore() {
  const { subscribe, set, update } = writable<DocumentState>(initialDocumentState);

  function pushHistory(state: DocumentState, nextTemplate: EditorTemplate, isDebouncedMerge = false): DocumentState {
    if (isDebouncedMerge && state.historyIndex > 0) {
      const nextHistory = [...state.history];
      nextHistory[state.historyIndex] = clone(nextTemplate);
      const historyArr = buildHistoryArray(nextHistory, state.historyIndex);
      return {
        ...state,
        template: nextTemplate,
        history: historyArr,
        historyIndex: state.historyIndex,
        isDirty: true,
      };
    }
    const nextHistory = state.history.slice(0, state.historyIndex + 1);
    nextHistory.push(clone(nextTemplate));
    const historyArr = buildHistoryArray(nextHistory, nextHistory.length - 1);
    return {
      ...state,
      template: nextTemplate,
      history: historyArr,
      historyIndex: nextHistory.length - 1,
      isDirty: true,
    };
  }

  return {
    subscribe,
    set,
    update,

    init(template: EditorTemplate) {
      lastThemeUpdateTime = 0;
      const valid = ensureValidTemplate(template);
      const initialHistory = buildHistoryArray([clone(valid)], 0);
      set({
        template: clone(valid),
        history: initialHistory,
        historyIndex: 0,
        isDirty: false,
        isSaving: false,
      });
    },

    updateTemplate(updates: Partial<EditorTemplate>) {
      update((state) => {
        if (!state.template) return state;
        const next: EditorTemplate = { ...state.template, ...updates };
        return pushHistory(state, next);
      });
    },

    updateConfig(updates: Partial<TemplateConfig>) {
      update((state) => {
        if (!state.template) return state;
        const next: EditorTemplate = {
          ...state.template,
          config: { ...state.template.config, ...updates },
        };
        return pushHistory(state, next);
      });
    },

    updateGlobalTheme(themeUpdates: Partial<TemplateTheme> | Record<string, unknown>) {
      update((state) => {
        if (!state.template) return state;
        const now = Date.now();
        const isWithinMergeWindow = now - lastThemeUpdateTime < THEME_MERGE_WINDOW_MS;
        lastThemeUpdateTime = now;

        const currentConfig = state.template.config || { theme: DEFAULT_TEMPLATE_THEME, sections: [] };
        const currentTheme = currentConfig.theme || DEFAULT_TEMPLATE_THEME;
        const mergedColors = { ...currentTheme.colors, ...(themeUpdates.colors || {}) };
        const mergedTypography = { ...currentTheme.typography, ...(themeUpdates.typography || {}) };
        const mergedButtons = { ...currentTheme.buttons, ...(themeUpdates.buttons || {}) };
        const mergedLayout = { ...currentTheme.layout, ...(themeUpdates.layout || {}) };
        const nextTheme: TemplateTheme = {
          ...currentTheme,
          ...themeUpdates,
          colors: mergedColors as TemplateTheme['colors'],
          typography: mergedTypography as TemplateTheme['typography'],
          buttons: mergedButtons as TemplateTheme['buttons'],
          layout: mergedLayout as TemplateTheme['layout'],
        };
        const next: EditorTemplate = {
          ...state.template,
          config: { ...currentConfig, theme: nextTheme },
        };
        return pushHistory(state, next, isWithinMergeWindow);
      });
    },

    updateSection(section: TemplateSection) {
      update((state) => {
        if (!state.template) return state;
        const baseSections = ensureSectionExists(state.template.config.sections, section.id);
        const sections = baseSections.map((s) => (s.id === section.id ? { ...s, ...section } : s));
        const next: EditorTemplate = {
          ...state.template,
          config: {
            ...state.template.config,
            sections,
          },
        };
        return pushHistory(state, next);
      });
    },

    updateSectionProps(sectionId: string, props: Record<string, unknown>) {
      update((state) => {
        if (!state.template) return state;
        return pushHistory(state, updateSectionPropsInTemplate(state.template, sectionId, props));
      });
    },

    updateSectionStyles(sectionId: string, styles: Record<string, string | undefined>) {
      update((state) => {
        if (!state.template) return state;
        return pushHistory(state, updateSectionStylesInTemplate(state.template, sectionId, styles));
      });
    },

    updateSectionSpacing(sectionId: string, spacing: { paddingY?: number; paddingX?: number; gap?: number }) {
      update((state) => {
        if (!state.template) return state;
        const updates: Record<string, string> = {};
        if (spacing.paddingY !== undefined || spacing.paddingX !== undefined) {
          updates.padding = `${spacing.paddingY || 0}px ${spacing.paddingX || 0}px`;
        }
        if (spacing.gap !== undefined) {
          updates.gap = `${spacing.gap}px`;
        }
        return pushHistory(state, updateSectionStylesInTemplate(state.template, sectionId, updates));
      });
    },

    updateNodeSpacing(sectionId: string, nodeName: string, spacing: { marginTop?: number; marginBottom?: number; padding?: number }) {
      update((state) => {
        if (!state.template) return state;
        let t = state.template;
        if (spacing.marginTop !== undefined) {
          t = updateNodeStyleTokenInTemplate(t, sectionId, nodeName, 'marginTop', `${spacing.marginTop}px`);
        }
        if (spacing.marginBottom !== undefined) {
          t = updateNodeStyleTokenInTemplate(t, sectionId, nodeName, 'marginBottom', `${spacing.marginBottom}px`);
        }
        if (spacing.padding !== undefined) {
          t = updateNodeStyleTokenInTemplate(t, sectionId, nodeName, 'padding', `${spacing.padding}px`);
        }
        return pushHistory(state, t);
      });
    },

    updateSectionLayoutPreset(sectionId: string, layoutPreset: string) {
      update((state) => {
        if (!state.template) return state;
        const baseSections = ensureSectionExists(state.template.config.sections, sectionId);
        const sections = baseSections.map((sec) => {
          if (sec.id !== sectionId) return sec;
          return {
            ...sec,
            layoutPreset,
            styles: { ...sec.styles, layoutPreset },
            props: { ...sec.props, layoutPreset },
          };
        });
        const next: EditorTemplate = {
          ...state.template,
          config: { ...state.template.config, sections },
        };
        return pushHistory(state, next);
      });
    },

    updateDesignSystemTheme(
      category: 'colors' | 'typography' | 'buttons' | 'layout' | 'radius' | 'spacing',
      tokens: Record<string, string | number>,
    ) {
      update((state) => {
        if (!state.template) return state;
        const currentTheme = state.template.config.theme || DEFAULT_TEMPLATE_THEME;
        const updatedCategory = {
          ...((currentTheme[category as keyof TemplateTheme] as Record<string, unknown>) || {}),
          ...tokens,
        };
        const nextTheme: TemplateTheme = {
          ...currentTheme,
          [category]: updatedCategory,
        };
        const next: EditorTemplate = {
          ...state.template,
          config: { ...state.template.config, theme: nextTheme },
        };
        return pushHistory(state, next);
      });
    },

    updateNodeStyleToken(
      sectionId: string,
      nodeName: string,
      styleProp: string,
      tokenValue: string,
    ) {
      update((state) => {
        if (!state.template) return state;
        return pushHistory(state, updateNodeStyleTokenInTemplate(state.template, sectionId, nodeName, styleProp, tokenValue));
      });
    },

    reorderSectionSlot(sectionId: string, fromIndex: number, toIndex: number) {
      update((state) => {
        if (!state.template) return state;
        const baseSections = ensureSectionExists(state.template.config.sections, sectionId);
        const sections = baseSections.map((sec) => {
          if (sec.id !== sectionId) return sec;
          const currentOrder = ((sec.props?.elementOrder as string[]) || ['badge', 'title', 'subtitle', 'image', 'cta']).slice();
          if (fromIndex < 0 || fromIndex >= currentOrder.length || toIndex < 0 || toIndex >= currentOrder.length) {
            return sec;
          }
          const [moved] = currentOrder.splice(fromIndex, 1);
          currentOrder.splice(toIndex, 0, moved);
          return {
            ...sec,
            props: { ...sec.props, elementOrder: currentOrder },
          };
        });
        const next: EditorTemplate = {
          ...state.template,
          config: { ...state.template.config, sections },
        };
        return pushHistory(state, next);
      });
    },

    addSection(sectionOrType: TemplateSection | TemplateSection['type'], atIndex?: number) {
      const section: TemplateSection = typeof sectionOrType === 'string'
        ? {
            id: `sec_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
            type: sectionOrType,
            props: {},
            styles: {},
          }
        : sectionOrType;

      update((state) => {
        if (!state.template) return state;
        const sections = [...state.template.config.sections];
        if (typeof atIndex === 'number' && atIndex >= 0 && atIndex <= sections.length) {
          sections.splice(atIndex, 0, section);
        } else {
          sections.push(section);
        }
        const next: EditorTemplate = {
          ...state.template,
          config: { ...state.template.config, sections },
        };
        return pushHistory(state, next);
      });
    },

    removeSection(sectionId: string) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.filter((s) => s.id !== sectionId);
        const next: EditorTemplate = {
          ...state.template,
          config: { ...state.template.config, sections },
        };
        return pushHistory(state, next);
      });
    },

    reorderSections(fromIndexOrId: number | string, toIndexOrDir: number | 'up' | 'down') {
      update((state) => {
        if (!state.template) return state;
        const sections = [...state.template.config.sections];
        if (typeof fromIndexOrId === 'string') {
          const idx = sections.findIndex((s) => s.id === fromIndexOrId);
          if (idx === -1) return state;
          const targetIdx = toIndexOrDir === 'up' ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= sections.length) return state;
          const [moved] = sections.splice(idx, 1);
          sections.splice(targetIdx, 0, moved);
        } else if (typeof fromIndexOrId === 'number' && typeof toIndexOrDir === 'number') {
          const [moved] = sections.splice(fromIndexOrId, 1);
          sections.splice(toIndexOrDir, 0, moved);
        }
        const next: EditorTemplate = {
          ...state.template,
          config: { ...state.template.config, sections },
        };
        return pushHistory(state, next);
      });
    },

    addNode(sectionId: string, nodeType: string) {
      update((state) => {
        const result = applyAddNode(state, sectionId, nodeType, (s, cfg) => {
          if (!s.template) return s;
          return pushHistory(s, { ...s.template, config: cfg });
        });
        return result.state;
      });
    },

    deleteNode(sectionId: string, nodeId: string) {
      update((state) => {
        const result = applyDeleteNode(state, sectionId, nodeId, (s, cfg) => {
          if (!s.template) return s;
          return pushHistory(s, { ...s.template, config: cfg });
        });
        return result;
      });
    },

    undo() {
      update((state) => {
        if (state.historyIndex <= 0) return state;
        const nextIndex = state.historyIndex - 1;
        const nextHistory = buildHistoryArray(state.history, nextIndex);
        return {
          ...state,
          template: clone(state.history[nextIndex]),
          history: nextHistory,
          historyIndex: nextIndex,
          isDirty: true,
        };
      });
    },

    redo() {
      update((state) => {
        if (state.historyIndex >= state.history.length - 1) return state;
        const nextIndex = state.historyIndex + 1;
        const nextHistory = buildHistoryArray(state.history, nextIndex);
        return {
          ...state,
          template: clone(state.history[nextIndex]),
          history: nextHistory,
          historyIndex: nextIndex,
          isDirty: true,
        };
      });
    },

    async save(): Promise<void> {
      await applySave(get({ subscribe }), update);
    },

    async submitForReview(): Promise<void> {
      await applySubmitReview(get({ subscribe }), update);
    },
  };
}

export const documentStore = createDocumentStore();
