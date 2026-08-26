import { derived } from 'svelte/store';
import {
  type EditorTemplate,
  type CanvasState,
  type DocumentState,
  type EditorState,
  initialCanvasState,
  initialDocumentState,
  initialState,
  ensureValidConfig,
} from './editorStore.types';
import { canvasStore } from './canvasStore';
import { documentStore } from './documentStore';

export type { EditorTemplate, CanvasState, DocumentState, EditorState };
export { ensureValidConfig, initialCanvasState, initialDocumentState, initialState };
export { canvasStore, documentStore };

export const canUndo = derived(documentStore, ($doc) => $doc.historyIndex > 0);
export const canRedo = derived(documentStore, ($doc) => $doc.historyIndex < $doc.history.length - 1);

export const activeSection = derived([documentStore, canvasStore], ([$doc, $canvas]) => {
  return $doc.template?.config?.sections?.find((s) => s.id === $canvas.selectedSectionId) || null;
});

export const activeNodeId = derived(canvasStore, ($canvas) => $canvas.selectedNodeId);
export const activeSectionId = derived(canvasStore, ($canvas) => $canvas.selectedSectionId);

const unifiedStore = derived([canvasStore, documentStore], ([$canvas, $doc]) => ({
  ...$canvas,
  ...$doc,
  error: null as string | null,
}));

export const editorStore = {
  subscribe: unifiedStore.subscribe,

  // Canvas methods
  selectSection: canvasStore.selectSection,
  selectNode: canvasStore.selectNode,
  setHovered: canvasStore.setHovered,
  setViewMode: canvasStore.setViewMode,
  setZoom: canvasStore.setZoom,
  setInspectorTab: canvasStore.setInspectorTab,
  toggleLayerPanel: canvasStore.toggleLayerPanel,
  toggleHistoryPanel: canvasStore.toggleHistoryPanel,
  toggleThemePanel: canvasStore.toggleThemePanel,
  toggleReadOnlyPreview: canvasStore.toggleReadOnlyPreview,
  toggleGuides: canvasStore.toggleGuides,
  toggleSnapGrid: canvasStore.toggleSnapGrid,
  toggleLayoutGrid: canvasStore.toggleLayoutGrid,
  toggleGrid: canvasStore.toggleGrid,
  setActiveMargin: canvasStore.setActiveMargin,
  toggleLeftSidebar: canvasStore.toggleLeftSidebar,
  toggleRightSidebar: canvasStore.toggleRightSidebar,
  toggleEditorTheme: canvasStore.toggleEditorTheme,

  // Document methods
  init(template: EditorTemplate) {
    canvasStore.reset();
    documentStore.init(template);
  },
  updateTemplate: documentStore.updateTemplate,
  updateConfig: documentStore.updateConfig,
  updateGlobalTheme: documentStore.updateGlobalTheme,
  updateSectionProps: documentStore.updateSectionProps,
  updateSectionStyles: documentStore.updateSectionStyles,
  updateSectionSpacing: documentStore.updateSectionSpacing,
  updateNodeSpacing: documentStore.updateNodeSpacing,
  updateSectionLayoutPreset: documentStore.updateSectionLayoutPreset,
  updateDesignSystemTheme: documentStore.updateDesignSystemTheme,
  updateNodeStyleToken: documentStore.updateNodeStyleToken,
  reorderSectionSlot: documentStore.reorderSectionSlot,
  addSection: documentStore.addSection,
  removeSection: documentStore.removeSection,
  reorderSections: documentStore.reorderSections,
  addNode: documentStore.addNode,
  deleteNode: documentStore.deleteNode,
  undo: documentStore.undo,
  redo: documentStore.redo,
  save: documentStore.save,
  submitForReview: documentStore.submitForReview,
  submitReview: documentStore.submitForReview,
  updateSection: documentStore.updateSection,
  deleteSection: documentStore.removeSection,
  reorderSection: (id: string, dir: 'up' | 'down') => documentStore.reorderSections(id, dir),
  toggleColumnGrid: canvasStore.toggleLayoutGrid,
  updateTemplateName: (name: string) => documentStore.updateTemplate({ name }),
};
