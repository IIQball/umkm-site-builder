/**
 * Helper resolusi styling dinamis untuk elemen-elemen Footer Section.
 * Mengikuti token Global Design System dan cascading nodeStyles.
 */

export interface ResolvedFooterNodeStyle {
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
  footer_brand: 'brand_bio',
  brand_bio: 'footer_brand',
  footer_contact: 'contact_info',
  contact_info: 'footer_contact',
  footer_navigation: 'navigation_links',
  navigation_links: 'footer_navigation',
  footer_copyright: 'copyright',
  copyright: 'footer_copyright',
};

/**
 * Resolusi style per node ID dari nodeStyles
 */
export function resolveFooterNodeStyle(
  nodeId: string,
  nodeStyles?: Record<string, Record<string, string>>
): ResolvedFooterNodeStyle {
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
