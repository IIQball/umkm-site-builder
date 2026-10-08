/**
 * Hero Section Helpers & Constants (SSOT)
 */

import { supportsHeroImage, HERO_IMAGE_SUPPORTED_PRESETS } from './heroLayout.helpers';

export const IMAGE_SUPPORTED_HERO_PRESETS = HERO_IMAGE_SUPPORTED_PRESETS;

export const parsePx = (val: unknown, fallback: number = 0): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseInt(val, 10) || fallback;
  return fallback;
};

export const isHeroImageSupported = (preset: string): boolean => {
  return supportsHeroImage(preset);
};

export function resolveHeroNodeVariables(
  nodeStyles: Record<string, Record<string, string>> | undefined,
  styles?: Record<string, unknown>
): string {
  const ns = nodeStyles || {};
  const badge = ns.hero_badge || ns.badge || {};
  const title = ns.hero_title || ns.title || {};
  const sub = ns.hero_subtitle || ns.subtitle || {};
  const cta = ns.hero_cta || ns.cta || {};
  const img = ns.hero_image || ns.image || {};

  const vars = [
    badge.color ? `--hero-badge-color: ${badge.color};` : '',
    badge.marginTop ? `--hero-badge-mt: ${badge.marginTop};` : '',
    badge.marginBottom ? `--hero-badge-mb: ${badge.marginBottom};` : '',
    title.color ? `--hero-title-color: ${title.color};` : '',
    title.marginTop ? `--hero-title-mt: ${title.marginTop};` : '',
    (title.marginBottom || styles?.titleMarginBottom) ? `--hero-title-mb: ${title.marginBottom || styles?.titleMarginBottom};` : '',
    sub.color ? `--hero-subtitle-color: ${sub.color};` : '',
    sub.marginTop ? `--hero-subtitle-mt: ${sub.marginTop};` : '',
    (sub.marginBottom || styles?.subtitleMarginBottom) ? `--hero-subtitle-mb: ${sub.marginBottom || styles?.subtitleMarginBottom};` : '',
    cta.color ? `--hero-cta-color: ${cta.color};` : '',
    cta.marginTop ? `--hero-cta-mt: ${cta.marginTop};` : '',
    cta.marginBottom ? `--hero-cta-mb: ${cta.marginBottom};` : '',
    img.marginTop ? `--hero-image-mt: ${img.marginTop};` : '',
    img.marginBottom ? `--hero-image-mb: ${img.marginBottom};` : '',
  ];

  return vars.filter(Boolean).join(' ');
}
