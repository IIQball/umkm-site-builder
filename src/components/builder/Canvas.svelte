<script lang="ts">
  import SectionRenderer from './sections/SectionRenderer.svelte';
  import type { TemplateSection } from '@/schemas/template.schema';
  import { editorStore } from './stores/editorStore';
  import { MoveVertical, MoveHorizontal } from 'lucide-svelte';

  export let sections: TemplateSection[] = [];
  export let selectedSectionId: string | null = null;
  export let viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  export let onSelectSection: (id: string) => void;

  let isDraggingSpacing = false;
  let dragStartY = 0;
  let dragStartX = 0;
  let startValue = 0;
  let currentDragTooltip = '';

  const parsePx = (val: unknown, defaultVal: number = 0): number => {
    if (typeof val !== 'string' && typeof val !== 'number') return defaultVal;
    return parseInt(String(val), 10) || defaultVal;
  };

  const handleSelect = (id: string) => {
    if (isDraggingSpacing) return;
    onSelectSection(id);
  };

  const startTopMarginDrag = (e: PointerEvent, section: TemplateSection) => {
    e.stopPropagation();
    e.preventDefault();
    isDraggingSpacing = true;
    dragStartY = e.clientY;
    startValue = parsePx(section.styles?.marginTop, 0);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - dragStartY;
      const newMarginTop = Math.max(0, Math.min(160, startValue + Math.round(deltaY)));
      currentDragTooltip = `Margin Top: ${newMarginTop}px`;
      editorStore.updateSectionStyles(section.id, {
        marginTop: `${newMarginTop}px`,
      });
    };

    const onPointerUp = () => {
      isDraggingSpacing = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const startBottomMarginDrag = (e: PointerEvent, section: TemplateSection) => {
    e.stopPropagation();
    e.preventDefault();
    isDraggingSpacing = true;
    dragStartY = e.clientY;
    startValue = parsePx(section.styles?.marginBottom, 0);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - dragStartY;
      const newMarginBottom = Math.max(0, Math.min(160, startValue + Math.round(deltaY)));
      currentDragTooltip = `Margin Bottom: ${newMarginBottom}px`;
      editorStore.updateSectionStyles(section.id, {
        marginBottom: `${newMarginBottom}px`,
      });
    };

    const onPointerUp = () => {
      isDraggingSpacing = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const startSidePaddingDrag = (e: PointerEvent, section: TemplateSection) => {
    e.stopPropagation();
    e.preventDefault();
    isDraggingSpacing = true;
    dragStartX = e.clientX;
    const paddingStr = section.styles?.padding || '48px 24px';
    const parts = paddingStr.trim().split(/\s+/).map((p) => parseInt(p, 10) || 0);
    const padY = parts[0] || 48;
    const startPadX = parts.length > 1 ? parts[1] : padY;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - dragStartX);
      const newPadX = Math.max(8, Math.min(120, startPadX + Math.round(deltaX / 2)));
      currentDragTooltip = `Padding: ${padY}px ${newPadX}px`;
      editorStore.updateSectionStyles(section.id, {
        padding: `${padY}px ${newPadX}px`,
      });
    };

    const onPointerUp = () => {
      isDraggingSpacing = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };
</script>

<main class="flex-1 h-full overflow-y-auto overflow-x-hidden bg-base-200/60 p-2 sm:p-4 md:p-6 flex justify-center items-start select-none transition-colors">
  <!-- Frame Container with fluid auto-layout boundaries -->
  <div
    class={`transition-all duration-300 ease-in-out bg-white text-slate-900 shadow-2xl my-2 sm:my-4 flex flex-col box-border overflow-x-hidden ${
      viewMode === 'desktop'
        ? 'w-full max-w-6xl rounded-xl min-h-[800px] border border-base-300 dark:border-slate-800'
        : viewMode === 'tablet'
        ? 'w-[768px] max-w-full rounded-2xl min-h-[800px] border-4 border-slate-700 mx-auto'
        : 'w-[375px] max-w-full rounded-2xl min-h-[667px] border-4 border-slate-700 mx-auto'
    }`}
  >
    {#if sections.length === 0}
      <div class="p-16 text-center text-slate-400">
        <p class="text-sm">Tidak ada section untuk ditampilkan.</p>
      </div>
    {:else}
      <div class="flex flex-col w-full min-w-0 transition-all">
        {#each sections as section (section.id)}
          <div
            role="button"
            tabindex="0"
            on:click={() => handleSelect(section.id)}
            on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(section.id)}
            class={`relative w-full text-left transition-all cursor-pointer ${
              selectedSectionId === section.id
                ? 'ring-2 ring-blue-500 ring-inset z-20'
                : 'hover:ring-1 hover:ring-blue-400/50 hover:ring-inset'
            }`}
          >
            <!-- Active Section Overlays & Spacing Drag Handles -->
            {#if selectedSectionId === section.id}
              <!-- Selection Badge -->
              <div class="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-30 pointer-events-none uppercase tracking-wider">
                {section.type.replace('_', ' ')}
              </div>

              <!-- Drag Info Tooltip -->
              {#if isDraggingSpacing && currentDragTooltip}
                <div class="absolute top-2 right-2 bg-slate-900 text-blue-400 border border-blue-500/40 text-[10px] font-mono font-bold px-2.5 py-1 rounded shadow-lg z-40 pointer-events-none">
                  {currentDragTooltip}
                </div>
              {/if}

              <!-- Top Spacing Handle (Margin Top) -->
              <div
                role="slider"
                tabindex="0"
                aria-valuenow={startValue}
                aria-label="Drag to adjust margin top"
                on:pointerdown={(e) => startTopMarginDrag(e, section)}
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
                aria-valuenow={startValue}
                aria-label="Drag to adjust margin bottom"
                on:pointerdown={(e) => startBottomMarginDrag(e, section)}
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
                aria-valuenow={startValue}
                aria-label="Drag to adjust horizontal padding"
                on:pointerdown={(e) => startSidePaddingDrag(e, section)}
                class="absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg cursor-ew-resize z-30 flex items-center justify-center transition-all group"
                title="Tarik untuk mengatur padding horizontal"
              >
                <MoveHorizontal size={12} class="opacity-90 group-hover:scale-110 transition-transform" />
              </div>
            {/if}

            <SectionRenderer {section} isActive={selectedSectionId === section.id} />
          </div>
        {/each}
      </div>
    {/if}
  </div>
</main>
