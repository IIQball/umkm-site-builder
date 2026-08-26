<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { getFeatureIcon } from './features.helpers';

  export let features: FeatureItem[];
  export let activePreset: string;
  export let isActive: boolean;
  export let draggedIdx: number | null;
  export let dropTargetIdx: number | null;
  export let onDragStart: (e: DragEvent, i: number) => void;
  export let onDragOver: (e: DragEvent, i: number) => void;
  export let onDrop: (e: DragEvent, i: number) => void;
</script>

{#if activePreset === 'numbered_process'}
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    {#each features as item, index}
      <div
        class="relative p-6 rounded-2xl border border-base-200 dark:border-slate-800 space-y-3"
        style="background-color: var(--theme-surface);"
      >
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-black text-xs">
          0{index + 1}
        </span>
        <h3 class="font-bold text-sm text-base-content">{item.title}</h3>
        <p class="text-xs text-base-content/70 leading-relaxed">{item.description}</p>
      </div>
    {/each}
  </div>

{:else if activePreset === 'feature_bento_grid'}
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each features as item, index}
      <div
        class="p-6 rounded-3xl border border-base-200 dark:border-slate-800 space-y-4 {index === 0 ? 'md:col-span-2 md:row-span-2' : ''}"
        style="background-color: var(--theme-surface);"
      >
        <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <svelte:component this={getFeatureIcon(item.icon)} size={20} />
        </div>
        <h3 class="font-bold {index === 0 ? 'text-lg md:text-xl' : 'text-sm'} text-base-content">{item.title}</h3>
        <p class="text-xs text-base-content/70 leading-relaxed">{item.description}</p>
      </div>
    {/each}
  </div>

{:else}
  <!-- grid_3_cards, grid_4_compact & default -->
  <div role="list" class="grid grid-cols-1 sm:grid-cols-2 {activePreset === 'grid_4_compact' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6">
    {#each features as item, index}
      <div
        role="listitem"
        draggable={isActive}
        on:dragstart={(e) => onDragStart(e, index)}
        on:dragover={(e) => onDragOver(e, index)}
        on:drop={(e) => onDrop(e, index)}
        class="group p-6 rounded-2xl border border-base-200 dark:border-slate-800 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 {draggedIdx === index ? 'opacity-40' : ''} {dropTargetIdx === index ? 'ring-2 ring-primary' : ''}"
        style="background-color: var(--theme-surface);"
      >
        <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
          <svelte:component this={getFeatureIcon(item.icon)} size={24} />
        </div>
        <h3 class="font-bold text-sm text-base-content">{item.title}</h3>
        <p class="text-xs text-base-content/70 leading-relaxed">{item.description}</p>
      </div>
    {/each}
  </div>
{/if}
