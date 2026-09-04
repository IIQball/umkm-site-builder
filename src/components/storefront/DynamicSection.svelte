<script lang="ts">
  import type { ComponentType } from 'svelte';
  
  // Impor komponen-komponen statis (Astro) atau interaktif (Svelte)
  import Hero from './Hero.svelte';
  import PromoBanner from './PromoBanner.svelte';
  import Footer from './Footer.svelte';

  export let section: {
    type: string;
    props?: Record<string, unknown>;
    id?: string;
  };

  // Peta komponen berdasarkan type dari JSONB
  const componentMap: Record<string, ComponentType> = {
    hero: Hero,
    promoBanner: PromoBanner,
    footer: Footer
  };

  $: Component = componentMap[section.type];
</script>

{#if Component}
  <section id={section.id} class="dynamic-section dynamic-section-{section.type}">
    <svelte:component this={Component} {...(section.props || {})} />
  </section>
{:else}
  <!-- Fallback jika tipe komponen tidak dikenali -->
  <div class="p-4 bg-error text-error-content text-sm rounded-md my-4">
    Unknown section type: {section.type}
  </div>
{/if}

<style>
  .dynamic-section {
    width: 100%;
  }
</style>
