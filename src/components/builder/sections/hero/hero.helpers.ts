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
