// vitest.config.ts
import { defineConfig } from "file:///E:/Magang%20Mudapedia/umkm-site-builder/node_modules/vitest/dist/config.js";
import path from "path";
import { svelte, vitePreprocess } from "file:///E:/Magang%20Mudapedia/umkm-site-builder/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
var __vite_injected_original_dirname = "E:\\Magang Mudapedia\\umkm-site-builder";
var vitest_config_default = defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [svelte({ preprocess: [vitePreprocess()], compilerOptions: { dev: true } })],
  test: {
    globals: true,
    environment: "node",
    env: {
      DATABASE_URL: "postgresql://mock:mock@localhost:5432/mock"
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@components": path.resolve(__vite_injected_original_dirname, "./src/components"),
      "@lib": path.resolve(__vite_injected_original_dirname, "./src/lib"),
      "@services": path.resolve(__vite_injected_original_dirname, "./src/services"),
      "@types": path.resolve(__vite_injected_original_dirname, "./src/types"),
      "@db": path.resolve(__vite_injected_original_dirname, "./src/db")
    }
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXE1hZ2FuZyBNdWRhcGVkaWFcXFxcdW1rbS1zaXRlLWJ1aWxkZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXE1hZ2FuZyBNdWRhcGVkaWFcXFxcdW1rbS1zaXRlLWJ1aWxkZXJcXFxcdml0ZXN0LmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovTWFnYW5nJTIwTXVkYXBlZGlhL3Vta20tc2l0ZS1idWlsZGVyL3ZpdGVzdC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlc3QvY29uZmlnJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgc3ZlbHRlLCB2aXRlUHJlcHJvY2VzcyB9IGZyb20gJ0BzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBwbHVnaW5zOiBbc3ZlbHRlKHsgcHJlcHJvY2VzczogW3ZpdGVQcmVwcm9jZXNzKCldLCBjb21waWxlck9wdGlvbnM6IHsgZGV2OiB0cnVlIH0gfSkgYXMgYW55XSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdub2RlJyxcbiAgICBlbnY6IHtcbiAgICAgIERBVEFCQVNFX1VSTDogJ3Bvc3RncmVzcWw6Ly9tb2NrOm1vY2tAbG9jYWxob3N0OjU0MzIvbW9jaycsXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgJ0Bjb21wb25lbnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMnKSxcbiAgICAgICdAbGliJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2xpYicpLFxuICAgICAgJ0BzZXJ2aWNlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9zZXJ2aWNlcycpLFxuICAgICAgJ0B0eXBlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy90eXBlcycpLFxuICAgICAgJ0BkYic6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9kYicpLFxuICAgIH0sXG4gIH0sXG59KTtcblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UyxTQUFTLG9CQUFvQjtBQUMxVSxPQUFPLFVBQVU7QUFDakIsU0FBUyxRQUFRLHNCQUFzQjtBQUZ2QyxJQUFNLG1DQUFtQztBQUl6QyxJQUFPLHdCQUFRLGFBQWE7QUFBQTtBQUFBLEVBRTFCLFNBQVMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLGVBQWUsQ0FBQyxHQUFHLGlCQUFpQixFQUFFLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBUTtBQUFBLEVBQzNGLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLEtBQUs7QUFBQSxNQUNILGNBQWM7QUFBQSxJQUNoQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNwQyxlQUFlLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxNQUN6RCxRQUFRLEtBQUssUUFBUSxrQ0FBVyxXQUFXO0FBQUEsTUFDM0MsYUFBYSxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsTUFDckQsVUFBVSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQy9DLE9BQU8sS0FBSyxRQUFRLGtDQUFXLFVBQVU7QUFBQSxJQUMzQztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
