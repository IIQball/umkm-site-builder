import { RADIUS_PRESETS } from '@/components/tokens/radius';
import { FONT_FAMILY_OPTIONS, FONT_SIZES, FONT_WEIGHTS } from '@/components/tokens/typography';
import { SHADOW_PRESETS } from '@/components/tokens/shadows';
import { NODE_ANIMATION_OPTIONS } from '@/components/tokens/animations';

export const fontFamilies = FONT_FAMILY_OPTIONS;

export const fontSizes = FONT_SIZES;

export const fontWeights = FONT_WEIGHTS;

export const radiusPresets = RADIUS_PRESETS.map((r) => ({
  label: r.label,
  value: `${r.value}px`,
}));

export const buttonPaddings = [
  { label: 'Kompak (8px 16px)', value: '8px 16px' },
  { label: 'Normal (12px 24px)', value: '12px 24px' },
  { label: 'Besar (16px 32px)', value: '16px 32px' },
];

export const shadowPresets = SHADOW_PRESETS;

export const nodeAnimationOptions = NODE_ANIMATION_OPTIONS;

export const hoverOptions = [
  { value: '', label: 'None' },
  { value: 'scale', label: 'Scale Up (1.05x)' },
  { value: 'lift', label: 'Lift Up (-4px)' },
  { value: 'glow', label: 'Glow Shadow' },
];
