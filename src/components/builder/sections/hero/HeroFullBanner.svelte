<script lang="ts">
  import { ShoppingBag } from 'lucide-svelte';

  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#products';
  export let selectNode: (e: MouseEvent, key: string) => void = () => {};
  export let selectNodeKey: (e: KeyboardEvent, key: string) => void = () => {};
</script>

<div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-4 text-white">
  {#if badgeText}
    <div
      data-node="badge"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'badge')}
      on:keydown={(e) => selectNodeKey(e, 'badge')}
      class="inline-flex items-center gap-1.5 px-4 h-8 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/30 cursor-pointer shadow-sm"
    >
      <span>{badgeText}</span>
    </div>
  {/if}

  <svelte:element
    this={tagName || 'h1'}
    data-node="title"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'title')}
    on:keydown={(e) => selectNodeKey(e, 'title')}
    class="font-black tracking-tight leading-tight text-3xl sm:text-5xl drop-shadow-md cursor-pointer"
  >
    {title}
  </svelte:element>

  <div
    data-node="subtitle"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'subtitle')}
    on:keydown={(e) => selectNodeKey(e, 'subtitle')}
    class="cursor-pointer"
  >
    <p class="text-sm sm:text-lg text-slate-100 max-w-xl leading-relaxed drop-shadow">
      {subtitle}
    </p>
  </div>

  {#if ctaText}
    <div data-node="cta" class="mt-2">
      <a
        href={ctaLink}
        style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
        class="inline-flex items-center justify-center px-8 font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform"
      >
        <ShoppingBag size={18} class="mr-2" />
        <span>{ctaText}</span>
      </a>
    </div>
  {/if}
</div>
