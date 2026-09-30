<script lang="ts">
  import HeroHeaderContent from './HeroHeaderContent.svelte';
  import HeroImageCard from './HeroImageCard.svelte';

  export let badgeText: string = '';
  export let badgeIcon: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#products';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let waNumber: string = '';
  export let imageUrl: string = '';
  export let imageFrame: 'none' | 'card' | 'grid' = 'none';
  export let imageShape: 'rounded' | 'square' | 'circle' | 'squircle' = 'rounded';
  export let activeNodeId: string | null = null;
  export let selectNode: (e: MouseEvent, key: string) => void = () => {};
  export let selectNodeKey: (e: KeyboardEvent, key: string) => void = () => {};
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'image'];

  $: isImageActive =
    activeNodeId === 'hero_image' || activeNodeId === 'hero_media' || activeNodeId === 'image';
  $: hasImage = elementOrder.includes('image');
</script>

{#snippet imageBlock()}
  {#if imageUrl && hasImage}
    <div class="my-3 w-full flex justify-center">
      <HeroImageCard
        {imageUrl}
        altText={title}
        {imageFrame}
        {imageShape}
        aspectRatio="aspect-[16/9]"
        maxWidthClass="w-full max-w-4xl"
        nodeKey="hero_image"
        isActive={isImageActive}
        {selectNode}
        {selectNodeKey}
      />
    </div>
  {/if}
{/snippet}

<div class="w-full py-6">
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
    customBlocks={{ image: imageBlock }}
  />
</div>
