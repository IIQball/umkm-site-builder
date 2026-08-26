import { z } from 'zod';

export const HeaderAnnouncementPresetSchema = z.enum([
  'default_split',
  'centered_stacked',
  'compact_inline',
  'floating_pill',
  'centered_inline',
  'sidebar_drawer_trigger',
  'top_contact_bar',
  'minimal_borderless',
]);

export const HeroPresetSchema = z.enum([
  'split_left_text',
  'split_right_text',
  'centered_minimal',
  'full_banner_overlay',
  'hero_card_overlap',
  'split_multi_badges',
  'hero_triple_highlights',
  'hero_search_focused',
]);

export const FeaturesPresetSchema = z.enum([
  'grid_3_cards',
  'horizontal_list',
  'banner_inline_bar',
  'grid_4_compact',
  'numbered_process',
  'feature_bento_grid',
  'icon_pill_chips',
  'split_image_feature',
]);

export const ProductCatalogPresetSchema = z.enum([
  'grid_standard',
  'carousel_scroll',
  'list_compact',
  'grid_2_col_large',
  'featured_hero_product',
  'masonry_catalog',
  'horizontal_card_slider',
  'catalog_table_menu',
]);

export const TestimonialsPresetSchema = z.enum([
  'masonry_grid',
  'single_spotlight',
  'chat_bubble_flow',
  'testimonial_marquee_slider',
  'large_quote_cards',
  'two_column_cards',
  'statistics_with_review',
  'compact_badge_grid',
]);

export const FAQPresetSchema = z.enum([
  'accordion_single_col',
  'split_faq_sidebar',
  'grid_2_col_cards',
  'categorized_tabs_faq',
  'faq_contact_banner_bottom',
  'two_column_accordion',
  'searchable_faq_box',
  'bubble_chat_faq',
]);

export const GoogleMapsPresetSchema = z.enum([
  'fullwidth_map',
  'split_map_info',
  'compact_boxed',
  'card_overlay_center',
  'multi_branch_map',
  'route_guide_map',
  'minimal_map_action',
  'full_bleed_with_hours_pill',
]);

export const FooterPresetSchema = z.enum([
  'multi_column',
  'centered_simple',
  'cta_focused',
  'minimal_stacked',
  'newsletter_footer',
  'two_column_clean',
  'floating_bottom_bar',
  'app_store_style_footer',
]);
