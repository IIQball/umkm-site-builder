import type { ComponentType } from 'svelte';
import {
  Megaphone, Sparkles, CheckCircle, ShoppingBag, MessageSquare, HelpCircle,
  PanelBottom, MapPin, Heading, FileText, Image, MousePointerClick,
  ListFilter, Clock, Package, Star, User, Search, Navigation,
} from 'lucide-svelte';
import type { TemplateSection } from '@/schemas';
import type { LayerNodeItem, FeatureItem, ProductItem, TestimonialItem, FAQItem } from '@/types';
import { DEFAULT_DEMO_PRODUCTS } from '../sections/productCatalog.helpers';
import { getAllSectionDefinitions } from '../registry';

export const sectionTypeLabels: Record<TemplateSection['type'], string> = getAllSectionDefinitions().reduce(
  (acc, def) => { acc[def.type as TemplateSection['type']] = def.label; return acc; }, {} as Record<TemplateSection['type'], string>
);
export const sectionTypeIcons: Record<TemplateSection['type'], ComponentType> = getAllSectionDefinitions().reduce(
  (acc, def) => { acc[def.type as TemplateSection['type']] = def.icon; return acc; }, {} as Record<TemplateSection['type'], ComponentType>
);
export const sectionTypes: TemplateSection['type'][] = getAllSectionDefinitions().map((def) => def.type as TemplateSection['type']);

export function getSectionNodes(section: TemplateSection): LayerNodeItem[] {
  switch (section.type) {
    case 'header_announcement': {
      const list: LayerNodeItem[] = [];
      const preset = (section.layoutPreset as string) || (section.props?.layoutPreset as string) || (section.styles?.layoutPreset as string) || 'default_split';
      const noAnnouncementPresets = ['compact_inline', 'transparent_glass_header', 'floating_pill_island', 'top_contact_bar', 'delivery_order_cta', 'store_badge_highlight', 'promo_countdown_banner'];

      if (preset === 'top_contact_bar') {
        list.push({ id: 'contact_bar', name: 'Top Contact Bar', icon: Clock });
      } else if (preset === 'delivery_order_cta') {
        list.push({ id: 'delivery_bar', name: 'Delivery Status Bar', icon: Clock });
      } else if (preset === 'promo_countdown_banner') {
        list.push({ id: 'countdown_bar', name: 'Flash Sale Countdown', icon: Clock });
      } else if (!noAnnouncementPresets.includes(preset) && section.props?.showAnnouncement !== false && section.props?.announcementText !== undefined && section.props?.announcementText !== '') {
        list.push({ id: 'announcement', name: 'Announcement Bar', icon: Megaphone });
      }
      list.push({ id: 'logo', name: 'Logo Brand', icon: Image });
      if (preset === 'store_badge_highlight') {
        list.push({ id: 'store_badges', name: 'Legal Badges (BPOM/Halal)', icon: CheckCircle });
      }
      list.push({ id: 'nav_links', name: 'Navigation Menu', icon: ListFilter });
      return list;
    }
    case 'hero': {
      const preset =
        (section.layoutPreset as string) ||
        (section.props?.layoutPreset as string) ||
        (section.styles?.layoutPreset as string) ||
        'split_left_text';

      const list: LayerNodeItem[] = [];

      // 1. Badge / Kategori
      if (preset !== 'interactive_terminal_code') {
        list.push({ id: 'hero_badge', name: 'Badge / Kategori', icon: Sparkles });
      }

      // 2. Judul Utama (H1)
      list.push({ id: 'hero_title', name: 'Judul Utama (H1)', icon: Heading });

      // 3. Deskripsi Subtitle
      list.push({ id: 'hero_subtitle', name: 'Deskripsi Subtitle', icon: FileText });

      // 4. CTA Buttons
      if (preset !== 'pill_category_selector') {
        list.push({ id: 'hero_cta', name: 'Grup Tombol CTA', icon: MousePointerClick });
      }

      // 5. Preset-specific components
      if (preset === 'side_card_booking') {
        list.push({ id: 'hero_booking_card', name: 'Form Reservasi / Booking', icon: FileText });
      } else if (preset === 'sticky_whatsapp_pill_float') {
        list.push({ id: 'hero_chat_simulation', name: 'Simulasi Bubble Chat WA', icon: MessageSquare });
      } else if (preset === 'split_stat_counter') {
        list.push({ id: 'hero_stat_counter', name: 'Metrik Statistik Angka', icon: CheckCircle });
      } else if (preset === 'bento_masonry_hero') {
        list.push({ id: 'hero_bento_promo', name: 'Ubin Teks Promo', icon: Sparkles });
        list.push({ id: 'hero_bento_image', name: 'Ubin Gambar Showcase', icon: Image });
        list.push({ id: 'hero_bento_review', name: 'Ubin Ulasan / Rating', icon: CheckCircle });
      } else if (preset === 'pill_category_selector') {
        list.push({ id: 'hero_pill_category', name: 'Filter Kategori Pill', icon: ListFilter });
      } else if (preset === 'inline_email_capture') {
        list.push({ id: 'hero_email_capture', name: 'Form Email Input', icon: FileText });
      } else if (preset === 'social_proof_community') {
        list.push({ id: 'hero_social_proof', name: 'Avatar Komunitas & Rating', icon: Sparkles });
      } else if (preset === 'brand_story_founder') {
        list.push({ id: 'hero_founder_photo', name: 'Foto Profil Pendiri', icon: Image });
      }

      // 6. Image showcase if supported (and not custom bento/founder handled above)
      const imageSupportedPresets = [
        'split_left_text',
        'split_right_text',
        'full_banner_overlay',
        'video_background_loop',
        'floating_cards_showcase',
        'dual_product_showcase',
        'badge_ticker_split',
        'editorial_luxury_serif',
        'side_card_booking',
        'dual_contrast_split',
        'sticker_badge_playful',
        'pill_category_selector',
        'centered_minimal',
      ];
      if (imageSupportedPresets.includes(preset) && preset !== 'brand_story_founder' && preset !== 'bento_masonry_hero') {
        list.push({ id: 'hero_image', name: 'Gambar Showcase', icon: Image });
      }

      return list;
    }
    case 'features': {
      const preset =
        (section.layoutPreset as string) ||
        (section.props?.layoutPreset as string) ||
        (section.styles?.layoutPreset as string) ||
        'grid_3_cards';

      const list: LayerNodeItem[] = [
        { id: 'features_heading', name: 'Judul & Subjudul Fitur', icon: Heading },
      ];

      if (preset === 'before_after_comparison') {
        list.push({ id: 'feature_item_0', name: 'Kartu Sebelum (Komparasi)', icon: FileText });
        list.push({ id: 'feature_item_1', name: 'Kartu Sesudah (Keunggulan)', icon: CheckCircle });
        return list;
      }

      const rawItems = (Array.isArray(section.props?.items) && section.props.items.length > 0)
        ? (section.props.items as FeatureItem[])
        : (Array.isArray(section.props?.features) && section.props.features.length > 0)
          ? (section.props.features as FeatureItem[])
          : [];

      let itemCount = 3;
      if (preset === 'dense_icon_matrix') {
        itemCount = Math.max(8, rawItems.length);
      } else if (
        ['bento_grid_asymmetric', 'alternating_zigzag_rows', 'interactive_tabs', 'vertical_accordion_showcase', 'sticky_scroll_highlight'].includes(preset)
      ) {
        itemCount = 4;
      } else if (preset === 'horizontal_list') {
        itemCount = rawItems.length > 0 ? rawItems.length : 6;
      } else if (preset === 'grid_3_cards' || preset === 'banner_inline_bar') {
        itemCount = 3;
      }

      for (let idx = 0; idx < itemCount; idx++) {
        const item = rawItems[idx];
        const name = item?.title ? `${item.title}` : `Fitur #${idx + 1}`;
        list.push({ id: `feature_item_${idx}`, name, icon: CheckCircle });
      }

      const hasImage = [
        'bento_grid_asymmetric',
        'alternating_zigzag_rows',
        'interactive_tabs',
        'vertical_accordion_showcase',
      ].includes(preset);

      if (hasImage) {
        list.push({ id: 'features_image', name: 'Gambar Ilustrasi Fitur', icon: Image });
      }

      return list;
    }
    case 'product_catalog': {
      const preset =
        (section.layoutPreset as string) ||
        (section.props?.layoutPreset as string) ||
        (section.styles?.layoutPreset as string) ||
        'grid_standard';

      const list: LayerNodeItem[] = [];

      // 1. Header node
      list.push({ id: 'catalog_header', name: 'Judul & Subjudul Katalog', icon: Heading });

      // 2. Preset-specific secondary nodes
      if (preset === 'split_category_sidebar') {
        list.push({ id: 'catalog_sidebar', name: 'Bilah Filter Kategori', icon: ListFilter });
      } else if (preset === 'interactive_filter_tabs') {
        list.push({ id: 'catalog_categories', name: 'Bilah Filter Kategori', icon: ListFilter });
      } else if (preset === 'flash_sale_countdown') {
        list.push({ id: 'catalog_timer', name: 'Kotak Timer Hitung Mundur', icon: Clock });
      } else if (preset === 'bundle_package_tiers') {
        list.push({ id: 'catalog_bundle_tier', name: 'Tiers Paket Hemat', icon: Package });
        list.push({ id: 'catalog_cta', name: 'Tombol Aksi WhatsApp', icon: MousePointerClick });
        return list;
      } else if (preset === 'single_product_deep_focus') {
        list.push({ id: 'product_image_0', name: 'Foto Produk Besar', icon: Image });
        list.push({ id: 'product_desc', name: 'Deskripsi & Manfaat', icon: FileText });
        list.push({ id: 'catalog_cta', name: 'Tombol Pesan WhatsApp', icon: MousePointerClick });
        return list;
      } else if (preset === 'price_table_view' || preset === 'minimal_accordion_catalog') {
        list.push({ id: 'catalog_price_rows', name: 'Baris Tabel / Daftar Harga', icon: FileText });
        return list;
      }

      // 3. Product items
      const rawProducts = Array.isArray(section.props?.products) && section.props.products.length > 0
        ? (section.props.products as ProductItem[])
        : DEFAULT_DEMO_PRODUCTS;

      rawProducts.forEach((item: ProductItem, idx: number) => {
        list.push({ id: item.id || `product_item_${idx}`, name: item.name ? `${item.name}` : `Produk #${idx + 1}`, icon: ShoppingBag });
      });
      return list;
    }
    case 'testimonials': {
      const preset = (section.layoutPreset as string) || (section.props?.layoutPreset as string) || (section.styles?.layoutPreset as string) || 'masonry_grid';
      const list: LayerNodeItem[] = [{ id: 'testimonials_header', name: 'Judul & Badge', icon: Heading }];

      if (preset === 'logo_client_cloud') {
        list[0].name = 'Judul Kemitraan';
        list.push({ id: 'testi_logo_cloud', name: 'Daftar Logo Mitra', icon: Image });
      } else if (preset === 'single_spotlight' || preset === 'chat_bubble_flow') {
        list[0].name = 'Judul Section';
        list.push({ id: 'testi_spotlight_quote', name: 'Kutipan Ulasan Utama', icon: FileText });
        list.push({ id: 'testi_spotlight_author', name: 'Identitas Pembeli', icon: User });
      } else if (preset === 'split_rating_stats') {
        list.push({ id: 'testi_stats', name: 'Skor Rating Agregat (Kiri)', icon: Star });
        list.push({ id: 'testi_split_reviews', name: 'Daftar Ulasan Singkat (Kanan)', icon: MessageSquare });
      } else if (preset === 'infinite_marquee_scroll' || preset === 'carousel_slider') {
        list[0].name = 'Judul Section';
        list.push({ id: 'testi_slider_track', name: 'Track Slider Ulasan', icon: Sparkles });
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
        list.push({ id: 'faq_search_bar', name: 'Bilah Pencarian FAQ', icon: Search });
      } else if (preset === 'categorized_tabs_faq') {
        list.push({ id: 'faq_header', name: 'Judul Kategori Bantuan', icon: Heading });
        list.push({ id: 'faq_tabs', name: 'Tab Kategori FAQ', icon: ListFilter });
      } else {
        const headerName = preset === 'chat_style_faq' ? 'Judul Percakapan' : preset === 'floating_help_center' ? 'Judul Pusat Informasi' : 'Judul & Deskripsi';
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
        return [{ id: 'maps_info_card', name: title, icon: MapPin }, { id: 'maps_iframe', name: 'Frame Peta Interaktif (Kanan)', icon: Image }];
      }
      if (preset === 'store_hours_highlight' || preset === 'interactive_route_finder') {
        const head = preset === 'store_hours_highlight' ? { id: 'maps_hours_badge', name: 'Bilah Status Jam Buka', icon: Clock } : { id: 'maps_header', name: 'Judul Lokasi', icon: Heading };
        return [head, { id: 'maps_iframe', name: 'Frame Peta', icon: Image }, { id: 'maps_cta_button', name: 'Tombol Navigasi Cepat', icon: Navigation }];
      }
      if (preset === 'minimal_framed_map' || preset === 'compact_boxed') {
        return [{ id: 'maps_header', name: 'Judul Lokasi', icon: Heading }, { id: 'maps_iframe', name: 'Frame Peta Bersih', icon: Image }];
      }
      if (preset === 'multi_branch_tabs') {
        return [
          { id: 'maps_branch_tabs', name: 'Bilah Tab Cabang', icon: ListFilter },
          { id: 'maps_info_card', name: 'Detail Alamat Cabang Aktif', icon: MapPin },
          { id: 'maps_iframe', name: 'Frame Peta Cabang', icon: Image },
        ];
      }
      return [
        { id: 'maps_header', name: 'Judul & Badge', icon: Heading },
        { id: 'maps_iframe', name: 'Frame Peta Utama', icon: Image },
        { id: 'maps_info_card', name: 'Kartu Info Melayang', icon: MapPin },
      ];
    }
    case 'footer':
      return [
        { id: 'whatsapp', name: 'WhatsApp Contact', icon: MessageSquare }, { id: 'address', name: 'Store Location', icon: PanelBottom },
        { id: 'info', name: 'Information Links', icon: ListFilter }, { id: 'copyright', name: 'Copyright Text', icon: FileText },
      ];
    default:
      return [];
  }
}
