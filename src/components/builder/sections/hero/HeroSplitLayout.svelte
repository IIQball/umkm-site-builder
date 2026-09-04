<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let isImageLeft: boolean = false;
  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#products';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let imageUrl: string = '';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent, key: string) => void = () => {};
  export let selectNodeKey: (e: KeyboardEvent, key: string) => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';
  $: isImageActive = activeNodeId === 'hero_image' || activeNodeId === 'hero_media' || activeNodeId === 'image';
</script>

<div class={`w-full grid gap-8 lg:gap-12 items-center ${isSmallScreen ? 'grid-cols-1' : 'grid-cols-12'}`}>
  {#if isImageLeft}
    <!-- Left: Image -->
    <div
      data-node="image"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'hero_image')}
      on:keydown={(e) => selectNodeKey(e, 'hero_image')}
      class={`w-full transition-all cursor-pointer rounded-2xl p-1.5 ${isSmallScreen ? 'order-2' : 'col-span-6 order-1'} ${
        isImageActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      {#if imageUrl}
        <div class="p-2 rounded-2xl bg-[var(--color-card-base,#ffffff)] border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-md overflow-hidden">
          <img
            src={imageUrl}
            alt="Hero Preview"
            class="w-full aspect-[4/3] object-cover rounded-xl"
          />
        </div>
      {/if}
    </div>

    <!-- Right: Text Content -->
    <div class={`w-full ${isSmallScreen ? 'order-1' : 'col-span-6 order-2'}`}>
      <HeroHeaderContent
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {waNumber}
        {activeNodeId}
        {selectNode}
        {selectNodeKey}
        align="left"
      />
    </div>
  {:else}
    <!-- Left: Text Content -->
    <div class={`w-full ${isSmallScreen ? 'col-span-1' : 'col-span-6'}`}>
      <HeroHeaderContent
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {waNumber}
        {activeNodeId}
        {selectNode}
        {selectNodeKey}
        align="left"
      />
    </div>

    <!-- Right: Image -->
    <div
      data-node="image"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'hero_image')}
      on:keydown={(e) => selectNodeKey(e, 'hero_image')}
      class={`w-full transition-all cursor-pointer rounded-2xl p-1.5 ${isSmallScreen ? 'col-span-1' : 'col-span-6'} ${
        isImageActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      {#if imageUrl}
        <div class="p-2 rounded-2xl bg-[var(--color-card-base,#ffffff)] border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-md overflow-hidden">
          <img
            src={imageUrl}
            alt="Hero Preview"
            class="w-full aspect-[4/3] object-cover rounded-xl"
          />
        </div>
      {/if}
    </div>
  {/if}
</div>
