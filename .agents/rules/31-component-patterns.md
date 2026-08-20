# Rules — Component & Hydration Patterns

## 1. Astro → Svelte island data bridge

- Server-fetched data (auth user, config, etc.) is passed to Svelte islands as a **serialized JSON string
  prop** (`userJson: string`).
- The island parses it synchronously at the top of its `<script>` block:
  ```ts
  const user: AuthenticatedUser = JSON.parse(userJson);
  ```
- Never pass raw objects as props across the Astro/Svelte boundary — Astro serializes them differently
  from what client-side Svelte expects and this causes hydration mismatches.
- Prop naming convention: `<entityName>Json` (e.g. `userJson`, `configJson`, `storeJson`).

## 2. Svelte `onMount` for browser-only APIs

- Anything accessing `localStorage`, `window.location`, `document`, or `window.matchMedia` MUST live
  inside `onMount()`. These APIs do not exist during SSR.
- Never call browser-only APIs at module level in a Svelte island — it will throw during server render.
- Import `onMount` from `'svelte'` at the top of the `<script>` block, not mid-script.

  ```ts
  import { onMount } from 'svelte'; // top of <script>
  onMount(() => {
    collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  });
  ```

## 3. `client:load` vs `client:only`

- `client:load` — interactive islands that benefit from SSR HTML (forms, navbars, sidebars, auth-aware
  UI). Hydrates immediately on page load.
- `client:only="svelte"` — canvas-heavy or browser-only components that have no meaningful SSR output
  (BuilderEditor, Canvas, heavy chart components). Skips SSR entirely.
- Never use `client:visible` on auth-gated or critical-path components — they flash briefly as
  unauthenticated before hydrating.

## 4. Svelte store vs prop for cross-component state

- If state is needed by a single island, use local Svelte `let` / `$:` reactivity.
- If state must be shared between two or more Svelte islands on the same page, use a Svelte writable
  store in `src/lib/stores/`.
- Do not share state between islands via URL params or DOM manipulation — use stores.

## 5. `{@const}` placement

- Svelte `{@const ...}` directives must be placed directly inside valid block tags (`{#if}`, `{#each}`,
  `{#await}`, etc.), never inside raw HTML elements like `<div>` or `<span>`.
- Wrong: `<div>{@const x = foo()}</div>`
- Right: `{#each items as item}{@const label = item.name.toUpperCase()}<span>{label}</span>{/each}`
