<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';
  import { resolveFeatureItemStyle } from './featureStyles.helpers';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';

  export let badgeText: string = 'Keunggulan Layanan Kami';
  export let title: string = 'Kenapa Memilih Produk UMKM Kami?';
  export let subtitle: string = 'Kami memadukan bahan baku lokal pilihan dengan proses produksi higienis bersertifikasi resmi.';
  export let items: FeatureItem[] = [];
  export let isActive: boolean = false;
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;
  export let onReorder: ((items: FeatureItem[]) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'feature_cards'];
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: hasHeader = elementOrder.some((s) => ['badge', 'title', 'subtitle'].includes(s));
  $: hasCards = elementOrder.includes('feature_cards') || elementOrder.includes('features_grid');
  $: isCardsFirst = (elementOrder.indexOf('feature_cards') === 0) || (elementOrder.indexOf('features_grid') === 0);

  let draggedIdx: number | null = null;
  let dropTargetIdx: number | null = null;

  const onDragStart = (e: DragEvent, index: number) => {
    if (!isActive) return;
    draggedIdx = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
    }
  };

  const onDragOver = (e: DragEvent, index: number) => {
    if (draggedIdx === null || draggedIdx === index) return;
    e.preventDefault();
    dropTargetIdx = index;
  };

  const onDrop = (e: DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      draggedIdx = null;
      dropTargetIdx = null;
      return;
    }

    const list = [...items];
    const [moved] = list.splice(draggedIdx, 1);
    list.splice(targetIdx, 0, moved);
    if (onReorder) onReorder(list);

    draggedIdx = null;
    dropTargetIdx = null;
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

<div class="text-center py-12 flex flex-col">
  {#if hasHeader}
    <div style="order: {isCardsFirst ? 2 : 1};">
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

  {#if hasCards}
    <div class="features-grid-3-container text-left" data-node="feature_cards" data-node-id="feature_cards" style="order: {isCardsFirst ? 1 : 2};">
      {#each items as item, index (item.id || item.title + index)}
        {@const isItemActive = activeNodeId === `feature_item_${index}`}
        {@const itemStyle = resolveFeatureItemStyle(item, index, nodeStyles)}
        <div
          data-node="feature_card"
          role="button"
          tabindex="0"
          draggable={isActive}
          on:click={(e) => handleItemClick(e, index)}
          on:keydown={(e) => handleItemKeydown(e, index)}
          on:dragstart={(e) => onDragStart(e, index)}
          on:dragover={(e) => onDragOver(e, index)}
          on:dragleave={() => (dropTargetIdx = null)}
          on:drop={(e) => onDrop(e, index)}
          class={`p-6 bg-[var(--color-card-base)] border transition-all duration-150 space-y-3 shadow-xs cursor-pointer ${
            isItemActive
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2'
              : isActive
                ? 'cursor-grab active:cursor-grabbing hover:border-[var(--color-primary)]'
                : 'hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
          } ${
            dropTargetIdx === index
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 shadow-lg'
              : 'border-[var(--color-border)]'
          } ${draggedIdx === index ? 'opacity-30' : ''}`}
          style="border-radius: var(--btn-radius, 16px);"
        >
          <div class="flex items-center justify-between gap-2">
            <div
              data-node="feature_icon"
              class="w-12 h-12 flex items-center justify-center border shrink-0"
              style="background-color: color-mix(in srgb, var(--color-primary) 12%, transparent); border-color: color-mix(in srgb, var(--color-primary) 20%, transparent); color: var(--color-primary); border-radius: calc(var(--btn-radius, 16px) * 0.75);"
            >
              <svelte:component this={resolveFeatureIcon(item.icon || item.iconName)} size={22} />
            </div>
            {#if item.badge}
              <span class="inline-block px-2.5 py-0.5 rounded-full text-2xs font-heading font-medium" style="background-color: color-mix(in srgb, var(--color-primary) 12%, transparent); color: var(--color-primary);">
                {item.badge}
              </span>
            {/if}
          </div>
          <h3 data-node="feature_title" class="feature-item-title font-heading text-[var(--color-text-main)]" style={itemStyle.color ? `color: ${itemStyle.color} !important;` : ''}>
            {item.title}
          </h3>
          <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
            {item.description}
          </p>
          {#if item.statLabel || item.linkUrl}
            <div class="pt-1">
              <span class="text-xs font-heading font-semibold text-[var(--color-primary)] inline-flex items-center gap-1">
                {item.statLabel || 'Pelajari Lebih Lanjut →'}
              </span>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .features-grid-3-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  @container featurecard (min-width: 640px) {
    .features-grid-3-container {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 20px !important;
    }
  }

  @container featurecard (min-width: 960px) {
    .features-grid-3-container {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 24px !important;
    }
  }
</style>
