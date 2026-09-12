<script lang="ts">
  import { onMount } from 'svelte';
  import type { ProductCatalogProps, SectionStyles, ProductItem } from '@/types';
  import { ShoppingCart } from 'lucide-svelte';
  import { formatIDR } from '@/lib/currency';
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
  import ProductVariantModal from './catalog/ProductVariantModal.svelte';
  import { fly } from 'svelte/transition';
  import './catalog/catalog.css';

  export let sectionId: string = '';
  export let props: ProductCatalogProps & { storeId?: string; storeName?: string; whatsappNumber?: string } = {};
  export let styles: SectionStyles = {};
  export let layoutPreset: string = 'grid_standard';
  export let isLiveStorefront: boolean = false;
  export let storeId: string = '';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'grid_standard';

  let dynamicProducts: ProductItem[] = [];
  let categories: { id: string; name: string; slug: string }[] = [];
  let activeCategoryId: string = "all";

  interface CartItem {
    product: ProductItem;
    selections: Record<string, { name: string; priceAdjustment?: number } | string>;
    variantId: string;
    qty: number;
    price: number;
    subtotal: number;
  }

  let currentView: "catalog" | "checkout" = "catalog";
  let storeWaNumber: string = "";
  let cart: CartItem[] = [];
  let isMounted = false;
  let form = { name: "", phone: "", address: "", delivery: "Reguler", notes: "" };

  $: effectiveStoreId = storeId || (props?.storeId as string) || '';
  $: storageKey = `cart_${effectiveStoreId || 'default'}`;

  onMount(() => {
    isMounted = true;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          cart = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load cart", e);
        }
      }
    }
  });

  $: if (isMounted && typeof window !== 'undefined') {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      void 0;
    }
  }

  // State for variant modal
  let selectedVariantProduct: ProductItem | null = null;
  let isVariantModalOpen = false;
  let variantModalMode: 'cart' | 'buy' = 'cart';

  // In live storefront: use only real products (empty state if none). In builder: fallback to demo.
  $: products = isLiveStorefront
    ? ((Array.isArray(props?.products) ? props.products : []) as ProductItem[])
    : ((dynamicProducts.length > 0 ? dynamicProducts : (Array.isArray(props?.products) && props.products.length > 0 ? props.products : DEFAULT_DEMO_PRODUCTS)) || DEFAULT_DEMO_PRODUCTS) as ProductItem[];

  $: storeName = (props?.storeName as string) || (typeof window !== 'undefined' ? localStorage.getItem('storeName') || '' : '') || 'Toko';
$: effectiveWaNumber = getCleanWaNumber(storeWaNumber || (props?.whatsappNumber as string) || (typeof window !== 'undefined' ? localStorage.getItem('storeWaNumber') || '' : ''));

$: title = (props?.title as string) || (props?.heading as string) || 'Katalog Produk Pilihan';
$: subtitle = (props?.subtitle as string) || 'Jelajahi produk berkualitas terbaik dengan penawaran harga menarik hari ini.';
$: badgeText = (props?.badgeText as string) || (props?.categoryBadge as string) || 'Produk Unggulan';

  $: totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  $: detailedCart = cart.map((item) => ({ ...item, subtotal: item.price * item.qty }));
  $: cartTotal = detailedCart.reduce((sum, item) => sum + item.subtotal, 0);

  const addConfiguredItemToCart = (
    product: ProductItem,
    selections: Record<string, any> = {},
    qty: number = 1,
    overrideUnitPrice?: number
  ) => {
    const variantKey = Object.entries(selections)
      .map(([k, v]) => `${k}:${typeof v === 'object' && v ? v.name : v}`)
      .sort()
      .join('|') || 'default';

    const existing = cart.find((c) => c.product.id === product.id && c.variantId === variantKey);
    if (existing) {
      existing.qty += qty;
      cart = [...cart];
    } else {
      let base = typeof overrideUnitPrice === 'number'
        ? overrideUnitPrice
        : typeof product.basePrice === 'number'
        ? product.basePrice
        : typeof product.price === 'number'
        ? product.price
        : parseFloat(String(product.basePrice ?? product.price ?? 0).replace(/[^0-9.-]+/g, '')) || 0;

      if (typeof overrideUnitPrice !== 'number' && product.variants && Array.isArray(product.variants)) {
        for (const group of product.variants) {
          const sel = selections[group.groupName];
          const selName = typeof sel === 'object' && sel ? sel.name : sel;
          if (selName && group.options) {
            const opt = group.options.find((o: any) => o.name === selName);
            if (opt && typeof opt.priceAdjustment === 'number') base += opt.priceAdjustment;
          }
        }
      }
      cart = [...cart, { product, variantId: variantKey, selections, qty, price: base, subtotal: base * qty }];
    }
  };

  const handleAddToCart = (product: ProductItem) => {
    selectedVariantProduct = product;
    variantModalMode = 'cart';
    isVariantModalOpen = true;
  };

  const scrollToCatalog = () => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById(sectionId || 'produk') || document.querySelector('[data-node="product_catalog_container"]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBuyNow = (product: ProductItem) => {
    selectedVariantProduct = product;
    variantModalMode = 'buy';
    isVariantModalOpen = true;
  };

  const updateCartQty = (idx: number, delta: number) => {
    cart[idx].qty += delta;
    cart = cart[idx].qty <= 0 ? cart.filter((_, i) => i !== idx) : [...cart];
  };

  const removeFromCart = (idx: number) => {
    cart = cart.filter((_, i) => i !== idx);
  };

  const handleCheckout = () => {
    if (!form.name || !form.phone || !form.address) {
      alert('Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Pengiriman.');
      return;
    }
    const itemsSummary = detailedCart.map((item) => {
      const optNames = Object.values(item.selections).map(opt => typeof opt === 'object' && opt ? (opt as any).name : opt).filter(Boolean).join(", ");
      return `- ${item.product.name}${optNames ? ` (Opsi: ${optNames})` : ''} x${item.qty}: ${formatIDR(item.subtotal)}`;
    }).join("\n");
      
    const message = `Halo ${storeName || 'Toko'}, saya ingin memesan:\n\n*DAFTAR PESANAN:*\n${itemsSummary}\n\n*TOTAL:* ${formatIDR(cartTotal)}\n\n*DATA PENGIRIMAN:*\nNama: ${form.name}\nWhatsApp: ${form.phone}\nAlamat: ${form.address}\nCatatan: ${form.notes || "-"}\n\nMohon konfirmasi ketersediaan & info pembayaran. Terima kasih!`;
    window.open(`https://wa.me/${effectiveWaNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };
</script>

<div
  data-node="product_catalog_container"
  class="product-card w-full box-border py-12 px-4 sm:px-6 relative overflow-hidden"
  style="container-type: inline-size; container-name: productcard;"
>
  {#if currentView === 'checkout'}
    <div class="max-w-5xl mx-auto" transition:fly={{ y: 15, duration: 250 }}>
      <CatalogCheckoutModal
        {detailedCart}
        {cartTotal}
        bind:form
        onBackToCatalog={() => {
          currentView = 'catalog';
          scrollToCatalog();
        }}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  {:else}
    <div class="max-w-6xl mx-auto">
      <!-- Catalog Header -->
      <CatalogHeader
        {sectionId}
        {title}
        {subtitle}
        {badgeText}
        align="center"
      />

      <!-- Empty State: shown in live storefront when store has no products yet -->
      {#if isLiveStorefront && products.length === 0}
        <div class="flex flex-col items-center justify-center gap-4 py-20 text-center text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p class="text-lg font-semibold">Belum Ada Produk</p>
          <p class="text-sm max-w-xs">Toko ini belum menambahkan produk. Silakan hubungi pemilik toko untuk informasi lebih lanjut.</p>
        </div>
      {:else}
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
      {/if}
    </div>

    <!-- Floating Sticky Cart Pill -->
    {#if totalCartItems > 0}
      <div transition:fly={{ y: 20, duration: 250 }} class="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          on:click={() => {
            currentView = 'checkout';
            scrollToCatalog();
          }}
          class="bg-slate-900 text-white dark:bg-primary dark:text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-sm group"
        >
          <div class="relative">
            <ShoppingCart size={18} />
            <span class="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-bold">
              {totalCartItems}
            </span>
          </div>
          <span>Keranjang</span>
          <span class="font-mono bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {formatIDR(cartTotal)}
          </span>
        </button>
      </div>
    {/if}
  {/if}

  <!-- Variant Selection & Quantity Modal -->
  <ProductVariantModal
    isOpen={isVariantModalOpen}
    product={selectedVariantProduct}
    mode={variantModalMode}
    onClose={() => { isVariantModalOpen = false; selectedVariantProduct = null; }}
    onAddToCart={(prod, sels, q, uPrice) => addConfiguredItemToCart(prod, sels, q, uPrice)}
    onBuyNow={(prod, sels, q, uPrice) => {
      addConfiguredItemToCart(prod, sels, q, uPrice);
      currentView = 'checkout';
      scrollToCatalog();
    }}
  />
</div>
