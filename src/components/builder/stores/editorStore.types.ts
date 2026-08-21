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
      primary: { ...DEFAULT_TEMPLATE_THEME.buttons?.primary, ...(rawTheme.buttons?.primary || {}) },
      secondary: { ...DEFAULT_TEMPLATE_THEME.buttons?.secondary, ...(rawTheme.buttons?.secondary || {}) },
      outline: { ...DEFAULT_TEMPLATE_THEME.buttons?.outline, ...(rawTheme.buttons?.outline || {}) },
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
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  rejectionReason?: string | null;
  config: TemplateConfig;
}

export interface EditorState {
  template: EditorTemplate | null;
  selectedSectionId: string | null;
  selectedNodeId: string | null;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  canvasMargin: '16px' | '24px' | '32px' | '48px';
  showColumnGrid: boolean;
  showPixelGrid: boolean;
  previewTheme: 'light' | 'dark';
  isDirty: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  error: string | null;
  history: {
    past: TemplateConfig[];
    future: TemplateConfig[];
  };
}

export const initialState: EditorState = {
  template: null,
  selectedSectionId: null,
  selectedNodeId: null,
  viewMode: 'desktop',
  canvasMargin: '24px',
  showColumnGrid: false,
  showPixelGrid: false,
  previewTheme: 'light',
  isDirty: false,
  isSaving: false,
  saveSuccess: false,
  error: null,
  history: { past: [], future: [] },
};
