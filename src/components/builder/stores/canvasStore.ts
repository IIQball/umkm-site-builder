import { writable } from 'svelte/store';
import { type CanvasState, initialCanvasState } from './editorStore.types';
import { getStoredTheme, applyTheme } from '@/lib/utils/theme';

/**
 * canvasStore (Ephemeral / Visual State)
 * Selection, viewport, zoom, grid, sidebars, and preview flags.
 * Mutations here DO NOT push history and DO NOT modify isDirty.
 */
export function createCanvasStore() {
  const initialTheme = typeof window !== 'undefined' ? getStoredTheme() : initialCanvasState.editorTheme;
  const { subscribe, set, update } = writable<CanvasState>({
    ...initialCanvasState,
    editorTheme: initialTheme,
    previewTheme: initialTheme,
  });

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

    setActiveMargin(activeMargin: '16px' | '24px' | '32px' | '48px') {
      update((state) => ({ ...state, activeMargin, canvasMargin: activeMargin }));
    },

    setCanvasMargin(canvasMargin: '16px' | '24px' | '32px' | '48px') {
      update((state) => ({ ...state, canvasMargin, activeMargin: canvasMargin }));
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

    toggleLeftSidebar() {
      update((state) => ({ ...state, leftSidebarOpen: !state.leftSidebarOpen }));
    },

    toggleRightSidebar() {
      update((state) => ({ ...state, rightSidebarOpen: !state.rightSidebarOpen }));
    },

    setLeftSidebar(open: boolean) {
      update((state) => ({ ...state, leftSidebarOpen: open }));
    },

    setRightSidebar(open: boolean) {
      update((state) => ({ ...state, rightSidebarOpen: open }));
    },

    toggleEditorTheme() {
      update((state) => {
        const next = state.editorTheme === 'light' ? 'dark' : 'light';
        applyTheme(next);
        return {
          ...state,
          editorTheme: next,
          previewTheme: next,
        };
      });
    },

    setEditorTheme(editorTheme: 'light' | 'dark') {
      applyTheme(editorTheme);
      update((state) => ({
        ...state,
        editorTheme,
        previewTheme: editorTheme,
      }));
    },

    initEditorTheme() {
      const current = getStoredTheme();
      applyTheme(current);
      update((state) => ({
        ...state,
        editorTheme: current,
        previewTheme: current,
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
      const current = typeof window !== 'undefined' ? getStoredTheme() : initialCanvasState.editorTheme;
      set({
        ...initialCanvasState,
        editorTheme: current,
        previewTheme: current,
      });
    },
  };
}

export const canvasStore = createCanvasStore();
