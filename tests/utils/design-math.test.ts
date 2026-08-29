import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
  calculateNestedRadius,
  calculatePillRadius,
  calculateGoldenRatioTypography,
} from '@/lib/utils/designMath';
import {
  documentStore,
  editorStore,
  canUndo,
} from '@/components/builder/stores/editorStore';
import { DEFAULT_TEMPLATE_CONFIG, DEFAULT_TEMPLATE_THEME } from '@/schemas';

describe('Design Math Helper Functions', () => {
  it('calculateNestedRadius should obey R_inner = max(0, R_outer - Padding)', () => {
    expect(calculateNestedRadius(16, 8)).toBe(8);
    expect(calculateNestedRadius(8, 16)).toBe(0);
    expect(calculateNestedRadius(24, 8)).toBe(16);
    expect(calculateNestedRadius(12, 12)).toBe(0);
  });

  it('calculatePillRadius should compute Height / 2', () => {
    expect(calculatePillRadius(48)).toBe(24);
    expect(calculatePillRadius(32)).toBe(16);
    expect(calculatePillRadius(40)).toBe(20);
    expect(calculatePillRadius(56)).toBe(28);
  });

  it('calculateGoldenRatioTypography should compute golden ratio scale (phi=1.618)', () => {
    const scale16 = calculateGoldenRatioTypography(16);
    expect(scale16.h1).toBe(42); // 16 * 1.618^2 = 41.88 -> 42
    expect(scale16.h2).toBe(26); // 16 * 1.618 = 25.88 -> 26
    expect(scale16.h3).toBe(20); // 16 * 1.25 = 20
    expect(scale16.body).toBe(16);
    expect(scale16.caption).toBe(10); // 16 / 1.618 = 9.88 -> 10

    const scale18 = calculateGoldenRatioTypography(18);
    expect(scale18.h1).toBe(47);
    expect(scale18.h2).toBe(29);
    expect(scale18.body).toBe(18);
  });
});

describe('Theme History Merge Window (400ms Debounce Merge)', () => {
  beforeEach(() => {
    documentStore.init({
      id: 'tpl-test',
      name: 'Test Template',
      price: 50000,
      config: DEFAULT_TEMPLATE_CONFIG,
    });
  });

  it('should merge consecutive theme changes within 400ms into a single undo step', () => {
    expect(get(documentStore).history.past.length).toBe(0);

    // First theme change
    documentStore.updateGlobalTheme({ colors: { primary: '#111111' } });
    expect(get(documentStore).history.past.length).toBe(1);

    // Rapid second theme change (e.g. 50ms later)
    documentStore.updateGlobalTheme({ colors: { primary: '#222222' } });
    // Still 1 history entry because it merged within 400ms
    expect(get(documentStore).history.past.length).toBe(1);

    // Rapid third theme change
    documentStore.updateGlobalTheme({ colors: { primary: '#333333' } });
    expect(get(documentStore).history.past.length).toBe(1);
    expect(get(documentStore).template?.config.theme?.colors?.primary).toBe('#333333');

    // Single undo reverts back to the original theme state before rapid changes
    expect(get(canUndo)).toBe(true);
    editorStore.undo();
    expect(get(documentStore).template?.config.theme?.colors?.primary).toBe(DEFAULT_TEMPLATE_THEME.colors?.primary);
  });
});
