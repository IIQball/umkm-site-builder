import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#4f46e5',
          'primary-content': '#ffffff',
          secondary: '#7c3aed',
          accent: '#06b6d4',
          neutral: '#3f3f46',
          'base-100': '#ffffff',
          'base-200': '#f8fafc',
          'base-300': '#f1f5f9',
          'base-content': '#0f172a',
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#3b82f6',
        },
        dark: {
          primary: '#4f46e5',
          'primary-content': '#ffffff',
          secondary: '#7c3aed',
          accent: '#06b6d4',
          neutral: '#e4e4e7',
          'base-100': '#161e31',
          'base-200': '#0a0f1e',
          'base-300': '#1c263c',
          'base-content': '#ffffff',
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#3b82f6',
        },
      },
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
  },
};
