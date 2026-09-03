<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';

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

<div class="py-6">
  <div class="w-full bg-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-800">
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
              ? 'ring-2 ring-blue-500 bg-white/10 ring-offset-2 ring-offset-slate-900'
              : 'hover:bg-white/5 hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
          } ${index > 0 ? 'border-t border-slate-800 pt-3 sm:border-t-0 sm:pt-2.5 sm:border-l sm:pl-4' : ''}`}
        >
          <div
            data-node="feature_icon"
            class="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/10"
          >
            <svelte:component this={resolveFeatureIcon(item.icon || item.iconName)} size={20} />
          </div>
          <div class="min-w-0 flex-1">
            <h3 data-node="feature_title" class="text-heading-md font-heading font-semibold text-sm sm:text-base text-white truncate">
              {item.title}
            </h3>
            {#if item.description}
              <p data-node="feature_desc" class="text-body-sm text-slate-300 ribbon-desc mt-0.5 truncate font-sans">
                {item.description}
              </p>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
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
