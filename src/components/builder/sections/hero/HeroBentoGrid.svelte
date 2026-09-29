<script lang="ts">
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = 'Pusat Batik Khas Tradisional';
  export let tagName: string = 'h1';
  export let title: string = 'Kain Batik Tulis Motif Asli Warisan Budaya';
  export let subtitle: string = 'Ditenun dari benang sutra halus dengan pewarna alami ramah lingkungan oleh para pengrajin lokal.';
  export let ctaText: string = 'Lihat Motif Baru';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=80'
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'image'];

  $: hasImage = elementOrder.includes('image');
  $: isImageActive = activeNodeId === 'hero_bento_image' || activeNodeId === 'hero_image' || activeNodeId === 'image';
  $: isPromoActive = activeNodeId === 'hero_bento_promo';
  $: isReviewActive = activeNodeId === 'hero_bento_review';
</script>

<div class="py-10">
  <div class="cq-bento-grid gap-4">
    <!-- Tile 1: Main text -->
    <div class={`bg-[var(--color-card-base)] p-6 sm:p-8 rounded-2xl shadow-xs border border-[var(--color-border)] ${hasImage ? 'cq-bento-span-7' : 'cq-bento-span-12'} flex flex-col justify-between text-left`}>
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
        align="left"
      />
    </div>

    <!-- Tile 2: Main Image (Sub-node hero_bento_image) -->
    {#if hasImage && imageUrl}
      <div
        data-node="hero_bento_image"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_bento_image')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_bento_image')}
        class={`rounded-2xl overflow-hidden shadow-xs border border-[var(--color-border)] cq-bento-span-5 h-64 sm:h-auto transition-all cursor-pointer ${
          isImageActive
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
            : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
      >
        <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
      </div>
    {/if}

    <!-- Tile 3: Promo Discount (Sub-node hero_bento_promo) -->
    <div
      data-node="hero_bento_promo"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_bento_promo')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_bento_promo')}
      style="background-color: var(--color-primary); color: var(--theme-btn-primary-text, currentColor);"
      class={`p-5 rounded-2xl shadow-xs cq-bento-span-4 text-left flex flex-col justify-between transition-all cursor-pointer ${
        isPromoActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <span class="text-xs font-bold uppercase tracking-wider opacity-90">Diskon Pembeli Pertama</span>
      <p class="text-2xl font-extrabold my-2 font-heading">Potongan 25%</p>
      <span class="text-xs opacity-80 font-sans">Klaim voucher di WhatsApp sekarang</span>
    </div>

    <!-- Tile 4: Review Quote (Sub-node hero_bento_review) -->
    <div
      data-node="hero_bento_review"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_bento_review')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_bento_review')}
      class={`bg-[var(--color-card-base)] p-5 rounded-2xl shadow-xs border border-[var(--color-border)] cq-bento-span-4 text-left transition-all cursor-pointer ${
        isReviewActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <div class="text-amber-400 text-xs mb-1">★★★★★</div>
      <p class="text-xs text-[var(--color-text-secondary)] italic font-sans">"Bahan sangat halus dan adem, motifnya khas dan tidak pasaran."</p>
      <p class="text-[11px] font-bold text-[var(--color-text-main)] font-heading mt-2">- Pelanggan Terverifikasi</p>
    </div>

    <!-- Tile 5: Fast Delivery -->
    <div class="bg-[var(--color-card-base)] p-5 rounded-2xl shadow-xs border border-[var(--color-border)] cq-bento-span-4 text-left flex items-center gap-3">
      <div
        style="background-color: var(--color-nested-base); color: var(--color-primary);"
        class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
      >
        🚚
      </div>
      <div>
        <p class="font-bold text-xs text-[var(--color-text-main)] font-heading">Kirim Seluruh Indonesia</p>
        <p class="text-2xs text-[var(--color-text-secondary)] font-sans">Packing aman bubble wrap tebal</p>
      </div>
    </div>
  </div>
</div>
