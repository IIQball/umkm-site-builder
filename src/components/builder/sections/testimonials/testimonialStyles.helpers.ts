import type { TestimonialItem } from '@/types';

export interface ResolvedTestimonialStyle {
  color: string;
  marginTop: string;
  marginBottom: string;
}

/**
 * Resolusi style CSS per-item ulasan dari nodeStyles builder.
 * Memprioritaskan item.id > testi_item_${index} > fallback generic.
 */
export function resolveTestimonialItemStyle(
  item: TestimonialItem | undefined,
  index: number,
  nodeStyles?: Record<string, Record<string, string>>
): ResolvedTestimonialStyle {
  if (!nodeStyles) {
    return { color: '', marginTop: '0px', marginBottom: '0px' };
  }
  const specific =
    (item?.id && nodeStyles[item.id]) ||
    nodeStyles[`testi_item_${index}`] ||
    nodeStyles[`item_${index}`] ||
    {};
  const generic = nodeStyles['testi_spotlight_quote'] || nodeStyles['testimonials_grid'] || {};

  const color = specific.color || generic.color || '';
  const marginTop = specific.marginTop || '0px';
  const marginBottom = specific.marginBottom || '0px';

  return { color, marginTop, marginBottom };
}
