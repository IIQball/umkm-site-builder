<script lang="ts">
  import { onMount } from 'svelte';
  import { Monitor, Tablet, Smartphone, Layout } from 'lucide-svelte';
  import type { TemplateConfig } from '@/schemas';
  import StorefrontDynamicPage from '@/components/storefront/StorefrontDynamicPage.svelte';

  export let baseConfig: TemplateConfig;
  export let finalMergedConfig: TemplateConfig;
  export let activeStoreData: {
    id: string;
    name: string;
    subdomain: string;
    address: string;
    waNumber: string;
    googleMapsUrl?: string;
    googleMapsEmbedUrl?: string;
    branchMode?: 'single' | 'multi';
    branches?: any[];
  };
  export let categories: Array<{ id: string; name: string }> = [];
  export let subdomain: string = '';
  export let mainDomain: string = 'localhost:4321';
  export let canvasCssVars: string = '';

  type ViewMode = 'desktop' | 'tablet' | 'mobile';
  export let previewViewMode: ViewMode = 'desktop';

  const VIEW_MODES: Array<{ id: ViewMode; icon: typeof Monitor; label: string }> = [
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
    { id: 'tablet', icon: Tablet, label: 'Tablet' },
    { id: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];

  let previewScrollEl: HTMLDivElement | null = null;
  let containerWidth = 0;
  let canvasHeight = 0;

  $: targetWidth = previewViewMode === 'desktop' ? 1200 : previewViewMode === 'tablet' ? 768 : 375;
  $: paddingHorizontal = 24;
  $: availableWidth = Math.max(0, containerWidth - paddingHorizontal);
  $: scaleRatio = (availableWidth > 0 && availableWidth < targetWidth)
    ? Number(Math.max(0.1, availableWidth / targetWidth).toFixed(4))
    : 1;
  $: scaledWidth = Math.round(targetWidth * scaleRatio);
  $: scaledHeight = canvasHeight > 0 ? Math.round(canvasHeight * scaleRatio) : 0;

  $: if (previewViewMode && previewScrollEl) {
    previewScrollEl.scrollTop = 0;
  }

  onMount(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (target) e.preventDefault();
    };
    previewScrollEl?.addEventListener('click', handleLinkClick, { capture: true });
    return () => {
      previewScrollEl?.removeEventListener('click', handleLinkClick, { capture: true });
    };
  });
</script>

<div class="bg-card rounded-2xl border border-light shadow-md overflow-hidden flex flex-col h-[540px]">
  <!-- Mockup Browser Top Bar -->
  <div class="h-10 px-4 bg-nested border-b border-light flex items-center justify-between gap-2 shrink-0">
    <div class="flex items-center gap-1.5 shrink-0">
      <div class="w-2.5 h-2.5 rounded-full bg-error/80"></div>
      <div class="w-2.5 h-2.5 rounded-full bg-warning/80"></div>
      <div class="w-2.5 h-2.5 rounded-full bg-success/80"></div>
    </div>

    <!-- URL Bar -->
    <div class="px-2.5 py-1 rounded-md bg-card border border-light text-2xs font-mono text-secondary flex items-center gap-1.5 max-w-[200px] sm:max-w-[260px] truncate shadow-2xs">
      <span class="w-2 h-2 rounded-full bg-success shrink-0"></span>
      <span class="text-main font-semibold truncate">{subdomain || 'toko'}.{mainDomain}</span>
      <span class="text-muted shrink-0 text-xs">({Math.round(scaleRatio * 100)}%)</span>
    </div>

    <!-- Device Viewport Switcher -->
    <div class="flex items-center bg-card p-0.5 rounded-lg border border-light gap-0.5 shrink-0">
      {#each VIEW_MODES as mode}
        <button
          type="button"
          on:click={() => (previewViewMode = mode.id)}
          class="p-1 rounded text-xs transition-colors cursor-pointer {previewViewMode === mode.id ? 'bg-primary text-primary-content shadow-2xs' : 'text-secondary hover:text-main'}"
          title="Tampilan {mode.label}"
        >
          <svelte:component this={mode.icon} size={13} />
        </button>
      {/each}
    </div>
  </div>

  <!-- Real Storefront Landing Page Preview Container -->
  <div
    bind:clientWidth={containerWidth}
    class="relative bg-nested/40 w-full flex-1 min-h-0 overflow-hidden flex justify-center items-start p-2 sm:p-3"
  >
    {#if baseConfig}
      <div
        bind:this={previewScrollEl}
        class="w-full h-full overflow-y-auto overflow-x-hidden flex justify-center items-start rounded-xl scrollbar-thin"
      >
        <div
          class="canvas-scale-container relative flex-shrink-0 transition-all duration-300 ease-out"
          style="width: {scaledWidth}px; height: {scaledHeight > 0 ? `${scaledHeight}px` : 'auto'}; min-height: {scaledHeight > 0 ? `${scaledHeight}px` : '100%'};"
        >
          <div
            bind:clientHeight={canvasHeight}
            class="shadow-2xl bg-canvas text-main rounded-xl border border-light overflow-hidden transition-transform duration-300 ease-out flex flex-col"
            style="{canvasCssVars}; width: {targetWidth}px; transform: scale({scaleRatio}); transform-origin: top left; position: {scaleRatio < 1 ? 'absolute' : 'relative'}; top: 0; left: 0;"
          >
            <StorefrontDynamicPage
              config={finalMergedConfig}
              store={activeStoreData}
              products={[]}
              categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.id }))}
              isOpen={true}
              viewModeOverride={previewViewMode}
              isPreview={true}
            />
          </div>
        </div>
      </div>
    {:else}
      <div class="w-full h-full flex flex-col items-center justify-center text-muted text-sm gap-2">
        <Layout size={32} class="opacity-40" />
        <p>Pilih template untuk melihat preview landing page lengkap</p>
      </div>
    {/if}
  </div>
</div>
