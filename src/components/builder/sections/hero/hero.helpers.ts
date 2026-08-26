import type { SectionStyles } from '@/types';

export function parsePadding(styles: SectionStyles | undefined, isFullBanner: boolean) {
  if (styles?.paddingTop || styles?.paddingBottom) {
    const top = parseInt(String(styles?.paddingTop || '0'), 10) || 0;
    const bottom = parseInt(String(styles?.paddingBottom || '0'), 10) || 0;
    return { top, bottom };
  }
  if (styles?.padding) {
    const parts = styles.padding.trim().split(/\s+/).map((p) => parseInt(p, 10) || 0);
    const top = parts[0] || (isFullBanner ? 48 : 0);
    const bottom = parts.length > 2 ? (parts[2] || top) : top;
    return { top, bottom };
  }
  return {
    top: isFullBanner ? 48 : 0,
    bottom: isFullBanner ? 48 : 0,
  };
}

export function parsePx(val: unknown, fallback: number = 0): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseInt(val, 10) || fallback;
  return fallback;
}

export function getNodeStyles(nodeStylesRecord: unknown, nodeName: string): string {
  if (!nodeStylesRecord || typeof nodeStylesRecord !== 'object') return '';
  const styles = (nodeStylesRecord as Record<string, Record<string, string>>)[nodeName];
  if (!styles) return '';

  return Object.entries(styles)
    .filter(([, v]) => Boolean(v))
    .map(([k, v]) => {
      const cssKey = k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      return `${cssKey}: ${v};`;
    })
    .join(' ');
}

export function resolveTokenColor(token: string | undefined, fallback: string = ''): string {
  if (!token) return fallback;
  if (token.startsWith('var(')) return token;
  const map: Record<string, string> = {
    primary: 'var(--theme-primary)',
    secondary: 'var(--theme-secondary)',
    surface: 'var(--theme-surface)',
    bg: 'var(--theme-bg)',
    textPrimary: 'var(--theme-text-primary)',
    textMuted: 'var(--theme-text-muted)',
    border: 'var(--theme-border)',
  };
  return map[token] || `var(--theme-${token})`;
}
