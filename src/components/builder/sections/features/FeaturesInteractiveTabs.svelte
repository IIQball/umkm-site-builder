<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';
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
  $: isItemActive = activeNodeId === `feature_item_${activeTabIdx}` || activeNodeId === 'tab_card';

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
    if (selectNode) selectNode(e, 'tab_card');
  };

  const handleActiveItemKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'tab_card');
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
    <div class="flex flex-wrap items-center justify-center gap-2 mb-8" data-node="tab_nav" data-node-id="tab_nav" style:order={isTabNavAfter ? 2 : 1}>
      {#each items as item, idx}
        <button
          type="button"
          on:click={(e) => handleTabClick(e, idx)}
          class={`px-4 py-2 text-xs font-heading font-semibold shadow-xs cursor-pointer flex items-center gap-2 transition-all ${
            activeTabIdx === idx
              ? 'ring-2 ring-[var(--color-primary)]'
              : 'hover:opacity-80'
          }`}
          style="border-radius: var(--btn-radius, 16px); {activeTabIdx === idx ? 'background-color: var(--btn-primary-bg, var(--color-primary)); color: var(--theme-btn-primary-text, #ffffff);' : 'background-color: var(--color-nested-base); color: var(--color-text-secondary); border: 1px solid var(--color-border);'}"
        >
          <svelte:component this={resolveFeatureIcon(item.icon || item.iconName)} size={16} />
          <span>{item.title}</span>
        </button>
      {/each}
    </div>
  {/if}

  <!-- Tab Panels -->
  {#if hasTabCard || hasImage}
    <div class="tabs-showcase-container text-left {isImageOnLeft ? 'split-reversed' : ''}" style:order={isTabNavAfter ? 1 : 2}>
      {#if hasTabCard}
        <div
          data-node="tab_card"
          data-node-id="tab_card"
          role="button"
          tabindex="0"
          on:click={handleActiveItemClick}
          on:keydown={handleActiveItemKeydown}
          class={`space-y-4 p-6 bg-[var(--color-card-base)] border border-[var(--color-border)] transition-all duration-150 cursor-pointer ${
            isItemActive
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2 bg-[var(--color-primary)]/10'
              : 'hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
          }`}
          style="border-radius: var(--btn-radius, 16px); order: {isImageOnLeft ? 2 : 1};"
        >
          <div class="flex items-center gap-3">
            <div
              data-node="feature_icon"
              class="w-10 h-10 flex items-center justify-center shrink-0 border"
              style="background-color: color-mix(in srgb, var(--color-primary) 12%, transparent); border-color: color-mix(in srgb, var(--color-primary) 20%, transparent); color: var(--color-primary); border-radius: calc(var(--btn-radius, 16px) * 0.75);"
            >
              <svelte:component this={resolveFeatureIcon(activeItem.icon || activeItem.iconName)} size={20} />
            </div>
            {#if activeItem.badge}
              <span class="inline-block px-2.5 py-0.5 rounded-full text-2xs font-heading font-medium" style="background-color: color-mix(in srgb, var(--color-primary) 12%, transparent); color: var(--color-primary);">
                {activeItem.badge}
              </span>
            {/if}
          </div>
          <h3 data-node="feature_title" class="feature-item-title font-heading text-[var(--color-text-main)]">
            {activeItem.title}
          </h3>
          <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
            {activeItem.description}
          </p>
          {#if activeItem.linkUrl || activeItem.statLabel}
            <div class="pt-1">
              <span
                class="px-4 py-2 text-xs font-heading font-semibold shadow-xs cursor-pointer inline-flex items-center justify-center transition-all"
                style="background-color: var(--btn-primary-bg, var(--color-primary)); color: var(--theme-btn-primary-text, #ffffff); border-radius: var(--btn-radius, 16px);"
              >
                {activeItem.statLabel || 'Pesan Varian Ini'}
              </span>
            </div>
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
              ? 'ring-2 ring-[var(--color-primary)] ring-offset-2'
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
