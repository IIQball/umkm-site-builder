## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Icon Usage in Astro Pages

**DO NOT import lucide-svelte components directly in `.astro` template markup.**

Astro's TypeScript checker cannot resolve lucide-svelte (Svelte 4 class-based) component props
(`class`, `size`, `color`), causing false positive TS errors that cannot be suppressed with
`@ts-ignore` in Astro template syntax.

**Correct pattern — use inline SVG in `.astro` files:**

```astro
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <polyline points="6 9 12 15 18 9"/>
</svg>
```

**lucide-svelte IS fine in `.svelte` components** — only avoid in `.astro` template sections.

## Builder Canvas Viewport Responsiveness

**DO NOT rely solely on window-based CSS media queries (`md:hidden`, `hidden md:flex`, `sm:inline`) in Template Builder section components (`src/components/builder/sections/`).**

When building or refactoring components rendered inside the no-code builder canvas:
- Always subscribe to `$canvasStore.viewMode` (`'desktop' | 'tablet' | 'mobile'`) from `src/components/builder/stores/editorStore.ts`.
- Derive reactive conditionals:
  - `$: isDesktop = $canvasStore?.viewMode === 'desktop';`
  - `$: isMobile = $canvasStore?.viewMode === 'mobile';`
  - `$: isSmallScreen = $canvasStore?.viewMode === 'mobile' || $canvasStore?.viewMode === 'tablet';`
- Use Svelte logic blocks (`{#if isDesktop}`, `{#if isSmallScreen}`) for layout shifts, burger buttons, and nav link visibility instead of `@media (min-width: 768px)` window classes.

