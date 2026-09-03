<script lang="ts">
  import { ArrowRight } from 'lucide-svelte';
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let align: 'left' | 'center' = 'left';

  $: isBadgeActive = activeNodeId === 'hero_badge' || activeNodeId === 'badge';
  $: isTitleActive = activeNodeId === 'hero_title' || activeNodeId === 'title';
  $: isSubtitleActive = activeNodeId === 'hero_subtitle' || activeNodeId === 'subtitle';
  $: isCtaActive = activeNodeId === 'hero_cta' || activeNodeId === 'hero_cta_primary' || activeNodeId === 'cta';

  $: waUrl = generateWhatsAppLink(waNumber);
  $: effectivePrimaryLink = waNumber ? waUrl : (ctaLink || '#');
</script>

<div class={`space-y-4 ${align === 'center' ? 'text-center max-w-3xl mx-auto' : 'text-left'}`}>
  {#if badgeText}
    <div
      data-node="badge"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_badge')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_badge')}
      class={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-2xs font-heading font-medium border transition-all cursor-pointer shadow-2xs ${
        isBadgeActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/40 dark:bg-blue-950/40'
          : 'bg-slate-100/90 dark:bg-slate-800/70 border-slate-200/90 dark:border-slate-700/80 text-[var(--color-text-secondary,#334155)] hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-primary,#2563eb)]"></span>
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
    class={`text-heading-xl font-heading font-extrabold text-[var(--color-text-main,#0f172a)] tracking-tight leading-tight transition-all cursor-pointer rounded-xl p-1.5 -ml-1.5 block ${
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
      class={`text-body-base text-[var(--color-text-secondary,#334155)] leading-relaxed font-sans transition-all cursor-pointer rounded-xl p-1.5 -ml-1.5 ${
        isSubtitleActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/20 dark:bg-blue-950/20'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <p>{subtitle}</p>
    </div>
  {/if}

  {#if ctaText || secondaryCtaText}
    <div
      data-node="cta"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_cta')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_cta')}
      class={`flex flex-wrap items-center gap-3 pt-2 rounded-xl p-1.5 -ml-1.5 transition-all cursor-pointer ${
        align === 'center' ? 'justify-center' : 'justify-start'
      } ${
        isCtaActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/20 dark:bg-blue-950/20'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      {#if ctaText}
        <a
          href={effectivePrimaryLink}
          class="inline-flex items-center justify-center h-10 min-h-[40px] px-6 rounded-2xl bg-[var(--color-primary,#2563eb)] text-white font-heading font-semibold text-sm hover:bg-primary-dark active:scale-[0.98] transition-all duration-150 shadow-xs"
        >
          <span>{ctaText}</span>
          <ArrowRight size={15} class="ml-1.5" />
        </a>
      {/if}
      {#if secondaryCtaText}
        <a
          href={secondaryCtaLink || '#'}
          class="inline-flex items-center justify-center h-10 min-h-[40px] px-5 rounded-2xl bg-transparent text-[var(--color-text-main,#0f172a)] hover:bg-[var(--color-nested-base,#f1f5f9)] border border-slate-300 dark:border-slate-700 font-heading font-semibold text-sm active:scale-[0.98] transition-all duration-150"
        >
          <span>{secondaryCtaText}</span>
        </a>
      {/if}
    </div>
  {/if}
</div>
