// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    svelte(),
  ],
  vite: {
    server: {
      allowedHosts: true,
    },
    optimizeDeps: {
      exclude: ['@astrojs/svelte', 'worker-mailer'],
    },
    ssr: {
      noExternal: ['worker-mailer'],
    },
    build: {
      chunkSizeWarningLimit: 2000,
    },
  },
});
