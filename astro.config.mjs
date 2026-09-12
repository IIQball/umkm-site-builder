// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  fetchFile: null,
  integrations: [
    svelte(),
  ],
  vite: {
    server: {
      allowedHosts: true,
    },
    build: {
      chunkSizeWarningLimit: 2000, // Menghilangkan warning chunk > 500kb
    },
  },
});
