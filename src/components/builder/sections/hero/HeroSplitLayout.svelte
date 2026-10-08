<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';
  import HeroHeaderContent from './HeroHeaderContent.svelte';
  import HeroImageCard from './HeroImageCard.svelte';

  export let isImageLeft: boolean = false;
  export let badgeText: string = '';
  export let badgeIcon: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#products';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let imageUrl: string = '';
  export let imageFrame: 'none' | 'card' | 'grid' = 'none';
  export let imageShape: 'rounded' | 'square' | 'circle' | 'squircle' = 'rounded';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent, key: string) => void = () => {};
  export let selectNodeKey: (e: KeyboardEvent, key: string) => void = () => {};
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'image'];

  $: hasImage = elementOrder.includes('image');
  $: imgIdx = elementOrder.indexOf('image');
  $: titleIdx = elementOrder.indexOf('title') !== -1 ? elementOrder.indexOf('title') : 1;
  $: effectiveIsImageLeft = imgIdx !== -1 ? imgIdx < titleIdx : isImageLeft;

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';
  $: isImageActive =
    activeNodeId === 'hero_image' || activeNodeId === 'hero_media' || activeNodeId === 'image';
</script>

{#if !hasImage}
  <!-- Tampilan Penuh / Terpusat saat gambar dihapus -->
  <div class="w-full max-w-3xl mx-auto py-6">
    <HeroHeaderContent
      {badgeText}
      {badgeIcon}
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
      {elementOrder}
      align="center"
    />
  </div>
{:else}
  <div class={`w-full grid gap-8 lg:gap-12 items-center ${isSmallScreen ? 'grid-cols-1' : 'grid-cols-12'}`}>
    {#if effectiveIsImageLeft}
      <!-- Left: Image -->
      <div class={`w-full ${isSmallScreen ? 'order-2' : 'col-span-6 order-1'}`}>
        <HeroImageCard
          {imageUrl}
          altText={title}
          {imageFrame}
          {imageShape}
          aspectRatio="aspect-[4/3]"
          nodeKey="hero_image"
          isActive={isImageActive}
          {selectNode}
          {selectNodeKey}
        />
      </div>

      <!-- Right: Text Content -->
      <div class={`w-full ${isSmallScreen ? 'order-1' : 'col-span-6 order-2'}`}>
        <HeroHeaderContent
          {badgeText}
          {badgeIcon}
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
          {elementOrder}
          align="left"
        />
      </div>
    {:else}
      <!-- Left: Text Content -->
      <div class={`w-full ${isSmallScreen ? 'col-span-1' : 'col-span-6'}`}>
        <HeroHeaderContent
          {badgeText}
          {badgeIcon}
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
          {elementOrder}
          align="left"
        />
      </div>

      <!-- Right: Image -->
      <div class={`w-full ${isSmallScreen ? 'col-span-1' : 'col-span-6'}`}>
        <HeroImageCard
          {imageUrl}
          altText={title}
          {imageFrame}
          {imageShape}
          aspectRatio="aspect-[4/3]"
          nodeKey="hero_image"
          isActive={isImageActive}
          {selectNode}
          {selectNodeKey}
        />
      </div>
    {/if}
  </div>
{/if}
