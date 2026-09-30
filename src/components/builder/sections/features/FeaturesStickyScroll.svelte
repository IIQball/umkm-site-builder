<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';
  import { isFeaturesVisualOnLeft } from './featuresLayout.helpers';

  export let badgeText: string = 'Nilai Tambah Kami';
  export let title: string = 'Pelayanan Nyaman Dari Awal Hingga Selesai';
  export let subtitle: string = 'Kami tidak sekadar menjual barang, melainkan memberikan pengalaman belanja yang transparan dan amanah.';
  export let items: FeatureItem[] = [];
  export let ctaText: string = 'Hubungi Kami Langsung';
  export let ctaLink: string = '#';
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'scroll_cards'];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;

  $: isHeadingActive = activeNodeId === 'features_heading' || activeNodeId === 'header';
  $: isCardsOnLeft = isFeaturesVisualOnLeft('sticky_scroll_highlight', elementOrder, false);
  $: stickySlots = elementOrder.filter((s) => ['badge', 'title', 'subtitle', 'cta'].includes(s));
  $: hasScrollCards = elementOrder.includes('scroll_cards') || elementOrder.includes('features_grid');

  const handleHeadingClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'features_heading');
  };

  const handleHeadingKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'features_heading');
    }
  };

  const handleItemClick = (e: MouseEvent, index: number) => {
    if (selectNode) selectNode(e, `feature_item_${index}`);
  };

  const handleItemKeydown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, `feature_item_${index}`);
    }
  };
</script>

<div class="py-12">
  <div class="asym-split-container {isCardsOnLeft ? 'split-reversed' : ''}">
    <!-- Sticky Heading Kolom -->
    {#if stickySlots.length > 0}
      <div
        role="button"
        tabindex="0"
        on:click={handleHeadingClick}
        on:keydown={handleHeadingKeydown}
        class={`text-left asym-sticky-left self-start p-3 rounded-2xl transition-all cursor-pointer ${
          isHeadingActive
            ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 bg-[var(--color-primary)]/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
        }`}
        style="order: {isCardsOnLeft ? 2 : 1};"
      >
        {#each stickySlots as slot}
          {#if slot === 'badge' && badgeText}
            <span
              data-node="badge"
              class="inline-flex items-center rounded-full border px-2.5 py-1 text-2xs gap-1.5 font-heading font-medium mb-4 shadow-2xs"
              style="background-color: color-mix(in srgb, var(--color-primary) 10%, transparent); border-color: color-mix(in srgb, var(--color-primary) 25%, transparent); color: var(--color-primary);"
            >
              <span class="w-1.5 h-1.5 rounded-full" style="background-color: var(--color-primary);"></span>
              {badgeText}
            </span>
          {:else if slot === 'title' && title}
            <h2 data-node="title" class="title-heading font-heading font-black text-[var(--color-text-main)] tracking-tight mb-4">
              {title}
            </h2>
          {:else if slot === 'subtitle' && subtitle}
            <p data-node="subtitle" class="text-body-base text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
              {subtitle}
            </p>
          {:else if slot === 'cta' && ctaText}
            <div class="mb-4">
              <a
                href={ctaLink || '#'}
                class="px-4 py-2 text-xs font-heading font-semibold shadow-xs inline-flex items-center justify-center transition-all"
                style="border-radius: var(--btn-radius, 16px); background-color: var(--btn-primary-bg, var(--color-primary)); color: var(--theme-btn-primary-text, #ffffff);"
              >
                {ctaText}
              </a>
            </div>
          {/if}
        {/each}
      </div>
    {/if}

    <!-- Kartu Bertumpuk Kolom -->
    {#if hasScrollCards}
      <div data-node="scroll_cards" data-node-id="scroll_cards" class="space-y-4 text-left" style="order: {isCardsOnLeft ? 1 : 2};">
        {#each items as item, idx (item.id || item.title + idx)}
          {@const isItemActive = activeNodeId === `feature_item_${idx}`}
          <div
            data-node="feature_card"
            role="button"
            tabindex="0"
            on:click={(e) => handleItemClick(e, idx)}
            on:keydown={(e) => handleItemKeydown(e, idx)}
            class={`bg-[var(--color-card-base)] p-6 shadow-xs border border-[var(--color-border)] transition-all duration-150 cursor-pointer ${
              isItemActive
                ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2'
                : 'hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
            }`}
            style="border-radius: var(--btn-radius, 16px);"
          >
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-mono font-bold text-[var(--color-primary)]">
                {item.badge || `0${idx + 1} / BENEFIT`}
              </span>
              <div
                data-node="feature_icon"
                class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                style="background-color: color-mix(in srgb, var(--color-primary) 12%, transparent); border-color: color-mix(in srgb, var(--color-primary) 20%, transparent); color: var(--color-primary);"
              >
                <svelte:component this={resolveFeatureIcon(item.icon || item.iconName)} size={16} />
              </div>
            </div>
            <h3 data-node="feature_title" class="feature-item-title font-heading text-[var(--color-text-main)] mb-2">
              {item.title}
            </h3>
            <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
              {item.description}
            </p>
            {#if item.statLabel || item.linkUrl}
              <div class="mt-3">
                <span class="text-xs font-heading font-semibold text-[var(--color-primary)] inline-flex items-center gap-1">
                  {item.statLabel || 'Cek Selengkapnya →'}
                </span>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .asym-split-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
  }

  .asym-sticky-left {
    position: static;
  }

  @container featurecard (min-width: 640px) {
    .asym-split-container {
      display: grid !important;
      grid-template-columns: 4fr 8fr !important;
      gap: 32px !important;
    }
    .asym-split-container.split-reversed {
      grid-template-columns: 8fr 4fr !important;
    }
    .asym-sticky-left {
      position: sticky;
      top: 2rem;
    }
  }

  @container featurecard (min-width: 960px) {
    .asym-split-container {
      gap: 40px !important;
    }
  }
</style>
