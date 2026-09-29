<script lang="ts">
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#products';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let waNumber: string = '';
  export let imageUrl: string = '';
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
    <div
      data-node="image"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'hero_image')}
      on:keydown={(e) => selectNodeKey(e, 'hero_image')}
      class={`w-full max-w-4xl my-3 p-2 rounded-2xl bg-[var(--color-card-base)] border border-[var(--color-border)] shadow-lg transition-all cursor-pointer ${
        isImageActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <img
        src={imageUrl}
        alt="Pratinjau Banner Hero"
        class="w-full aspect-[16/9] object-cover rounded-xl"
      />
    </div>
  {/if}
{/snippet}

<div class="w-full py-6">
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
    {elementOrder}
    align="center"
    customBlocks={{ image: imageBlock }}
  />
</div>
