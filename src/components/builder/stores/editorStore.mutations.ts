import type { TemplateConfig } from '@/schemas';
import type { EditorState, EditorTemplate } from './editorStore.types';

type Updater = (fn: (s: EditorState) => EditorState) => void;

export async function applySave(
  state: EditorState,
  update: Updater
): Promise<void> {
  if (!state.template || state.isSaving) return;
  update((s) => ({ ...s, isSaving: true, error: null, saveSuccess: false }));
  try {
    const { template } = state;
    const response = await fetch(`/api/builder/save?templateId=${encodeURIComponent(template.id)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: template.name, description: template.description, price: template.price, thumbnailUrl: template.thumbnailUrl, config: template.config }),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'Gagal menyimpan template');
    }
    update((s) => ({ ...s, isSaving: false, isDirty: false, saveSuccess: true }));
    setTimeout(() => update((s) => ({ ...s, saveSuccess: false })), 3000);
  } catch (err) {
    update((s) => ({ ...s, isSaving: false, error: err instanceof Error ? err.message : 'Gagal menyimpan template' }));
  }
}

export async function applySubmitReview(
  state: EditorState,
  update: Updater
): Promise<boolean> {
  if (!state.template || state.isSaving) return false;
  update((s) => ({ ...s, isSaving: true, error: null }));
  try {
    const { template } = state;
    await fetch(`/api/builder/save?templateId=${encodeURIComponent(template.id)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: template.name, description: template.description, price: template.price, thumbnailUrl: template.thumbnailUrl, config: template.config }),
    });
    const response = await fetch('/api/templates/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: template.id }),
    });
    const resData = await response.json().catch(() => ({}));
    if (!response.ok || !resData.ok) throw new Error(resData.error?.message || 'Gagal mengajukan review template');
    update((s) => ({ ...s, isSaving: false, isDirty: false, saveSuccess: true, template: s.template ? { ...s.template, status: 'pending' as EditorTemplate['status'] } : null }));
    window.location.href = resData.redirectUrl || `/builder/preview/${template.id}`;
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Gagal mengajukan review';
    update((s) => ({ ...s, isSaving: false, error: msg }));
    throw err;
  }
}


/**
 * Handles deleteNode logic per section type.
 * Returns updated sections array.
 */
export function applyDeleteNode(
  state: EditorState,
  sectionId: string,
  nodeId: string,
  pushHistory: (state: EditorState, config: TemplateConfig) => EditorState
): EditorState {
  if (!state.template) return state;

  const sections = state.template.config.sections.map((s) => {
    if (s.id !== sectionId) return s;
    const currentProps = { ...(s.props || {}) };

    if (s.type === 'hero') {
      const order = Array.isArray(currentProps.elementOrder)
        ? [...currentProps.elementOrder]
        : ['badge', 'title', 'subtitle', 'image', 'cta'];
      currentProps.elementOrder = order.filter((k) => k !== nodeId);
      if (nodeId === 'badge') currentProps.badgeText = '';
      if (nodeId === 'image') currentProps.imageUrl = '';
    } else if (s.type === 'header_announcement') {
      if (nodeId === 'announcement') {
        currentProps.showAnnouncement = false;
        currentProps.announcementText = '';
      } else if (nodeId === 'logo') {
        currentProps.logoText = '';
        currentProps.logoImageUrl = '';
      } else if (nodeId === 'nav_links') {
        currentProps.navLinks = [];
      } else if (nodeId.startsWith('nav_')) {
        const idx = parseInt(nodeId.replace('nav_', ''), 10);
        if (Array.isArray(currentProps.navLinks)) {
          currentProps.navLinks = currentProps.navLinks.filter((_, i) => i !== idx);
        }
      }
    } else if (s.type === 'features' && Array.isArray(currentProps.features)) {
      const idx = parseInt(nodeId.replace('item_', ''), 10);
      if (!isNaN(idx)) currentProps.features = currentProps.features.filter((_, i) => i !== idx);
    } else if (s.type === 'product_catalog' && Array.isArray(currentProps.products)) {
      const idx = parseInt(nodeId.replace('item_', ''), 10);
      if (!isNaN(idx)) currentProps.products = currentProps.products.filter((_, i) => i !== idx);
    } else if (s.type === 'testimonials' && Array.isArray(currentProps.testimonials)) {
      const idx = parseInt(nodeId.replace('item_', ''), 10);
      if (!isNaN(idx)) currentProps.testimonials = currentProps.testimonials.filter((_, i) => i !== idx);
    } else if (s.type === 'faq' && Array.isArray(currentProps.faqs)) {
      const idx = parseInt(nodeId.replace('item_', ''), 10);
      if (!isNaN(idx)) currentProps.faqs = currentProps.faqs.filter((_, i) => i !== idx);
    }

    return { ...s, props: currentProps };
  });

  return {
    ...pushHistory(state, { ...state.template.config, sections }),
    selectedNodeId: null,
  };
}

/**
 * Handles addNode logic per section type.
 * Returns updated state with selectedNodeId set to new node key.
 */
export function applyAddNode(
  state: EditorState,
  sectionId: string,
  nodeType: string,
  pushHistory: (state: EditorState, config: TemplateConfig) => EditorState
): EditorState {
  if (!state.template) return state;
  let selectedNodeKey: string | null = null;

  const sections = state.template.config.sections.map((s) => {
    if (s.id !== sectionId) return s;
    const currentProps = { ...(s.props || {}) };

    if (s.type === 'hero') {
      const order = Array.isArray(currentProps.elementOrder)
        ? [...currentProps.elementOrder]
        : ['badge', 'title', 'subtitle', 'image', 'cta'];
      if (!order.includes(nodeType)) order.push(nodeType);
      currentProps.elementOrder = order;
      if (nodeType === 'badge' && !currentProps.badgeText) {
        currentProps.badgeText = 'Promo Spesial Baru';
      }
      if (nodeType === 'image' && !currentProps.imageUrl) {
        currentProps.imageUrl = 'https://images.unsplash.com/photo-1556742049-0a67c55c70ff?w=800';
      }
      selectedNodeKey = nodeType;
    } else if (s.type === 'header_announcement') {
      if (nodeType === 'announcement') {
        currentProps.showAnnouncement = true;
        currentProps.announcementText = currentProps.announcementText || 'Diskon 20% khusus hari ini';
        selectedNodeKey = 'announcement';
      } else if (nodeType === 'logo') {
        currentProps.logoText = currentProps.logoText || 'Toko UMKM';
        selectedNodeKey = 'logo';
      } else {
        const navs = Array.isArray(currentProps.navLinks) ? [...currentProps.navLinks] : ['Beranda'];
        navs.push('Menu Baru');
        currentProps.navLinks = navs;
        selectedNodeKey = 'nav_links';
      }
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
}
