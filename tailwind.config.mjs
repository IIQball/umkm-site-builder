import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  blocklist: ['transition-[width]'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-family, 'Poppins')", 'sans-serif'],
        heading: ["var(--font-heading, 'Host Grotesk')", 'sans-serif'],
        mono: ['var(--font-geist-mono, monospace)'],
      },
      fontSize: {
        '3xs': ['0.5625rem', { lineHeight: '0.75rem' }],
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'xs-dense': ['0.6875rem', { lineHeight: '0.875rem' }],
      },
      letterSpacing: {
        caps: '0.2em',
      },
      colors: {
        'muted-foreground': 'var(--color-text-muted, #64748b)',
        foreground: 'var(--color-text-main, #0f172a)',
        canvas: 'rgb(var(--color-bg-base-rgb, 248 250 252) / <alpha-value>)',
        card: 'rgb(var(--color-card-rgb, 255 255 255) / <alpha-value>)',
        nested: 'rgb(var(--color-nested-rgb, 241 245 249) / <alpha-value>)',
        main: 'rgb(var(--color-text-main-rgb, 15 23 42) / <alpha-value>)',
        secondary: 'var(--color-text-secondary)',
        accent: {
          DEFAULT: 'rgb(var(--color-accent-rgb, 154 0 221) / <alpha-value>)',
          dark: 'var(--color-accent-dark, #6F00A0)',
          light: 'var(--color-accent-light, #9A00DD)'
        },
        muted: 'var(--color-text-muted)',
        light: 'var(--color-border-light)',
        border: 'var(--color-border)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary-rgb, 54 198 253) / <alpha-value>)',
          dark: 'var(--color-primary-dark)',
          light: 'var(--color-primary-light)'
        },
        orange: {
          DEFAULT: 'rgb(var(--color-orange-rgb, 252 1 139) / <alpha-value>)',
          dark: 'var(--color-orange-dark)',
          light: 'var(--color-orange-light)'
        },
        success: 'rgb(var(--color-success-rgb, 16 185 129) / <alpha-value>)',
        error: 'rgb(var(--color-error-rgb, 239 68 68) / <alpha-value>)',
        warning: 'rgb(var(--color-warning-rgb, 254 207 2) / <alpha-value>)',
        info: 'rgb(var(--color-info-rgb, 2 132 199) / <alpha-value>)'
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#36C6FD',
          'primary-content': '#ffffff',
          secondary: '#FC018B',
          accent: '#9A00DD',
          neutral: '#3f3f46',
          'base-100': '#ffffff',
          'base-200': '#f8fafc',
          'base-300': '#f1f5f9',
          'base-content': '#0f172a',
          success: '#10b981',
          error: '#ef4444',
          warning: '#FECF02',
          info: '#0284C7'
        },
        dark: {
          primary: '#00A3EF',
          'primary-content': '#ffffff',
          secondary: '#B90162',
          accent: '#6F00A0',
          neutral: '#e4e4e7',
          'base-100': '#111827',
          'base-200': '#0B0F19',
          'base-300': '#1F2937',
          'base-content': '#ffffff',
          success: '#10b981',
          error: '#ef4444',
          warning: '#FDA201',
          info: '#38BDF8'
        }
      }
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true
  }
}
