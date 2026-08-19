import { DEFAULT_TEMPLATE_SECTIONS, type TemplateConfig } from '@/schemas/template.schema';

export const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const ensureValidConfig = (config: unknown): TemplateConfig => {
  if (!config || typeof config !== 'object') {
    return { theme: { primaryColor: '#3b82f6', fontFamily: 'sans-serif' }, sections: clone(DEFAULT_TEMPLATE_SECTIONS) };
  }
  const cfg = config as Partial<TemplateConfig>;
  return {
    theme: cfg.theme || { primaryColor: '#3b82f6', fontFamily: 'sans-serif' },
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
  config: TemplateConfig;
}

export interface EditorState {
  template: EditorTemplate | null;
  selectedSectionId: string | null;
  selectedNodeId: string | null;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  canvasMargin: '16px' | '24px' | '32px' | '48px';
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
  isDirty: false,
  isSaving: false,
  saveSuccess: false,
  error: null,
  history: { past: [], future: [] },
};
