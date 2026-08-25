<script lang="ts">
  import { canvasStore, editorStore } from './stores/editorStore';

  export let viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  export let showColumnGrid: boolean = false;
  export let showPixelGrid: boolean = false;
  export let gutter: number = 24;

  $: currentViewMode = viewMode || $canvasStore.viewMode || 'desktop';
  $: columnsCount = currentViewMode === 'desktop' ? 12 : currentViewMode === 'tablet' ? 8 : 4;
  $: columnsArray = Array.from({ length: columnsCount });

  $: layoutTheme = $editorStore.template?.config.theme?.layout || {};
  $: activeMargin = $canvasStore.activeMargin;

  $: safeZoneMargin = currentViewMode === 'desktop'
    ? (layoutTheme.horizontalMarginDesktop || activeMargin || '32px')
    : currentViewMode === 'tablet'
    ? (layoutTheme.horizontalMarginTablet || activeMargin || '24px')
    : (layoutTheme.horizontalMarginMobile || activeMargin || '16px');
</script>

{#if showColumnGrid || showPixelGrid}
  <div class="pointer-events-none absolute inset-0 z-30 w-full h-full overflow-hidden select-none">
    <!-- Pixel Grid 8px Overlay -->
    {#if showPixelGrid}
      <div
        class="absolute inset-0 w-full h-full opacity-40"
        style="background-size: 8px 8px; background-image: linear-gradient(to right, rgba(99, 102, 241, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.15) 1px, transparent 1px);"
      />
    {/if}

    <!-- Column Grid Overlay (Figma-Style) -->
    {#if showColumnGrid}
      <div
        class="w-full h-full max-w-full mx-auto box-border transition-all duration-200"
        style={`padding-left: ${safeZoneMargin}; padding-right: ${safeZoneMargin};`}
      >
        <div
          class="w-full h-full grid box-border transition-all duration-200"
          style={`grid-template-columns: repeat(${columnsCount}, minmax(0, 1fr)); gap: ${gutter}px;`}
        >
          {#each columnsArray as _, i}
            <div
              class="h-full bg-rose-500/10 border-x border-rose-500/20 flex flex-col justify-between items-center py-2"
            >
              <span class="text-[9px] font-mono text-rose-500/60 font-semibold">{i + 1}</span>
              <span class="text-[9px] font-mono text-rose-500/60 font-semibold">{i + 1}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}

