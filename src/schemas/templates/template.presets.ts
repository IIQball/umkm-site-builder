import { z } from 'zod';

export const HeaderAnnouncementPresetSchema = z.enum([
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
]);
export type HeaderAnnouncementPreset = z.infer<typeof HeaderAnnouncementPresetSchema>;

export const HeroPresetSchema = z.enum([
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
]);
export type HeroPreset = z.infer<typeof HeroPresetSchema>;

export const FeaturesPresetSchema = z.enum([
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
]);
export type FeaturesPreset = z.infer<typeof FeaturesPresetSchema>;

export const ProductCatalogPresetSchema = z.enum([
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
]);
export type ProductCatalogPreset = z.infer<typeof ProductCatalogPresetSchema>;

export const TestimonialsPresetSchema = z.enum([
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
]);
export type TestimonialsPreset = z.infer<typeof TestimonialsPresetSchema>;

export const FAQPresetSchema = z.enum([
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
]);
export type FAQPreset = z.infer<typeof FAQPresetSchema>;

export const GoogleMapsPresetSchema = z.enum([
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
]);
export type GoogleMapsPreset = z.infer<typeof GoogleMapsPresetSchema>;

export const FooterPresetSchema = z.enum([
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
]);
export type FooterPreset = z.infer<typeof FooterPresetSchema>;

export const SectionLayoutPresetSchema = z.union([
  HeaderAnnouncementPresetSchema,
  HeroPresetSchema,
  FeaturesPresetSchema,
  ProductCatalogPresetSchema,
  TestimonialsPresetSchema,
  FAQPresetSchema,
  GoogleMapsPresetSchema,
  FooterPresetSchema,
]);
export type SectionLayoutPreset = z.infer<typeof SectionLayoutPresetSchema>;
