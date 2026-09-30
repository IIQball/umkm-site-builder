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
</script>

<div class={`flex flex-col gap-4 ${align === 'center' ? 'items-center text-center max-w-3xl mx-auto' : 'items-start text-left'}`}>
  {#each effectiveOrder as slot (slot)}
    {#if slot === 'badge' && badgeText}
      <div
        data-node="badge"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_badge')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_badge')}
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 9999px)); font-family: var(--font-heading, inherit);"
        class={`badge badge-outline gap-1.5 px-3 py-1 text-2xs font-heading font-medium border transition-all cursor-pointer shadow-2xs ${
          isBadgeActive
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 bg-primary/15'
            : 'bg-[var(--color-nested-base)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
      >
        {#if badgeIcon}
          <svelte:component this={resolveFeatureIcon(badgeIcon)} size={12} class="text-[var(--color-primary)] shrink-0" />
        {:else}
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: var(--color-primary);"></span>
        {/if}
        <span>{stripEmoji(badgeText)}</span>
      </div>
    {:else if slot === 'title'}
      <svelte:element
        this={tagName || 'h1'}
        data-node="title"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_title')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_title')}
        style="font-size: var(--text-h1-size, inherit); font-weight: var(--text-h1-weight, inherit); color: var(--color-text-main); font-family: var(--font-heading, inherit);"
        class={`text-heading-xl font-heading font-extrabold tracking-tight leading-tight transition-all cursor-pointer rounded-xl p-1.5 -ml-1.5 block w-full ${
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
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_subtitle')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_subtitle')}
        style="font-size: var(--text-body-size, inherit); font-weight: var(--text-body-weight, inherit); color: var(--color-text-secondary); font-family: var(--font-body, var(--font-sans, inherit));"
        class={`text-body-base leading-relaxed font-sans transition-all cursor-pointer rounded-xl p-1.5 -ml-1.5 w-full ${
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
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_cta')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_cta')}
        class={`flex flex-wrap items-center gap-3 pt-2 rounded-xl p-1.5 -ml-1.5 transition-all cursor-pointer ${
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
              style="color: var(--theme-btn-tertiary-text, var(--btn-tertiary-text, var(--color-text-main))); font-family: var(--font-heading, inherit);"
              class="btn btn-link btn-sm font-heading font-semibold text-sm no-underline hover:underline px-0"
            >
              <span>{stripEmoji(ctaText)}</span>
              <ArrowRight size={15} class="ml-1.5" />
            </a>
          {:else if ctaVariant === 'secondary' || ctaVariant === 'outline'}
            <a
              href={effectivePrimaryLink}
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); color: var(--theme-btn-secondary-text, var(--btn-secondary-text, var(--color-text-main))); border: 1px solid var(--theme-btn-outline-border, var(--btn-outline-border, var(--color-border))); font-family: var(--font-heading, inherit);"
              class="btn btn-outline btn-sm font-heading font-semibold text-sm px-6 shadow-2xs"
            >
              <span>{stripEmoji(ctaText)}</span>
              <ArrowRight size={15} class="ml-1.5" />
            </a>
          {:else}
            <a
              href={effectivePrimaryLink}
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, currentColor); border: none; font-family: var(--font-heading, inherit);"
              class="btn btn-primary btn-sm font-heading font-semibold text-sm px-6 shadow-xs"
            >
              <span>{stripEmoji(ctaText)}</span>
              <ArrowRight size={15} class="ml-1.5" />
            </a>
          {/if}
        {/if}
        {#if secondaryCtaText}
          {#if secondaryCtaVariant === 'tertiary'}
            <a
              href={secondaryCtaLink || '#'}
              style="color: var(--theme-btn-tertiary-text, var(--btn-tertiary-text, var(--color-text-main))); font-family: var(--font-heading, inherit);"
              class="btn btn-link btn-sm font-heading font-semibold text-sm no-underline hover:underline px-0"
            >
              <span>{stripEmoji(secondaryCtaText)}</span>
            </a>
          {:else}
            <a
              href={secondaryCtaLink || '#'}
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); color: var(--theme-btn-secondary-text, var(--btn-secondary-text, var(--color-text-main))); border: 1px solid var(--theme-btn-outline-border, var(--btn-outline-border, var(--color-border))); font-family: var(--font-heading, inherit);"
              class="btn btn-outline btn-sm font-heading font-semibold text-sm px-5 shadow-2xs"
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
