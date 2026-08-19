import type { ComponentType } from 'svelte';

export interface NodeStyles {
  textAlign?: 'left' | 'center' | 'right' | 'justify' | string;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  backgroundColor?: string;
  borderRadius?: string;
  padding?: string;
  boxShadow?: string;
  marginTop?: string;
  marginBottom?: string;
  maxWidth?: string;
  width?: string;
  animation?: string;
  hoverEffect?: 'scale' | 'lift' | 'glow' | string;
}

export interface HeaderAnnouncementProps {
  announcementText?: string;
  logoText?: string;
  navLinks?: string[];
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
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesProps {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface ProductItem {
  name: string;
  price: number;
  imageUrl?: string;
  badge?: string;
}

export interface ProductCatalogProps {
  title?: string;
  subtitle?: string;
  products?: ProductItem[];
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface TestimonialItem {
  avatar?: string;
  customerName: string;
  rating: number;
  comment: string;
}

export interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  testimonials?: TestimonialItem[];
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface FAQItem {
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

export interface FooterProps {
  whatsappNumber?: string;
  address?: string;
  copyrightText?: string;
  nodeStyles?: Record<string, NodeStyles>;
  [key: string]: unknown;
}

export interface SectionStyles {
  backgroundColor?: string;
  color?: string;
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
  [key: string]: unknown;
}

export interface LayerNodeItem {
  id: string;
  name: string;
  icon: ComponentType;
}
