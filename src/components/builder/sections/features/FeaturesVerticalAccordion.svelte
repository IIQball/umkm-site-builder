<script lang="ts">
  import type { ComponentType } from 'svelte';
  import { ChevronDown } from 'lucide-svelte';

  export let features: any[] = [];
  export let title: string = '';
  export let subtitle: string = '';
  export let renderIcon: (name?: string) => ComponentType;

  let expandedAccordionIdx: number | null = 0;
</script>

<div class="py-12 max-w-3xl mx-auto flex flex-col gap-4 text-left">
  <div class="text-center mb-6">
    <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
      {title || 'Detail Nilai Tambah Layanan'}
    </h2>
    <p class="text-sm text-[var(--theme-text-muted,#64748b)]">{subtitle || 'Klik untuk membuka rincian manfaat'}</p>
  </div>

  {#each features as feature, idx}
    {@const isExpanded = expandedAccordionIdx === idx}
    <div class="rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
      <button
        type="button"
        on:click={() => (expandedAccordionIdx = isExpanded ? null : idx)}
        class="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center flex-shrink-0">
            <svelte:component this={renderIcon(feature.icon)} size={18} />
          </div>
          <h4 class="font-bold text-sm sm:text-base text-[var(--theme-text-primary,#0f172a)]">{feature.title}</h4>
        </div>
        <ChevronDown size={18} class={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-[var(--theme-primary,#2563eb)]' : ''}`} />
      </button>
      {#if isExpanded}
        <div class="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed border-t border-base-200 dark:border-slate-800">
          {feature.description}
        </div>
      {/if}
    </div>
  {/each}
</div>
