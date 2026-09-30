import type { ComponentType } from 'svelte';
import {
  Megaphone, Sparkles, CheckCircle, ShoppingBag, MessageSquare, HelpCircle,
  MapPin, Heading, FileText, Image, MousePointerClick,
  ListFilter, Clock, Package, Star, User, Search, Navigation, Layers,
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
      const list: LayerNodeItem[] = [{ id: 'testimonials_header', name: 'Judul & Lencana Testimoni', icon: Heading }];

      if (preset === 'logo_client_cloud') {
        list[0].name = 'Judul Kemitraan';
        list.push({ id: 'testi_logo_cloud', name: 'Daftar Logo Kemitraan', icon: Image });
      } else if (preset === 'single_spotlight' || preset === 'chat_bubble_flow') {
        list[0].name = 'Judul Seksi Testimoni';
        list.push({ id: 'testi_spotlight_quote', name: 'Kutipan Ulasan Utama', icon: FileText });
        list.push({ id: 'testi_spotlight_author', name: 'Identitas Pelanggan', icon: User });
      } else if (preset === 'split_rating_stats') {
        list.push({ id: 'testi_stats', name: 'Skor Rating Agregat (Kiri)', icon: Star });
        list.push({ id: 'testi_split_reviews', name: 'Daftar Ulasan Pelanggan (Kanan)', icon: MessageSquare });
      } else if (preset === 'infinite_marquee_scroll' || preset === 'carousel_slider') {
        list[0].name = 'Judul Seksi Testimoni';
        list.push({ id: 'testi_slider_track', name: 'Alur Slider Ulasan', icon: Sparkles });
      } else {
        const items = Array.isArray(section.props?.testimonials) && section.props.testimonials.length > 0
          ? (section.props.testimonials as TestimonialItem[])
          : [{ customerName: 'Ulasan #1' }, { customerName: 'Ulasan #2' }, { customerName: 'Ulasan #3' }];
        items.slice(0, 4).forEach((item: Partial<TestimonialItem>, idx: number) => {
          list.push({ id: `testi_item_${idx}`, name: item?.customerName ? `${item.customerName}` : `Kartu Ulasan #${idx + 1}`, icon: MessageSquare });
        });
      }
      return list;
    }
    case 'faq': {
      const preset = (section.layoutPreset as string) || (section.props?.layoutPreset as string) || (section.styles?.layoutPreset as string) || 'accordion_single_col';
      const list: LayerNodeItem[] = [];

      if (preset === 'split_faq_sidebar') {
        list.push({ id: 'faq_cs_card', name: 'Kartu Bantuan CS (Kiri)', icon: MessageSquare });
      } else if (preset === 'search_filtered_faq') {
        list.push({ id: 'faq_header', name: 'Judul Pusat Informasi', icon: Heading });
        list.push({ id: 'faq_search_bar', name: 'Bilah Pencarian Tanya Jawab', icon: Search });
      } else if (preset === 'categorized_tabs_faq') {
        list.push({ id: 'faq_header', name: 'Judul Kategori Bantuan', icon: Heading });
        list.push({ id: 'faq_tabs', name: 'Tab Kategori Pertanyaan', icon: ListFilter });
      } else {
        const headerName = preset === 'chat_style_faq' ? 'Judul Percakapan' : preset === 'floating_help_center' ? 'Judul Pusat Informasi' : 'Judul & Deskripsi FAQ';
        list.push({ id: 'faq_header', name: headerName, icon: Heading });
      }

      const items = Array.isArray(section.props?.faqs) && section.props.faqs.length > 0
        ? (section.props.faqs as FAQItem[])
        : [{ question: 'Tanya Jawab #1' }, { question: 'Tanya Jawab #2' }, { question: 'Tanya Jawab #3' }];

      const itemLabel = preset === 'floating_help_center' ? 'Kotak Bantuan' : preset === 'chat_style_faq' ? 'Dialog Q&A' : 'Tanya Jawab';
      items.slice(0, 4).forEach((item: Partial<FAQItem>, idx: number) => {
        list.push({ id: `faq_item_${idx}`, name: item?.question ? `${item.question}` : `${itemLabel} #${idx + 1}`, icon: HelpCircle });
      });
      return list;
    }
    case 'google_maps': {
      const preset = (section.layoutPreset as string) || (section.props?.layoutPreset as string) || (section.styles?.layoutPreset as string) || 'fullwidth_map';
      if (preset === 'split_map_info' || preset === 'two_column_directions') {
        const title = preset === 'two_column_directions' ? 'Panduan Rute (Kiri)' : 'Kartu Info Detail (Kiri)';
        return [{ id: 'maps_info_card', name: title, icon: MapPin }, { id: 'maps_iframe', name: 'Bingkai Peta Interaktif (Kanan)', icon: Image }];
      }
      if (preset === 'store_hours_highlight' || preset === 'interactive_route_finder') {
        const head = preset === 'store_hours_highlight' ? { id: 'maps_hours_badge', name: 'Bilah Status Jam Buka', icon: Clock } : { id: 'maps_header', name: 'Judul Lokasi', icon: Heading };
        return [head, { id: 'maps_iframe', name: 'Bingkai Peta', icon: Image }, { id: 'maps_cta_button', name: 'Tombol Navigasi Google Maps', icon: Navigation }];
      }
      if (preset === 'minimal_framed_map' || preset === 'compact_boxed') {
        return [{ id: 'maps_header', name: 'Judul Lokasi', icon: Heading }, { id: 'maps_iframe', name: 'Bingkai Peta Bersih', icon: Image }];
      }
      if (preset === 'multi_branch_tabs') {
        return [
          { id: 'maps_branch_tabs', name: 'Bilah Tab Cabang Gerai', icon: ListFilter },
          { id: 'maps_info_card', name: 'Detail Alamat Cabang Aktif', icon: MapPin },
          { id: 'maps_iframe', name: 'Bingkai Peta Cabang', icon: Image },
        ];
      }
      return [
        { id: 'maps_header', name: 'Judul & Lencana Lokasi', icon: Heading },
        { id: 'maps_iframe', name: 'Bingkai Peta Utama', icon: Image },
        { id: 'maps_info_card', name: 'Kartu Informasi Melayang', icon: MapPin },
      ];
    }
    case 'footer':
      return getFooterLayerNodes(section);
    default:
      return [];
  }
}
