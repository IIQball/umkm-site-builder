import type { ComponentType } from 'svelte';
import type { FAQItem, FeatureItem, ProductItem, TestimonialItem } from './content';

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

export * from './presets';

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

export type { FeatureItem };

export interface FeaturesProps {
  title?: string;
  subtitle?: string;
  columns?: number;
  features?: FeatureItem[];
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export type { ProductItem };

export interface ProductCatalogProps {
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'carousel' | string;
  columns?: number;
  gap?: 'sm' | 'md' | 'lg' | string;
  items?: ProductItem[];
  products?: ProductItem[];
  cardVariant?: 'solid' | 'bordered' | 'glass' | string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | string;
  ctaStyle?: 'filled' | 'outline' | 'link' | string;
  showPrice?: boolean;
  showBadge?: boolean;
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export type { TestimonialItem };

export interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  testimonials?: TestimonialItem[];
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export type { FAQItem };

export interface FAQProps {
  title?: string;
  subtitle?: string;
  faqs?: FAQItem[];
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface GoogleMapsProps {
  title?: string;
  subtitle?: string;
  address?: string;
  markerTitle?: string;
  zoom?: number;
  mapHeight?: string;
  googleMapsUrl?: string;
  mapsUrl?: string;
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface FooterProps {
  logoText?: string;
  tagline?: string;
  copyrightText?: string;
  address?: string;
  whatsappNumber?: string;
  waNumber?: string;
  columns?: number;
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface SectionStyles {
  backgroundColor?: string;
  bgColorToken?: ColorToken | string;
  color?: string;
  textColorToken?: ColorToken | string;
  padding?: string;
  paddingTop?: string | number;
  paddingBottom?: string | number;
  margin?: string;
  marginTop?: string | number;
  marginBottom?: string | number;
  layoutPreset?: string;
  columnsDesktop?: number | string;
  columnsTablet?: number | string;
  columnsMobile?: number | string;
  minHeight?: string;
  [key: string]: unknown;
}

export interface SectionDefinition {
  type: string;
  name: string;
  icon: ComponentType;
  defaultProps: Record<string, unknown>;
  defaultStyles: SectionStyles;
  allowedNodes: string[];
}

export interface LayerNodeItem {
  id: string;
  name?: string;
  label?: string;
  type?: string;
  icon?: ComponentType;
}
