<script lang="ts">
  import { ArrowRight } from 'lucide-svelte';

  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: isBadgeActive = activeNodeId === 'hero_badge' || activeNodeId === 'badge';
  $: isTitleActive = activeNodeId === 'hero_title' || activeNodeId === 'title';
  $: isSubtitleActive = activeNodeId === 'hero_subtitle' || activeNodeId === 'subtitle';
  $: isCtaActive = activeNodeId === 'hero_cta' || activeNodeId === 'cta';
</script>

<div class="py-12 flex flex-col items-center text-center gap-6">
  {#if badgeText}
    <div
      data-node="badge"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_badge')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_badge')}
      class={`px-4 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
        isBadgeActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/40 dark:bg-blue-950/40'
          : 'bg-slate-100 dark:bg-slate-800 text-[var(--color-text-secondary,#334155)] hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <span>{badgeText}</span>
    </div>
  {/if}

  <svelte:element
    this={tagName || 'h1'}
    data-node="title"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode && selectNode(e, 'hero_title')}
    on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_title')}
    class={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black text-[var(--color-text-main,#0f172a)] tracking-tighter leading-none transition-all cursor-pointer rounded-2xl p-2 ${
      isTitleActive
        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/20 dark:bg-blue-950/20'
        : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
    }`}
  >
    {title}
  </svelte:element>

  {#if subtitle}
    <div
      data-node="subtitle"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_subtitle')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_subtitle')}
      class={`text-base sm:text-xl text-[var(--color-text-secondary,#334155)] max-w-2xl font-medium leading-relaxed font-sans transition-all cursor-pointer rounded-xl p-2 ${
        isSubtitleActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/20 dark:bg-blue-950/20'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <p>{subtitle}</p>
    </div>
  {/if}

  {#if ctaText}
    <div
      data-node="cta"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_cta')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_cta')}
      class={`pt-4 rounded-2xl p-2 transition-all cursor-pointer ${
        isCtaActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/20 dark:bg-blue-950/20'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <a
        href={ctaLink || '#'}
        class="inline-flex items-center justify-center h-12 min-h-[48px] px-10 rounded-2xl bg-[var(--color-primary,#2563eb)] text-white font-heading font-bold text-base hover:bg-primary-dark active:scale-[0.98] transition-all duration-150 shadow-md"
      >
        <span>{ctaText}</span>
        <ArrowRight size={18} class="ml-2" />
      </a>
    </div>
  {/if}
</div>
