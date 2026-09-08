<script lang="ts">
  import { canvasStore, editorStore } from './stores/editorStore';

  export let viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  export let showColumnGrid: boolean | undefined = undefined;
  export let showPixelGrid: boolean | undefined = undefined;
  export let gutter: number | undefined = undefined;

  $: currentViewMode = viewMode || $canvasStore.viewMode || 'desktop';
  $: activeShowColumnGrid = showColumnGrid ?? $canvasStore.showColumnGrid ?? false;
  $: activeShowPixelGrid = showPixelGrid ?? $canvasStore.showPixelGrid ?? false;

  $: columnsCount = currentViewMode === 'desktop' ? 12 : currentViewMode === 'tablet' ? 8 : 4;
  $: activeGutter = gutter ?? (currentViewMode === 'desktop' ? 24 : currentViewMode === 'tablet' ? 16 : 12);
  $: columnsArray = Array.from({ length: columnsCount });

  $: layoutTheme = $editorStore.template?.config.theme?.layout || {};
  $: activeMargin = $canvasStore.activeMargin;

  $: safeZoneMargin = currentViewMode === 'desktop'
    ? (layoutTheme.horizontalMarginDesktop || activeMargin || '32px')
    : currentViewMode === 'tablet'
    ? (layoutTheme.horizontalMarginTablet || activeMargin || '24px')
    : (layoutTheme.horizontalMarginMobile || activeMargin || '16px');
</script>

{#if activeShowColumnGrid || activeShowPixelGrid}
  <div class="pointer-events-none absolute inset-0 z-30 w-full h-full overflow-hidden select-none">
    <!-- Pixel Grid 8px Overlay -->
    {#if activeShowPixelGrid}
      <div
        class="absolute inset-0 w-full h-full opacity-40"
        style="background-size: 8px 8px; background-image: linear-gradient(to right, rgba(99, 102, 241, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.15) 1px, transparent 1px);"></div>
    {/if}

    <!-- Column Grid Overlay (Figma-Style) -->
    {#if activeShowColumnGrid}
      <div
        class="w-full h-full mx-auto box-border transition-all duration-200"
        style={`padding-left: var(--active-safe-zone, ${safeZoneMargin}); padding-right: var(--active-safe-zone, ${safeZoneMargin});`}
      >
        <div
          class="w-full h-full grid box-border transition-all duration-200"
          style={`grid-template-columns: repeat(${columnsCount}, minmax(0, 1fr)); gap: ${activeGutter}px;`}
        >
          {#each columnsArray as _, i}
            <div
              class="h-full bg-rose-500/10 border-x border-rose-500/20 flex flex-col justify-between items-center py-2"
            >
              <span class="text-[9px] font-mono text-rose-500/70 font-semibold bg-rose-500/10 px-1 rounded">{i + 1}</span>
              <span class="text-[9px] font-mono text-rose-500/70 font-semibold bg-rose-500/10 px-1 rounded">{i + 1}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}

