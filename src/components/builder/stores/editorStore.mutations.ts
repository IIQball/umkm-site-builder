import type { TemplateConfig } from '@/schemas';
import type { DocumentState, EditorTemplate } from './editorStore.types';
import { getDefaultFeaturesSlots } from '../sections/features/featuresLayout.helpers';
import { getAddedSlotDefaultProps, getSectionDefaultSlots } from '../inspector/sectionSlot.helpers';
import { DEFAULT_DEMO_PRODUCTS } from '../sections/productCatalog.helpers';
import { DEFAULT_TESTIMONIALS } from '../sections/testimonials/testimonials.helpers';
import { DEFAULT_FAQS } from '../sections/faq/faq.helpers';

const SLOT_MAP: Record<string, string> = {
  hero_badge: 'badge', badge: 'badge', hero_title: 'title', title: 'title',
  hero_subtitle: 'subtitle', subtitle: 'subtitle', hero_cta: 'cta', hero_cta_primary: 'cta',
  cta: 'cta', hero_image: 'image', hero_media: 'image', hero_founder_photo: 'image',
  hero_terminal: 'terminal', hero_booking_card: 'booking_card', hero_stat_counter: 'stat_counter',
  hero_trust_badges: 'trust_badges', hero_contrast_card: 'contrast_card',
  hero_product_cards: 'product_cards', hero_floating_cards: 'floating_cards',
  hero_social_proof: 'social_proof', hero_chat_simulation: 'chat_simulation',
  hero_email_capture: 'email_capture', hero_category_pills: 'category_pills',
  hero_pill_category: 'category_pills', hero_bento_promo: 'bento_promo',
  hero_bento_review: 'bento_review',
  maps_badge: 'badge', maps_title: 'title', maps_subtitle: 'subtitle',
  faq_badge: 'badge', faq_title: 'title', faq_subtitle: 'subtitle',
  testimonials_header: 'title', faq_header: 'title', maps_header: 'title',
  features_heading: 'title', features_image: 'image', catalog_header: 'title',
};

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
      const defaultSlots = getSectionDefaultSlots(s);
      const currentOrder = Array.isArray(currentProps.elementOrder) && currentProps.elementOrder.length > 0
        ? [...currentProps.elementOrder]
        : [...defaultSlots];

      // Normalize nodeId to slot key
      const targetSlot = SLOT_MAP[nodeId] || nodeId;

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
      } else if (s.type === 'product_catalog') {
        const productsList = Array.isArray(currentProps.products) && currentProps.products.length > 0
          ? [...currentProps.products]
          : [...DEFAULT_DEMO_PRODUCTS];
        const idx = parseInt(nodeId.replace(/^(product_item_|item_)/, ''), 10);
        if (!isNaN(idx)) currentProps.products = productsList.filter((_, i) => i !== idx);
      } else if (s.type === 'testimonials') {
        const testisArray = Array.isArray(currentProps.testimonials) && currentProps.testimonials.length > 0
          ? [...currentProps.testimonials]
          : [...DEFAULT_TESTIMONIALS];
        const idx = parseInt(nodeId.replace(/^(testi_item_|item_)/, ''), 10);
        if (!isNaN(idx)) currentProps.testimonials = testisArray.filter((_, i) => i !== idx);
      } else if (s.type === 'faq') {
        const faqsList = Array.isArray(currentProps.faqs) && currentProps.faqs.length > 0 ? [...currentProps.faqs] : [...DEFAULT_FAQS];
        const idx = parseInt(nodeId.replace(/^(faq_item_|item_)/, ''), 10);
        if (!isNaN(idx)) currentProps.faqs = faqsList.filter((_, i) => i !== idx);
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
      if (nodeType === 'badge' && !currentProps.badgeText) currentProps.badgeText = 'Promo Spesial Baru';
      if (nodeType === 'image' && !currentProps.imageUrl) currentProps.imageUrl = 'https://images.unsplash.com/photo-1556742049-0a67c55c70ff?w=800';
      if (nodeType === 'bento_promo' && !currentProps.bentoPromoTitle) currentProps.bentoPromoTitle = 'Diskon Pembeli Pertama';
      if (nodeType === 'bento_review' && !currentProps.bentoReviewText) currentProps.bentoReviewText = '"Bahan sangat halus dan adem, motifnya khas dan tidak pasaran."';
      selectedNodeKey = nodeType;
    } else if (s.type === 'header_announcement') {
      if (['announcement', 'announcement_bar', 'contact_bar', 'delivery_bar', 'countdown_bar'].includes(nodeType)) {
        currentProps.showAnnouncement = true;
        currentProps.announcementText = currentProps.announcementText || 'Diskon 20% khusus hari ini';
        const rowOrder = Array.isArray(currentProps.rowOrder) ? [...currentProps.rowOrder] : ['navbar'];
        if (!rowOrder.includes('announcement_bar')) currentProps.rowOrder = ['announcement_bar', ...rowOrder];
        selectedNodeKey = nodeType;
      } else {
        const navOrder = Array.isArray(currentProps.navbarOrder) ? [...currentProps.navbarOrder] : ['logo', 'nav_links', 'cta'];
        const cleanType = nodeType === 'nav' ? 'nav_links' : nodeType;
        if (!navOrder.includes(cleanType)) navOrder.push(cleanType);
        currentProps.navbarOrder = navOrder;
        if (cleanType === 'logo' && !currentProps.logoText) currentProps.logoText = 'Toko UMKM';
        if (cleanType === 'cta' && !currentProps.ctaText) currentProps.ctaText = 'Chat WA';
        if (cleanType === 'nav_links' && (!Array.isArray(currentProps.navLinks) || currentProps.navLinks.length === 0)) currentProps.navLinks = ['Beranda', 'Produk', 'Tentang', 'Kontak'];
        selectedNodeKey = cleanType;
      }
    } else if (s.type === 'features') {
      const preset = (s.layoutPreset as string) || (s.props?.layoutPreset as string) || 'grid_3_cards';
      const defaultSlots = getDefaultFeaturesSlots(preset);
      const isSlot = defaultSlots.includes(nodeType) || ['badge', 'title', 'subtitle', 'cta', 'image', 'feature_cards', 'feature_rows', 'ribbon_bar', 'bento_spotlight', 'bento_cards', 'zigzag_items', 'tab_nav', 'tab_card', 'accordion_list', 'scroll_cards', 'icon_matrix', 'before_card', 'after_card'].includes(nodeType);
      if (isSlot) {
        const order = Array.isArray(currentProps.elementOrder) ? [...currentProps.elementOrder] : [...defaultSlots];
        if (!order.includes(nodeType)) order.push(nodeType);
        currentProps.elementOrder = order;
        Object.assign(currentProps, getAddedSlotDefaultProps(nodeType, 'features'));
        selectedNodeKey = nodeType;
      } else {
        const items = Array.isArray(currentProps.features) ? [...currentProps.features] : [];
        items.push({ icon: 'star', title: 'Fitur Baru', description: 'Keunggulan produk dan layanan Anda.' });
        currentProps.features = items;
        selectedNodeKey = `item_${items.length - 1}`;
      }
    } else if (s.type === 'product_catalog') {
      const isHeaderSlot = ['badge', 'title', 'subtitle', 'catalog_sidebar', 'catalog_categories', 'catalog_timer', 'catalog_bundle_tier', 'catalog_cta', 'product_image_0', 'product_desc', 'catalog_price_rows'].includes(nodeType);
      if (isHeaderSlot) {
        const order = Array.isArray(currentProps.elementOrder) ? [...currentProps.elementOrder] : ['badge', 'title', 'subtitle'];
        if (!order.includes(nodeType)) order.push(nodeType);
        currentProps.elementOrder = order;
        Object.assign(currentProps, getAddedSlotDefaultProps(nodeType, 'product_catalog'));
        selectedNodeKey = nodeType;
      } else {
        const items = Array.isArray(currentProps.products) && currentProps.products.length > 0
          ? [...currentProps.products]
          : [...DEFAULT_DEMO_PRODUCTS];
        items.push({ name: 'Produk Baru', price: 99000, imageUrl: '', badge: 'Baru' });
        currentProps.products = items;
        const newSlot = `product_item_${items.length - 1}`;
        if (Array.isArray(currentProps.elementOrder)) currentProps.elementOrder = [...currentProps.elementOrder, newSlot];
        selectedNodeKey = newSlot;
      }
    } else if (s.type === 'testimonials') {
      const items = Array.isArray(currentProps.testimonials) && currentProps.testimonials.length > 0 ? [...currentProps.testimonials] : [...DEFAULT_TESTIMONIALS];
      items.push({ id: `testi_${Date.now()}`, customerName: `Pelanggan Baru #${items.length + 1}`, rating: 5, comment: 'Kualitas produk sangat memuaskan!', avatar: '', role: 'Pelanggan Terverifikasi', platform: 'WhatsApp', verified: true, verifiedText: 'Pembeli Terverifikasi' });
      currentProps.testimonials = items;
      const newSlot = `testi_item_${items.length - 1}`;
      if (Array.isArray(currentProps.elementOrder)) currentProps.elementOrder = [...currentProps.elementOrder, newSlot];
      selectedNodeKey = newSlot;
    } else if (s.type === 'faq') {
      if (['badge', 'title', 'subtitle', 'faq_cs_card', 'faq_search_bar', 'faq_tabs', 'faq_list'].includes(nodeType)) {
        const order = Array.isArray(currentProps.elementOrder) ? [...currentProps.elementOrder] : getSectionDefaultSlots(s);
        if (!order.includes(nodeType)) order.push(nodeType);
        currentProps.elementOrder = order;
        Object.assign(currentProps, getAddedSlotDefaultProps(nodeType, 'faq'));
        selectedNodeKey = nodeType;
      } else {
        const items = Array.isArray(currentProps.faqs) && currentProps.faqs.length > 0 ? [...currentProps.faqs] : [...DEFAULT_FAQS];
        items.push({ id: `faq_${Date.now()}`, question: 'Pertanyaan Baru?', answer: 'Tuliskan jawaban yang jelas dan informatif di sini.', category: 'Umum' });
        currentProps.faqs = items;
        const newSlot = `faq_item_${items.length - 1}`;
        if (Array.isArray(currentProps.elementOrder)) currentProps.elementOrder = [...currentProps.elementOrder, newSlot];
        selectedNodeKey = newSlot;
      }
    } else if (s.type === 'google_maps' || s.type === 'footer') {
      const order = Array.isArray(currentProps.elementOrder) ? [...currentProps.elementOrder] : getSectionDefaultSlots(s);
      if (!order.includes(nodeType)) order.push(nodeType);
      currentProps.elementOrder = order;
      Object.assign(currentProps, getAddedSlotDefaultProps(nodeType, s.type));
      selectedNodeKey = nodeType;
    }

    return { ...s, props: currentProps };
  });

  return {
    state: pushHistory(state, { ...state.template.config, sections }),
    selectedNodeId: selectedNodeKey,
  };
}

