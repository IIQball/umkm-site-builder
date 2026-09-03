<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';

  export let badgeText: string = 'Ringkasan Keunggulan';
  export let title: string = 'Semua Kebaikan Dalam Satu Kemasan';
  export let subtitle: string = 'Ringkasan keunggulan formula herbal alami kami untuk kesehatan harian.';
  export let items: FeatureItem[] = [];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;

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
    maxWidthClass="max-w-xl"
  />

  <div class="features-matrix-container text-left">
    {#each items as item, index (`${item.id || 'dm'}-${index}`)}
      {@const isActiveNode = activeNodeId === `feature_item_${index}`}
      <div
        data-node="feature_card"
        role="button"
        tabindex="0"
        on:click={(e) => handleItemClick(e, index)}
        on:keydown={(e) => handleItemKeydown(e, index)}
        class={`p-4 sm:p-5 rounded-2xl border bg-[var(--color-card-base,#ffffff)] flex items-start gap-3.5 shadow-xs transition-all duration-150 cursor-pointer ${
          isActiveNode
            ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
            : 'border-[var(--color-border,rgba(15,23,42,0.08))] hover:border-blue-400/80 hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
        }`}
      >
        <div
          data-node="feature_icon"
          class="w-11 h-11 rounded-xl bg-[var(--color-primary,#2563eb)]/10 text-[var(--color-primary,#2563eb)] flex items-center justify-center shrink-0 border border-[var(--color-primary,#2563eb)]/20 mt-0.5"
        >
          <svelte:component this={resolveFeatureIcon(item.icon || item.iconName)} size={20} />
        </div>
        <div class="min-w-0 flex-1">
          <h3 data-node="feature_title" class="text-heading-md font-heading font-semibold text-[var(--color-text-main,#0f172a)] text-sm sm:text-base leading-snug">
            {item.title}
          </h3>
          {#if item.description}
            <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary,#334155)] leading-relaxed mt-1 font-sans">
              {item.description}
            </p>
          {/if}
        </div>
      </div>
    {/each}
  </div>
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
