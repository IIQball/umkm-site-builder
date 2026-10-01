import type { ComponentType } from 'svelte';
import {
  Megaphone, Sparkles, CheckCircle, ShoppingBag, MessageSquare, HelpCircle,
  MapPin, Heading, FileText, Image, MousePointerClick,
  ListFilter, Clock, Package, Star, Search, Navigation, Layers, Flag,
} from 'lucide-svelte';
import type { TemplateSection } from '@/schemas';
import type { LayerNodeItem, ProductItem, TestimonialItem, FAQItem } from '@/types';
import { DEFAULT_DEMO_PRODUCTS } from '../sections/productCatalog.helpers';
import { getAllSectionDefinitions } from '../registry';
import { getFooterLayerNodes } from '../sections/footer/footer.helpers';
import {
  headerHasRowOrder,
  getDefaultHeaderNavbarOrder,
  getHeaderTopBarType,
} from '../sections/header/headerLayout.helpers';
import { getEffectiveHeroElementOrder } from '../sections/hero/heroLayout.helpers';
import {
  getEffectiveFeaturesElementOrder,
  getFeaturesSlotLabel,
} from '../sections/features/featuresLayout.helpers';
import {
  getEffectiveCatalogElementOrder,
  getCatalogSlotLabel,
} from '../sections/catalog/catalogLayout.helpers';
import {
  getEffectiveTestimonialsElementOrder,
  getTestimonialsSlotLabel,
} from '../sections/testimonials/testimonialsLayout.helpers';
import { DEFAULT_TESTIMONIALS } from '../sections/testimonials/testimonials.helpers';
import {
  getEffectiveFaqElementOrder,
  getFaqSlotLabel,
} from '../sections/faq/faqLayout.helpers';
import { DEFAULT_FAQS } from '../sections/faq/faq.helpers';
import {
  getEffectiveMapsElementOrder,
  getMapsSlotLabel,
} from '../sections/maps/mapsLayout.helpers';

export const sectionTypeLabels: Record<TemplateSection['type'], string> = {
  header_announcement: 'Header & Pengumuman', hero: 'Banner Utama (Hero)', features: 'Fitur & Keunggulan',
  product_catalog: 'Katalog Produk', testimonials: 'Testimoni Pelanggan', faq: 'FAQ (Tanya Jawab)',
  google_maps: 'Google Maps & Lokasi', footer: 'Footer & Kontak',
};

export const sectionTypeIcons: Record<TemplateSection['type'], ComponentType> = getAllSectionDefinitions().reduce(
  (acc, def) => { acc[def.type as TemplateSection['type']] = def.icon; return acc; }, {} as Record<TemplateSection['type'], ComponentType>
);

export const sectionTypes: TemplateSection['type'][] = getAllSectionDefinitions().map((def) => def.type as TemplateSection['type']);

export function getSectionNodes(section: TemplateSection): LayerNodeItem[] {
  switch (section.type) {
    case 'header_announcement': {
      const list: LayerNodeItem[] = [];
      const preset = (section.layoutPreset as string) || (section.props?.layoutPreset as string) || (section.styles?.layoutPreset as string) || 'default_split';
      const hasRows = headerHasRowOrder(preset);
      const rowOrder = (section.props?.rowOrder as string[]) || (hasRows ? ['announcement_bar', 'navbar'] : ['navbar']);

      if (hasRows && rowOrder.includes('announcement_bar') && section.props?.showAnnouncement !== false) {
        const topBarType = getHeaderTopBarType(preset);
        if (topBarType === 'contact') list.push({ id: 'contact_bar', name: 'Bar Kontak & Jam Buka', icon: Clock });
        else if (topBarType === 'delivery') list.push({ id: 'delivery_bar', name: 'Bar Layanan Pesan Antar', icon: Clock });
        else if (topBarType === 'countdown') list.push({ id: 'countdown_bar', name: 'Bar Hitung Mundur Promo', icon: Clock });
        else list.push({ id: 'announcement', name: 'Bar Pengumuman Promo', icon: Megaphone });
      }

      const defaultNav = getDefaultHeaderNavbarOrder(preset);
      const navbarOrder = (Array.isArray(section.props?.navbarOrder) && section.props.navbarOrder.length > 0
        ? section.props.navbarOrder
        : defaultNav).filter((s: string) => defaultNav.includes(s)) as string[];

      if (navbarOrder.includes('logo')) list.push({ id: 'logo', name: 'Logo & Brand Toko', icon: Image });
      if (navbarOrder.includes('store_badges')) list.push({ id: 'store_badges', name: 'Lencana Legalitas (BPOM / Halal)', icon: CheckCircle });
      if (navbarOrder.includes('search_bar')) list.push({ id: 'search_bar', name: 'Bilah Pencarian Produk', icon: Search });
      if (navbarOrder.includes('nav_links')) list.push({ id: 'nav_links', name: 'Menu Navigasi Toko', icon: ListFilter });
      if (navbarOrder.includes('cta')) list.push({ id: 'cta', name: 'Tombol Pesan WhatsApp (CTA)', icon: MousePointerClick });
      return list;
    }
    case 'hero': {
      const preset =
        (section.layoutPreset as string) ||
        (section.props?.layoutPreset as string) ||
        (section.styles?.layoutPreset as string) ||
        'split_left_text';

      const elementOrder = getEffectiveHeroElementOrder(
        preset,
        section.props?.elementOrder,
        section.props?.heroPreset as string
      );

      const list: LayerNodeItem[] = [];

      const HERO_SLOT_NODE_MAP: Record<string, { id: string; name: string; icon: ComponentType }> = {
        badge: { id: 'hero_badge', name: 'Lencana Promo & Kategori', icon: Sparkles },
        title: { id: 'hero_title', name: 'Judul Utama (H1)', icon: Heading },
        subtitle: { id: 'hero_subtitle', name: 'Subjudul & Deskripsi', icon: FileText },
        cta: { id: 'hero_cta', name: 'Tombol Aksi (CTA)', icon: MousePointerClick },
        terminal: { id: 'hero_terminal', name: 'Kotak Kode Terminal', icon: FileText },
        booking_card: { id: 'hero_booking_card', name: 'Formulir Reservasi', icon: FileText },
        stat_counter: { id: 'hero_stat_counter', name: 'Metrik Statistik Angka', icon: CheckCircle },
        trust_badges: { id: 'hero_trust_badges', name: 'Lencana Sertifikasi / Jaminan', icon: CheckCircle },
        contrast_card: { id: 'hero_contrast_card', name: 'Kartu Pendaftaran Kuota', icon: Sparkles },
        product_cards: { id: 'hero_product_cards', name: 'Dua Kartu Produk Bundling', icon: Package },
        floating_cards: { id: 'hero_floating_cards', name: 'Kartu Keunggulan Melayang', icon: Sparkles },
        social_proof: { id: 'hero_social_proof', name: 'Avatar Komunitas & Rating', icon: Star },
        chat_simulation: { id: 'hero_chat_simulation', name: 'Simulasi Balon Chat WA', icon: MessageSquare },
        email_capture: { id: 'hero_email_capture', name: 'Formulir Input Email / WA', icon: FileText },
        category_pills: { id: 'hero_pill_category', name: 'Filter Kategori Kapsul', icon: ListFilter },
        bento_promo: { id: 'hero_bento_promo', name: 'Ubin Teks Promo', icon: Sparkles },
        bento_review: { id: 'hero_bento_review', name: 'Ubin Rating & Ulasan', icon: CheckCircle },
      };

      for (const slot of elementOrder) {
        if (slot === 'image') {
          const isFounder = preset === 'brand_story_founder';
          list.push({ id: isFounder ? 'hero_founder_photo' : 'hero_image', name: isFounder ? 'Foto Profil Pendiri' : 'Gambar Utama (Showcase)', icon: Image });
        } else if (HERO_SLOT_NODE_MAP[slot]) {
          list.push(HERO_SLOT_NODE_MAP[slot]);
        }
      }

      return list;
    }
    case 'features': {
      const preset =
        (section.layoutPreset as string) ||
        (section.props?.layoutPreset as string) ||
        (section.styles?.layoutPreset as string) ||
        'grid_3_cards';

      const elementOrder = getEffectiveFeaturesElementOrder(
        preset,
        section.props?.elementOrder,
        section.props?.featuresPreset as string
      );

      const list: LayerNodeItem[] = [];

      const FEATURES_SLOT_ICON_MAP: Record<string, ComponentType> = {
        badge: Sparkles,
        title: Heading,
        subtitle: FileText,
        cta: MousePointerClick,
        image: Image,
        feature_cards: Package,
        feature_rows: ListFilter,
        ribbon_bar: Sparkles,
        bento_spotlight: Package,
        bento_cards: CheckCircle,
        zigzag_items: Layers,
        tab_nav: ListFilter,
        tab_card: FileText,
        accordion_list: ListFilter,
        scroll_cards: Layers,
        icon_matrix: CheckCircle,
        before_card: FileText,
        after_card: CheckCircle,
        features_grid: Package,
      };

      for (const slot of elementOrder) {
        list.push({
          id: slot,
          name: getFeaturesSlotLabel(slot, preset),
          icon: FEATURES_SLOT_ICON_MAP[slot] || CheckCircle,
        });
      }

      return list;
    }
    case 'product_catalog': {
      const preset =
        (section.layoutPreset as string) ||
        (section.props?.layoutPreset as string) ||
        (section.styles?.layoutPreset as string) ||
        'grid_standard';

      const rawProducts = (Array.isArray(section.props?.products) && section.props.products.length > 0
        ? (section.props.products as ProductItem[])
        : DEFAULT_DEMO_PRODUCTS) as ProductItem[];

      const elementOrder = getEffectiveCatalogElementOrder(
        preset,
        section.props?.elementOrder,
        rawProducts,
        (section.props?.catalogPreset as string) || (section.props?.layoutPreset as string) || (section.layoutPreset as string)
      );

      const CATALOG_SLOT_ICON_MAP: Record<string, ComponentType> = {
        badge: Sparkles,
        title: Heading,
        subtitle: FileText,
        catalog_sidebar: ListFilter,
        catalog_categories: ListFilter,
        catalog_timer: Clock,
        catalog_bundle_tier: Package,
        catalog_cta: MousePointerClick,
        product_image_0: Image,
        product_desc: FileText,
        catalog_price_rows: FileText,
      };

      const list: LayerNodeItem[] = [];

      for (const slot of elementOrder) {
        const label = getCatalogSlotLabel(slot, preset, rawProducts);
        if (slot.startsWith('product_item_')) {
          const idx = parseInt(slot.replace('product_item_', ''), 10);
          const prod = rawProducts[idx];
          list.push({
            id: prod?.id || slot,
            name: label,
            icon: ShoppingBag,
          });
        } else {
          list.push({
            id: slot,
            name: label,
            icon: CATALOG_SLOT_ICON_MAP[slot] || Sparkles,
          });
        }
      }

      return list;
    }
    case 'testimonials': {
      const preset = (section.layoutPreset as string) || (section.props?.layoutPreset as string) || (section.styles?.layoutPreset as string) || 'masonry_grid';
      const rawTestis = (Array.isArray(section.props?.testimonials) && section.props.testimonials.length > 0 ? (section.props.testimonials as TestimonialItem[]) : DEFAULT_TESTIMONIALS) as TestimonialItem[];
      const elementOrder = getEffectiveTestimonialsElementOrder(preset, section.props?.elementOrder, rawTestis, (section.props?.testimonialsPreset as string) || (section.props?.layoutPreset as string) || (section.layoutPreset as string));
      const TESTI_ICONS: Record<string, ComponentType> = { badge: Sparkles, title: Heading, subtitle: FileText, testi_stats: Star, testi_slider_track: Sparkles, testi_logo_cloud: Image };
      const list: LayerNodeItem[] = [];
      for (const slot of elementOrder) {
        list.push({ id: slot, name: getTestimonialsSlotLabel(slot, preset, rawTestis), icon: slot.startsWith('testi_item_') ? MessageSquare : (TESTI_ICONS[slot] || Sparkles) });
      }
      return list;
    }
    case 'faq': {
      const preset = (section.layoutPreset as string) || (section.props?.layoutPreset as string) || (section.styles?.layoutPreset as string) || 'accordion_single_col';
      const rawFaqs = (Array.isArray(section.props?.faqs) && section.props.faqs.length > 0 ? (section.props.faqs as FAQItem[]) : DEFAULT_FAQS) as FAQItem[];
      const elementOrder = getEffectiveFaqElementOrder(preset, section.props?.elementOrder, rawFaqs);
      const FAQ_ICONS: Record<string, ComponentType> = { badge: Sparkles, title: Heading, subtitle: FileText, faq_cs_card: MessageSquare, faq_search_bar: Search, faq_tabs: ListFilter };
      const list: LayerNodeItem[] = [];
      for (const slot of elementOrder) {
        list.push({ id: slot, name: getFaqSlotLabel(slot, preset, rawFaqs), icon: (slot.startsWith('faq_item_') || slot.startsWith('item_')) ? HelpCircle : (FAQ_ICONS[slot] || Sparkles) });
      }
      return list;
    }
    case 'google_maps': {
      const preset = (section.layoutPreset as string) || (section.props?.layoutPreset as string) || (section.styles?.layoutPreset as string) || 'fullwidth_map';
      const branchMode = (section.props?.branchMode as string) || (preset === 'multi_branch_tabs' ? 'multi' : 'single');
      const elementOrder = getEffectiveMapsElementOrder(preset, section.props?.elementOrder, branchMode);
      const MAPS_ICONS: Record<string, ComponentType> = {
        badge: Sparkles,
        title: Heading,
        subtitle: FileText,
        maps_branch_selector: ListFilter,
        maps_iframe: Image,
        maps_info_card: MapPin,
        maps_cta_button: Navigation,
        maps_hours_card: Clock,
        maps_directions_card: Flag,
      };
      const list: LayerNodeItem[] = [];
      for (const slot of elementOrder) {
        list.push({
          id: slot,
          name: getMapsSlotLabel(slot, preset),
          icon: MAPS_ICONS[slot] || MapPin,
        });
      }
      return list;
    }
    case 'footer':
      return getFooterLayerNodes(section);
    default:
      return [];
  }
}
