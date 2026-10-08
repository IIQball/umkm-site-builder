import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getStoredTheme, applyTheme } from '@/lib/utils/theme';
import { canvasStore } from '@/components/builder/stores/canvasStore';
import { get } from 'svelte/store';

describe('Theme SSOT Utility', () => {
  let localStorageMock: Record<string, string> = {};
  const originalLocalStorage = globalThis.localStorage;
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  beforeEach(() => {
    localStorageMock = {};
    (globalThis as unknown as { localStorage: unknown }).localStorage = {
      getItem: (key: string) => localStorageMock[key] ?? null,
      setItem: (key: string, val: string) => {
        localStorageMock[key] = val;
      },
      removeItem: (key: string) => {
        delete localStorageMock[key];
      },
      clear: () => {
        localStorageMock = {};
      },
    };

    (globalThis as unknown as { window: unknown }).window = {
      matchMedia: (query: string) => ({
        matches: query.includes('dark'),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      }),
    };

    const classList = new Set<string>();
    const attributes: Record<string, string> = {};
    (globalThis as unknown as { document: unknown }).document = {
      documentElement: {
        classList: {
          add: (cls: string) => classList.add(cls),
          remove: (cls: string) => classList.delete(cls),
          contains: (cls: string) => classList.has(cls),
        },
        setAttribute: (name: string, val: string) => {
          attributes[name] = val;
        },
        getAttribute: (name: string) => attributes[name] ?? null,
      },
    };
  });

  afterEach(() => {
    (globalThis as unknown as { localStorage: unknown }).localStorage = originalLocalStorage;
    (globalThis as unknown as { window: unknown }).window = originalWindow;
    (globalThis as unknown as { document: unknown }).document = originalDocument;
  });

  describe('getStoredTheme', () => {
    it('returns stored dark theme when localStorage has dark', () => {
      localStorageMock['theme'] = 'dark';
      expect(getStoredTheme()).toBe('dark');
    });

    it('returns stored light theme when localStorage has light', () => {
      localStorageMock['theme'] = 'light';
      expect(getStoredTheme()).toBe('light');
    });

    it('falls back to system prefers-color-scheme if no localStorage value', () => {
      expect(getStoredTheme()).toBe('dark');
    });
  });

  describe('applyTheme', () => {
    it('applies dark theme to document and localStorage', () => {
      applyTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('applies light theme to document and localStorage', () => {
      applyTheme('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  describe('canvasStore Theme Management', () => {
    it('initializes and toggles editorTheme seamlessly with previewTheme synchronized', () => {
      canvasStore.setEditorTheme('light');
      expect(get(canvasStore).editorTheme).toBe('light');
      expect(get(canvasStore).previewTheme).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');

      canvasStore.toggleEditorTheme();
      expect(get(canvasStore).editorTheme).toBe('dark');
      expect(get(canvasStore).previewTheme).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');

      canvasStore.toggleEditorTheme();
      expect(get(canvasStore).editorTheme).toBe('light');
      expect(get(canvasStore).previewTheme).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });
});
