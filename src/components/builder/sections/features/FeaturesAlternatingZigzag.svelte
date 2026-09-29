<script lang="ts">
  import type { FeatureItem } from '@/types';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';
  import { isFeaturesVisualOnLeft } from './featuresLayout.helpers';

  export let badgeText: string = 'Proses Produksi';
  export let title: string = '';
  export let subtitle: string = '';
  export let items: FeatureItem[] = [];
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'zigzag_items'];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;

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
        maxWidthClass="max-w-2xl"
      />
    </div>
  {/if}

  {#if hasZigzag}
    <div class="space-y-12" style="order: {isZigzagFirst ? 1 : 2};">
      {#each items as item, index (item.id || item.title + index)}
    {@const isEven = (index % 2 === 1) !== isReversedOrientation}
    {@const isItemActive = activeNodeId === `feature_item_${index}`}
    <div
      data-node="feature_card"
      role="button"
      tabindex="0"
      on:click={(e) => handleItemClick(e, index)}
      on:keydown={(e) => handleItemKeydown(e, index)}
      class={`zigzag-item p-4 transition-all duration-150 cursor-pointer ${isEven ? 'zigzag-reverse' : ''} ${
        isItemActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 bg-[var(--color-primary)]/10'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
      style="border-radius: var(--btn-radius, 16px);"
    >
      <div class="text-left">
        <span
          class="text-xs font-heading font-bold uppercase tracking-wider block mb-2"
          style="color: {isEven ? 'var(--color-secondary)' : 'var(--color-primary)'};"
        >
          {item.badge || `Langkah 0${index + 1}`}
        </span>
        <h3 data-node="feature_title" class="text-heading-md font-heading font-black text-[var(--color-text-main)] mb-3">
          {item.title}
        </h3>
        <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
          {item.description}
        </p>
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

  .title-heading {
    font-size: 1.625rem;
    line-height: 2rem;
  }

  @container featurecard (min-width: 640px) {
    .title-heading {
      font-size: 2.125rem;
      line-height: 2.5rem;
    }
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
    .title-heading {
      font-size: 2.5rem;
      line-height: 2.875rem;
    }
    .zigzag-item {
      gap: 40px !important;
    }
  }
</style>
