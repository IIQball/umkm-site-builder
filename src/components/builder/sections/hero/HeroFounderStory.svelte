<script lang="ts">
  import HeroHeaderContent from './HeroHeaderContent.svelte';
  import HeroImageCard from './HeroImageCard.svelte';

  export let badgeText: string = 'Kisah di Balik Dapur Kami';
  export let badgeIcon: string = '';
  export let tagName: string = 'h1';
  export let title: string = '"Kami Memasak Seperti Menyajikan Makanan untuk Ibu Sendiri"';
  export let subtitle: string = 'Bermula dari warung kecil tahun 2012, kami mempertahankan racikan bumbu ulek tradisional tanpa MSG berlebih demi menjaga kemurnian rasa.';
  export let ctaText: string = 'Coba Menu Kami';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&auto=format&fit=crop&q=80';
  export let imageFrame: 'none' | 'card' | 'grid' = 'none';
  export let imageShape: 'rounded' | 'square' | 'circle' | 'squircle' = 'rounded';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['image', 'badge', 'title', 'subtitle', 'cta'];
  export let founderRole: string = 'Pendiri & Artisan';
  export let founderTitle: string = 'Pengrajin Resep Asli';

  $: hasImage = elementOrder.includes('image');
  $: imgIdx = elementOrder.indexOf('image');
  $: titleIdx = elementOrder.indexOf('title') !== -1 ? elementOrder.indexOf('title') : 1;
  $: isImageLeft = imgIdx !== -1 ? imgIdx < titleIdx : true;
  $: isPhotoActive = activeNodeId === 'hero_founder_photo' || activeNodeId === 'hero_image' || activeNodeId === 'image';
</script>

{#snippet founderBadge()}
  <div class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-left pointer-events-none rounded-b-2xl">
    <p class="font-bold text-sm font-heading">{founderRole || 'Pendiri & Artisan'}</p>
    <p class="text-[11px] text-slate-300">{founderTitle || 'Pengrajin Resep Asli'}</p>
  </div>
{/snippet}

{#snippet photoBlock()}
  {#if imageUrl}
    <HeroImageCard
      {imageUrl}
      altText={title}
      {imageFrame}
      {imageShape}
      aspectRatio="aspect-[4/5]"
      maxWidthClass="w-full max-w-sm mx-auto"
      nodeKey="hero_founder_photo"
      isActive={isPhotoActive}
      {selectNode}
      {selectNodeKey}
      customOverlay={founderBadge}
    />
  {/if}
{/snippet}

{#snippet textBlock()}
  <div class="text-left">
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
{/snippet}

<div class="py-10">
  {#if !hasImage}
    <div class="max-w-2xl mx-auto text-center space-y-4">
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
    <div class="cq-grid-split items-center gap-8">
      {#if isImageLeft}
        {@render photoBlock()}
        {@render textBlock()}
      {:else}
        {@render textBlock()}
        {@render photoBlock()}
      {/if}
    </div>
  {/if}
</div>
