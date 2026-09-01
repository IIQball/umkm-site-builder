import { z } from 'zod';

export const ColorTokenSchema = z.enum([
  'primary',
  'secondary',
  'accent',
  'background',
  'surface',
  'text_primary',
  'text_muted',
  'textPrimary',
  'textMuted',
  'transparent',
]);

export type ColorToken = z.infer<typeof ColorTokenSchema>;

export const TypographyTokenSchema = z.enum(['h1', 'h2', 'h3', 'body', 'caption']);
export type TypographyToken = z.infer<typeof TypographyTokenSchema>;

export const SpacingStepSchema = z.union([
  z.literal(0),
  z.literal(8),
  z.literal(16),
  z.literal(24),
  z.literal(32),
  z.literal(40),
  z.literal(48),
  z.literal(56),
  z.literal(64),
  z.literal(80),
  z.literal(96),
]);
export type SpacingStep = z.infer<typeof SpacingStepSchema>;

export const ButtonHeightSchema = z.union([
  z.literal(32),
  z.literal(40),
  z.literal(48),
  z.literal(56),
]);
export type ButtonHeight = z.infer<typeof ButtonHeightSchema>;

export const EffectShadowSchema = z.enum(['none', 'sm', 'md', 'lg']);
export type EffectShadow = z.infer<typeof EffectShadowSchema>;
