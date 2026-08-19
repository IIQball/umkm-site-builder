<script lang="ts">
  import { ChevronUp, ChevronDown, Trash2 } from 'lucide-svelte';
  import { editorStore } from '../../stores/editorStore';

  export let nodeKey: string;
  export let index: number;
  export let total: number;
  export let sectionId: string;
  export let isResizingNode: boolean;
  export let resizeTooltip: string;
  export let onMoveElement: (key: string, direction: 'up' | 'down') => void;
  export let onStartResize: (e: PointerEvent, key: string, handle: string) => void;
</script>

<!-- Top Toolbar -->
<div class="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 px-2 py-0.5 z-40">
  <span class="text-[9px] font-bold uppercase tracking-wider text-blue-400 font-mono">
    {nodeKey}
  </span>

  <div class="h-3 w-px bg-slate-700" />

  <button
    type="button"
    on:click|stopPropagation={() => onMoveElement(nodeKey, 'up')}
    disabled={index === 0}
    class="p-0.5 hover:text-blue-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
    title="Pindah ke Atas"
  >
    <ChevronUp size={12} />
  </button>
  <button
    type="button"
    on:click|stopPropagation={() => onMoveElement(nodeKey, 'down')}
    disabled={index === total - 1}
    class="p-0.5 hover:text-blue-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
    title="Pindah ke Bawah"
  >
    <ChevronDown size={12} />
  </button>

  <div class="h-3 w-px bg-slate-700" />

  <button
    type="button"
    on:click|stopPropagation={() => editorStore.deleteNode(sectionId, nodeKey)}
    class="p-0.5 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer"
    title="Hapus Elemen (Delete)"
  >
    <Trash2 size={12} />
  </button>
</div>

<!-- Resize Tooltip -->
{#if isResizingNode && resizeTooltip}
  <div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-lg z-50 pointer-events-none">
    {resizeTooltip}
  </div>
{/if}

<!-- 4-Corner Resize Handles -->
<div
  role="slider"
  tabindex="0"
  aria-valuenow={0}
  aria-label="Resize Top Left"
  on:pointerdown={(e) => onStartResize(e, nodeKey, 'nw')}
  class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow cursor-nwse-resize z-40 hover:scale-125 transition-transform"
/>
<div
  role="slider"
  tabindex="0"
  aria-valuenow={0}
  aria-label="Resize Top Right"
  on:pointerdown={(e) => onStartResize(e, nodeKey, 'ne')}
  class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow cursor-nesw-resize z-40 hover:scale-125 transition-transform"
/>
<div
  role="slider"
  tabindex="0"
  aria-valuenow={0}
  aria-label="Resize Bottom Left"
  on:pointerdown={(e) => onStartResize(e, nodeKey, 'sw')}
  class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow cursor-nesw-resize z-40 hover:scale-125 transition-transform"
/>
<div
  role="slider"
  tabindex="0"
  aria-valuenow={0}
  aria-label="Resize Bottom Right"
  on:pointerdown={(e) => onStartResize(e, nodeKey, 'se')}
  class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow cursor-nwse-resize z-40 hover:scale-125 transition-transform"
/>
<!-- Side Edge Handle -->
<div
  role="slider"
  tabindex="0"
  aria-valuenow={0}
  aria-label="Resize Width"
  on:pointerdown={(e) => onStartResize(e, nodeKey, 'e')}
  class="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-4 bg-white border border-blue-600 rounded-sm shadow cursor-ew-resize z-40 hover:scale-125 transition-transform"
/>
