<script lang="ts">
  import { Monitor, Tablet, Smartphone, Columns } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let onConfigChange: (key: string, value: unknown) => void;

  $: colDesktop = Number(section?.props?.columnsDesktop ?? section?.styles?.columnsDesktop ?? 3);
  $: colTablet = Number(section?.props?.columnsTablet ?? section?.styles?.columnsTablet ?? 2);
  $: colMobile = Number(section?.props?.columnsMobile ?? section?.styles?.columnsMobile ?? 1);
  $: gridGapVal = String(section?.props?.gridGap ?? section?.styles?.gridGap ?? 'normal');
</script>

<div class="space-y-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 rounded-xl">
  <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 border-b border-blue-200/60 dark:border-blue-900/40 pb-1.5">
    <Columns size={14} class="text-blue-600 dark:text-blue-400" />
    <span>Grid & Kolom Katalog</span>
  </div>

  <!-- Desktop -->
  <div>
    <div class="flex items-center justify-between mb-1.5">
      <div class="flex items-center gap-1.5 font-semibold text-base-content/90">
        <Monitor size={13} class="text-blue-600 dark:text-blue-400" />
        <span>Kolom Desktop</span>
      </div>
      <span class="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 rounded">{colDesktop} Kolom</span>
    </div>
    <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
      {#each [2, 3, 4, 5] as cols}
        <button type="button" on:click={() => onConfigChange('columnsDesktop', cols)}
          class={`py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${colDesktop === cols ? 'bg-blue-600 text-white shadow-sm' : 'text-base-content/70 hover:text-base-content hover:bg-base-100/60'}`}>
          {cols} Kolom
        </button>
      {/each}
    </div>
  </div>

  <!-- Tablet -->
  <div>
    <div class="flex items-center justify-between mb-1.5">
      <div class="flex items-center gap-1.5 font-semibold text-base-content/90">
        <Tablet size={13} class="text-blue-600 dark:text-blue-400" />
        <span>Kolom Tablet</span>
      </div>
      <span class="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 rounded">{colTablet} Kolom</span>
    </div>
    <div class="grid grid-cols-2 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
      {#each [2, 3] as cols}
        <button type="button" on:click={() => onConfigChange('columnsTablet', cols)}
          class={`py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${colTablet === cols ? 'bg-blue-600 text-white shadow-sm' : 'text-base-content/70 hover:text-base-content hover:bg-base-100/60'}`}>
          {cols} Kolom
        </button>
      {/each}
    </div>
  </div>

  <!-- Mobile -->
  <div>
    <div class="flex items-center justify-between mb-1.5">
      <div class="flex items-center gap-1.5 font-semibold text-base-content/90">
        <Smartphone size={13} class="text-blue-600 dark:text-blue-400" />
        <span>Kolom Mobile</span>
      </div>
      <span class="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 rounded">{colMobile} Kolom</span>
    </div>
    <div class="grid grid-cols-2 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
      <button type="button" on:click={() => onConfigChange('columnsMobile', 1)}
        class={`py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${colMobile === 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-base-content/70 hover:text-base-content hover:bg-base-100/60'}`}>
        1 Kolom (Standard)
      </button>
      <button type="button" on:click={() => onConfigChange('columnsMobile', 2)}
        class={`py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${colMobile === 2 ? 'bg-blue-600 text-white shadow-sm' : 'text-base-content/70 hover:text-base-content hover:bg-base-100/60'}`}>
        2 Kolom (E-Commerce)
      </button>
    </div>
  </div>

  <!-- Grid Gap -->
  <div>
    <label for="catalog-gap" class="block font-semibold mb-1 text-base-content/90">Jarak Antar Kartu (Grid Gap)</label>
    <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
      {#each [
        { val: 'compact', label: 'Compact (12px)' },
        { val: 'normal', label: 'Normal (20px)' },
        { val: 'relaxed', label: 'Relaxed (32px)' },
      ] as g}
        <button type="button" on:click={() => onConfigChange('gridGap', g.val)}
          class={`py-1.5 text-[11px] font-medium rounded transition-all cursor-pointer ${
            gridGapVal === g.val || (g.val === 'normal' && !gridGapVal)
              ? 'bg-base-100 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
              : 'text-base-content/70 hover:text-base-content'
          }`}>
          {g.label}
        </button>
      {/each}
    </div>
  </div>
</div>
