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
      exclude: ['@astrojs/svelte', 'worker-mailer', 'three/examples/jsm/loaders/GLTFLoader.js'],
    },
    ssr: {
      noExternal: ['worker-mailer'],
    },
    build: {
      chunkSizeWarningLimit: 2000,
    },
    plugins: [
      {
        name: 'sanitize-daisy-layout-transition',
        enforce: 'post',
        transform(code, id) {
          if (id.includes('.css') || id.includes('global.css') || id.includes('type=style')) {
            if (code.includes('margin-top') && code.includes('transition-property')) {
              return code.replaceAll('transition-property: transform, margin-top', 'transition-property: transform');
            }
          }
          return code;
        },
      },
    ],
  },
});
