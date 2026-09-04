import { FONT_SIZES, FONT_WEIGHTS } from '@/components/tokens/typography';

export const fontFamilies = [
  { label: 'Default (Inter)', value: 'Inter, sans-serif' },
  { label: 'Plus Jakarta Sans (Modern)', value: '"Plus Jakarta Sans", sans-serif' },
  { label: 'Poppins (Geometric)', value: 'Poppins, sans-serif' },
  { label: 'Playfair Display (Serif/Elegant)', value: "'Playfair Display', serif" },
  { label: 'Outfit (Clean)', value: 'Outfit, sans-serif' },
];

export const fontSizes = FONT_SIZES;

export const fontWeights = FONT_WEIGHTS;

export const radiusPresets = [
  { label: 'Kotak (0px)', value: '0px' },
  { label: 'Kecil (8px)', value: '8px' },
  { label: 'Sedang (16px)', value: '16px' },
  { label: 'Besar (24px)', value: '24px' },
  { label: 'Pill Radius (Full)', value: '9999px' },
];

export const buttonPaddings = [
  { label: 'Kompak (8px 16px)', value: '8px 16px' },
  { label: 'Normal (12px 24px)', value: '12px 24px' },
  { label: 'Besar (16px 32px)', value: '16px 32px' },
];

export const shadowPresets = [
  { label: 'Tanpa Shadow', value: 'none' },
  { label: 'Soft Shadow (sm)', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  { label: 'Medium Shadow (md)', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
  { label: 'Large Shadow (lg)', value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
];

export const nodeAnimationOptions = [
  { value: '', label: 'Tanpa Animasi' },
  { value: 'fadeIn', label: 'Fade In (Halus)' },
  { value: 'slideUp', label: 'Slide Up (Muncul dari Bawah)' },
  { value: 'slideLeft', label: 'Slide In Left (Dari Kanan)' },
  { value: 'slideRight', label: 'Slide In Right (Dari Kiri)' },
  { value: 'zoomIn', label: 'Zoom In (Membesar)' },
];

export const hoverOptions = [
  { value: '', label: 'None' },
  { value: 'scale', label: 'Scale Up (1.05x)' },
  { value: 'lift', label: 'Lift Up (-4px)' },
  { value: 'glow', label: 'Glow Shadow' },
];

