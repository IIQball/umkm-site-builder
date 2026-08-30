/**
 * Centralized Design System Colors (SSOT)
 * Matches CSS Semantic Variables in src/styles/global.css
 */

export const colors = {
  primary: {
    DEFAULT: '#2563eb',
    dark: '#1d4ed8',
    light: '#3b82f6',
    rgb: '37, 99, 235',
    hsl: '221, 83%, 53%',
  },
  secondary: {
    DEFAULT: '#334155',
    dark: '#1e293b',
    light: '#475569',
    rgb: '51, 65, 85',
    hsl: '215, 25%, 27%',
  },
  semantic: {
    success: {
      DEFAULT: '#10b981',
      dark: '#059669',
      light: '#34d399',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.2)',
    },
    error: {
      DEFAULT: '#ef4444',
      dark: '#dc2626',
      light: '#f87171',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.2)',
    },
    warning: {
      DEFAULT: '#f59e0b',
      dark: '#d97706',
      light: '#fbbf24',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.2)',
    },
    info: {
      DEFAULT: '#3b82f6',
      dark: '#2563eb',
      light: '#60a5fa',
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.2)',
    },
    violet: {
      DEFAULT: '#8b5cf6',
      dark: '#7c3aed',
      light: '#a78bfa',
      bg: 'rgba(139, 92, 246, 0.1)',
      border: 'rgba(139, 92, 246, 0.2)',
    },
    sky: {
      DEFAULT: '#0ea5e9',
      dark: '#0284c7',
      light: '#38bdf8',
      bg: 'rgba(14, 165, 233, 0.1)',
      border: 'rgba(14, 165, 233, 0.2)',
    },
    rose: {
      DEFAULT: '#f43f5e',
      dark: '#e11d48',
      light: '#fb7185',
      bg: 'rgba(244, 63, 94, 0.1)',
      border: 'rgba(244, 63, 94, 0.2)',
    },
    orange: {
      DEFAULT: '#ff5b35',
      dark: '#ea4a24',
      light: '#ff7b5c',
      bg: 'rgba(255, 91, 53, 0.1)',
      border: 'rgba(255, 91, 53, 0.2)',
    },
    amber: {
      DEFAULT: '#f59e0b',
      dark: '#d97706',
      light: '#fbbf24',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.2)',
    },
  },
  neutrals: {
    light: {
      bgBase: '#f4f6fa',
      cardBase: '#ffffff',
      nestedBase: '#f1f5f9',
      textMain: '#0f172a',
      textSecondary: '#334155',
      textMuted: '#64748b',
      textLight: '#94a3b8',
      border: 'rgba(15, 23, 42, 0.08)',
      borderLight: 'rgba(15, 23, 42, 0.05)',
    },
    dark: {
      bgBase: '#0b0f19',
      cardBase: '#111827',
      nestedBase: '#1f2937',
      textMain: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      textLight: '#64748b',
      border: 'rgba(248, 250, 252, 0.07)',
      borderLight: 'rgba(248, 250, 252, 0.04)',
    },
  },
} as const;

export type ColorTheme = 'indigo' | 'emerald' | 'amber' | 'violet' | 'sky' | 'rose' | 'orange';
export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'slate'
  | 'emerald'
  | 'violet'
  | 'sky'
  | 'indigo'
  | 'amber'
  | 'rose'
  | 'orange';

