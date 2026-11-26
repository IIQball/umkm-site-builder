<script lang="ts">
  import { onMount } from 'svelte';
  import type { ProductCatalogProps, SectionStyles, ProductItem } from '@/types';
  import { ShoppingCart } from 'lucide-svelte';
  import { formatIDR } from '@/lib/currency';
  import { toast } from '@/lib/toast';
  import { generateWhatsAppLink, getEffectiveWhatsAppNumber, openWhatsAppWithTracking } from '@/lib/whatsapp';
  import { DEFAULT_DEMO_PRODUCTS, type CartItem } from './catalog/productCatalog.helpers';
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
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let isActive: boolean = false;

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'grid_standard';
  $: effectiveNodeStyles = nodeStyles && Object.keys(nodeStyles).length > 0
    ? nodeStyles
    : ((props?.nodeStyles || styles?.nodeStyles || {}) as Record<string, Record<string, string>>);

  let dynamicProducts: ProductItem[] = [], categories: { id: string; name: string; slug: string }[] = [], activeCategoryId: string = "all";
  let currentView: "catalog" | "checkout" = "catalog", storeWaNumber: string = "", cart: CartItem[] = [], isMounted = false;
  let form = { name: "", phone: "", address: "", delivery: "Reguler", notes: "" };
  let buyButtonText = '', cartButtonText = 'Keranjang';
  let marginTop = '0px', marginBottom = '0px', paddingTop = '48px', paddingBottom = '48px', paddingLeft = '', paddingRight = '';

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
    try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { void 0; }
  }

  let selectedVariantProduct: ProductItem | null = null, isVariantModalOpen = false, variantModalMode: 'cart' | 'buy' = 'cart';

  // In live storefront: use only real products (empty state if none). In builder: fallback to demo.
  $: products = isLiveStorefront
    ? ((Array.isArray(props?.products) ? props.products : []) as ProductItem[])
    : ((dynamicProducts.length > 0 ? dynamicProducts : (Array.isArray(props?.products) && props.products.length > 0 ? props.products : DEFAULT_DEMO_PRODUCTS)) || DEFAULT_DEMO_PRODUCTS) as ProductItem[];

  $: storeName = (props?.storeName as string) || (typeof window !== 'undefined' ? localStorage.getItem('storeName') || '' : '') || 'Toko';
  $: effectiveWaNumber = getEffectiveWhatsAppNumber(storeWaNumber || (props?.whatsappNumber as string) || (typeof window !== 'undefined' ? localStorage.getItem('storeWaNumber') || '' : ''));
  $: title = (props?.title as string) || (props?.heading as string) || 'Katalog Produk Pilihan';
  $: subtitle = (props?.subtitle as string) || 'Jelajahi produk berkualitas terbaik dengan penawaran harga menarik hari ini.';
  $: badgeText = (props?.badgeText as string) || (props?.categoryBadge as string) || 'Produk Unggulan';
  $: buyButtonText = (props?.buyButtonText as string) || (props?.ctaText as string) || '';
  $: cartButtonText = (props?.cartButtonText as string) || (props?.secondaryButtonText as string) || 'Keranjang';
  $: activeCategories = (Array.isArray(props?.categories) && props.categories.length > 0 ? props.categories : (Array.isArray(categories) && categories.length > 0 ? categories : []));
  $: elementOrder = (props?.elementOrder as string[]) || ['badge', 'title', 'subtitle', 'catalog_grid'];
  $: isGridFirst = elementOrder.indexOf('catalog_grid') === 0;

  $: totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  $: detailedCart = cart.map((item) => ({ ...item, subtotal: item.price * item.qty }));
  $: cartTotal = detailedCart.reduce((sum, item) => sum + item.subtotal, 0);

  $: toPx = (v: unknown, d: string) => v !== undefined ? (typeof v === 'number' ? `${v}px` : String(v)) : d;
  $: marginTop = toPx(styles?.marginTop, '0px');
  $: marginBottom = toPx(styles?.marginBottom, '0px');
  $: paddingTop = toPx(styles?.paddingTop, '48px');
  $: paddingBottom = toPx(styles?.paddingBottom, '48px');
  $: paddingLeft = toPx(styles?.paddingLeft, 'var(--active-safe-zone, var(--active-margin, 32px))');
  $: paddingRight = toPx(styles?.paddingRight, 'var(--active-safe-zone, var(--active-margin, 32px))');
  $: customBgColor = styles?.bgColorToken ? `var(--theme-${styles.bgColorToken === 'textPrimary' ? 'text-primary' : styles.bgColorToken === 'textMuted' ? 'text-muted' : styles.bgColorToken})` : styles?.backgroundColor;
  $: sectionBgStyle = customBgColor ? `background-color: ${customBgColor};` : 'background-color: var(--color-bg-base);';

  const addConfiguredItemToCart = (
    product: ProductItem,
    selections: Record<string, string | { name: string }> = {},
    qty: number = 1,
    overrideUnitPrice?: number
  ) => {
    const variantKey = Object.entries(selections).map(([k, v]) => `${k}:${typeof v === 'object' && v ? v.name : v}`).sort().join('|') || 'default';
    const existing = cart.find((c) => c.product.id === product.id && c.variantId === variantKey);
    if (existing) {
      existing.qty += qty;
      cart = [...cart];
    } else {
      let base = typeof overrideUnitPrice === 'number' ? overrideUnitPrice : typeof product.basePrice === 'number' ? product.basePrice : typeof product.price === 'number' ? product.price : parseFloat(String(product.basePrice ?? product.price ?? 0).replace(/[^0-9.-]+/g, '')) || 0;
      if (typeof overrideUnitPrice !== 'number' && product.variants && Array.isArray(product.variants)) {
        for (const group of product.variants) {
          const sel = selections[group.groupName];
          const selName = typeof sel === 'object' && sel ? sel.name : sel;
          if (selName && group.options) {
            const opt = group.options.find((o: { name: string; priceAdjustment?: number }) => o.name === selName);
            if (opt && typeof opt.priceAdjustment === 'number') base += opt.priceAdjustment;
          }
        }
      }
      cart = [...cart, { product, variantId: variantKey, selections, qty, price: base, subtotal: base * qty }];
    }
    toast.success(`${product.name} dimasukkan ke keranjang`);
  };

  const handleAddToCart = (product: ProductItem) => {
    if (!product.variants || product.variants.length === 0) {
      addConfiguredItemToCart(product);
      return;
    }
    selectedVariantProduct = product;
    variantModalMode = 'cart';
    isVariantModalOpen = true;
  };

  const scrollToCatalog = () => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById(sectionId || 'produk') || document.querySelector('[data-node="product_catalog_container"]');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBuyNow = (product: ProductItem) => {
    if (!product.variants || product.variants.length === 0) {
      addConfiguredItemToCart(product);
      currentView = 'checkout';
      scrollToCatalog();
      return;
    }
    selectedVariantProduct = product;
    variantModalMode = 'buy';
    isVariantModalOpen = true;
  };

  const updateCartQty = (idx: number, delta: number) => {
    cart[idx].qty += delta;
    cart = cart[idx].qty <= 0 ? cart.filter((_, i) => i !== idx) : [...cart];
  };
  const removeFromCart = (idx: number) => { cart = cart.filter((_, i) => i !== idx); };

  const handleCheckout = () => {
    if (!form.name || !form.phone || !form.address) {
      toast.warning('Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Pengiriman.', 'Data Belum Lengkap');
      return;
    }
    const itemsSummary = detailedCart.map((item) => {
      const optNames = Object.values(item.selections).map(opt => typeof opt === 'object' && opt ? (opt as { name?: string }).name : opt).filter(Boolean).join(", ");
      return `- ${item.product.name}${optNames ? ` (Opsi: ${optNames})` : ''} x${item.qty}: ${formatIDR(item.subtotal)}`;
    }).join("\n");
    const deliveryMethod = form.delivery || 'Kurir Toko / Pengantaran Langsung';
    const message = `Halo ${storeName || 'Toko'}, saya ingin memesan:\n\n*DAFTAR PESANAN:*\n${itemsSummary}\n\n*TOTAL:* ${formatIDR(cartTotal)}\n\n*DATA PENGIRIMAN:*\nNama: ${form.name}\nWhatsApp: ${form.phone}\nAlamat: ${form.address}\nMetode Pengiriman: ${deliveryMethod}\nCatatan: ${form.notes || "-"}\n\nMohon konfirmasi ketersediaan & info pembayaran. Terima kasih!`;
    const waLink = generateWhatsAppLink(effectiveWaNumber, message);
    
    openWhatsAppWithTracking(waLink, effectiveStoreId);
  };
</script>

<div
  id={sectionId || 'produk'}
  data-node="product_catalog_container"
  class="w-full box-border relative"
  style="{sectionBgStyle} margin-top: {marginTop}; margin-bottom: {marginBottom};"
>
  {#if currentView === 'checkout'}
    <div
      class="builder-safe-container relative z-10 w-full mx-auto box-border"
      style="max-width: var(--theme-max-width, var(--active-max-width, 1200px)); padding-left: {paddingLeft}; padding-right: {paddingRight}; padding-top: {paddingTop}; padding-bottom: {paddingBottom};"
      transition:fly={{ y: 15, duration: 250 }}
    >
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
    <div
      class="builder-safe-container relative z-10 w-full mx-auto box-border flex flex-col"
      style="max-width: var(--theme-max-width, var(--active-max-width, 1200px)); padding-left: {paddingLeft}; padding-right: {paddingRight}; padding-top: {paddingTop}; padding-bottom: {paddingBottom};"
    >
      <!-- Catalog Header -->
      <div style="order: {isGridFirst ? 2 : 1};">
        <CatalogHeader
          {sectionId}
          {title}
          {subtitle}
          {badgeText}
          {elementOrder}
          nodeStyles={effectiveNodeStyles}
          align="center"
          {isActive}
        />
      </div>

      <div class="product-card" style="order: {isGridFirst ? 1 : 2};">
        <!-- Empty State: shown in live storefront when store has no products yet -->
        {#if isLiveStorefront && products.length === 0}
          <div class="flex flex-col items-center justify-center gap-4 py-20 text-center text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <p class="text-lg font-semibold">Belum Ada Produk</p>
            <p class="text-sm max-w-xs">Toko ini belum menambahkan produk. Silakan hubungi pemilik toko untuk informasi lebih lanjut.</p>
          </div>
        {:else}
          <!-- Preset Dispatcher -->
          {#if activePreset === 'carousel_scroll'}
            <CatalogCarouselScroll {sectionId} {products} {buyButtonText} {cartButtonText} nodeStyles={effectiveNodeStyles} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
          {:else if activePreset === 'list_compact'}
            <CatalogListCompact {sectionId} {products} {buyButtonText} {cartButtonText} nodeStyles={effectiveNodeStyles} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
          {:else if activePreset === 'masonry_catalog'}
            <CatalogMasonry {sectionId} {products} {buyButtonText} {cartButtonText} nodeStyles={effectiveNodeStyles} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
          {:else if activePreset === 'bento_product_spotlight'}
            <CatalogBentoSpotlight {sectionId} {products} {buyButtonText} {cartButtonText} nodeStyles={effectiveNodeStyles} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
          {:else if activePreset === 'split_category_sidebar'}
            <CatalogSidebarFilter {sectionId} {products} categories={activeCategories} {activeCategoryId} {buyButtonText} {cartButtonText} nodeStyles={effectiveNodeStyles} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
          {:else if activePreset === 'price_table_view'}
            <CatalogPriceTable {sectionId} {products} {buyButtonText} nodeStyles={effectiveNodeStyles} onBuyNow={handleBuyNow} />
          {:else if activePreset === 'lookbook_gallery'}
            <CatalogLookbook {sectionId} {products} {buyButtonText} nodeStyles={effectiveNodeStyles} onBuyNow={handleBuyNow} />
          {:else if activePreset === 'flash_sale_countdown'}
            <CatalogFlashSale {sectionId} {products} {buyButtonText} {cartButtonText} nodeStyles={effectiveNodeStyles} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
          {:else}
            <!-- Standard, compact_mini_cards -->
            <CatalogGridStandard {sectionId} {products} {activePreset} {isLiveStorefront} {buyButtonText} {cartButtonText} nodeStyles={effectiveNodeStyles} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
          {/if}
        {/if}
      </div>
    </div>

    <!-- Floating Sticky Cart Pill (posisi rapih di atas Laporkan Bug) -->
    {#if totalCartItems > 0}
      <div transition:fly={{ y: 20, duration: 250 }} class="fixed bottom-20 right-4 sm:right-6 z-40">
        <button
          type="button"
          on:click={() => { currentView = 'checkout'; scrollToCatalog(); }}
          class="flex items-center gap-2.5 py-2.5 px-4 rounded-full shadow-2xl border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer font-heading font-semibold text-xs sm:text-sm select-none whitespace-nowrap"
          style="background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--color-card-base, #ffffff));"
        >
          <div class="flex items-center gap-1.5 bg-black/15 dark:bg-white/20 px-2 py-0.5 rounded-full font-mono font-bold text-xs">
            <ShoppingCart size={14} />
            <span>{totalCartItems}</span>
          </div>
          <span>Keranjang</span>
          <span class="opacity-40">•</span>
          <span class="font-bold font-mono">{formatIDR(cartTotal)}</span>
        </button>
      </div>
    {/if}
  {/if}

  <!-- Variant Selection & Quantity Modal -->
  <ProductVariantModal
    isOpen={isVariantModalOpen} product={selectedVariantProduct} mode={variantModalMode}
    onClose={() => { isVariantModalOpen = false; selectedVariantProduct = null; }}
    onAddToCart={(prod, sels, q, uPrice) => addConfiguredItemToCart(prod, sels, q, uPrice)}
    onBuyNow={(prod, sels, q, uPrice) => { addConfiguredItemToCart(prod, sels, q, uPrice); currentView = 'checkout'; scrollToCatalog(); }}
  />
</div>
