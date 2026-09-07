/**
 * Design System Animation Tokens (SSOT)
 * Standardizes transitions, durations, easings, and micro-animations.
 */

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: '300ms cubic-bezier(0.16, 1, 0.3, 1)',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const durations = {
  fast: '150ms',
  normal: '200ms',
  moderate: '300ms',
  slow: '500ms',
  deliberate: '700ms',
} as const;

export const easings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  smoothOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const animationClasses = {
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  barGrow: 'animate-bar-grow',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
} as const;

export const NODE_ANIMATION_OPTIONS = [
  { value: '', label: 'Tanpa Animasi' },
  { value: 'fadeIn', label: 'Fade In (Halus)' },
  { value: 'fadeInUp', label: 'Fade In Up (Muncul dari Bawah)' },
  { value: 'slideUp', label: 'Slide Up (Muncul dari Bawah)' },
  { value: 'slideLeft', label: 'Slide In Left (Dari Kanan)' },
  { value: 'slideRight', label: 'Slide In Right (Dari Kiri)' },
  { value: 'zoomIn', label: 'Zoom In (Membesar)' },
] as const;

export type TransitionToken = keyof typeof transitions;
export type DurationToken = keyof typeof durations;
export type EasingToken = keyof typeof easings;
export type NodeAnimationOption = (typeof NODE_ANIMATION_OPTIONS)[number];
