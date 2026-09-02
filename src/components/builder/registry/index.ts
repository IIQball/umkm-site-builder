import type { ComponentType } from 'svelte';
import {
  Megaphone,
  Sparkles,
  CheckCircle,
  ShoppingBag,
  MessageSquare,
  HelpCircle,
  MapPin,
  PanelBottom,
} from 'lucide-svelte';
import type { TemplateSection } from '@/schemas';
import { DEFAULT_TEMPLATE_SECTIONS } from '@/schemas';
import type { SectionDefinition, SectionRegistryMap } from './registry.types';

// Section Render Components
import HeaderAnnouncement from '../sections/HeaderAnnouncement.svelte';
import Hero from '../sections/Hero.svelte';
import Features from '../sections/Features.svelte';
import ProductCatalog from '../sections/ProductCatalog.svelte';
import Testimonials from '../sections/Testimonials.svelte';
import FAQ from '../sections/FAQ.svelte';
import GoogleMaps from '../sections/GoogleMaps.svelte';
import Footer from '../sections/Footer.svelte';

// Content Inspector Components
import HeaderContent from '../content/HeaderContent.svelte';
import HeroContent from '../content/HeroContent.svelte';
import FeaturesContent from '../content/FeaturesContent.svelte';
import ProductCatalogContent from '../content/ProductCatalogContent.svelte';
import TestimonialsContent from '../content/TestimonialsContent.svelte';
import FaqContent from '../content/FaqContent.svelte';
import GoogleMapsContent from '../content/GoogleMapsContent.svelte';
import FooterContent from '../content/FooterContent.svelte';

// Styles Inspector Components
import HeaderStylesTab from '../inspector/HeaderStylesTab.svelte';
import CatalogStylesTab from '../inspector/CatalogStylesTab.svelte';

export * from './registry.types';

const defaultSectionConfigs: Record<string, TemplateSection> = DEFAULT_TEMPLATE_SECTIONS.reduce(
  (acc, sec) => {
    acc[sec.type] = sec;
    return acc;
  },
  {} as Record<string, TemplateSection>
);


export const sectionRegistry: SectionRegistryMap = {
  header_announcement: {
    type: 'header_announcement',
    label: 'Header & Announcement',
    icon: Megaphone as unknown as ComponentType,
    renderComponent: HeaderAnnouncement as unknown as ComponentType,
    inspectorComponent: HeaderContent as unknown as ComponentType,
    stylesComponent: HeaderStylesTab as unknown as ComponentType,
    defaultConfig: defaultSectionConfigs['header_announcement'],
    layoutPresets: [
      'default_split',
      'centered_stacked',
      'compact_inline',
      'floating_pill_island',
      'split_nav_centered_logo',
      'command_search_bar',
      'transparent_glass_header',
      'mega_menu_dropdown',
      'top_contact_bar',
      'delivery_order_cta',
      'store_badge_highlight',
      'promo_countdown_banner',
    ],
    isFullBleed: true,
  },
  hero: {
    type: 'hero',
    label: 'Hero Banner',
    icon: Sparkles as unknown as ComponentType,
    renderComponent: Hero as unknown as ComponentType,
    inspectorComponent: HeroContent as unknown as ComponentType,
    defaultConfig: defaultSectionConfigs['hero'],
    layoutPresets: [
      'split_left_text',
      'split_right_text',
      'centered_minimal',
      'full_banner_overlay',
      'video_background_loop',
      'gradient_mesh_glow',
      'interactive_terminal_code',
      'floating_cards_showcase',
      'oversized_bold_typography',
      'inline_email_capture',
      'social_proof_community',
      'dual_product_showcase',
      'badge_ticker_split',
      'pill_category_selector',
      'bento_masonry_hero',
      'split_stat_counter',
      'sticky_whatsapp_pill_float',
      'sticker_badge_playful',
      'editorial_luxury_serif',
      'side_card_booking',
      'dual_contrast_split',
      'brand_story_founder',
    ],
    isFullBleed: true,
  },
  features: {
    type: 'features',
    label: 'Fitur & Keunggulan',
    icon: CheckCircle as unknown as ComponentType,
    renderComponent: Features as unknown as ComponentType,
    inspectorComponent: FeaturesContent as unknown as ComponentType,
    defaultConfig: defaultSectionConfigs['features'],
    layoutPresets: [
      'grid_3_cards',
      'horizontal_list',
      'banner_inline_bar',
      'bento_grid_asymmetric',
      'alternating_zigzag_rows',
      'interactive_tabs',
      'vertical_accordion_showcase',
      'sticky_scroll_highlight',
      'dense_icon_matrix',
      'before_after_comparison',
    ],
    isFullBleed: false,
  },
  product_catalog: {
    type: 'product_catalog',
    label: 'Katalog Produk',
    icon: ShoppingBag as unknown as ComponentType,
    renderComponent: ProductCatalog as unknown as ComponentType,
    inspectorComponent: ProductCatalogContent as unknown as ComponentType,
    stylesComponent: CatalogStylesTab as unknown as ComponentType,
    defaultConfig: defaultSectionConfigs['product_catalog'],
    layoutPresets: [
      'grid_standard',
      'carousel_scroll',
      'list_compact',
      'masonry_catalog',
      'bento_product_spotlight',
      'split_category_sidebar',
      'compact_mini_cards',
      'price_table_view',
      'lookbook_gallery',
      'flash_sale_countdown',
    ],
    isFullBleed: false,
  },
  testimonials: {
    type: 'testimonials',
    label: 'Testimoni Pelanggan',
    icon: MessageSquare as unknown as ComponentType,
    renderComponent: Testimonials as unknown as ComponentType,
    inspectorComponent: TestimonialsContent as unknown as ComponentType,
    defaultConfig: defaultSectionConfigs['testimonials'],
    layoutPresets: [
      'masonry_grid',
      'single_spotlight',
      'chat_bubble_flow',
      'infinite_marquee_scroll',
      'video_review_cards',
      'social_post_cards',
      'side_by_side_3_cards',
      'logo_client_cloud',
      'split_rating_stats',
      'carousel_slider',
    ],
    isFullBleed: false,
  },
  faq: {
    type: 'faq',
    label: 'FAQ (Tanya Jawab)',
    icon: HelpCircle as unknown as ComponentType,
    renderComponent: FAQ as unknown as ComponentType,
    inspectorComponent: FaqContent as unknown as ComponentType,
    defaultConfig: defaultSectionConfigs['faq'],
    layoutPresets: [
      'accordion_single_col',
      'split_faq_sidebar',
      'grid_2_col_cards',
      'accordion_two_col',
      'chat_style_faq',
      'search_filtered_faq',
      'categorized_tabs_faq',
      'compact_numbered_list',
      'floating_help_center',
      'horizontal_faq_cards',
    ],
    isFullBleed: false,
  },
  google_maps: {
    type: 'google_maps',
    label: 'Google Maps & Lokasi',
    icon: MapPin as unknown as ComponentType,
    renderComponent: GoogleMaps as unknown as ComponentType,
    inspectorComponent: GoogleMapsContent as unknown as ComponentType,
    defaultConfig: defaultSectionConfigs['google_maps'],
    layoutPresets: [
      'fullwidth_map',
      'split_map_info',
      'compact_boxed',
      'floating_address_card',
      'two_column_directions',
      'store_hours_highlight',
      'interactive_route_finder',
      'minimal_framed_map',
      'multi_branch_tabs',
      'card_overlay_bottom',
    ],
    isFullBleed: false,
  },
  footer: {
    type: 'footer',
    label: 'Footer & Kontak',
    icon: PanelBottom as unknown as ComponentType,
    renderComponent: Footer as unknown as ComponentType,
    inspectorComponent: FooterContent as unknown as ComponentType,
    defaultConfig: defaultSectionConfigs['footer'],
    layoutPresets: [
      'multi_column',
      'centered_simple',
      'cta_focused',
      'minimal_single_row',
      'giant_wordmark',
      'newsletter_centric',
      'live_status_badge',
      'split_map_footer',
      'social_links_grid',
      'boxed_card_footer',
    ],
    isFullBleed: false,
  },
};

export function getSectionDefinition(type: string): SectionDefinition | undefined {
  return sectionRegistry[type];
}

export function getAllSectionDefinitions(): SectionDefinition[] {
  return Object.values(sectionRegistry);
}

export function registerSection(definition: SectionDefinition): void {
  sectionRegistry[definition.type] = definition;
}
