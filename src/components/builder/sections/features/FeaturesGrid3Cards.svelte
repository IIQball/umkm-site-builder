<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';

  export let badgeText: string = 'Keunggulan Layanan Kami';
  export let title: string = 'Kenapa Memilih Produk UMKM Kami?';
  export let subtitle: string = 'Kami memadukan bahan baku lokal pilihan dengan proses produksi higienis bersertifikasi resmi.';
  export let items: FeatureItem[] = [];
  export let isActive: boolean = false;
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;
  export let onReorder: ((items: FeatureItem[]) => void) | undefined = undefined;

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

<div class="text-center py-12">
  <FeaturesHeaderTitle
    {badgeText}
    {title}
    {subtitle}
    {activeNodeId}
    {selectNode}
    maxWidthClass="max-w-2xl"
  />

  <div class="features-grid-3-container text-left">
    {#each items as item, index (item.id || item.title + index)}
      {@const isItemActive = activeNodeId === `feature_item_${index}`}
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
        class={`p-6 rounded-2xl bg-[var(--color-card-base,#ffffff)] border transition-all duration-150 space-y-3 shadow-xs cursor-pointer ${
          isItemActive
            ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
            : isActive
              ? 'cursor-grab active:cursor-grabbing hover:border-blue-400'
              : 'hover:border-blue-400/80 hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
        } ${
          dropTargetIdx === index
            ? 'border-blue-500 ring-2 ring-blue-400/40 shadow-lg'
            : 'border-[var(--color-border,rgba(15,23,42,0.08))]'
        } ${draggedIdx === index ? 'opacity-30' : ''}`}
      >
        <div
          data-node="feature_icon"
          class="w-12 h-12 rounded-xl bg-[var(--color-primary,#2563eb)]/10 text-[var(--color-primary,#2563eb)] flex items-center justify-center border border-[var(--color-primary,#2563eb)]/20 shrink-0"
        >
          <svelte:component this={resolveFeatureIcon(item.icon || item.iconName)} size={22} />
        </div>
        <h3 data-node="feature_title" class="text-heading-md font-heading font-semibold text-[var(--color-text-main,#0f172a)]">
          {item.title}
        </h3>
        <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary,#334155)] leading-relaxed font-sans">
          {item.description}
        </p>
      </div>
    {/each}
  </div>
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
