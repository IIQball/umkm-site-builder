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
import { canvasStore, createCanvasStore } from './canvasStore';
import { documentStore, createDocumentStore } from './documentStore';

export type { EditorTemplate, CanvasState, DocumentState, EditorState };
export { ensureValidConfig, initialCanvasState, initialDocumentState, initialState };
export { canvasStore, createCanvasStore, documentStore, createDocumentStore };

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
