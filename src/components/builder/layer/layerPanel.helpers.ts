import type { ComponentType } from 'svelte';
import {
  Megaphone,
  Sparkles,
  CheckCircle,
  ShoppingBag,
  MessageSquare,
  HelpCircle,
  PanelBottom,
  Heading,
  FileText,
  Image,
  MousePointerClick,
  ListFilter,
} from 'lucide-svelte';
import type { TemplateSection } from '@/schemas/template.schema';
import type { LayerNodeItem, FeatureItem, ProductItem, TestimonialItem, FAQItem } from '@/types/builder';

export const sectionTypeLabels: Record<TemplateSection['type'], string> = {
  header_announcement: 'Header & Announcement',
  hero: 'Hero Banner',
  features: 'Fitur & Keunggulan',
  product_catalog: 'Katalog Produk',
  testimonials: 'Testimoni Pelanggan',
  faq: 'FAQ (Tanya Jawab)',
  footer: 'Footer & Kontak',
};

export const sectionTypeIcons: Record<TemplateSection['type'], ComponentType> = {
  header_announcement: Megaphone,
  hero: Sparkles,
  features: CheckCircle,
  product_catalog: ShoppingBag,
  testimonials: MessageSquare,
  faq: HelpCircle,
  footer: PanelBottom,
};

export const sectionTypes: TemplateSection['type'][] = [
  'header_announcement',
  'hero',
  'features',
  'product_catalog',
  'testimonials',
  'faq',
  'footer',
];

export function getSectionNodes(section: TemplateSection): LayerNodeItem[] {
  switch (section.type) {
    case 'header_announcement': {
      const list: LayerNodeItem[] = [];
      if (section.props?.showAnnouncement !== false && section.props?.announcementText !== undefined && section.props?.announcementText !== '') {
        list.push({ id: 'announcement', name: 'Announcement Bar', icon: Megaphone });
      }
      list.push({ id: 'logo', name: 'Logo Brand', icon: Image });
      list.push({ id: 'nav_links', name: 'Navigation Menu', icon: ListFilter });
      return list;
    }
    case 'hero': {
      const order =
        Array.isArray(section.props?.elementOrder) && section.props.elementOrder.length > 0
          ? (section.props.elementOrder as string[])
          : ['badge', 'title', 'subtitle', 'image', 'cta'];
      const map: Record<string, LayerNodeItem> = {
        badge: { id: 'badge', name: 'Promo Badge', icon: Sparkles },
        title: { id: 'title', name: 'Heading Title', icon: Heading },
        subtitle: { id: 'subtitle', name: 'Subtitle Description', icon: FileText },
        image: { id: 'image', name: 'Banner Image', icon: Image },
        cta: { id: 'cta', name: 'Action Button', icon: MousePointerClick },
      };
      return order.map((k: string) => map[k] || { id: k, name: k, icon: Sparkles });
    }
    case 'features': {
      const list: LayerNodeItem[] = [{ id: 'header', name: 'Section Header', icon: Heading }];
      const items = Array.isArray(section.props?.features) ? (section.props.features as FeatureItem[]) : [];
      items.forEach((item: FeatureItem, idx: number) => {
        list.push({ id: `item_${idx}`, name: item.title || `Fitur #${idx + 1}`, icon: CheckCircle });
      });
      return list;
    }
    case 'product_catalog': {
      const list: LayerNodeItem[] = [{ id: 'header', name: 'Catalog Header', icon: Heading }];
      const items = Array.isArray(section.props?.products) ? (section.props.products as ProductItem[]) : [];
      items.forEach((item: ProductItem, idx: number) => {
        list.push({ id: `item_${idx}`, name: item.name || `Produk #${idx + 1}`, icon: ShoppingBag });
      });
      return list;
    }
    case 'testimonials': {
      const list: LayerNodeItem[] = [{ id: 'header', name: 'Testimonial Header', icon: Heading }];
      const items = Array.isArray(section.props?.testimonials) ? (section.props.testimonials as TestimonialItem[]) : [];
      items.forEach((item: TestimonialItem, idx: number) => {
        list.push({ id: `item_${idx}`, name: item.customerName || `Review #${idx + 1}`, icon: MessageSquare });
      });
      return list;
    }
    case 'faq': {
      const list: LayerNodeItem[] = [{ id: 'header', name: 'FAQ Header', icon: Heading }];
      const items = Array.isArray(section.props?.faqs) ? (section.props.faqs as FAQItem[]) : [];
      items.forEach((item: FAQItem, idx: number) => {
        list.push({ id: `item_${idx}`, name: item.question || `FAQ #${idx + 1}`, icon: HelpCircle });
      });
      return list;
    }
    case 'footer':
      return [
        { id: 'whatsapp', name: 'WhatsApp Contact', icon: MessageSquare },
        { id: 'address', name: 'Store Location', icon: PanelBottom },
        { id: 'info', name: 'Information Links', icon: ListFilter },
        { id: 'copyright', name: 'Copyright Text', icon: FileText },
      ];
    default:
      return [];
  }
}
