<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';

  export let badgeText: string = 'Ringkasan Keunggulan';
  export let title: string = 'Semua Kebaikan Dalam Satu Kemasan';
  export let subtitle: string = 'Ringkasan keunggulan formula herbal alami kami untuk kesehatan harian.';
  export let items: FeatureItem[] = [];
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'icon_matrix'];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;

  $: hasHeader = elementOrder.some((s) => ['badge', 'title', 'subtitle'].includes(s));
  $: hasMatrix = elementOrder.includes('icon_matrix') || elementOrder.includes('features_grid');
  $: isMatrixFirst = (elementOrder.indexOf('icon_matrix') === 0) || (elementOrder.indexOf('features_grid') === 0);

  const handleItemClick = (e: MouseEvent, index: number) => {
    if (selectNode) selectNode(e, `feature_item_${index}`);
  };

  const handleItemKeydown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, `feature_item_${index}`);
    }
  };
</script>

<div class="text-center py-12 flex flex-col">
  {#if hasHeader}
    <div style="order: {isMatrixFirst ? 2 : 1};">
      <FeaturesHeaderTitle
        {badgeText}
        {title}
        {subtitle}
        {activeNodeId}
        {selectNode}
        {elementOrder}
        maxWidthClass="max-w-xl"
      />
    </div>
  {/if}

  {#if hasMatrix}
    <div class="features-matrix-container text-left" style="order: {isMatrixFirst ? 1 : 2};">
    {#each items as item, index (`${item.id || 'dm'}-${index}`)}
      {@const isActiveNode = activeNodeId === `feature_item_${index}`}
      <div
        data-node="feature_card"
        role="button"
        tabindex="0"
        on:click={(e) => handleItemClick(e, index)}
        on:keydown={(e) => handleItemKeydown(e, index)}
        class={`p-4 sm:p-5 border bg-[var(--color-card-base)] flex items-start gap-3.5 shadow-xs transition-all duration-150 cursor-pointer ${
          isActiveNode
            ? 'border-[var(--color-primary)] ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
        style="border-radius: var(--btn-radius, 16px);"
      >
        <div
          data-node="feature_icon"
          class="w-11 h-11 flex items-center justify-center shrink-0 border mt-0.5"
          style="background-color: color-mix(in srgb, var(--color-primary) 12%, transparent); border-color: color-mix(in srgb, var(--color-primary) 20%, transparent); color: var(--color-primary); border-radius: calc(var(--btn-radius, 16px) * 0.75);"
        >
          <svelte:component this={resolveFeatureIcon(item.icon || item.iconName)} size={20} />
        </div>
        <div class="min-w-0 flex-1">
          <h3 data-node="feature_title" class="text-heading-md font-heading font-semibold text-[var(--color-text-main)] text-sm sm:text-base leading-snug">
            {item.title}
          </h3>
          {#if item.description}
            <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] leading-relaxed mt-1 font-sans">
              {item.description}
            </p>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  {/if}
</div>

<style>
  .features-matrix-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    width: 100%;
  }

  @container featurecard (min-width: 640px) {
    .features-matrix-container {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 16px !important;
    }
  }

  @container featurecard (min-width: 960px) {
    .features-matrix-container {
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      gap: 20px !important;
    }
  }
</style>
