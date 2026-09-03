import type { ColorToken, NodeStyles } from './builder';
import type { VariantGroup } from '../../schemas/product-variant.schema';

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
  iconName?: string;
  title: string;
  description: string;
  badge?: string;
  imageUrl?: string;
  linkUrl?: string;
  statValue?: string;
  statLabel?: string;
  [key: string]: unknown;
}

export interface FeaturesProps {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  columns?: number;
  items?: FeatureItem[];
  features?: FeatureItem[];
  mainImageUrl?: string;
  layoutPreset?: string;
  beforeTitle?: string;
  beforeItems?: string[];
  afterTitle?: string;
  afterItems?: string[];
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
  variants?: VariantGroup[];
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
  avatarUrl?: string;
  comment?: string;
  content?: string;
  rating?: number;
  platform?: string;
  verified?: boolean;
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
  category?: string;
  iconName?: string;
}

export interface FAQProps {
  title?: string;
  subtitle?: string;
  faqs?: FAQItem[];
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface MapBranchItem {
  id?: string;
  name: string;
  title?: string;
  address: string;
  googleMapsUrl?: string;
}

export interface GoogleMapsProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  apiKey?: string;
  address?: string;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  mapHeight?: string;
  showMarker?: boolean;
  markerTitle?: string;
  storeHours?: string;
  storeHoursStatus?: string;
  phone?: string;
  whatsappNumber?: string;
  facilities?: string;
  directionsLandmark?: string;
  directionsParking?: string;
  branches?: MapBranchItem[];
  storeImageUrl?: string;
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
