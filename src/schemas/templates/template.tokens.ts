import { z } from 'zod';
import {
  COLOR_TOKENS,
  RADIUS_STEPS,
  FONT_FAMILIES,
  FONT_FAMILY_OPTIONS,
} from '@/components/tokens';

export const ColorTokenSchema = z.enum(COLOR_TOKENS);
export type ColorToken = z.infer<typeof ColorTokenSchema>;

export const TypographyTokenSchema = z.enum(['h1', 'h2', 'h3', 'body', 'caption']);
export type TypographyToken = z.infer<typeof TypographyTokenSchema>;

export const RadiusStepSchema = z.union(
  RADIUS_STEPS.map((step) => z.literal(step)) as [
    z.ZodLiteral<number>,
    z.ZodLiteral<number>,
    ...z.ZodLiteral<number>[]
  ]
);
export type RadiusStep = z.infer<typeof RadiusStepSchema>;

export const FontFamilySchema = z.string().refine(
  (val) => {
    return (
      (FONT_FAMILIES as readonly string[]).some((f) => val.includes(f)) ||
      FONT_FAMILY_OPTIONS.some((opt) => opt.value === val)
    );
  },
  { message: 'Invalid font family' }
);
export type FontFamily = z.infer<typeof FontFamilySchema>;

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
