<script lang="ts">
  import { Star } from 'lucide-svelte';
  import HeroHeaderContent from './HeroHeaderContent.svelte';
  import HeroImageCard from './HeroImageCard.svelte';
  import { resolveFeatureIcon } from './heroIcons';

  export let badgeText: string = 'Pusat Batik Khas Tradisional';
  export let badgeIcon: string = '';
  export let tagName: string = 'h1';
  export let title: string = 'Kain Batik Tulis Motif Asli Warisan Budaya';
  export let subtitle: string = 'Ditenun dari benang sutra halus dengan pewarna alami ramah lingkungan oleh para pengrajin lokal.';
  export let ctaText: string = 'Lihat Motif Baru';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=80';
  export let imageFrame: 'none' | 'card' | 'grid' = 'none';
  export let imageShape: 'rounded' | 'square' | 'circle' | 'squircle' = 'rounded';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'image'];

  // Bento customization props
  export let bentoPromoTitle: string = 'Diskon Pembeli Pertama';
  export let bentoPromoHighlight: string = 'Potongan 25%';
  export let bentoPromoSubtitle: string = 'Klaim voucher di WhatsApp sekarang';
  export let bentoPromoTextColor: string = 'auto';
  export let bentoReviewStars: number = 5;
  export let bentoReviewText: string = '"Bahan sangat halus dan adem, motifnya khas dan tidak pasaran."';
  export let bentoReviewAuthor: string = '- Pelanggan Terverifikasi';
  export let bentoFeatureIcon: string = 'Truck';
  export let bentoFeatureTitle: string = 'Kirim Seluruh Indonesia';
  export let bentoFeatureSubtitle: string = 'Packing aman bubble wrap tebal';

  $: hasImage = elementOrder.includes('image');
  $: hasPromo = elementOrder.includes('bento_promo');
  $: hasReview = elementOrder.includes('bento_review');
  $: bottomTileSpanClass = hasPromo && hasReview ? 'cq-bento-span-4' : hasPromo || hasReview ? 'cq-bento-span-6' : 'cq-bento-span-12';
  $: isImageActive = activeNodeId === 'hero_bento_image' || activeNodeId === 'hero_image' || activeNodeId === 'image';
  $: isPromoActive = activeNodeId === 'hero_bento_promo';
  $: isReviewActive = activeNodeId === 'hero_bento_review';

  $: starCount = typeof bentoReviewStars === 'number' && bentoReviewStars >= 1 && bentoReviewStars <= 5 ? bentoReviewStars : 5;
  $: FeatureIconComponent = resolveFeatureIcon(bentoFeatureIcon);
  $: promoTextColorStyle = bentoPromoTextColor && bentoPromoTextColor !== 'auto' ? `color: ${bentoPromoTextColor};` : 'color: var(--theme-btn-primary-text, currentColor);';
</script>

<div class="py-10">
  <div class="cq-bento-grid gap-4">
    <!-- Tile 1: Main text -->
    <div class={`bg-[var(--color-card-base)] p-6 sm:p-8 rounded-2xl shadow-xs border border-[var(--color-border)] ${hasImage ? 'cq-bento-span-7' : 'cq-bento-span-12'} flex flex-col justify-between text-left`}>
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

    <!-- Tile 2: Main Image (Sub-node hero_bento_image) -->
    {#if hasImage && imageUrl}
      <div class="cq-bento-span-5 h-64 sm:h-auto flex flex-col justify-center">
        <HeroImageCard
          {imageUrl}
          altText={title}
          {imageFrame}
          {imageShape}
          aspectRatio="aspect-auto h-full"
          maxWidthClass="w-full h-full"
          nodeKey="hero_bento_image"
          isActive={isImageActive}
          {selectNode}
          {selectNodeKey}
        />
      </div>
    {/if}

    <!-- Tile 3: Promo Discount (Sub-node hero_bento_promo) -->
    {#if hasPromo}
      <div
        data-node="hero_bento_promo"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_bento_promo')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_bento_promo')}
        style="background-color: var(--color-primary); {promoTextColorStyle}"
        class={`p-5 rounded-2xl shadow-xs ${bottomTileSpanClass} text-left flex flex-col justify-between transition-all cursor-pointer ${
          isPromoActive
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100'
            : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
      >
        <span class="text-xs font-bold uppercase tracking-wider opacity-90">{bentoPromoTitle}</span>
        <p class="text-2xl font-extrabold my-2 font-heading">{bentoPromoHighlight}</p>
        <span class="text-xs opacity-80 font-sans">{bentoPromoSubtitle}</span>
      </div>
    {/if}

    <!-- Tile 4: Review Quote (Sub-node hero_bento_review) -->
    {#if hasReview}
      <div
        data-node="hero_bento_review"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_bento_review')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_bento_review')}
        class={`bg-[var(--color-card-base)] p-5 rounded-2xl shadow-xs border border-[var(--color-border)] ${bottomTileSpanClass} text-left transition-all cursor-pointer ${
          isReviewActive
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100'
            : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
      >
        <div class="flex items-center gap-0.5 text-amber-400 mb-1">
          {#each Array(starCount) as _}
            <Star size={12} class="fill-current text-amber-400" />
          {/each}
        </div>
        <p class="text-xs text-[var(--color-text-secondary)] italic font-sans">{bentoReviewText}</p>
        <p class="text-[11px] font-bold text-[var(--color-text-main)] font-heading mt-2">{bentoReviewAuthor}</p>
      </div>
    {/if}

    <!-- Tile 5: Fast Delivery / Feature -->
    <div class={`bg-[var(--color-card-base)] p-5 rounded-2xl shadow-xs border border-[var(--color-border)] ${bottomTileSpanClass} text-left flex items-center gap-3`}>
      <div
        style="background-color: var(--color-nested-base); color: var(--color-primary);"
        class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      >
        {#if FeatureIconComponent}
          <svelte:component this={FeatureIconComponent} class="w-5 h-5" />
        {/if}
      </div>
      <div>
        <p class="font-bold text-xs text-[var(--color-text-main)] font-heading">{bentoFeatureTitle}</p>
        <p class="text-2xs text-[var(--color-text-secondary)] font-sans">{bentoFeatureSubtitle}</p>
      </div>
    </div>
  </div>
</div>
