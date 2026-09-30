<script lang="ts">
  import { editorStore, canvasStore } from '../../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';
  import { formatIDR } from '@/lib/currency';
  import { AlertCircle } from 'lucide-svelte';
  import HeroHeaderContent from './HeroHeaderContent.svelte';
  import { stripEmoji } from './heroIcons';

  export let badgeText: string = 'Paket Bundling Spesial';
  export let badgeIcon: string = '';
  export let tagName: string = 'h1';
  export let title: string = 'Dua Varian Paling Dicari Pekan Ini';
  export let subtitle: string = 'Pilih paket bundling favorit untuk mendapatkan gratis ongkir dan bonus merchandise menarik.';
  export let ctaText: string = 'Pesan Varian';
  export let ctaLink: string = '#products';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let waNumber: string = '';
  export let selectedProductIndex1: number = -1;
  export let selectedProductIndex2: number = -1;
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'product_cards'];

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isTablet = viewMode === 'tablet';

  interface CatalogProduct {
    name?: string;
    price?: number;
    imageUrl?: string;
    image?: string;
    imageUrls?: string[];
    description?: string;
    badge?: string;
  }

  $: catalogSection = $editorStore?.template?.config?.sections?.find(
    (s: any) => s.type === 'catalog' || s.type === 'product_catalog'
  );
  $: catalogProducts = ((catalogSection?.props?.products as CatalogProduct[]) || []);
  $: productCount = catalogProducts.length;

  $: defaultIndex1 = productCount === 2 ? 0 : productCount >= 3 ? productCount - 1 : 0;
  $: defaultIndex2 = productCount === 2 ? 1 : productCount >= 3 ? productCount - 2 : 1;

  $: activeIndex1 =
    selectedProductIndex1 >= 0 && selectedProductIndex1 < productCount
      ? selectedProductIndex1
      : defaultIndex1;

  $: activeIndex2 =
    selectedProductIndex2 >= 0 && selectedProductIndex2 < productCount
      ? selectedProductIndex2
      : defaultIndex2;

  const fallbackProduct1: CatalogProduct = {
    name: 'Paket Varian A - Best Seller',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
    description: 'Cita rasa unik dengan kemasan ramah lingkungan',
  };

  const fallbackProduct2: CatalogProduct = {
    name: 'Paket Varian B - Premium',
    price: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    description: 'Kualitas unggulan dengan aroma khas istimewa',
  };

  $: displayProduct1 = productCount > 0 ? (catalogProducts[activeIndex1] || catalogProducts[0] || fallbackProduct1) : fallbackProduct1;
  $: displayProduct2 = productCount > 1 ? (catalogProducts[activeIndex2] || catalogProducts[1] || fallbackProduct2) : fallbackProduct2;

  $: prod1Image = productCount > 0
    ? (displayProduct1.image || displayProduct1.imageUrl || displayProduct1.imageUrls?.[0] || '')
    : fallbackProduct1.imageUrl;

  $: prod2Image = productCount > 1
    ? (displayProduct2.image || displayProduct2.imageUrl || displayProduct2.imageUrls?.[0] || '')
    : fallbackProduct2.imageUrl;

  $: hasDesc1 = productCount > 0
    ? Boolean(displayProduct1.description && displayProduct1.description.trim())
    : Boolean(fallbackProduct1.description);

  $: hasDesc2 = productCount > 1
    ? Boolean(displayProduct2.description && displayProduct2.description.trim())
    : Boolean(fallbackProduct2.description);

  $: waUrl1 = generateWhatsAppLink(waNumber, `Halo, saya ingin membeli ${displayProduct1.name || title}`);
  $: waUrl2 = generateWhatsAppLink(waNumber, `Halo, saya ingin membeli ${displayProduct2.name || title}`);
  $: effectiveCtaLink1 = waNumber ? waUrl1 : ctaLink;
  $: effectiveCtaLink2 = waNumber ? waUrl2 : ctaLink;

  $: hasProductCards = elementOrder.includes('product_cards');
  $: isProductActive = activeNodeId === 'hero_product_cards' || activeNodeId === 'product_cards';
</script>

{#snippet cardsBlock()}
  {#if hasProductCards}
    <div
      data-node="hero_product_cards"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_product_cards')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_product_cards')}
      class={`grid gap-4 sm:gap-6 mx-auto text-left p-2 rounded-2xl transition-all cursor-pointer ${
        isMobile ? 'grid-cols-1 max-w-sm' : 'grid-cols-1 sm:grid-cols-2 max-w-3xl'
      } ${
        isProductActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 bg-primary/5'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      {#if productCount === 0}
        <div class="sm:col-span-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
          <AlertCircle size={15} class="shrink-0" />
          <span>Menampilkan contoh preview. Tambahkan produk di <strong>Katalog Produk</strong> agar tersinkronisasi otomatis.</span>
        </div>
      {/if}

      <!-- Kartu Produk 1 -->
      <div class="card bg-[var(--color-card-base)] p-4 sm:p-5 rounded-2xl shadow-md border border-[var(--color-border)] flex flex-col justify-between">
        <div>
          <div class="aspect-video w-full rounded-xl overflow-hidden bg-[var(--color-nested-base)] mb-3 flex items-center justify-center">
            {#if prod1Image}
              <img src={prod1Image} alt={displayProduct1.name || 'Produk 1'} class="w-full h-full object-cover" />
            {:else}
              <div class="text-xs text-[var(--color-text-secondary)]">Tidak ada foto produk</div>
            {/if}
          </div>
          <h3 class="font-heading font-bold text-sm text-[var(--color-text-main)] mb-1">{stripEmoji(displayProduct1.name || fallbackProduct1.name)}</h3>
          {#if hasDesc1}
            <p class="text-xs text-[var(--color-text-secondary)] mb-4 font-sans line-clamp-2">
              {stripEmoji(productCount > 0 ? (displayProduct1.description || '') : fallbackProduct1.description)}
            </p>
          {:else}
            <div class="mb-4"></div>
          {/if}
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
          <span class="font-heading font-bold text-sm" style="color: var(--color-primary);">{formatIDR(displayProduct1.price || 0)}</span>
          <a
            href={effectiveCtaLink1}
            target={waNumber ? '_blank' : '_self'}
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);"
            class="btn btn-primary btn-xs sm:btn-sm h-8 px-4 text-xs font-heading font-semibold shadow-xs"
          >
            {ctaText || 'Pesan'}
          </a>
        </div>
      </div>

      <!-- Kartu Produk 2 -->
      <div class="card bg-[var(--color-card-base)] p-4 sm:p-5 rounded-2xl shadow-md border border-[var(--color-border)] flex flex-col justify-between">
        <div>
          <div class="aspect-video w-full rounded-xl overflow-hidden bg-[var(--color-nested-base)] mb-3 flex items-center justify-center">
            {#if prod2Image}
              <img src={prod2Image} alt={displayProduct2.name || 'Produk 2'} class="w-full h-full object-cover" />
            {:else}
              <div class="text-xs text-[var(--color-text-secondary)]">Tidak ada foto produk</div>
            {/if}
          </div>
          <h3 class="font-heading font-bold text-sm text-[var(--color-text-main)] mb-1">{stripEmoji(displayProduct2.name || fallbackProduct2.name)}</h3>
          {#if hasDesc2}
            <p class="text-xs text-[var(--color-text-secondary)] mb-4 font-sans line-clamp-2">
              {stripEmoji(productCount > 1 ? (displayProduct2.description || '') : fallbackProduct2.description)}
            </p>
          {:else}
            <div class="mb-4"></div>
          {/if}
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
          <span class="font-heading font-bold text-sm" style="color: var(--color-primary);">{formatIDR(displayProduct2.price || 0)}</span>
          <a
            href={effectiveCtaLink2}
            target={waNumber ? '_blank' : '_self'}
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);"
            class="btn btn-primary btn-xs sm:btn-sm h-8 px-4 text-xs font-heading font-semibold shadow-xs"
          >
            {ctaText || 'Pesan'}
          </a>
        </div>
      </div>
    </div>
  {/if}
{/snippet}

<div class={`text-center w-full ${isMobile ? 'py-6' : isTablet ? 'py-10' : 'py-12 md:py-16'}`}>
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
    customBlocks={{ product_cards: cardsBlock }}
  />
</div>
