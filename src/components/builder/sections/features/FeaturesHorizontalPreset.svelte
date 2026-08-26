<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { getFeatureIcon } from './features.helpers';

  export let features: FeatureItem[];
  export let activePreset: string;
  export let imageUrl: string = '';
</script>

{#if activePreset === 'banner_inline_bar'}
  <div class="p-6 rounded-2xl border border-base-200 dark:border-slate-800 bg-base-100 dark:bg-slate-900 shadow-sm">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-base-200 dark:divide-slate-800">
      {#each features as item}
        <div class="flex items-center gap-3 px-2 pt-3 md:pt-0">
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <svelte:component this={getFeatureIcon(item.icon)} size={20} />
          </div>
          <div>
            <h4 class="font-bold text-xs text-base-content">{item.title}</h4>
            <p class="text-[11px] text-base-content/60 line-clamp-1">{item.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>

{:else if activePreset === 'icon_pill_chips'}
  <div class="flex flex-wrap items-center justify-center gap-3">
    {#each features as item}
      <div
        class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-base-200 dark:border-slate-800 shadow-sm"
        style="background-color: var(--theme-surface);"
      >
        <div class="text-primary">
          <svelte:component this={getFeatureIcon(item.icon)} size={16} />
        </div>
        <span class="font-bold text-xs text-base-content">{item.title}</span>
      </div>
    {/each}
  </div>

{:else if activePreset === 'split_image_feature'}
  <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
    <div class="md:col-span-6 space-y-4">
      {#each features as item}
        <div class="p-4 rounded-xl border border-base-200 dark:border-slate-800 space-y-1 bg-base-100 dark:bg-slate-900">
          <div class="flex items-center gap-2">
            <svelte:component this={getFeatureIcon(item.icon)} size={16} class="text-primary" />
            <h3 class="font-bold text-xs text-base-content">{item.title}</h3>
          </div>
          <p class="text-xs text-base-content/70 pl-6">{item.description}</p>
        </div>
      {/each}
    </div>
    <div class="md:col-span-6 rounded-2xl overflow-hidden shadow-xl aspect-4/3">
      <img
        src={imageUrl || 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80'}
        alt="Features Illustration"
        class="w-full h-full object-cover"
      />
    </div>
  </div>

{:else}
  <!-- horizontal_list -->
  <div class="space-y-4 max-w-3xl mx-auto">
    {#each features as item}
      <div
        class="flex items-start gap-4 p-5 rounded-2xl border border-base-200 dark:border-slate-800 shadow-sm"
        style="background-color: var(--theme-surface);"
      >
        <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <svelte:component this={getFeatureIcon(item.icon)} size={20} />
        </div>
        <div class="space-y-1">
          <h3 class="font-bold text-sm text-base-content">{item.title}</h3>
          <p class="text-xs text-base-content/70 leading-relaxed">{item.description}</p>
        </div>
      </div>
    {/each}
  </div>
{/if}
