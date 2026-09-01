<script lang="ts">
  import type { ComponentType } from 'svelte';

  export let features: any[] = [];
  export let title: string = '';
  export let renderIcon: (name?: string) => ComponentType;

  let activeTabIdx = 0;
  $: activeFeature = features[activeTabIdx] || features[0];
</script>

<div class="py-12 flex flex-col items-center gap-8 text-center">
  <div>
    <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
      {title || 'Eksplorasi Keunggulan'}
    </h2>
    <p class="text-sm text-[var(--theme-text-muted,#64748b)]">Pilih poin keunggulan untuk melihat detail lengkap</p>
  </div>

  <!-- Tab Buttons -->
  <div class="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
    {#each features as feature, idx}
      <button
        type="button"
        on:click={() => (activeTabIdx = idx)}
        class={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
          activeTabIdx === idx
            ? 'bg-white dark:bg-slate-900 text-[var(--theme-primary,#2563eb)] shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
        }`}
      >
        {feature.title}
      </button>
    {/each}
  </div>

  <!-- Active Tab Showcase -->
  <div class="w-full max-w-2xl p-8 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-lg flex flex-col items-center gap-4 text-center">
    <div class="w-16 h-16 rounded-2xl bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center border border-blue-100 shadow-sm">
      <svelte:component this={renderIcon(activeFeature?.icon)} size={32} />
    </div>
    <h3 class="text-xl sm:text-2xl font-black text-[var(--theme-text-primary,#0f172a)]">{activeFeature?.title}</h3>
    <p class="text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed max-w-lg">{activeFeature?.description}</p>
  </div>
</div>
