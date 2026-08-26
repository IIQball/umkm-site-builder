import { writable } from 'svelte/store';
import { type CanvasState, initialCanvasState } from './editorStore.types';

export function createCanvasStore() {
  const { subscribe, set, update } = writable<CanvasState>(initialCanvasState);

  return {
    subscribe,
    set,
    update,

    selectSection(id: string | null) {
      update((state) => ({ ...state, selectedSectionId: id, selectedNodeId: null }));
    },

    deselectAll() {
      update((state) => ({ ...state, selectedSectionId: null, selectedNodeId: null }));
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
      const clamped = Math.min(200, Math.max(50, zoom));
      update((state) => ({ ...state, zoom: clamped }));
    },

    setInspectorTab(activeInspectorTab: 'props' | 'styles' | 'content') {
      update((state) => ({ ...state, activeInspectorTab }));
    },

    toggleLayerPanel() {
      update((state) => ({ ...state, isLayerPanelOpen: !state.isLayerPanelOpen }));
    },

    toggleHistoryPanel() {
      update((state) => ({ ...state, isHistoryPanelOpen: !state.isHistoryPanelOpen }));
    },

    toggleThemePanel() {
      update((state) => ({ ...state, isThemePanelOpen: !state.isThemePanelOpen }));
    },

    toggleReadOnlyPreview() {
      update((state) => ({ ...state, isReadOnlyPreview: !state.isReadOnlyPreview }));
    },

    toggleGuides() {
      update((state) => ({ ...state, showGuides: !state.showGuides }));
    },

    toggleSnapGrid() {
      update((state) => ({ ...state, snapToGrid: !state.snapToGrid }));
    },

    toggleLayoutGrid() {
      update((state) => ({ ...state, showLayoutGrid: !state.showLayoutGrid }));
    },

    toggleColumnGrid() {
      update((state) => ({ ...state, showLayoutGrid: !state.showLayoutGrid }));
    },

    toggleGrid() {
      update((state) => ({ ...state, gridActive: !state.gridActive }));
    },

    togglePixelGrid() {
      update((state) => ({ ...state, showPixelGrid: !state.showPixelGrid }));
    },

    setActiveMargin(activeMargin: string) {
      update((state) => ({ ...state, activeMargin }));
    },

    toggleLeftSidebar() {
      update((state) => ({ ...state, leftSidebarOpen: !state.leftSidebarOpen }));
    },

    toggleRightSidebar() {
      update((state) => ({ ...state, rightSidebarOpen: !state.rightSidebarOpen }));
    },

    toggleEditorTheme() {
      update((state) => ({ ...state, editorTheme: state.editorTheme === 'light' ? 'dark' : 'light' }));
    },

    reset() {
      set(initialCanvasState);
    },
  };
}

export const canvasStore = createCanvasStore();
