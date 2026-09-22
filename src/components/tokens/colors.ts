/**
 * Centralized Design System Colors (SSOT)
 * Matches CSS Semantic Variables in src/styles/global.css
 */

export const DEFAULT_THEME_COLOR_FIELDS = [
  { key: 'primary', label: 'Primary Brand Color', defaultVal: '#36C6FD' },
  { key: 'secondary', label: 'Secondary / Accent Color', defaultVal: '#FC018B' },
  { key: 'background', label: 'Background Kanvas', defaultVal: '#ffffff' },
  { key: 'surface', label: 'Surface / Card Background', defaultVal: '#f8fafc' },
  { key: 'textPrimary', label: 'Teks Utama (Primary)', defaultVal: '#0f172a' },
  { key: 'textMuted', label: 'Teks Redup (Muted)', defaultVal: '#64748b' }
] as const

export const COLOR_TOKENS = [
  'primary',
  'secondary',
  'accent',
  'background',
  'surface',
  'text_primary',
  'text_muted',
  'textPrimary',
  'textMuted',
  'transparent'
] as const
export type ColorToken = (typeof COLOR_TOKENS)[number]

export const colors = {
  primary: {
    DEFAULT: '#36C6FD',
    dark: '#00A3EF',
    light: '#7dd3fc',
    rgb: '54, 198, 253',
    hsl: '196, 98%, 60%'
  },
  secondary: {
    DEFAULT: '#FC018B',
    dark: '#B90162',
    light: '#fd3da5',
    rgb: '252, 1, 139',
    hsl: '327, 99%, 50%'
  },
  semantic: {
    success: {
      DEFAULT: '#10b981',
      dark: '#059669',
      light: '#34d399',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.2)'
    },
    error: {
      DEFAULT: '#ef4444',
      dark: '#dc2626',
      light: '#f87171',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.2)'
    },
    warning: {
      DEFAULT: '#FECF02',
      dark: '#FDA201',
      light: '#fee159',
      bg: 'rgba(254, 207, 2, 0.1)',
      border: 'rgba(254, 207, 2, 0.2)'
    },
    info: {
      DEFAULT: '#0284C7',
      dark: '#0369A1',
      light: '#38BDF8',
      bg: 'rgba(2, 132, 199, 0.1)',
      border: 'rgba(2, 132, 199, 0.2)'
    },
    violet: {
      DEFAULT: '#9A00DD',
      dark: '#6F00A0',
      light: '#b635ee',
      bg: 'rgba(154, 0, 221, 0.1)',
      border: 'rgba(154, 0, 221, 0.2)'
    },
    accent: {
      DEFAULT: '#9A00DD',
      dark: '#6F00A0',
      light: '#b635ee',
      bg: 'rgba(154, 0, 221, 0.1)',
      border: 'rgba(154, 0, 221, 0.2)'
    },
    sky: {
      DEFAULT: '#36C6FD',
      dark: '#00A3EF',
      light: '#7dd3fc',
      bg: 'rgba(54, 198, 253, 0.1)',
      border: 'rgba(54, 198, 253, 0.2)'
    },
    rose: {
      DEFAULT: '#f43f5e',
      dark: '#e11d48',
      light: '#fb7185',
      bg: 'rgba(244, 63, 94, 0.1)',
      border: 'rgba(244, 63, 94, 0.2)'
    },
    orange: {
      DEFAULT: '#FC018B',
      dark: '#B90162',
      light: '#fd3da5',
      bg: 'rgba(252, 1, 139, 0.1)',
      border: 'rgba(252, 1, 139, 0.2)'
    },
    amber: {
      DEFAULT: '#FECF02',
      dark: '#FDA201',
      light: '#fee159',
      bg: 'rgba(254, 207, 2, 0.1)',
      border: 'rgba(254, 207, 2, 0.2)'
    }
  },
  neutrals: {
    light: {
      bgBase: '#f8fafc',
      cardBase: '#ffffff',
      nestedBase: '#f1f5f9',
      textMain: '#0f172a',
      textSecondary: '#334155',
      textMuted: '#64748b',
      textLight: '#94a3b8',
      border: 'rgba(15, 23, 42, 0.08)',
      borderLight: 'rgba(15, 23, 42, 0.05)'
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
      borderLight: 'rgba(248, 250, 252, 0.04)'
    }
  }
} as const

export type ColorTheme = 'indigo' | 'emerald' | 'amber' | 'violet' | 'sky' | 'rose' | 'orange'
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
  | 'orange'
