/**
 * Theme Utility (SSOT)
 * Centralizes theme detection, DOM application, and localStorage synchronization.
 */

export type ThemeMode = 'light' | 'dark';

/**
 * Resolves current theme preference from localStorage or system prefers-color-scheme.
 */
export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/**
 * Applies the theme to document.documentElement and persists it to localStorage.
 */
export function applyTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  try {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  } catch (err) {
    console.error('[Theme] Failed to apply theme:', err);
  }
}
