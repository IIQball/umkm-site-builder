import type { TemplateConfig } from '@/schemas';
import type { DocumentState, EditorTemplate } from './editorStore.types';
import { DEFAULT_SLOTS_BY_SECTION } from './documentStore.actions';

type Updater = (fn: (s: DocumentState) => DocumentState) => void;

export async function applySave(
  state: DocumentState,
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
  state: DocumentState,
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
    const response = await fetch('/api/designer/templates/submit-review', {
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
 * Returns updated DocumentState.
 */
export function applyDeleteNode(
  state: DocumentState,
  sectionId: string,
  nodeId: string,
  pushHistory: (state: DocumentState, config: TemplateConfig) => DocumentState
): DocumentState {
  if (!state.template) return state;

  const sections = state.template.config.sections.map((s) => {
    if (s.id !== sectionId) return s;
    const currentProps = { ...(s.props || {}) };

    if (s.type === 'header_announcement') {
      const rowOrder = Array.isArray(currentProps.rowOrder) && currentProps.rowOrder.length > 0
        ? [...currentProps.rowOrder]
        : ['announcement_bar', 'navbar'];
      const navbarOrder = Array.isArray(currentProps.navbarOrder) && currentProps.navbarOrder.length > 0
        ? [...currentProps.navbarOrder]
        : (s.layoutPreset === 'centered_stacked' ? ['logo', 'nav_links'] : ['logo', 'nav_links', 'cta']);

      if (['announcement', 'announcement_bar', 'contact_bar', 'delivery_bar', 'countdown_bar'].includes(nodeId)) {
        currentProps.showAnnouncement = false;
        currentProps.announcementText = '';
        currentProps.rowOrder = rowOrder.filter((k) => k !== 'announcement_bar');
      } else if (nodeId === 'logo') {
        currentProps.logoText = '';
        currentProps.logoImageUrl = '';
        currentProps.navbarOrder = navbarOrder.filter((k) => k !== 'logo');
      } else if (nodeId === 'nav_links') {
        currentProps.navLinks = [];
        currentProps.navbarOrder = navbarOrder.filter((k) => k !== 'nav_links');
      } else if (nodeId === 'cta') {
        currentProps.ctaText = '';
        currentProps.navbarOrder = navbarOrder.filter((k) => k !== 'cta');
      } else if (nodeId === 'search_bar') {
        currentProps.navbarOrder = navbarOrder.filter((k) => k !== 'search_bar');
      } else if (nodeId === 'store_badges') {
        currentProps.navbarOrder = navbarOrder.filter((k) => k !== 'store_badges');
      } else if (nodeId.startsWith('nav_')) {
        const idx = parseInt(nodeId.replace('nav_', ''), 10);
        if (Array.isArray(currentProps.navLinks)) {
          currentProps.navLinks = currentProps.navLinks.filter((_, i) => i !== idx);
        }
      }
    } else {
      // Slot-based deletion for standard sections
      const defaultSlots = DEFAULT_SLOTS_BY_SECTION[s.type] || ['badge', 'title', 'subtitle', 'image', 'cta'];
      const currentOrder = Array.isArray(currentProps.elementOrder) && currentProps.elementOrder.length > 0
        ? [...currentProps.elementOrder]
        : [...defaultSlots];

      // Normalize nodeId to slot key
      const slotMap: Record<string, string> = {
        hero_badge: 'badge',
        badge: 'badge',
        hero_title: 'title',
        title: 'title',
        hero_subtitle: 'subtitle',
        subtitle: 'subtitle',
        hero_cta: 'cta',
        hero_cta_primary: 'cta',
        cta: 'cta',
        hero_image: 'image',
        hero_media: 'image',
        hero_founder_photo: 'image',
        image: 'image',
        hero_terminal: 'terminal',
        terminal: 'terminal',
        hero_booking_card: 'booking_card',
        booking_card: 'booking_card',
        hero_stat_counter: 'stat_counter',
        stat_counter: 'stat_counter',
        hero_trust_badges: 'trust_badges',
        trust_badges: 'trust_badges',
        hero_contrast_card: 'contrast_card',
        contrast_card: 'contrast_card',
        hero_product_cards: 'product_cards',
        product_cards: 'product_cards',
        hero_floating_cards: 'floating_cards',
        floating_cards: 'floating_cards',
        hero_social_proof: 'social_proof',
        social_proof: 'social_proof',
        hero_chat_simulation: 'chat_simulation',
        chat_simulation: 'chat_simulation',
        hero_email_capture: 'email_capture',
        email_capture: 'email_capture',
        hero_category_pills: 'category_pills',
        hero_pill_category: 'category_pills',
        category_pills: 'category_pills',
        footer_brand: 'brand_bio',
        footer_contact: 'contact_info',
        footer_navigation: 'navigation_links',
        footer_copyright: 'copyright',
        testimonials_header: 'title',
        faq_header: 'title',
        maps_header: 'title',
        features_heading: 'title',
        features_image: 'image',
      };
      const targetSlot = slotMap[nodeId] || nodeId;

      currentProps.elementOrder = currentOrder.filter((k) => k !== targetSlot && k !== nodeId);

      if (targetSlot === 'badge') currentProps.badgeText = '';
      if (targetSlot === 'title') currentProps.title = '';
      if (targetSlot === 'subtitle') currentProps.subtitle = '';
      if (targetSlot === 'cta') currentProps.ctaText = '';
      if (targetSlot === 'image') {
        currentProps.imageUrl = '';
        currentProps.mainImageUrl = '';
      }

      // Array item deletions (cards / items)
      if (s.type === 'features' && Array.isArray(currentProps.features) && nodeId.startsWith('item_')) {
        const idx = parseInt(nodeId.replace('item_', ''), 10);
        if (!isNaN(idx)) currentProps.features = currentProps.features.filter((_, i) => i !== idx);
      } else if (s.type === 'product_catalog' && Array.isArray(currentProps.products) && nodeId.startsWith('item_')) {
        const idx = parseInt(nodeId.replace('item_', ''), 10);
        if (!isNaN(idx)) currentProps.products = currentProps.products.filter((_, i) => i !== idx);
      } else if (s.type === 'testimonials' && Array.isArray(currentProps.testimonials) && nodeId.startsWith('item_')) {
        const idx = parseInt(nodeId.replace('item_', ''), 10);
        if (!isNaN(idx)) currentProps.testimonials = currentProps.testimonials.filter((_, i) => i !== idx);
      } else if (s.type === 'faq' && Array.isArray(currentProps.faqs) && nodeId.startsWith('item_')) {
        const idx = parseInt(nodeId.replace('item_', ''), 10);
        if (!isNaN(idx)) currentProps.faqs = currentProps.faqs.filter((_, i) => i !== idx);
      }
    }

    return { ...s, props: currentProps };
  });

  return pushHistory(state, { ...state.template.config, sections });
}

/**
 * Handles addNode logic per section type.
 * Returns updated state and selectedNodeId.
 */
export function applyAddNode(
  state: DocumentState,
  sectionId: string,
  nodeType: string,
  pushHistory: (state: DocumentState, config: TemplateConfig) => DocumentState
): { state: DocumentState; selectedNodeId: string | null } {
  if (!state.template) return { state, selectedNodeId: null };
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
      items.push({ icon: 'star', title: 'Fitur Baru', description: 'Keunggulan produk dan layanan Anda.' });
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
    state: pushHistory(state, { ...state.template.config, sections }),
    selectedNodeId: selectedNodeKey,
  };
}

