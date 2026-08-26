<script lang="ts">
  import { canvasStore } from '../stores/editorStore';
  import type { ProductCatalogProps, SectionStyles, ProductItem } from '@/types';
  import { Package } from 'lucide-svelte';
  import { DEFAULT_DEMO_PRODUCTS, getCardPresetClass } from './productCatalog.helpers';
  import { onMount } from 'svelte';
  import { generateWhatsAppOrderUrl } from '../../../lib/whatsapp';
  import CatalogGridPreset from './catalog/CatalogGridPreset.svelte';
  import CatalogSliderPreset from './catalog/CatalogSliderPreset.svelte';
  import CatalogListPreset from './catalog/CatalogListPreset.svelte';
  import CatalogHeroProductPreset from './catalog/CatalogHeroProductPreset.svelte';

  export let props: ProductCatalogProps & { storeId?: string } = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'grid_standard';

  void sectionId;
  void isActive;

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'grid_standard';
  $: activeStoreId = props.storeId || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('storeId') : null);

  let dynamicProducts: ProductItem[] = [];
  let categories: { id: string; name: string; slug: string }[] = [];
  let activeCategoryId: string = 'all';
  let storeWaNumber: string = '';
  let isLoading = false;

  $: rawProducts = Array.isArray(props?.products) ? props.products : [];
  $: products = activeStoreId ? dynamicProducts : ((rawProducts.length > 0 ? rawProducts : DEFAULT_DEMO_PRODUCTS) as ProductItem[]);

  $: isMobileView = $canvasStore?.viewMode === 'mobile';
  $: isTabletView = $canvasStore?.viewMode === 'tablet';
  $: colDesktop = Number(props?.columnsDesktop ?? styles?.columnsDesktop ?? 3);
  $: colTablet = Number(props?.columnsTablet ?? styles?.columnsTablet ?? 2);
  $: colMobile = Number(props?.columnsMobile ?? styles?.columnsMobile ?? 1);

  $: colClass = (() => {
    if (activePreset === 'grid_2_col_large') return 'grid grid-cols-1 md:grid-cols-2';
    if (isMobileView) return colMobile === 2 ? 'grid grid-cols-2' : 'grid grid-cols-1';
    if (isTabletView) return colTablet === 3 ? 'grid grid-cols-3' : 'grid grid-cols-2';
    if (colDesktop === 4) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    if (colDesktop === 2) return 'grid grid-cols-1 md:grid-cols-2';
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  })();

  $: cardBorderRadius = (props?.cardBorderRadius as string) || '16px';
  $: cardPresetStyle = getCardPresetClass((props?.cardPreset as string) || 'minimal_flat');

  async function fetchStoreProducts(storeId: string, page = 1, categoryId?: string) {
    isLoading = true;
    try {
      let url = `/api/stores/${storeId}/products?page=${page}&limit=12`;
      if (categoryId && categoryId !== 'all') url += `&categoryId=${categoryId}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          dynamicProducts = data.data.products || [];
          categories = data.data.categories || [];
          storeWaNumber = data.data.store?.waNumber || '';
        }
      }
    } catch {
      // Fallback gracefully to demo products
    } finally {
      isLoading = false;
    }
  }

  function handleOrderWhatsApp(product: ProductItem) {
    if (typeof window === 'undefined') return;
    const targetWa = storeWaNumber || (props?.whatsappNumber as string) || (props?.waNumber as string) || '628123456789';
    const waUrl = generateWhatsAppOrderUrl(targetWa, product.name || 'Produk', Number(product.price) || 0);
    window.open(waUrl, '_blank');
  }

  onMount(() => {
    if (activeStoreId) fetchStoreProducts(activeStoreId);
  });
</script>

<section
  class="relative w-full py-12 transition-all {isActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-base-100' : ''}"
  style:background-color="var(--theme-bg)"
>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
    <!-- Header -->
    <div class="mb-8 text-center max-w-2xl mx-auto">
      {#if props.badge}
        <span class="inline-block px-3 py-1 mb-2 text-xs font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary">
          {props.badge}
        </span>
      {/if}
      <h2 class="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
        {props.title || 'Katalog Produk Kami'}
      </h2>
      {#if props.subtitle}
        <p class="mt-2 text-sm text-base-content/60">{props.subtitle}</p>
      {/if}
    </div>

    <!-- Category Filter Tabs -->
    {#if categories.length > 0}
      <div class="flex flex-wrap items-center justify-center gap-2 mb-8">
        <button
          type="button"
          on:click={() => { activeCategoryId = 'all'; if (activeStoreId) fetchStoreProducts(activeStoreId, 1, 'all'); }}
          class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer {activeCategoryId === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-base-200/80 text-base-content/70 hover:bg-base-200'}"
        >
          Semua
        </button>
        {#each categories as cat}
          <button
            type="button"
            on:click={() => { activeCategoryId = cat.id; if (activeStoreId) fetchStoreProducts(activeStoreId, 1, cat.id); }}
            class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer {activeCategoryId === cat.id ? 'bg-primary text-white shadow-sm' : 'bg-base-200/80 text-base-content/70 hover:bg-base-200'}"
          >
            {cat.name}
          </button>
        {/each}
      </div>
    {/if}

    <!-- Content Presets -->
    {#if products.length === 0 && !isLoading}
      <div class="py-12 text-center text-base-content/50 border border-dashed border-base-300 dark:border-slate-800 rounded-2xl">
        <Package size={32} class="mx-auto mb-2 opacity-40" />
        <p class="text-xs font-medium">Belum ada produk yang tersedia saat ini.</p>
      </div>
    {:else if activePreset === 'carousel_scroll' || activePreset === 'horizontal_card_slider'}
      <CatalogSliderPreset {products} {cardBorderRadius} onOrderWhatsApp={handleOrderWhatsApp} />
    {:else if activePreset === 'list_compact' || activePreset === 'catalog_table_menu'}
      <CatalogListPreset {products} {activePreset} {cardBorderRadius} onOrderWhatsApp={handleOrderWhatsApp} />
    {:else if activePreset === 'featured_hero_product'}
      <CatalogHeroProductPreset {products} {cardBorderRadius} onOrderWhatsApp={handleOrderWhatsApp} />
    {:else}
      <CatalogGridPreset
        {products}
        {activePreset}
        {colClass}
        {cardBorderRadius}
        {cardPresetStyle}
        onOrderWhatsApp={handleOrderWhatsApp}
      />
    {/if}
  </div>
</section>
