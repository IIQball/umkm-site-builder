import type { FeatureItem } from '@/types';

/**
 * Resolusi style CSS per-item fitur dari nodeStyles builder.
 * Memprioritaskan item.id > feature_item_${index} > fallback generic.
 */
export function resolveFeatureItemStyle(
  item: FeatureItem,
  index: number,
  nodeStyles?: Record<string, Record<string, string>>
): { color: string } {
  if (!nodeStyles) return { color: '' };
  const specific =
    (item?.id && nodeStyles[item.id]) ||
    nodeStyles[`feature_item_${index}`] ||
    nodeStyles[`item_${index}`] ||
    {};
  const generic = nodeStyles['feature_cards'] || nodeStyles['features_grid'] || {};
  const color = specific.color || generic.color || '';
  return { color };
}
