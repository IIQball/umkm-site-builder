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

export const textColorOptions = [
  { value: '', label: 'Default (Warisan Tema)', preview: 'transparent' },
  { value: 'var(--theme-text-primary, var(--color-text-main, #0f172a))', label: 'Teks Utama (Primary Text)', preview: '#0f172a' },
  { value: 'var(--theme-text-muted, var(--color-text-muted, #64748b))', label: 'Teks Redup (Muted Text)', preview: '#64748b' },
  { value: 'var(--theme-primary, var(--color-primary))', label: 'Primary Brand (Warna Utama)', preview: '#36C6FD' },
  { value: 'var(--theme-secondary, var(--color-secondary, #3b82f6))', label: 'Secondary / Accent', preview: '#3b82f6' },
  { value: '#ffffff', label: 'Putih Bersih (White)', preview: '#ffffff' },
  { value: '#0f172a', label: 'Hitam Gelap (#0f172a)', preview: '#0f172a' },
];

export const marginOptions = [
  { value: '0px', label: '0px (Rapat)' },
  { value: '4px', label: '4px (Sangat Ketat)' },
  { value: '8px', label: '8px (Normal)' },
  { value: '12px', label: '12px (Sedang)' },
  { value: '16px', label: '16px (Renggang)' },
  { value: '24px', label: '24px (Lebar)' },
  { value: '32px', label: '32px (Ekstra Lebar)' },
  { value: '48px', label: '48px (Jumbo)' },
];

