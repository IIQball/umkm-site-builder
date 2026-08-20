<script lang="ts">
  export let viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  export let showColumnGrid: boolean = false;
  export let showPixelGrid: boolean = false;

  $: columnsCount = viewMode === 'desktop' ? 12 : viewMode === 'tablet' ? 8 : 4;
  $: columnsArray = Array.from({ length: columnsCount });
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
      <div class="w-full h-full max-w-full mx-auto px-4 sm:px-6 md:px-8 box-border">
        <div
          class="w-full h-full grid gap-3 sm:gap-4 md:gap-6 box-border"
          style={`grid-template-columns: repeat(${columnsCount}, minmax(0, 1fr));`}
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
