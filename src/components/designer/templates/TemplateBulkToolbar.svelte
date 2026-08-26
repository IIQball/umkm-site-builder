<script lang="ts">
  import { CheckSquare, Square, Trash2, X } from 'lucide-svelte';

  export let isSelectionMode: boolean;
  export let selectedCount: number;
  export let totalCount: number;
  export let onToggleSelectionMode: () => void;
  export let onSelectAll: () => void;
  export let onClearSelection: () => void;
  export let onDeleteSelected: () => void;
</script>

<div class="flex items-center gap-2">
  {#if isSelectionMode}
    <div class="flex items-center gap-2 p-1.5 rounded-xl bg-card border border-light text-xs shadow-sm animate-fade-in">
      <button
        type="button"
        on:click={selectedCount === totalCount ? onClearSelection : onSelectAll}
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-nested border border-light hover:bg-nested/80 text-main transition-colors cursor-pointer font-bold"
      >
        {#if selectedCount === totalCount && totalCount > 0}
          <CheckSquare size={14} class="text-primary" />
        {:else}
          <Square size={14} />
        {/if}
        <span>Pilih Semua ({selectedCount}/{totalCount})</span>
      </button>

      <button
        type="button"
        on:click={onDeleteSelected}
        disabled={selectedCount === 0}
        class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
      >
        <Trash2 size={14} />
        <span>Hapus ({selectedCount})</span>
      </button>

      <button
        type="button"
        on:click={onToggleSelectionMode}
        class="p-1.5 rounded-lg text-muted hover:text-main hover:bg-nested transition-colors cursor-pointer"
        title="Batal Mode Pilih"
        aria-label="Batal Mode Pilih"
      >
        <X size={15} />
      </button>
    </div>
  {:else}
    <button
      type="button"
      on:click={onToggleSelectionMode}
      class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-card border border-light text-secondary hover:text-main hover:bg-nested hover:border-primary/40 transition-all shadow-xs cursor-pointer"
    >
      <CheckSquare size={14} />
      <span>Pilih Multi-Template</span>
    </button>
  {/if}
</div>
