<script lang="ts">
  import type { ProductCatalogProps, SectionStyles, ProductItem } from '@/types';
  import { ShoppingCart } from 'lucide-svelte';
  import { DEFAULT_DEMO_PRODUCTS, getCleanWaNumber } from './productCatalog.helpers';
  import CatalogHeader from './catalog/CatalogHeader.svelte';
  import CatalogGridStandard from './catalog/CatalogGridStandard.svelte';
  import CatalogCarouselScroll from './catalog/CatalogCarouselScroll.svelte';
  import CatalogListCompact from './catalog/CatalogListCompact.svelte';
  import CatalogMasonry from './catalog/CatalogMasonry.svelte';
  import CatalogBentoSpotlight from './catalog/CatalogBentoSpotlight.svelte';
  import CatalogSidebarFilter from './catalog/CatalogSidebarFilter.svelte';
  import CatalogPriceTable from './catalog/CatalogPriceTable.svelte';
  import CatalogLookbook from './catalog/CatalogLookbook.svelte';
  import CatalogFlashSale from './catalog/CatalogFlashSale.svelte';
  import CatalogBundleTiers from './catalog/CatalogBundleTiers.svelte';
  import CatalogSingleFocus from './catalog/CatalogSingleFocus.svelte';
  import CatalogSpecialCards from './catalog/CatalogSpecialCards.svelte';
  import CatalogAccordion from './catalog/CatalogAccordion.svelte';
  import CatalogCheckoutModal from './catalog/CatalogCheckoutModal.svelte';
  import { fly } from 'svelte/transition';
  import './catalog/catalog.css';

  export let sectionId: string = '';
  export let props: ProductCatalogProps & { storeId?: string } = {};
  export let styles: SectionStyles = {};
  export let layoutPreset: string = 'grid_standard';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'grid_standard';

  let dynamicProducts: ProductItem[] = [];
  let categories: { id: string; name: string; slug: string }[] = [];
  let activeCategoryId: string = 'all';
  let storeWaNumber: string = '';
  let currentView: 'catalog' | 'checkout' = 'catalog';
  let cart: any[] = [];
  let form = { name: '', phone: '', address: '', delivery: 'Reguler', notes: '' };

  $: products = ((dynamicProducts.length > 0 ? dynamicProducts : (Array.isArray(props?.products) && props.products.length > 0 ? props.products : DEFAULT_DEMO_PRODUCTS)) || DEFAULT_DEMO_PRODUCTS) as ProductItem[];
  $: effectiveWaNumber = getCleanWaNumber(storeWaNumber || (props?.whatsappNumber as string) || (typeof window !== 'undefined' ? localStorage.getItem('storeWaNumber') || '' : ''));

  $: title = (props?.title as string) || (props?.heading as string) || 'Katalog Produk Pilihan';
  $: subtitle = (props?.subtitle as string) || 'Jelajahi produk berkualitas terbaik dengan penawaran harga menarik hari ini.';
  $: badgeText = (props?.badgeText as string) || (props?.categoryBadge as string) || 'Produk Unggulan';

  $: totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  $: detailedCart = cart.map((item) => ({ ...item, subtotal: item.price * item.qty }));
  $: cartTotal = detailedCart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleAddToCart = (product: ProductItem, selections: Record<string, string>) => {
    const variantId = JSON.stringify(selections);
    const existing = cart.find((c) => c.product.id === product.id && c.variantId === variantId);
    if (existing) {
      existing.qty++;
      cart = [...cart];
    } else {
      let base = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0).replace(/[^0-9.-]+/g, '')) || 0;
      cart = [...cart, { product, variantId, selections, qty: 1, price: base, subtotal: base }];
    }
  };

  const handleBuyNow = (product: ProductItem, selections: Record<string, string>) => {
    handleAddToCart(product, selections);
    currentView = 'checkout';
  };

  const updateCartQty = (idx: number, delta: number) => {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart = cart.filter((_, i) => i !== idx);
    else cart = [...cart];
  };

  const removeFromCart = (idx: number) => {
    cart = cart.filter((_, i) => i !== idx);
  };

  const handleCheckout = () => {
    if (!form.name || !form.phone || !form.address) {
      alert('Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Pengiriman.');
      return;
    }
    const itemsSummary = detailedCart
      .map((item) => `• ${item.product.name} (x${item.qty}) - Rp ${item.subtotal.toLocaleString('id-ID')}\n  Varian: ${Object.values(item.selections).join(', ') || 'Standar'}`)
      .join('\n');
    const message = `Halo, saya ingin memesan dari katalog toko:\n\n*DAFTAR PESANAN:*\n${itemsSummary}\n\n*TOTAL:* Rp ${cartTotal.toLocaleString('id-ID')}\n\n*DATA PENGIRIMAN:*\nNama: ${form.name}\nWhatsApp: ${form.phone}\nAlamat: ${form.address}\nPengiriman: ${form.delivery}\nCatatan: ${form.notes || '-'}\n\nMohon konfirmasi ketersediaan & info rekening. Terima kasih!`;
    window.open(`https://wa.me/${effectiveWaNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };
</script>

<div
  data-node="product_catalog_container"
  class="product-card w-full box-border py-12 px-4 sm:px-6 relative overflow-hidden"
  style="container-type: inline-size; container-name: productcard;"
>
  <div class="max-w-6xl mx-auto">
    <!-- Catalog Header -->
    <CatalogHeader
      {sectionId}
      {title}
      {subtitle}
      {badgeText}
      align="center"
    />

    <!-- Preset Dispatcher -->
    {#if activePreset === 'carousel_scroll'}
      <CatalogCarouselScroll {sectionId} {products} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
    {:else if activePreset === 'list_compact'}
      <CatalogListCompact {sectionId} {products} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
    {:else if activePreset === 'masonry_catalog'}
      <CatalogMasonry {sectionId} {products} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
    {:else if activePreset === 'bento_product_spotlight'}
      <CatalogBentoSpotlight {sectionId} {products} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
    {:else if activePreset === 'split_category_sidebar'}
      <CatalogSidebarFilter {sectionId} {products} {categories} {activeCategoryId} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
    {:else if activePreset === 'price_table_view'}
      <CatalogPriceTable {sectionId} {products} onBuyNow={handleBuyNow} />
    {:else if activePreset === 'lookbook_gallery'}
      <CatalogLookbook {sectionId} {products} onBuyNow={handleBuyNow} />
    {:else if activePreset === 'flash_sale_countdown'}
      <CatalogFlashSale {sectionId} {products} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
    {:else if activePreset === 'bundle_package_tiers'}
      <CatalogBundleTiers {sectionId} {products} waNumber={effectiveWaNumber} onBuyNow={handleBuyNow} />
    {:else if activePreset === 'single_product_deep_focus'}
      <CatalogSingleFocus {sectionId} {products} waNumber={effectiveWaNumber} onBuyNow={handleBuyNow} />
    {:else if activePreset === 'seasonal_hampers_gift' || activePreset === 'before_after_product_effect' || activePreset === 'digital_download_catalog' || activePreset === 'customer_review_paired_card'}
      <CatalogSpecialCards {sectionId} {products} {activePreset} waNumber={effectiveWaNumber} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
    {:else if activePreset === 'minimal_accordion_catalog'}
      <CatalogAccordion {sectionId} {products} onBuyNow={handleBuyNow} />
    {:else}
      <!-- Standard, compact_mini_cards, quick_buy_whatsapp_direct, badge_stock_scarcity, interactive_filter_tabs -->
      <CatalogGridStandard {sectionId} {products} {activePreset} waNumber={effectiveWaNumber} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
    {/if}
  </div>

  <!-- Floating Sticky Cart Pill -->
  {#if totalCartItems > 0 && currentView === 'catalog'}
    <div transition:fly={{ y: 20, duration: 250 }} class="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        on:click={() => (currentView = 'checkout')}
        class="bg-slate-900 text-white dark:bg-primary dark:text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-sm group"
      >
        <div class="relative">
          <ShoppingCart size={18} />
          <span class="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
            {totalCartItems}
          </span>
        </div>
        <span>Keranjang</span>
        <span class="font-mono bg-white/20 px-2 py-0.5 rounded-full text-xs">
          Rp {cartTotal.toLocaleString('id-ID')}
        </span>
      </button>
    </div>
  {/if}

  <!-- Integrated WhatsApp Checkout Dialog Modal -->
  {#if currentView === 'checkout'}
    <CatalogCheckoutModal
      {detailedCart}
      {cartTotal}
      bind:form
      onBackToCatalog={() => (currentView = 'catalog')}
      onUpdateQty={updateCartQty}
      onRemoveItem={removeFromCart}
      onCheckout={handleCheckout}
    />
  {/if}
</div>
