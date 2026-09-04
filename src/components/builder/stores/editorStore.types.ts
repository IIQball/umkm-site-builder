import type { TemplateConfig } from '@/schemas';
import { migrateTemplateConfig, ensureValidConfig, clone } from '@/lib/templates';

export { clone, ensureValidConfig, migrateTemplateConfig };

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

export interface CanvasState {
  selectedSectionId: string | null;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  gridActive: boolean;
  zoom: number;
  activeMargin: '16px' | '24px' | '32px' | '48px';
  canvasMargin: '16px' | '24px' | '32px' | '48px';
  showColumnGrid: boolean;
  showPixelGrid: boolean;
  previewTheme: 'light' | 'dark';
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  editorTheme: 'light' | 'dark';
}

export const initialCanvasState: CanvasState = {
  selectedSectionId: null,
  selectedNodeId: null,
  hoveredNodeId: null,
  viewMode: 'desktop',
  gridActive: false,
  zoom: 100,
  activeMargin: '24px',
  canvasMargin: '24px',
  showColumnGrid: false,
  showPixelGrid: false,
  previewTheme: 'light',
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  editorTheme: 'light',
};

export interface DocumentState {
  template: EditorTemplate | null;
  isDirty: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  error: string | null;
  history: {
    past: TemplateConfig[];
    future: TemplateConfig[];
  };
}

export const initialDocumentState: DocumentState = {
  template: null,
  isDirty: false,
  isSaving: false,
  saveSuccess: false,
  error: null,
  history: { past: [], future: [] },
};

// Legacy / Combined EditorState alias for backward compatibility
export type EditorState = DocumentState;
export const initialState = initialDocumentState;

