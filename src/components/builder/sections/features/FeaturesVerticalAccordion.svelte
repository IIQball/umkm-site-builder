<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { ChevronDown } from 'lucide-svelte';
  import { resolveFeatureIcon } from './featureIcons';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';
  import { isFeaturesVisualOnLeft } from './featuresLayout.helpers';

  export let badgeText: string = 'Proses Teliti';
  export let title: string = 'Kualitas Diperiksa Langkah demi Langkah';
  export let subtitle: string = 'Setiap tahapan pengolahan dipantau secara berkala untuk menjaga higienitas dan mutu rasa.';
  export let items: FeatureItem[] = [];
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'accordion_list', 'image'];
  export let mainImageUrl: string = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;

  let activeIdx: number = 0;

  $: activeItem = items[activeIdx] || items[0];
  $: isImageActive = activeNodeId === 'features_image' || activeNodeId === 'image';

  $: hasHeader = elementOrder.some((s) => ['badge', 'title', 'subtitle'].includes(s));
  $: hasAccordion = elementOrder.includes('accordion_list') || elementOrder.includes('features_grid');
  $: hasImage = elementOrder.includes('image');
  $: isImageOnLeft = isFeaturesVisualOnLeft('vertical_accordion_showcase', elementOrder, false);

  const handleItemClick = (e: MouseEvent, index: number) => {
    activeIdx = index;
    if (selectNode) selectNode(e, `feature_item_${index}`);
  };

  const handleItemKeydown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      activeIdx = index;
      if (selectNode) selectNode(e, `feature_item_${index}`);
    }
  };

  const handleImageClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'features_image');
  };

  const handleImageKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'features_image');
    }
  };
</script>

<div class="py-12">
  <div class="accordion-split-container {isImageOnLeft ? 'split-reversed' : ''}">
    <!-- Akordeon List Kolom -->
    {#if hasHeader || hasAccordion}
      <div class="space-y-3 text-left" style="order: {isImageOnLeft ? 2 : 1};">
        {#if hasHeader}
          <FeaturesHeaderTitle
            {badgeText}
            {title}
            {subtitle}
            {activeNodeId}
            {selectNode}
            {elementOrder}
            align="left"
            maxWidthClass="max-w-none"
          />
        {/if}

        {#if hasAccordion}
          <div data-node="accordion_list" data-node-id="accordion_list" class="space-y-3">
            {#each items as item, index (item.id || item.title + index)}
            {@const isExpanded = activeIdx === index}
            {@const isItemActive = activeNodeId === `feature_item_${index}`}
            <div
              data-node="feature_card"
              role="button"
              tabindex="0"
              on:click={(e) => handleItemClick(e, index)}
              on:keydown={(e) => handleItemKeydown(e, index)}
              class={`p-5 border cursor-pointer transition-all duration-150 ${
                isItemActive
                  ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2'
                  : isExpanded
                    ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10'
                    : 'border-[var(--color-border)] bg-[var(--color-card-base)] hover:bg-[var(--color-nested-base)]'
              }`}
              style="border-radius: var(--btn-radius, 16px);"
            >
              <h3 data-node="feature_title" class="feature-item-title-compact font-heading flex items-center justify-between gap-4">
                <span class="flex items-center gap-2.5 min-w-0 {isExpanded ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-main)]'}">
                  <span
                    data-node="feature_icon"
                    class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                    style="background-color: color-mix(in srgb, var(--color-primary) 12%, transparent); border-color: color-mix(in srgb, var(--color-primary) 20%, transparent); color: var(--color-primary);"
                  >
                    <svelte:component this={resolveFeatureIcon(item.icon || item.iconName)} size={15} />
                  </span>
                  <span class="truncate">{`0${index + 1}. `}{item.title}</span>
                  {#if item.badge}
                    <span class="inline-block px-2 py-0.5 rounded-full text-3xs font-heading font-medium shrink-0" style="background-color: color-mix(in srgb, var(--color-primary) 15%, transparent); color: var(--color-primary);">
                      {item.badge}
                    </span>
                  {/if}
                </span>
                <ChevronDown
                  size={18}
                  class={`shrink-0 transition-transform ${
                    isExpanded ? 'rotate-180 text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
                  }`}
                />
              </h3>
              {#if isExpanded}
                <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] leading-relaxed mt-2 font-sans">
                  {item.description}
                </p>
                {#if item.statLabel || item.linkUrl}
                  <div class="mt-2.5 pt-2 border-t border-[var(--color-border)]">
                    <span class="text-xs font-heading font-semibold text-[var(--color-primary)] inline-flex items-center gap-1">
                      {item.statLabel || 'Detail Selengkapnya →'}
                    </span>
                  </div>
                {/if}
              {/if}
            </div>
          {/each}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Ilustrasi Gambar Kolom -->
    {#if hasImage}
      <div
        role="button"
        tabindex="0"
        on:click={handleImageClick}
        on:keydown={handleImageKeydown}
        class={`w-full aspect-[4/3] overflow-hidden shadow-xl bg-[var(--color-nested-base)] transition-all cursor-pointer ${
          isImageActive
            ? 'ring-2 ring-[var(--color-primary)] ring-offset-2'
            : 'hover:opacity-95'
        }`}
        style="border-radius: var(--btn-radius, 16px); order: {isImageOnLeft ? 1 : 2};"
      >
        <img
          src={activeItem?.imageUrl || mainImageUrl}
          alt={activeItem?.title || title}
          class="w-full h-full object-cover transition-all duration-300"
        />
      </div>
    {/if}
  </div>
</div>

<style>
  .accordion-split-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
  }

  @container featurecard (min-width: 640px) {
    .accordion-split-container {
      display: grid !important;
      grid-template-columns: 5fr 7fr !important;
      align-items: center;
      gap: 32px !important;
    }
    .accordion-split-container.split-reversed {
      grid-template-columns: 7fr 5fr !important;
    }
  }

  @container featurecard (min-width: 960px) {
    .accordion-split-container {
      gap: 40px !important;
    }
  }
</style>
