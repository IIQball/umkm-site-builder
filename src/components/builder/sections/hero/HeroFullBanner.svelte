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
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta'];

  $: effectiveOrder = (
    elementOrder && elementOrder.length > 0 ? elementOrder : ['badge', 'title', 'subtitle', 'cta']
  ).filter((k) => k !== 'image');

  $: isBadgeActive = activeNodeId === 'hero_badge' || activeNodeId === 'badge';
  $: isTitleActive = activeNodeId === 'hero_title' || activeNodeId === 'title';
  $: isSubtitleActive = activeNodeId === 'hero_subtitle' || activeNodeId === 'subtitle';
  $: isCtaActive = activeNodeId === 'hero_cta' || activeNodeId === 'cta';

  $: waUrl = generateWhatsAppLink(waNumber);
  $: effectiveLink = waNumber ? waUrl : ctaLink || '#';
</script>

<div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-4 text-white py-12">
  {#each effectiveOrder as slot (slot)}
    {#if slot === 'badge' && badgeText}
      <div
        data-node="badge"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode(e, 'hero_badge')}
        on:keydown={(e) => selectNodeKey(e, 'hero_badge')}
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 9999px));"
        class={`badge badge-outline gap-1.5 px-4 h-8 text-xs font-heading font-semibold backdrop-blur-md border transition-all cursor-pointer shadow-sm ${
          isBadgeActive
            ? 'ring-2 ring-primary bg-white/30 border-white'
            : 'bg-white/20 border-white/30 text-white hover:outline-dashed hover:outline-1 hover:outline-white/70'
        }`}
      >
        <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
        <span>{badgeText}</span>
      </div>
    {:else if slot === 'title'}
      <svelte:element
        this={tagName || 'h1'}
        data-node="title"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode(e, 'hero_title')}
        on:keydown={(e) => selectNodeKey(e, 'hero_title')}
        style="font-size: var(--text-h1-size, inherit); font-weight: var(--text-h1-weight, inherit);"
        class={`text-heading-xl font-heading font-black tracking-tight leading-tight text-white drop-shadow-md transition-all cursor-pointer rounded-2xl p-2 ${
          isTitleActive
            ? 'ring-2 ring-primary bg-white/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-white/70'
        }`}
      >
        {title}
      </svelte:element>
    {:else if slot === 'subtitle' && subtitle}
      <div
        data-node="subtitle"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode(e, 'hero_subtitle')}
        on:keydown={(e) => selectNodeKey(e, 'hero_subtitle')}
        style="font-size: var(--text-body-size, inherit); font-weight: var(--text-body-weight, inherit);"
        class={`text-body-base text-slate-100 max-w-xl leading-relaxed drop-shadow font-sans transition-all cursor-pointer rounded-xl p-2 ${
          isSubtitleActive
            ? 'ring-2 ring-primary bg-white/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-white/70'
        }`}
      >
        <p>{subtitle}</p>
      </div>
    {:else if slot === 'cta' && ctaText}
      <div
        data-node="cta"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode(e, 'hero_cta')}
        on:keydown={(e) => selectNodeKey(e, 'hero_cta')}
        class={`mt-2 rounded-2xl p-2 transition-all cursor-pointer ${
          isCtaActive
            ? 'ring-2 ring-primary bg-white/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-white/70'
        }`}
      >
        <a
          href={effectiveLink}
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);"
          class="btn btn-primary font-heading font-semibold text-sm shadow-lg px-8"
        >
          <span>{ctaText}</span>
          <ArrowRight size={16} class="ml-2" />
        </a>
      </div>
    {/if}
  {/each}
</div>
