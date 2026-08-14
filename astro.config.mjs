// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [
    svelte(),
  ],
  vite: {
    ssr: {
      external: ['svelte'],
    },
  },
  output: 'server', // SSR enabled for dynamic routes
});
