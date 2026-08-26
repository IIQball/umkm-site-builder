import { DEFAULT_TEMPLATE_SECTIONS, DEFAULT_TEMPLATE_THEME, type TemplateConfig, type TemplateTheme } from '@/schemas';

export const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const ensureValidConfig = (config: unknown): TemplateConfig => {
  if (!config || typeof config !== 'object') {
    return { theme: clone(DEFAULT_TEMPLATE_THEME), sections: clone(DEFAULT_TEMPLATE_SECTIONS) };
  }
  const cfg = config as Partial<TemplateConfig>;
  const rawTheme = ((cfg.theme || {}) as Partial<TemplateTheme>) || {};
  const mergedTheme: TemplateTheme = {
    ...DEFAULT_TEMPLATE_THEME,
    ...rawTheme,
    colors: { ...DEFAULT_TEMPLATE_THEME.colors, ...(rawTheme.colors || {}) },
    typography: { ...DEFAULT_TEMPLATE_THEME.typography, ...(rawTheme.typography || {}) },
    buttons: {
      ...DEFAULT_TEMPLATE_THEME.buttons,
      ...(rawTheme.buttons || {}),
    },
    layout: { ...DEFAULT_TEMPLATE_THEME.layout, ...(rawTheme.layout || {}) },
  };

  return {
    theme: mergedTheme,
    sections: Array.isArray(cfg.sections) && cfg.sections.length > 0 ? cfg.sections : clone(DEFAULT_TEMPLATE_SECTIONS),
  };
};

export interface EditorTemplate {
  id: string;
  name: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  price: number;
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | string;
  rejectionReason?: string | null;
  config: TemplateConfig;
}

export const ensureValidTemplate = (template: EditorTemplate): EditorTemplate => {
  const config = ensureValidConfig(template.config);
  return {
    ...template,
    config,
  };
};

export interface CanvasState {
  selectedSectionId: string | null;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  zoom: number;
  activeInspectorTab: 'props' | 'styles' | 'content';
  isLayerPanelOpen: boolean;
  isHistoryPanelOpen: boolean;
  isThemePanelOpen: boolean;
  isReadOnlyPreview: boolean;
  showGuides: boolean;
  snapToGrid: boolean;
  showLayoutGrid: boolean;
  showColumnGrid?: boolean;
  showPixelGrid?: boolean;
  gridActive: boolean;
  activeMargin: string;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  editorTheme: 'light' | 'dark';
  previewTheme?: 'light' | 'dark';
}

export interface DocumentState {
  template: EditorTemplate | null;
  history: EditorTemplate[] & { past: EditorTemplate[]; future: EditorTemplate[] };
  historyIndex: number;
  isDirty: boolean;
  isSaving: boolean;
}

export interface EditorState extends CanvasState, DocumentState {}

export const initialCanvasState: CanvasState = {
  selectedSectionId: null,
  selectedNodeId: null,
  hoveredNodeId: null,
  viewMode: 'desktop',
  zoom: 100,
  activeInspectorTab: 'props',
  isLayerPanelOpen: true,
  isHistoryPanelOpen: false,
  isThemePanelOpen: false,
  isReadOnlyPreview: false,
  showGuides: false,
  snapToGrid: false,
  showLayoutGrid: false,
  gridActive: false,
  activeMargin: '16px',
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  editorTheme: 'light',
};

export const initialDocumentState: DocumentState = {
  template: null,
  history: Object.assign([], { past: [], future: [] }),
  historyIndex: -1,
  isDirty: false,
  isSaving: false,
};

export const initialState: EditorState = {
  ...initialCanvasState,
  ...initialDocumentState,
};
