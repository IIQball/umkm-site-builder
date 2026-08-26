import type { ComponentType } from 'svelte';

export type ColorToken =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'background'
  | 'surface'
  | 'textPrimary'
  | 'textMuted'
  | 'text_primary'
  | 'text_muted'
  | 'transparent';

export type TypographyToken = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

export type SpacingStep = 0 | 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64 | 80 | 96;

export type ButtonHeight = 32 | 40 | 48 | 56;

export type EffectShadow = 'none' | 'sm' | 'md' | 'lg';

export type GlobalRadiusToken = 'sharp' | 'sm' | 'md' | 'lg' | 'pill';

export {
  calculateNestedRadius,
  calculatePillRadius,
  calculateGoldenRatioTypography,
} from '@/lib/utils/designMath';

export type HeaderAnnouncementPreset = 'default_split' | 'centered_stacked' | 'compact_inline';
export type HeroPreset = 'split_left_text' | 'split_right_text' | 'centered_minimal' | 'full_banner_overlay';
export type FeaturesPreset = 'grid_3_cards' | 'horizontal_list' | 'banner_inline_bar';
export type ProductCatalogPreset = 'grid_standard' | 'carousel_scroll' | 'list_compact';
export type TestimonialsPreset = 'masonry_grid' | 'single_spotlight' | 'chat_bubble_flow';
export type FAQPreset = 'accordion_single_col' | 'split_faq_sidebar' | 'grid_2_col_cards';
export type GoogleMapsPreset = 'fullwidth_map' | 'split_map_info' | 'compact_boxed';
export type FooterPreset = 'multi_column' | 'centered_simple' | 'cta_focused';

export type SectionLayoutPreset =
  | HeaderAnnouncementPreset
  | HeroPreset
  | FeaturesPreset
  | ProductCatalogPreset
  | TestimonialsPreset
  | FAQPreset
  | GoogleMapsPreset
  | FooterPreset;

export interface NodeStyles {
  textAlign?: 'left' | 'center' | 'right' | 'justify' | string;
  textColorToken?: ColorToken;
  bgColorToken?: ColorToken;
  borderColorToken?: ColorToken;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  borderRadius?: string;
  padding?: string;
  boxShadow?: string;
  marginTop?: string;
  marginBottom?: string;
  maxWidth?: string;
  width?: string;
  animation?: string;
  hoverEffect?: 'scale' | 'lift' | 'glow' | string;
  [key: string]: unknown;
}

export interface HeaderAnnouncementProps {
  showAnnouncement?: boolean;
  announcementText?: string;
  announcementAlign?: 'center' | 'left' | string;
  announcementBgColorToken?: ColorToken;
  announcementTextColorToken?: ColorToken;
  announcementPaddingY?: string;
  logoType?: 'image_only' | 'text_only' | 'image_text' | string;
  logoText?: string;
  logoImageUrl?: string;
  logoImageHeight?: number | string;
  logoTextSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | string;
  logoTextWeight?: 'normal' | 'semibold' | 'bold' | string;
  logoTextColorToken?: ColorToken;
  navLinks?: string[];
  navGap?: 'compact' | 'normal' | 'relaxed' | string | number;
  navFontSize?: '12px' | '14px' | '16px' | '18px' | string;
  navFontWeight?: '400' | '500' | '600' | string;
  navTextTransform?: 'none' | 'uppercase' | 'capitalize' | string;
  navColorToken?: ColorToken;
  navHoverColorToken?: ColorToken;
  ctaText?: string;
  ctaLink?: string;
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface HeroProps {
  tagName?: 'h1' | 'h2' | 'h3' | string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  badgeText?: string;
  elementOrder?: string[];
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface FeatureItem {
  id?: string;
  icon?: string;
  title: string;
  description: string;
}

export interface FeaturesProps {
  title?: string;
  subtitle?: string;
  columns?: number;
  features?: FeatureItem[];
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface ProductItem {
  id?: string;
  name: string;
  price: number;
  image?: string;
  imageUrl?: string;
  description?: string;
  badge?: string;
}

export interface ProductCatalogProps {
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'carousel' | string;
  columns?: number;
  gap?: 'sm' | 'md' | 'lg' | string;
  items?: ProductItem[];
  cardVariant?: 'solid' | 'bordered' | 'glass' | string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | string;
  ctaStyle?: 'filled' | 'outline' | 'link' | string;
  showPrice?: boolean;
  showBadge?: boolean;
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface TestimonialItem {
  id?: string;
  name?: string;
  customerName?: string;
  role?: string;
  avatar?: string;
  comment: string;
  rating?: number;
}

export interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  testimonials?: TestimonialItem[];
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

export interface FAQProps {
  title?: string;
  subtitle?: string;
  faqs?: FAQItem[];
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface GoogleMapsProps {
  apiKey?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  mapHeight?: string;
  showMarker?: boolean;
  markerTitle?: string;
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface FooterProps {
  logoText?: string;
  logoImageUrl?: string;
  tagline?: string;
  copyrightText?: string;
  whatsappNumber?: string;
  address?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  footerLinks?: Array<{
    label: string;
    url: string;
  }>;
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export type SectionPropsMap = {
  header_announcement: HeaderAnnouncementProps;
  hero: HeroProps;
  features: FeaturesProps;
  product_catalog: ProductCatalogProps;
  testimonials: TestimonialsProps;
  faq: FAQProps;
  google_maps: GoogleMapsProps;
  footer: FooterProps;
};

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface ViewportDimension {
  width: number;
  label: string;
}

export const DEVICE_VIEWPORTS: Record<DeviceMode, ViewportDimension> = {
  desktop: { width: 1280, label: 'Desktop (1280px)' },
  tablet: { width: 768, label: 'Tablet (768px)' },
  mobile: { width: 375, label: 'Mobile (375px)' },
};

export interface SelectedElement {
  sectionId: string;
  nodePath: string;
  nodeType: string;
  elementRef?: HTMLElement | null;
  rect?: DOMRect | null;
  tagName?: string;
  textContent?: string;
  orderIndex?: number;
  totalSiblings?: number;
}

export interface SectionStyles {
  textColorToken?: ColorToken;
  bgColorToken?: ColorToken;
  borderColorToken?: ColorToken;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textAlign?: 'left' | 'center' | 'right' | string;
  borderRadius?: string;
  marginTop?: string;
  marginBottom?: string;
  fontSize?: string;
  fontWeight?: string;
  display?: 'flex' | 'grid' | 'block' | string;
  alignItems?: string;
  justifyContent?: string;
  gap?: string;
  margin?: string;
  maxWidth?: string;
  containerWidth?: 'boxed' | 'full' | string;
  animation?: string;
  animationDuration?: string;
  animationDelay?: string;
  fontFamily?: string;
  columnsDesktop?: 2 | 3 | 4 | 5 | string | number;
  columnsTablet?: 2 | 3 | string | number;
  columnsMobile?: 1 | 2 | string | number;
  gridGap?: 'compact' | 'normal' | 'relaxed' | string;
  cardPreset?: 'minimal_bordered' | 'elevated_shadow' | 'flat_filled' | 'horizontal' | string;
  cardRadius?: 'sharp' | 'rounded' | 'smooth' | 'extra_rounded' | string;
  imageAspectRatio?: 'square' | 'portrait' | 'widescreen' | 'auto' | string;
  badgePosition?: 'top_left' | 'top_right' | string;
  badgeColor?: 'rose' | 'emerald' | 'amber' | 'blue' | 'violet' | 'slate' | string;
  productNameSize?: 'sm' | 'base' | 'lg' | string;
  productNameWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | string;
  pricePlacement?: 'stacked' | 'inline' | string;
  ctaButtonWidth?: 'full' | 'compact' | string;
  ctaButtonColor?: string;
  ctaButtonTextColor?: string;
  ctaButtonRadius?: 'sharp' | 'rounded' | 'smooth' | 'pill' | string;
  showWhatsAppIcon?: boolean;
  [key: string]: unknown;
}

export interface LayerNodeItem {
  id: string;
  name: string;
  icon: ComponentType;
}
