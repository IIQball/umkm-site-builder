/**
 * Helper resolusi styling dinamis untuk elemen-elemen Google Maps.
 * Mengikuti token Global Design System dan cascading nodeStyles.
 */

export interface ResolvedMapsNodeStyle {
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderRadius: string;
  padding: string;
  marginTop: string;
  marginBottom: string;
  fontSize: string;
  fontWeight: string;
  raw: Record<string, string>;
}

const ALIAS_MAP: Record<string, string> = {
  maps_header: 'title',
  header: 'title',
  maps_title: 'title',
  maps_badge: 'badge',
  maps_subtitle: 'subtitle',
  maps_hours_badge: 'maps_hours_card',
  maps_branch_tabs: 'maps_branch_selector',
  map_view: 'maps_iframe',
};

/**
 * Resolusi style per node ID dari nodeStyles
 */
export function resolveMapsNodeStyle(
  nodeId: string,
  nodeStyles?: Record<string, Record<string, string>>
): ResolvedMapsNodeStyle {
  if (!nodeStyles || typeof nodeStyles !== 'object') {
    return {
      color: '',
      backgroundColor: '',
      borderColor: '',
      borderRadius: '',
      padding: '',
      marginTop: '0px',
      marginBottom: '0px',
      fontSize: '',
      fontWeight: '',
      raw: {},
    };
  }

  const primary = nodeStyles[nodeId] || {};
  const aliasKey = ALIAS_MAP[nodeId];
  const alias = aliasKey ? nodeStyles[aliasKey] || {} : {};

  const merged = {
    ...alias,
    ...primary,
  };

  return {
    color: merged.color || merged.textColor || '',
    backgroundColor: merged.backgroundColor || merged.bgColor || merged.bgColorToken || '',
    borderColor: merged.borderColor || '',
    borderRadius: merged.borderRadius || '',
    padding: merged.padding || '',
    marginTop: merged.marginTop || '0px',
    marginBottom: merged.marginBottom || '0px',
    fontSize: merged.fontSize || '',
    fontWeight: merged.fontWeight || '',
    raw: merged,
  };
}
