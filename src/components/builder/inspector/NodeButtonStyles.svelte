<script lang="ts">
  import { Sliders } from 'lucide-svelte';
  import { radiusPresets, buttonPaddings, shadowPresets } from './nodeStyles.constants';

  export let nodeStyles: Record<string, string> = {};
  export let onStyleChange: (key: string, value: string) => void;
</script>

<div class="space-y-3">
  <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
    <Sliders size={13} class="text-blue-500" />
    <span>Kustomisasi Tombol</span>
  </div>

  <div>
    <label for="node-border-radius" class="block font-medium mb-1 text-base-content/80">Kelengkungan Sudut (Radius 8pt/Pill)</label>
    <select
      id="node-border-radius"
      value={nodeStyles.borderRadius || '8px'}
      on:change={(e) => onStyleChange('borderRadius', e.currentTarget.value)}
      on:input={(e) => onStyleChange('borderRadius', e.currentTarget.value)}
      class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
    >
      {#each radiusPresets as r}
        <option value={r.value}>{r.label}</option>
      {/each}
    </select>
  </div>

  <div>
    <span class="block font-medium mb-1 text-base-content/80">Ukuran Tombol (Padding 8pt)</span>
    <div class="grid grid-cols-3 gap-1">
      {#each buttonPaddings as bp}
        <button
          type="button"
          on:click={() => onStyleChange('padding', bp.value)}
          class={`py-1.5 rounded text-[11px] border transition-colors cursor-pointer ${
            nodeStyles.padding === bp.value
              ? 'bg-blue-600 text-white border-blue-500 font-semibold'
              : 'bg-base-200 border-base-300 dark:border-slate-700 text-base-content/80 hover:bg-base-300'
          }`}
        >
          {bp.label}
        </button>
      {/each}
    </div>
  </div>

  <div>
    <label for="node-shadow" class="block font-medium mb-1 text-base-content/80">Button Shadow</label>
    <select
      id="node-shadow"
      value={nodeStyles.boxShadow || 'none'}
      on:change={(e) => onStyleChange('boxShadow', e.currentTarget.value)}
      on:input={(e) => onStyleChange('boxShadow', e.currentTarget.value)}
      class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
    >
      {#each shadowPresets as sh}
        <option value={sh.value}>{sh.label}</option>
      {/each}
    </select>
  </div>
</div>
