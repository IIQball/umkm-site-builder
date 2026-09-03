<script lang="ts">
  import { ArrowRight } from 'lucide-svelte';
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#products';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent, key: string) => void = () => {};
  export let selectNodeKey: (e: KeyboardEvent, key: string) => void = () => {};

  $: isBadgeActive = activeNodeId === 'hero_badge' || activeNodeId === 'badge';
  $: isTitleActive = activeNodeId === 'hero_title' || activeNodeId === 'title';
  $: isSubtitleActive = activeNodeId === 'hero_subtitle' || activeNodeId === 'subtitle';
  $: isCtaActive = activeNodeId === 'hero_cta' || activeNodeId === 'cta';

  $: waUrl = generateWhatsAppLink(waNumber);
  $: effectiveLink = waNumber ? waUrl : (ctaLink || '#');
</script>

<div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-4 text-white py-12">
  {#if badgeText}
    <div
      data-node="badge"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'hero_badge')}
      on:keydown={(e) => selectNodeKey(e, 'hero_badge')}
      class={`inline-flex items-center gap-1.5 px-4 h-8 rounded-full text-xs font-heading font-semibold backdrop-blur-md border transition-all cursor-pointer shadow-sm ${
        isBadgeActive
          ? 'ring-2 ring-blue-400 bg-white/30 border-white'
          : 'bg-white/20 border-white/30 text-white hover:outline-dashed hover:outline-1 hover:outline-white/70'
      }`}
    >
      <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
      <span>{badgeText}</span>
    </div>
  {/if}

  <svelte:element
    this={tagName || 'h1'}
    data-node="title"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'hero_title')}
    on:keydown={(e) => selectNodeKey(e, 'hero_title')}
    class={`text-heading-xl font-heading font-black tracking-tight leading-tight text-white drop-shadow-md transition-all cursor-pointer rounded-2xl p-2 ${
      isTitleActive
        ? 'ring-2 ring-blue-400 bg-white/10'
        : 'hover:outline-dashed hover:outline-1 hover:outline-white/70'
    }`}
  >
    {title}
  </svelte:element>

  {#if subtitle}
    <div
      data-node="subtitle"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'hero_subtitle')}
      on:keydown={(e) => selectNodeKey(e, 'hero_subtitle')}
      class={`text-body-base text-slate-100 max-w-xl leading-relaxed drop-shadow font-sans transition-all cursor-pointer rounded-xl p-2 ${
        isSubtitleActive
          ? 'ring-2 ring-blue-400 bg-white/10'
          : 'hover:outline-dashed hover:outline-1 hover:outline-white/70'
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
      on:click={(e) => selectNode(e, 'hero_cta')}
      on:keydown={(e) => selectNodeKey(e, 'hero_cta')}
      class={`mt-2 rounded-2xl p-2 transition-all cursor-pointer ${
        isCtaActive
          ? 'ring-2 ring-blue-400 bg-white/10'
          : 'hover:outline-dashed hover:outline-1 hover:outline-white/70'
      }`}
    >
      <a
        href={effectiveLink}
        class="inline-flex items-center justify-center h-10 min-h-[40px] px-8 rounded-2xl bg-[var(--color-primary,#2563eb)] text-white font-heading font-semibold text-sm shadow-lg hover:bg-primary-dark active:scale-[0.98] transition-all duration-150"
      >
        <span>{ctaText}</span>
        <ArrowRight size={16} class="ml-2" />
      </a>
    </div>
  {/if}
</div>
