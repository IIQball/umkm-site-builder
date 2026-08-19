import { writable, derived, get } from 'svelte/store';
import {
  DEFAULT_TEMPLATE_SECTIONS,
  type TemplateConfig,
  type TemplateSection,
} from '@/schemas/template.schema';

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

const initialState: EditorState = {
  template: null,
  selectedSectionId: null,
  selectedNodeId: null,
  viewMode: 'desktop',
  canvasMargin: '24px',
  isDirty: false,
  isSaving: false,
  saveSuccess: false,
  error: null,
  history: {
    past: [],
    future: [],
  },
};

const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const ensureValidConfig = (config: unknown): TemplateConfig => {
  if (!config || typeof config !== 'object') {
    return {
      theme: { primaryColor: '#3b82f6', fontFamily: 'sans-serif' },
      sections: clone(DEFAULT_TEMPLATE_SECTIONS),
    };
  }
  const cfg = config as Partial<TemplateConfig>;
  return {
    theme: cfg.theme || { primaryColor: '#3b82f6', fontFamily: 'sans-serif' },
    sections: Array.isArray(cfg.sections) && cfg.sections.length > 0
      ? cfg.sections
      : clone(DEFAULT_TEMPLATE_SECTIONS),
  };
};

function createEditorStore() {
  const { subscribe, set, update } = writable<EditorState>(initialState);

  const pushHistory = (state: EditorState, newConfig: TemplateConfig): EditorState => {
    if (!state.template) return state;
    const past = [...state.history.past, clone(state.template.config)].slice(-20);
    return {
      ...state,
      template: {
        ...state.template,
        config: newConfig,
      },
      history: {
        past,
        future: [],
      },
      isDirty: true,
    };
  };

  return {
    subscribe,
    set,
    update,

    init(rawTemplate: Partial<EditorTemplate> & { id: string; config?: unknown }) {
      if (!rawTemplate) return;
      const validConfig = ensureValidConfig(rawTemplate.config);
      const template: EditorTemplate = {
        id: rawTemplate.id,
        name: rawTemplate.name || 'Untitled Template',
        description: rawTemplate.description || '',
        thumbnailUrl: rawTemplate.thumbnailUrl || null,
        price: typeof rawTemplate.price === 'number' ? rawTemplate.price : 0,
        status: rawTemplate.status || 'draft',
        config: validConfig,
      };

      set({
        ...initialState,
        template,
        selectedSectionId: validConfig.sections[0]?.id || null,
      });
    },

    selectSection(id: string | null) {
      update((state) => ({
        ...state,
        selectedSectionId: id,
        selectedNodeId: null,
      }));
    },

    selectNode(sectionId: string, nodeId: string | null) {
      update((state) => ({
        ...state,
        selectedSectionId: sectionId,
        selectedNodeId: nodeId,
      }));
    },

    setViewMode(viewMode: 'desktop' | 'tablet' | 'mobile') {
      update((state) => ({ ...state, viewMode }));
    },

    setCanvasMargin(canvasMargin: '16px' | '24px' | '32px' | '48px') {
      update((state) => ({ ...state, canvasMargin }));
    },

    updateTemplateName(name: string) {
      update((state) => {
        if (!state.template) return state;
        return {
          ...state,
          template: { ...state.template, name },
          isDirty: true,
        };
      });
    },

    updateNodeStyles(sectionId: string, nodeId: string, styles: Record<string, unknown>) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const currentProps = s.props || {};
          const currentStyles = (currentProps.nodeStyles as Record<string, Record<string, unknown>>) || {};
          const updatedForNode = { ...(currentStyles[nodeId] || {}), ...styles };
          return {
            ...s,
            props: {
              ...currentProps,
              nodeStyles: {
                ...currentStyles,
                [nodeId]: updatedForNode,
              },
            },
          };
        });
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    deleteNode(sectionId: string, nodeId: string) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const currentProps = { ...(s.props || {}) };

          if (s.type === 'hero') {
            const order = Array.isArray(currentProps.elementOrder)
              ? [...currentProps.elementOrder]
              : ['badge', 'title', 'subtitle', 'image', 'cta'];
            const filtered = order.filter((k) => k !== nodeId);
            currentProps.elementOrder = filtered;
            if (nodeId === 'badge') currentProps.badgeText = '';
            if (nodeId === 'image') currentProps.imageUrl = '';
          } else if (s.type === 'header_announcement') {
            if (nodeId === 'announcement') {
              currentProps.announcementText = '';
            } else if (nodeId.startsWith('nav_')) {
              const idx = parseInt(nodeId.replace('nav_', ''), 10);
              if (Array.isArray(currentProps.navLinks)) {
                currentProps.navLinks = currentProps.navLinks.filter((_, i) => i !== idx);
              }
            }
          } else if (s.type === 'features' && Array.isArray(currentProps.features)) {
            const idx = parseInt(nodeId.replace('item_', ''), 10);
            if (!isNaN(idx)) {
              currentProps.features = currentProps.features.filter((_, i) => i !== idx);
            }
          } else if (s.type === 'product_catalog' && Array.isArray(currentProps.products)) {
            const idx = parseInt(nodeId.replace('item_', ''), 10);
            if (!isNaN(idx)) {
              currentProps.products = currentProps.products.filter((_, i) => i !== idx);
            }
          } else if (s.type === 'testimonials' && Array.isArray(currentProps.testimonials)) {
            const idx = parseInt(nodeId.replace('item_', ''), 10);
            if (!isNaN(idx)) {
              currentProps.testimonials = currentProps.testimonials.filter((_, i) => i !== idx);
            }
          } else if (s.type === 'faq' && Array.isArray(currentProps.faqs)) {
            const idx = parseInt(nodeId.replace('item_', ''), 10);
            if (!isNaN(idx)) {
              currentProps.faqs = currentProps.faqs.filter((_, i) => i !== idx);
            }
          }

          return { ...s, props: currentProps };
        });

        return {
          ...pushHistory(state, { ...state.template.config, sections }),
          selectedNodeId: null,
        };
      });
    },

    addNode(sectionId: string, nodeType: string) {
      update((state) => {
        if (!state.template) return state;
        let selectedNodeKey: string | null = null;

        const sections = state.template.config.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const currentProps = { ...(s.props || {}) };

          if (s.type === 'hero') {
            const order = Array.isArray(currentProps.elementOrder)
              ? [...currentProps.elementOrder]
              : ['badge', 'title', 'subtitle', 'image', 'cta'];
            if (!order.includes(nodeType)) {
              order.push(nodeType);
            }
            currentProps.elementOrder = order;
            if (nodeType === 'badge' && !currentProps.badgeText) {
              currentProps.badgeText = '✨ Promo Spesial Baru';
            }
            if (nodeType === 'image' && !currentProps.imageUrl) {
              currentProps.imageUrl = 'https://images.unsplash.com/photo-1556742049-0a67c55c70ff?w=800';
            }
            selectedNodeKey = nodeType;
          } else if (s.type === 'header_announcement') {
            const navs = Array.isArray(currentProps.navLinks) ? [...currentProps.navLinks] : ['Beranda'];
            navs.push('Menu Baru');
            currentProps.navLinks = navs;
            selectedNodeKey = `nav_${navs.length - 1}`;
          } else if (s.type === 'features') {
            const items = Array.isArray(currentProps.features) ? [...currentProps.features] : [];
            items.push({ icon: '⭐', title: 'Fitur Baru', description: 'Keunggulan produk dan layanan Anda.' });
            currentProps.features = items;
            selectedNodeKey = `item_${items.length - 1}`;
          } else if (s.type === 'product_catalog') {
            const items = Array.isArray(currentProps.products) ? [...currentProps.products] : [];
            items.push({ name: 'Produk Baru', price: 99000, imageUrl: '', badge: 'Baru' });
            currentProps.products = items;
            selectedNodeKey = `item_${items.length - 1}`;
          } else if (s.type === 'testimonials') {
            const items = Array.isArray(currentProps.testimonials) ? [...currentProps.testimonials] : [];
            items.push({ customerName: 'Pelanggan Baru', rating: 5, comment: 'Pelayanan sangat memuaskan!' });
            currentProps.testimonials = items;
            selectedNodeKey = `item_${items.length - 1}`;
          } else if (s.type === 'faq') {
            const items = Array.isArray(currentProps.faqs) ? [...currentProps.faqs] : [];
            items.push({ question: 'Pertanyaan Baru?', answer: 'Tuliskan jawaban yang jelas dan informatif di sini.' });
            currentProps.faqs = items;
            selectedNodeKey = `item_${items.length - 1}`;
          }

          return { ...s, props: currentProps };
        });

        return {
          ...pushHistory(state, { ...state.template.config, sections }),
          selectedNodeId: selectedNodeKey,
        };
      });
    },

    updateSection(updatedSection: TemplateSection) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) =>
          s.id === updatedSection.id ? updatedSection : s
        );
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    updateSectionProps(sectionId: string, props: Record<string, unknown>) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) =>
          s.id === sectionId ? { ...s, props: { ...s.props, ...props } } : s
        );
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    updateSectionStyles(sectionId: string, styles: Record<string, unknown>) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) =>
          s.id === sectionId ? { ...s, styles: { ...(s.styles || {}), ...styles } } : s
        );
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    addSection(type: TemplateSection['type']) {
      update((state) => {
        if (!state.template) return state;
        const count = state.template.config.sections.length + 1;
        const newId = `section-${Date.now()}-${count}`;
        const newSection: TemplateSection = {
          id: newId,
          type,
          styles: {
            padding: '48px 24px',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            textAlign: 'center',
          },
          props: {},
        };

        const sections = [...state.template.config.sections, newSection];
        return {
          ...pushHistory(state, { ...state.template.config, sections }),
          selectedSectionId: newId,
        };
      });
    },

    deleteSection(sectionId: string) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.filter((s) => s.id !== sectionId);
        const nextSelected = sections[0]?.id || null;
        return {
          ...pushHistory(state, { ...state.template.config, sections }),
          selectedSectionId: state.selectedSectionId === sectionId ? nextSelected : state.selectedSectionId,
        };
      });
    },

    reorderSection(sectionId: string, direction: 'up' | 'down') {
      update((state) => {
        if (!state.template) return state;
        const sections = [...state.template.config.sections];
        const index = sections.findIndex((s) => s.id === sectionId);
        if (index === -1) return state;

        if (direction === 'up' && index > 0) {
          const temp = sections[index];
          sections[index] = sections[index - 1];
          sections[index - 1] = temp;
        } else if (direction === 'down' && index < sections.length - 1) {
          const temp = sections[index];
          sections[index] = sections[index + 1];
          sections[index + 1] = temp;
        }

        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    reorderArrayItem(sectionId: string, arrayKey: string, fromIndex: number, toIndex: number) {
      update((state) => {
        if (!state.template) return state;
        const sections = state.template.config.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const array = [...((s.props && (s.props[arrayKey] as unknown[])) || [])];
          if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) return s;
          const [movedItem] = array.splice(fromIndex, 1);
          array.splice(toIndex, 0, movedItem);
          return {
            ...s,
            props: {
              ...s.props,
              [arrayKey]: array,
            },
          };
        });
        return pushHistory(state, { ...state.template.config, sections });
      });
    },

    undo() {
      update((state) => {
        if (state.history.past.length === 0 || !state.template) return state;
        const previous = state.history.past[state.history.past.length - 1];
        const newPast = state.history.past.slice(0, -1);
        const newFuture = [clone(state.template.config), ...state.history.future];

        return {
          ...state,
          template: {
            ...state.template,
            config: previous,
          },
          history: {
            past: newPast,
            future: newFuture,
          },
          isDirty: true,
        };
      });
    },

    redo() {
      update((state) => {
        if (state.history.future.length === 0 || !state.template) return state;
        const next = state.history.future[0];
        const newFuture = state.history.future.slice(1);
        const newPast = [...state.history.past, clone(state.template.config)];

        return {
          ...state,
          template: {
            ...state.template,
            config: next,
          },
          history: {
            past: newPast,
            future: newFuture,
          },
          isDirty: true,
        };
      });
    },

    async save() {
      const state = get({ subscribe });
      if (!state.template || state.isSaving) return;

      update((s) => ({ ...s, isSaving: true, error: null, saveSuccess: false }));

      try {
        const response = await fetch(`/api/builder/save?templateId=${encodeURIComponent(state.template.id)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: state.template.name,
            description: state.template.description,
            price: state.template.price,
            thumbnailUrl: state.template.thumbnailUrl,
            config: state.template.config,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || 'Gagal menyimpan template');
        }

        update((s) => ({
          ...s,
          isSaving: false,
          isDirty: false,
          saveSuccess: true,
        }));

        setTimeout(() => {
          update((s) => ({ ...s, saveSuccess: false }));
        }, 3000);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Gagal menyimpan template';
        update((s) => ({
          ...s,
          isSaving: false,
          error: errorMsg,
        }));
      }
    },

    async submitReview() {
      const state = get({ subscribe });
      if (!state.template || state.isSaving) return;

      // Konfirmasi pengajuan
      const confirmed = window.confirm(
        'Apakah Anda yakin ingin mengajukan template ini untuk direview oleh Admin?\n\nSetelah diajukan, status template akan menjadi "Menunggu Review" dan Anda akan dialihkan ke halaman preview.'
      );
      if (!confirmed) return;

      update((s) => ({ ...s, isSaving: true, error: null }));

      try {
        // 1. Simpan konfigurasi draft terlebih dahulu
        await fetch(`/api/builder/save?templateId=${state.template.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: state.template.name,
            description: state.template.description,
            price: state.template.price,
            thumbnailUrl: state.template.thumbnailUrl,
            config: state.template.config,
          }),
        });

        // 2. Ajukan review (update status ke pending)
        const response = await fetch('/api/templates/submit-review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: state.template.id,
          }),
        });

        const resData = await response.json().catch(() => ({}));
        if (!response.ok || !resData.ok) {
          throw new Error(resData.error?.message || 'Gagal mengajukan review template');
        }

        update((s) => ({
          ...s,
          isSaving: false,
          isDirty: false,
          saveSuccess: true,
          template: s.template ? { ...s.template, status: 'pending' } : null,
        }));

        // 3. Redirect ke halaman preview
        const redirectUrl = resData.redirectUrl || `/builder/preview/${state.template.id}`;
        window.location.href = redirectUrl;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Gagal mengajukan review';
        update((s) => ({
          ...s,
          isSaving: false,
          error: errorMsg,
        }));
        alert(`Error: ${errorMsg}`);
      }
    },
  };
}

export const editorStore = createEditorStore();

export const activeSection = derived(editorStore, ($store) => {
  if (!$store.template || !$store.selectedSectionId) return undefined;
  return $store.template.config.sections.find((s) => s.id === $store.selectedSectionId);
});

export const activeNodeId = derived(editorStore, ($store) => $store.selectedNodeId);

export const canUndo = derived(editorStore, ($store) => $store.history.past.length > 0);
export const canRedo = derived(editorStore, ($store) => $store.history.future.length > 0);
