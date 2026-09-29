<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';

  export let badgeText: string = '';
  export let title: string = '';
  export let subtitle: string = '';
  export let items: FeatureItem[] = [];
  export let elementOrder: string[] = ['badge', 'title', 'ribbon_bar'];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;

  $: hasHeader = elementOrder.some((s) => ['badge', 'title', 'subtitle'].includes(s)) && (badgeText || title || subtitle);
  $: hasRibbon = elementOrder.includes('ribbon_bar') || elementOrder.includes('features_grid');
  $: isRibbonFirst = (elementOrder.indexOf('ribbon_bar') === 0) || (elementOrder.indexOf('features_grid') === 0);

  const handleItemClick = (e: MouseEvent, index: number) => {
    if (selectNode) selectNode(e, `feature_item_${index}`);
  };

  const handleItemKeydown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, `feature_item_${index}`);
    }
  };
</script>

<div class="py-6 flex flex-col text-center">
  {#if hasHeader}
    <div style="order: {isRibbonFirst ? 2 : 1};">
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

  {#if hasRibbon}
    <div
      style="order: {isRibbonFirst ? 1 : 2};"
      class="w-full p-4 sm:p-6 shadow-lg border transition-colors"
      style:background-color="var(--color-nested-base, #111827)"
      style:border-color="var(--color-border)"
      style:border-radius="var(--btn-radius, 16px)"
      style:color="var(--color-text-main)"
    >
      <div class="banner-ribbon-container text-left">
        {#each items as item, index (item.id || `ribbon-${index}`)}
          {@const isActiveNode = activeNodeId === `feature_item_${index}`}
          <div
            data-node="feature_card"
            role="button"
            tabindex="0"
            on:click={(e) => handleItemClick(e, index)}
            on:keydown={(e) => handleItemKeydown(e, index)}
            class={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-all cursor-pointer ${
              isActiveNode
                ? 'ring-2 ring-primary bg-[var(--color-primary)]/10 ring-offset-2 dark:ring-offset-slate-900'
                : 'hover:bg-[var(--color-primary)]/5 hover:outline-dashed hover:outline-1 hover:outline-primary/50'
            } ${index > 0 ? 'border-t border-[var(--color-border)] pt-3 sm:border-t-0 sm:pt-2.5 sm:border-l sm:pl-4' : ''}`}
          >
            <div
              data-node="feature_icon"
              class="w-10 h-10 flex items-center justify-center shrink-0 border"
              style="background-color: color-mix(in srgb, var(--color-primary) 15%, transparent); border-color: color-mix(in srgb, var(--color-primary) 25%, transparent); color: var(--color-primary); border-radius: calc(var(--btn-radius, 16px) * 0.75);"
            >
              <svelte:component this={resolveFeatureIcon(item.icon || item.iconName)} size={20} />
            </div>
            <div class="min-w-0 flex-1">
              <h3 data-node="feature_title" class="text-heading-md font-heading font-semibold text-sm sm:text-base text-[var(--color-text-main)] truncate">
                {item.title}
              </h3>
              {#if item.description}
                <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] ribbon-desc mt-0.5 truncate font-sans">
                  {item.description}
                </p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .banner-ribbon-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .ribbon-desc {
    display: none;
  }

  @container featurecard (min-width: 640px) {
    .banner-ribbon-container {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 16px !important;
    }
    .ribbon-desc {
      display: block;
    }
  }
</style>
