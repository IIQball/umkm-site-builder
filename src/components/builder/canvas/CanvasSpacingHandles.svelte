<script lang="ts">
  import { MoveVertical, MoveHorizontal } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let isSelected: boolean = false;
  export let onStartDrag: (
    e: MouseEvent,
    section: TemplateSection,
    type: 'padding-top' | 'padding-bottom' | 'padding-horizontal' | 'margin-top' | 'margin-bottom'
  ) => void;
</script>

{#if isSelected}
  <!-- Selection Badge -->
  <div class="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-30 pointer-events-none uppercase tracking-wider">
    {section.type.replace('_', ' ')}
  </div>

  <!-- Top Spacing Handle (Margin Top) -->
  <div
    role="slider"
    tabindex="0"
    aria-valuenow={0}
    aria-label="Drag to adjust margin top"
    on:mousedown={(e) => onStartDrag(e, section, 'margin-top')}
    class="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 px-3 h-5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold rounded-full shadow-lg cursor-ns-resize z-30 transition-all group"
    title="Tarik untuk mengatur jarak atas (Margin Top)"
  >
    <MoveVertical size={11} class="opacity-90 group-hover:scale-110 transition-transform" />
    <span class="text-[9px] tracking-tight">Jarak Atas</span>
  </div>

  <!-- Bottom Spacing Handle (Margin Bottom) -->
  <div
    role="slider"
    tabindex="0"
    aria-valuenow={0}
    aria-label="Drag to adjust margin bottom"
    on:mousedown={(e) => onStartDrag(e, section, 'margin-bottom')}
    class="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 px-3 h-5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold rounded-full shadow-lg cursor-ns-resize z-30 transition-all group"
    title="Tarik untuk mengatur jarak bawah (Margin Bottom)"
  >
    <MoveVertical size={11} class="opacity-90 group-hover:scale-110 transition-transform" />
    <span class="text-[9px] tracking-tight">Jarak Bawah</span>
  </div>

  <!-- Right Side Padding Handle -->
  <div
    role="slider"
    tabindex="0"
    aria-valuenow={0}
    aria-label="Drag to adjust horizontal padding"
    on:mousedown={(e) => onStartDrag(e, section, 'padding-horizontal')}
    class="absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg cursor-ew-resize z-30 flex items-center justify-center transition-all group"
    title="Tarik untuk mengatur padding horizontal"
  >
    <MoveHorizontal size={12} class="opacity-90 group-hover:scale-110 transition-transform" />
  </div>
{/if}
