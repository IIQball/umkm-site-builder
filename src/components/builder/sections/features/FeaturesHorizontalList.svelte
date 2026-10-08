<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';
  import { resolveFeatureItemStyle } from './featureStyles.helpers';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';
  import { isFeaturesVisualOnLeft } from './featuresLayout.helpers';

  export let badgeText: string = 'Standar Kualitas';
  export let title: string = 'Komitmen Terbaik di Setiap Pesanan';
  export let subtitle: string = 'Kami memastikan setiap tahapan dari kebun hingga ke tangan Anda melewati proses kurasi ketat.';
  export let items: FeatureItem[] = [];
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'feature_rows'];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: isListOnLeft = isFeaturesVisualOnLeft('horizontal_list', elementOrder, false);
  $: hasHeader = elementOrder.some((s) => ['badge', 'title', 'subtitle'].includes(s));
  $: hasRows = elementOrder.includes('feature_rows') || elementOrder.includes('features_grid');

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
  <div class="asym-split-container {isListOnLeft ? 'split-reversed' : ''}">
    <!-- Kolom Sticky Header -->
    {#if hasHeader}
      <div class="asym-sticky-left self-start" style="order: {isListOnLeft ? 2 : 1};">
        <FeaturesHeaderTitle
          {badgeText}
          {title}
          {subtitle}
          {activeNodeId}
          {selectNode}
          {elementOrder}
          {nodeStyles}
          align="left"
          maxWidthClass="max-w-none"
        />
      </div>
    {/if}

    <!-- Kolom List -->
    {#if hasRows}
      <div class="space-y-4 text-left" data-node="feature_rows" data-node-id="feature_rows" style="order: {isListOnLeft ? 1 : 2};">
        {#each items as item, index (item.id || item.title + index)}
          {@const isItemActive = activeNodeId === `feature_item_${index}`}
          {@const itemStyle = resolveFeatureItemStyle(item, index, nodeStyles)}
          <div
            data-node="feature_card"
            role="button"
            tabindex="0"
            on:click={(e) => handleItemClick(e, index)}
            on:keydown={(e) => handleItemKeydown(e, index)}
            class={`bg-[var(--color-card-base)] p-6 border border-[var(--color-border)] transition-all duration-150 flex items-start gap-4 shadow-xs cursor-pointer ${
              isItemActive
                ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2'
                : 'hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
            }`}
            style="border-radius: var(--btn-radius, 16px);"
          >
            <div
              data-node="feature_icon"
              class="w-12 h-12 flex items-center justify-center border shrink-0"
              style="background-color: color-mix(in srgb, var(--color-primary) 12%, transparent); border-color: color-mix(in srgb, var(--color-primary) 20%, transparent); color: var(--color-primary); border-radius: calc(var(--btn-radius, 16px) * 0.75);"
            >
              <svelte:component this={resolveFeatureIcon(item.icon || item.iconName)} size={22} />
            </div>
            <div class="flex-1 min-w-0">
              {#if item.badge}
                <span class="inline-block px-2 py-0.5 rounded-full text-2xs font-heading font-medium mb-1" style="background-color: color-mix(in srgb, var(--color-primary) 12%, transparent); color: var(--color-primary);">
                  {item.badge}
                </span>
              {/if}
              <h3 data-node="feature_title" class="feature-item-title font-heading text-[var(--color-text-main)] mb-1" style={itemStyle.color ? `color: ${itemStyle.color} !important;` : ''}>
                {item.title}
              </h3>
              <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
                {item.description}
              </p>
              {#if item.statLabel || item.linkUrl}
                <span class="text-xs font-heading font-semibold text-[var(--color-primary)] inline-flex items-center gap-1 mt-1.5">
                  {item.statLabel || 'Cek Detail →'}
                </span>
              {/if}
            </div>
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
