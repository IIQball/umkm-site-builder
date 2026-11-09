<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ArrowRight } from 'lucide-svelte';
  import { generateWhatsAppLink } from '@/lib/whatsapp';
  import { resolveFeatureIcon, stripEmoji } from './heroIcons';

  export let badgeText: string = '';
  export let badgeIcon: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#';
  export let ctaVariant: string = 'primary';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let secondaryCtaVariant: string = 'secondary';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let align: 'left' | 'center' = 'left';
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta'];
  export let customBlocks: Record<string, Snippet> = {};

  $: effectiveOrder = (
    elementOrder && elementOrder.length > 0 ? elementOrder : ['badge', 'title', 'subtitle', 'cta']
  ).filter((k) => ['badge', 'title', 'subtitle', 'cta'].includes(k) || Boolean(customBlocks[k]));

  $: isBadgeActive = activeNodeId === 'hero_badge' || activeNodeId === 'badge';
  $: isTitleActive = activeNodeId === 'hero_title' || activeNodeId === 'title';
  $: isSubtitleActive = activeNodeId === 'hero_subtitle' || activeNodeId === 'subtitle';
  $: isCtaActive = activeNodeId === 'hero_cta' || activeNodeId === 'hero_cta_primary' || activeNodeId === 'cta';

  $: waUrl = generateWhatsAppLink(waNumber);
  $: effectivePrimaryLink = waNumber ? waUrl : (ctaLink || '#');

  function editorNode(node: HTMLElement, key: string) {
    if (!selectNode && !selectNodeKey) return;
    const onClick = (e: MouseEvent) => selectNode?.(e, key);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') selectNodeKey?.(e, key);
    };
    node.addEventListener('click', onClick);
    node.addEventListener('keydown', onKey);
    return {
      destroy() {
        node.removeEventListener('click', onClick);
        node.removeEventListener('keydown', onKey);
      }
    };
  }
</script>

<div class={`flex flex-col ${align === 'center' ? 'items-center text-center max-w-3xl mx-auto' : 'items-start text-left'}`}>
  {#each effectiveOrder as slot (slot)}
    {#if slot === 'badge' && badgeText}
      <div
        data-node="badge"
        use:editorNode={'hero_badge'}
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 9999px)); font-family: var(--font-heading, inherit); font-size: var(--theme-text-caption, var(--text-caption-size, 10px)); font-weight: var(--theme-text-caption-weight, var(--text-caption-weight, 700)); color: var(--hero-badge-color, inherit); margin-top: var(--hero-badge-mt, 0px); margin-bottom: var(--hero-badge-mb, 0px);"
        class={`inline-flex items-center gap-1.5 px-3.5 py-1 mb-3 min-h-[24px] text-2xs font-heading font-medium border transition-all shadow-2xs ${selectNode ? 'cursor-pointer' : ''} ${
          isBadgeActive
            ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100 bg-[var(--theme-primary,var(--color-primary))]/15'
            : 'bg-[color-mix(in_srgb,var(--theme-secondary,var(--color-secondary))_10%,transparent)] border-[color-mix(in_srgb,var(--theme-secondary,var(--color-secondary))_25%,transparent)] text-[var(--theme-secondary,var(--color-secondary))] hover:outline-dashed hover:outline-1 hover:outline-[var(--theme-primary,var(--color-primary))]/50'
        }`}
      >
        {#if badgeIcon}
          <svelte:component this={resolveFeatureIcon(badgeIcon)} size={12} class="text-[var(--theme-secondary,var(--color-secondary))] shrink-0" />
        {:else}
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: var(--theme-secondary, var(--color-secondary));"></span>
        {/if}
        <span>{stripEmoji(badgeText)}</span>
      </div>
    {:else if slot === 'title'}
      <svelte:element
        this={tagName || 'h1'}
        data-node="title"
        use:editorNode={'hero_title'}
        style="font-size: var(--theme-text-h1, var(--text-h1-size, 42px)); font-weight: var(--theme-text-h1-weight, var(--text-h1-weight, 700)); color: var(--hero-title-color, var(--color-text-main)); font-family: var(--font-heading, inherit); margin-top: var(--hero-title-mt, 0px); margin-bottom: var(--hero-title-mb, 0px);"
        class={`text-heading-xl font-heading font-extrabold tracking-tight leading-tight mb-3 transition-all rounded-xl p-1.5 -ml-1.5 block w-full ${selectNode ? 'cursor-pointer' : ''} ${
          isTitleActive
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 bg-primary/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
      >
        {stripEmoji(title)}
      </svelte:element>
    {:else if slot === 'subtitle' && subtitle}
      <div
        data-node="subtitle"
        use:editorNode={'hero_subtitle'}
        style="font-size: var(--theme-text-body, var(--text-body-size, 16px)); font-weight: var(--theme-text-body-weight, var(--text-body-weight, 400)); color: var(--hero-subtitle-color, var(--color-text-secondary)); font-family: var(--font-body, var(--font-sans, inherit)); margin-top: var(--hero-subtitle-mt, 0px); margin-bottom: var(--hero-subtitle-mb, 0px);"
        class={`text-body-base leading-relaxed mb-0 transition-all rounded-xl p-1.5 -ml-1.5 w-full ${selectNode ? 'cursor-pointer' : ''} ${
          isSubtitleActive
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 bg-primary/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
      >
        <p>{stripEmoji(subtitle)}</p>
      </div>
    {:else if slot === 'cta' && (ctaText || secondaryCtaText)}
      <div
        data-node="cta"
        use:editorNode={'hero_cta'}
        style="margin-top: var(--hero-cta-mt, 0px); margin-bottom: var(--hero-cta-mb, 0px); color: var(--hero-cta-color, inherit);"
        class={`flex flex-wrap items-center gap-3 mt-6 rounded-xl p-1.5 -ml-1.5 transition-all ${selectNode ? 'cursor-pointer' : ''} ${
          align === 'center' ? 'justify-center' : 'justify-start'
        } ${
          isCtaActive
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 bg-primary/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
      >
        {#if ctaText}
          {#if ctaVariant === 'tertiary'}
            <a
              href={effectivePrimaryLink}
              style="color: var(--theme-btn-tertiary-text, var(--btn-tertiary-text, var(--color-text-main))); font-family: var(--font-heading, inherit); font-size: var(--theme-text-body, var(--text-body-size, 16px)); font-weight: var(--theme-text-body-weight, var(--text-body-weight, 600));"
              class="inline-flex items-center justify-center gap-1.5 min-h-[44px] font-heading font-semibold text-sm no-underline hover:underline px-0 transition-colors"
            >
              <span>{stripEmoji(ctaText)}</span>
              <ArrowRight size={16} class="shrink-0" />
            </a>
          {:else if ctaVariant === 'secondary' || ctaVariant === 'outline'}
            <a
              href={effectivePrimaryLink}
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); color: var(--theme-btn-secondary-text, var(--btn-secondary-text, var(--color-text-main))); border: 1px solid var(--theme-btn-outline-border, var(--btn-outline-border, var(--color-border))); font-family: var(--font-heading, inherit); font-size: var(--theme-text-body, var(--text-body-size, 16px)); font-weight: var(--theme-text-body-weight, var(--text-body-weight, 600));"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px] px-6 font-heading font-semibold text-sm shadow-2xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <span>{stripEmoji(ctaText)}</span>
              <ArrowRight size={16} class="shrink-0" />
            </a>
          {:else}
            <a
              href={effectivePrimaryLink}
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--color-card-base, #ffffff)); border: none; font-family: var(--font-heading, inherit); font-size: var(--theme-text-body, var(--text-body-size, 16px)); font-weight: var(--theme-text-body-weight, var(--text-body-weight, 600));"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px] px-6 font-heading font-semibold text-sm shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>{stripEmoji(ctaText)}</span>
              <ArrowRight size={16} class="shrink-0" />
            </a>
          {/if}
        {/if}
        {#if secondaryCtaText}
          {#if secondaryCtaVariant === 'tertiary'}
            <a
              href={secondaryCtaLink || '#'}
              style="color: var(--theme-btn-tertiary-text, var(--btn-tertiary-text, var(--color-text-main))); font-family: var(--font-heading, inherit); font-size: var(--theme-text-body, var(--text-body-size, 16px)); font-weight: var(--theme-text-body-weight, var(--text-body-weight, 600));"
              class="inline-flex items-center justify-center gap-1.5 min-h-[44px] font-heading font-semibold text-sm no-underline hover:underline px-0 transition-colors"
            >
              <span>{stripEmoji(secondaryCtaText)}</span>
            </a>
          {:else}
            <a
              href={secondaryCtaLink || '#'}
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); color: var(--theme-btn-secondary-text, var(--btn-secondary-text, var(--color-text-main))); border: 1px solid var(--theme-btn-outline-border, var(--btn-outline-border, var(--color-border))); font-family: var(--font-heading, inherit); font-size: var(--theme-text-body, var(--text-body-size, 16px)); font-weight: var(--theme-text-body-weight, var(--text-body-weight, 600));"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px] px-5 font-heading font-semibold text-sm shadow-2xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <span>{stripEmoji(secondaryCtaText)}</span>
            </a>
          {/if}
        {/if}
      </div>
    {:else if customBlocks[slot]}
      {@render customBlocks[slot]()}
    {/if}
  {/each}
</div>
