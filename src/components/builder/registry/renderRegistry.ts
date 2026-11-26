import type { ComponentType } from 'svelte';

// Section Render Components (Storefront & Canvas view only)
import Header from '../sections/Header.svelte';
import Hero from '../sections/Hero.svelte';
import Features from '../sections/Features.svelte';
import ProductCatalog from '../sections/ProductCatalog.svelte';
import Testimonials from '../sections/Testimonials.svelte';
import FAQ from '../sections/FAQ.svelte';
import GoogleMaps from '../sections/GoogleMaps.svelte';
import Footer from '../sections/Footer.svelte';

export interface RenderSectionDefinition {
  type: string;
  renderComponent: ComponentType;
  isFullBleed?: boolean;
}

export const renderSectionRegistry: Record<string, RenderSectionDefinition> = {
  header_announcement: {
    type: 'header_announcement',
    renderComponent: Header as unknown as ComponentType,
    isFullBleed: true,
  },
  hero: {
    type: 'hero',
    renderComponent: Hero as unknown as ComponentType,
    isFullBleed: true,
  },
  features: {
    type: 'features',
    renderComponent: Features as unknown as ComponentType,
    isFullBleed: true,
  },
  product_catalog: {
    type: 'product_catalog',
    renderComponent: ProductCatalog as unknown as ComponentType,
    isFullBleed: true,
  },
  testimonials: {
    type: 'testimonials',
    renderComponent: Testimonials as unknown as ComponentType,
    isFullBleed: false,
  },
  faq: {
    type: 'faq',
    renderComponent: FAQ as unknown as ComponentType,
    isFullBleed: false,
  },
  google_maps: {
    type: 'google_maps',
    renderComponent: GoogleMaps as unknown as ComponentType,
    isFullBleed: true,
  },
  footer: {
    type: 'footer',
    renderComponent: Footer as unknown as ComponentType,
    isFullBleed: true,
  },
};

export function getRenderSectionDefinition(type: string): RenderSectionDefinition | undefined {
  return renderSectionRegistry[type];
}

