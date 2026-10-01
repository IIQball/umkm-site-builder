<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';
  import { resolveFeatureItemStyle } from './featureStyles.helpers';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';
  import { isFeaturesVisualOnLeft } from './featuresLayout.helpers';

  export let badgeText: string = 'Proses Produksi';
  export let title: string = '';
  export let subtitle: string = '';
  export let items: FeatureItem[] = [];
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'zigzag_items'];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: hasHeader = elementOrder.some((s) => ['badge', 'title', 'subtitle'].includes(s));
  $: hasZigzag = elementOrder.includes('zigzag_items') || elementOrder.includes('features_grid');
  $: isZigzagFirst = (elementOrder.indexOf('zigzag_items') === 0) || (elementOrder.indexOf('features_grid') === 0);
  $: isReversedOrientation = isFeaturesVisualOnLeft('alternating_zigzag_rows', elementOrder, false);

  const handleItemClick = (e: MouseEvent, index: number) => {
    if (selectNode) selectNode(e, `feature_item_${index}`);
  };

  const handleItemKeydown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, `feature_item_${index}`);
    }
  };

  const handleImageClick = (e: MouseEvent, index: number) => {
    if (selectNode) selectNode(e, `feature_item_${index}`);
  };

  const handleImageKeydown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      if (selectNode) selectNode(e, `feature_item_${index}`);
    }
  };
</script>

<div class="py-12 flex flex-col space-y-12">
  {#if hasHeader}
    <div style="order: {isZigzagFirst ? 2 : 1};">
      <FeaturesHeaderTitle
        {badgeText}
        {title}
        {subtitle}
        {activeNodeId}
        {selectNode}
        {elementOrder}
        {nodeStyles}
        maxWidthClass="max-w-2xl"
      />
    </div>
  {/if}

  {#if hasZigzag}
    <div class="space-y-12" data-node="zigzag_items" data-node-id="zigzag_items" style="order: {isZigzagFirst ? 1 : 2};">
      {#each items as item, index (item.id || item.title + index)}
        {@const isEven = (index % 2 === 1) !== isReversedOrientation}
        {@const isItemActive = activeNodeId === `feature_item_${index}`}
        {@const itemStyle = resolveFeatureItemStyle(item, index, nodeStyles)}
        <div
          data-node="feature_card"
          role="button"
          tabindex="0"
          on:click={(e) => handleItemClick(e, index)}
          on:keydown={(e) => handleItemKeydown(e, index)}
          class={`zigzag-item p-4 transition-all duration-150 cursor-pointer ${isEven ? 'zigzag-reverse' : ''} ${
            isItemActive
              ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 bg-[var(--color-primary)]/10'
              : 'hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
          }`}
          style="border-radius: var(--btn-radius, 16px);"
        >
          <div class="text-left space-y-3">
            <div class="flex items-center gap-2.5">
              <div
                data-node="feature_icon"
                class="w-10 h-10 flex items-center justify-center shrink-0 border"
                style="background-color: color-mix(in srgb, var(--color-primary) 12%, transparent); border-color: color-mix(in srgb, var(--color-primary) 20%, transparent); color: var(--color-primary); border-radius: calc(var(--btn-radius, 16px) * 0.75);"
              >
                <svelte:component this={resolveFeatureIcon(item.icon || item.iconName)} size={20} />
              </div>
              <span
                class="text-xs font-heading font-bold uppercase tracking-wider"
                style="color: {isEven ? 'var(--color-secondary)' : 'var(--color-primary)'};"
              >
                {item.badge || `Langkah 0${index + 1}`}
              </span>
            </div>
            <h3 data-node="feature_title" class="feature-item-title font-heading text-[var(--color-text-main)]" style={itemStyle.color ? `color: ${itemStyle.color} !important;` : ''}>
              {item.title}
            </h3>
            <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
              {item.description}
            </p>
            {#if item.statLabel || item.linkUrl}
              <div class="pt-1">
                <a
                  href={item.linkUrl || '#'}
                  class="px-4 py-2 text-xs font-heading font-semibold shadow-xs inline-flex items-center justify-center transition-all"
                  style="background-color: var(--btn-primary-bg, var(--color-primary)); color: var(--theme-btn-primary-text, #ffffff); border-radius: var(--btn-radius, 16px);"
                >
                  {item.statLabel || 'Lihat Detail'}
                </a>
              </div>
            {/if}
          </div>
          <div
            role="button"
            tabindex="0"
            on:click|stopPropagation={(e) => handleImageClick(e, index)}
            on:keydown={(e) => handleImageKeydown(e, index)}
            class="w-full aspect-[4/3] overflow-hidden shadow-md bg-[var(--color-nested-base)]"
            style="border-radius: var(--btn-radius, 16px);"
          >
            <img
              src={item.imageUrl || (isEven ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80')}
              alt={item.title}
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .zigzag-item {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  @container featurecard (min-width: 640px) {
    .zigzag-item {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      align-items: center;
      gap: 32px !important;
    }
    .zigzag-reverse {
      direction: rtl;
    }
    .zigzag-reverse > div {
      direction: ltr;
    }
  }

  @container featurecard (min-width: 960px) {
    .zigzag-item {
      gap: 40px !important;
    }
  }
</style>
