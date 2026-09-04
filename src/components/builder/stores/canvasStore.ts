import { writable } from 'svelte/store';
import { type CanvasState, initialCanvasState } from './editorStore.types';

/**
 * canvasStore (Ephemeral / Visual State)
 * Selection, viewport, zoom, grid, sidebars, and preview flags.
 * Mutations here DO NOT push history and DO NOT modify isDirty.
 */
export function createCanvasStore() {
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
      update((state) => ({
        ...state,
        editorTheme: state.editorTheme === 'light' ? 'dark' : 'light',
      }));
    },

    setEditorTheme(editorTheme: 'light' | 'dark') {
      update((state) => ({ ...state, editorTheme }));
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
