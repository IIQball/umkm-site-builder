<script lang="ts">
  import type { FeatureItem } from '@/types';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';
  import { isFeaturesVisualOnLeft } from './featuresLayout.helpers';

  export let badgeText: string = 'Varian Unggulan';
  export let title: string = 'Eksplorasi Varian Rasa Favorit';
  export let subtitle: string = 'Pilih varian untuk melihat detail rasa, keunggulan, dan bahan baku.';
  export let items: FeatureItem[] = [];
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'tab_nav', 'tab_card', 'image'];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;

  let activeTabIdx = 0;
  $: activeItem = items[activeTabIdx] || items[0] || {
    badge: 'Best Seller Sepanjang Masa',
    title: 'Original Savory Butter',
    description: 'Dibuat dengan taburan garam laut murni Kusamba dan mentega gurih tanpa penyedap buatan. Cocok untuk semua umur.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    statLabel: 'Pesan Varian Ini',
  };

  $: isImageActive = activeNodeId === 'features_image' || activeNodeId === 'image';
  $: isItemActive = activeNodeId === `feature_item_${activeTabIdx}`;

  $: hasHeader = elementOrder.some((s) => ['badge', 'title', 'subtitle'].includes(s));
  $: hasTabNav = elementOrder.includes('tab_nav') || elementOrder.includes('features_grid');
  $: hasTabCard = elementOrder.includes('tab_card') || elementOrder.includes('features_grid');
  $: hasImage = elementOrder.includes('image');
  $: isImageOnLeft = isFeaturesVisualOnLeft('interactive_tabs', elementOrder, false);
  $: isTabNavAfter = elementOrder.indexOf('tab_nav') !== -1 && elementOrder.indexOf('tab_card') !== -1 && elementOrder.indexOf('tab_nav') > elementOrder.indexOf('tab_card');

  const handleTabClick = (e: MouseEvent, idx: number) => {
    activeTabIdx = idx;
    if (selectNode) selectNode(e, `feature_item_${idx}`);
  };

  const handleImageClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'features_image');
  };

  const handleImageKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'features_image');
    }
  };

  const handleActiveItemClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, `feature_item_${activeTabIdx}`);
  };

  const handleActiveItemKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, `feature_item_${activeTabIdx}`);
    }
  };
</script>

<div class="text-center py-12">
  {#if hasHeader}
    <FeaturesHeaderTitle
      {badgeText}
      {title}
      {subtitle}
      {activeNodeId}
      {selectNode}
      {elementOrder}
      maxWidthClass="max-w-2xl"
    />
  {/if}

  <!-- Tab Bar -->
  {#if hasTabNav && items.length > 0}
    <div class="flex flex-wrap items-center justify-center gap-2 mb-8" style:order={isTabNavAfter ? 2 : 1}>
      {#each items as item, idx}
        <button
          type="button"
          on:click={(e) => handleTabClick(e, idx)}
          class={`btn btn-sm font-heading font-semibold shadow-xs cursor-pointer ${
            activeTabIdx === idx
              ? 'btn-primary text-white'
              : 'btn-ghost bg-base-200 text-base-content/70'
          }`}
          style="border-radius: var(--btn-radius, 16px)"
        >
          {item.title}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Tab Panels -->
  {#if hasTabCard || hasImage}
    <div class="tabs-showcase-container text-left {isImageOnLeft ? 'split-reversed' : ''}" style:order={isTabNavAfter ? 1 : 2}>
      {#if hasTabCard}
        <div
          data-node="feature_card"
          role="button"
          tabindex="0"
          on:click={handleActiveItemClick}
          on:keydown={handleActiveItemKeydown}
          class={`space-y-4 p-6 bg-base-100 border border-base-200 dark:border-slate-800 transition-all duration-150 cursor-pointer ${
            isItemActive
              ? 'border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 bg-primary/10'
              : 'hover:border-primary/80 hover:outline-dashed hover:outline-1 hover:outline-primary/50'
          }`}
          style="border-radius: var(--btn-radius, 16px); order: {isImageOnLeft ? 2 : 1};"
        >
          <span class="badge badge-sm badge-primary font-heading font-bold uppercase tracking-wider">
            {activeItem.badge || 'Pilihan Unggulan'}
          </span>
          <h3 data-node="feature_title" class="text-heading-md font-heading font-black text-base-content">
            {activeItem.title}
          </h3>
          <p data-node="feature_desc" class="text-body-sm text-base-content/70 leading-relaxed font-sans">
            {activeItem.description}
          </p>
          {#if activeItem.linkUrl || activeItem.statLabel}
            <span
              class="btn btn-sm btn-primary font-heading font-semibold shadow-xs cursor-pointer inline-flex"
              style="border-radius: var(--btn-radius, 16px)"
            >
              {activeItem.statLabel || 'Pesan Varian Ini'}
            </span>
          {/if}
        </div>
      {/if}

      {#if hasImage}
        <div
          role="button"
          tabindex="0"
          on:click={handleImageClick}
          on:keydown={handleImageKeydown}
          class={`w-full aspect-video overflow-hidden shadow-lg bg-[var(--color-nested-base)] transition-all cursor-pointer ${
            isImageActive
              ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
              : 'hover:opacity-95'
          }`}
          style="border-radius: var(--btn-radius, 16px); order: {isImageOnLeft ? 1 : 2};"
        >
          <img
            src={activeItem.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'}
            alt={activeItem.title}
            class="w-full h-full object-cover"
          />
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .tabs-showcase-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
  }

  @container featurecard (min-width: 640px) {
    .tabs-showcase-container {
      display: grid !important;
      grid-template-columns: 5fr 7fr !important;
      align-items: center;
      gap: 32px !important;
    }
    .tabs-showcase-container.split-reversed {
      grid-template-columns: 7fr 5fr !important;
    }
  }

  @container featurecard (min-width: 960px) {
    .tabs-showcase-container {
      gap: 40px !important;
    }
  }
</style>
