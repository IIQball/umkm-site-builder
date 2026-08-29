import { describe, it, expect } from 'vitest';
import * as tokens from '@/components/tokens';
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  Badge,
  Modal,
  Table,
} from '@/components/ui';

describe('Centralized Design System Tokens (SSOT)', () => {
  describe('Color Tokens', () => {
    it('defines primary, secondary, and semantic color palettes', () => {
      expect(tokens.colors.primary.DEFAULT).toBe('#5551ff');
      expect(tokens.colors.primary.dark).toBe('#4338ca');
      expect(tokens.colors.primary.light).toBe('#6366f1');

      expect(tokens.colors.secondary.DEFAULT).toBe('#334155');

      expect(tokens.colors.semantic.success.DEFAULT).toBe('#10b981');
      expect(tokens.colors.semantic.error.DEFAULT).toBe('#ef4444');
      expect(tokens.colors.semantic.warning.DEFAULT).toBe('#f59e0b');
      expect(tokens.colors.semantic.info.DEFAULT).toBe('#3b82f6');
      expect(tokens.colors.semantic.violet.DEFAULT).toBe('#8b5cf6');
    });

    it('defines neutrals for both light and dark themes', () => {
      expect(tokens.colors.neutrals.light.bgBase).toBe('#f4f6fa');
      expect(tokens.colors.neutrals.light.cardBase).toBe('#ffffff');
      expect(tokens.colors.neutrals.dark.bgBase).toBe('#0b0f19');
      expect(tokens.colors.neutrals.dark.cardBase).toBe('#111827');
    });
  });

  describe('Typography Tokens', () => {
    it('defines font families including League Spartan heading and Poppins sans', () => {
      expect(tokens.fonts.heading).toContain('League Spartan');
      expect(tokens.fonts.sans).toContain('Poppins');
    });

    it('defines Golden Ratio scaling constant and typography scales', () => {
      expect(tokens.PHI).toBe(1.618);
      expect(tokens.typographyScale.h1.size).toBe('2.625rem');
      expect(tokens.typographyScale.h2.size).toBe('1.625rem');
      expect(tokens.typographyScale.body.size).toBe('1rem');
      expect(tokens.typographyScale.caption.size).toBe('0.625rem');
    });

    it('defines standard font weights', () => {
      expect(tokens.fontWeights.regular).toBe('400');
      expect(tokens.fontWeights.semibold).toBe('600');
      expect(tokens.fontWeights.bold).toBe('700');
    });
  });

  describe('Spacing & Radius Tokens', () => {
    it('obeys 8pt spacing grid and defines safe zones', () => {
      expect(tokens.spacingGrid[2]).toBe('8px');
      expect(tokens.spacingGrid[4]).toBe('16px');
      expect(tokens.spacingGrid[8]).toBe('32px');

      expect(tokens.safeZones.desktop).toBe('32px');
      expect(tokens.safeZones.tablet).toBe('24px');
      expect(tokens.safeZones.mobile).toBe('16px');
    });

    it('calculates nested radius using concentric corner formula', () => {
      expect(tokens.calculateNestedRadius(16, 8)).toBe(8);
      expect(tokens.calculateNestedRadius(24, 8)).toBe(16);
      expect(tokens.calculateNestedRadius(8, 12)).toBe(0);
    });

    it('calculates full pill border radius', () => {
      expect(tokens.calculatePillRadius(40)).toBe(20);
      expect(tokens.calculatePillRadius(32)).toBe(16);
      expect(tokens.calculatePillRadius(48)).toBe(24);
    });
  });

  describe('Shadow Tokens', () => {
    it('defines elevation levels and semantic glows', () => {
      expect(tokens.shadowTokens.sm).toBeDefined();
      expect(tokens.shadowTokens.md).toBeDefined();
      expect(tokens.shadowTokens.lg).toBeDefined();
      expect(tokens.shadowTokens.glow.indigo).toBeDefined();
      expect(tokens.shadowTokens.glow.emerald).toBeDefined();
    });
  });

  describe('Animation Tokens', () => {
    it('defines transitions, durations, and easings', () => {
      expect(tokens.transitions.fast).toBeDefined();
      expect(tokens.transitions.base).toBeDefined();
      expect(tokens.durations.normal).toBe('200ms');
      expect(tokens.easings.smoothOut).toBeDefined();
      expect(tokens.animationClasses.fadeInUp).toBe('animate-fade-in-up');
    });
  });
});

describe('Atomic UI Components Exports & Definition', () => {
  it('exports all 8 atomic UI components from src/components/ui', () => {
    expect(Button).toBeDefined();
    expect(Input).toBeDefined();
    expect(Textarea).toBeDefined();
    expect(Select).toBeDefined();
    expect(Card).toBeDefined();
    expect(Badge).toBeDefined();
    expect(Modal).toBeDefined();
    expect(Table).toBeDefined();
  });
});
