<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';
  import { resolveFeatureItemStyle } from './featureStyles.helpers';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let badgeText: string = 'Ringkasan Keunggulan';
  export let title: string = 'Semua Kebaikan Dalam Satu Kemasan';
  export let subtitle: string = 'Ringkasan keunggulan formula herbal alami kami untuk kesehatan harian.';
  export let items: FeatureItem[] = [];
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'icon_matrix'];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: isMobile = $canvasStore?.viewMode === 'mobile';
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
        {nodeStyles}
        maxWidthClass="max-w-xl"
      />
    </div>
  {/if}

  {#if hasMatrix}
    <div class="features-matrix-container text-left {isMobile ? 'is-canvas-mobile' : ''}" data-node="icon_matrix" data-node-id="icon_matrix" style="order: {isMatrixFirst ? 1 : 2};">
    {#each items as item, index (`${item.id || 'dm'}-${index}`)}
      {@const isActiveNode = activeNodeId === `feature_item_${index}`}
      {@const itemStyle = resolveFeatureItemStyle(item, index, nodeStyles)}
      <div
        data-node="feature_card"
        role="button"
        tabindex="0"
        on:click={(e) => handleItemClick(e, index)}
        on:keydown={(e) => handleItemKeydown(e, index)}
        class={`p-4 sm:p-5 border bg-[var(--color-card-base)] flex items-start gap-3.5 shadow-xs transition-all duration-150 cursor-pointer ${
          isActiveNode
            ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2'
            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
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
          <div class="flex items-center gap-1.5 flex-wrap mb-0.5">
            <h3 data-node="feature_title" class="feature-item-title-compact font-heading text-[var(--color-text-main)] leading-snug" style={itemStyle.color ? `color: ${itemStyle.color} !important;` : ''}>
              {item.title}
            </h3>
            {#if item.badge}
              <span class="inline-block px-1.5 py-0.5 rounded text-xs font-heading font-medium" style="background-color: color-mix(in srgb, var(--color-primary) 15%, transparent); color: var(--color-primary);">
                {item.badge}
              </span>
            {/if}
          </div>
          {#if item.description}
            <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] leading-relaxed mt-1 font-sans">
              {item.description}
            </p>
          {/if}
          {#if item.statLabel || item.linkUrl}
            <span class="text-xs font-heading font-semibold text-[var(--color-primary)] block mt-1.5">
              {item.statLabel || 'Cek Detail →'}
            </span>
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
    grid-template-columns: 1fr;
    gap: 12px;
    width: 100%;
  }

  .features-matrix-container.is-canvas-mobile {
    grid-template-columns: 1fr !important;
  }

  @container featurecard (min-width: 540px) {
    .features-matrix-container:not(.is-canvas-mobile) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
  }

  @container featurecard (min-width: 768px) {
    .features-matrix-container:not(.is-canvas-mobile) {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 16px !important;
    }
  }

  @container featurecard (min-width: 1024px) {
    .features-matrix-container:not(.is-canvas-mobile) {
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      gap: 20px !important;
    }
  }
</style>
