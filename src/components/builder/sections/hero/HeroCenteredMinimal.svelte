<script lang="ts">
  import { ShoppingBag } from 'lucide-svelte';

  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#products';
  export let imageUrl: string = '';
  export let selectNode: (e: MouseEvent, key: string) => void = () => {};
  export let selectNodeKey: (e: KeyboardEvent, key: string) => void = () => {};
</script>

<div class="w-full flex flex-col items-center text-center gap-6">
  {#if badgeText}
    <div
      data-node="badge"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'badge')}
      on:keydown={(e) => selectNodeKey(e, 'badge')}
      class="inline-flex items-center gap-1.5 px-4 h-8 rounded-full bg-blue-50 text-[var(--theme-primary,#2563eb)] text-xs font-bold border border-blue-200 cursor-pointer shadow-sm"
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
    class="font-black tracking-tight leading-tight text-3xl sm:text-5xl text-[var(--theme-text-primary,#0f172a)] max-w-3xl cursor-pointer"
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
    <p class="text-sm sm:text-base text-[var(--theme-text-muted,#64748b)] max-w-2xl leading-relaxed">
      {subtitle}
    </p>
  </div>

  {#if ctaText}
    <div data-node="cta">
      <a
        href={ctaLink}
        style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
        class="inline-flex items-center justify-center px-8 font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform"
      >
        <ShoppingBag size={18} class="mr-2" />
        <span>{ctaText}</span>
      </a>
    </div>
  {/if}

  {#if imageUrl}
    <div data-node="image" class="w-full max-w-4xl mt-4 p-2 rounded-2xl bg-base-200/60 dark:bg-slate-800/60 border border-base-300 dark:border-slate-800 shadow-lg">
      <img
        src={imageUrl}
        alt="Hero Showcase"
        class="w-full aspect-[16/9] object-cover rounded-lg"
      />
    </div>
  {/if}
</div>
