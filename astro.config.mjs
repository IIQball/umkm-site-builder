// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    runtime: {
      mode: 'local',
    },
  }),
  integrations: [
    svelte(),
  ],
  vite: {
    ssr: {
      external: ['svelte', 'node:crypto'],
    },
    resolve: {
      alias: {
        crypto: 'node:crypto',
      },
    },
  },
});
