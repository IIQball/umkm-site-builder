<script lang="ts">
  import type { ProductCatalogProps, SectionStyles, ProductItem } from "@/types";
  import { ShoppingCart } from "lucide-svelte";
  import { DEFAULT_DEMO_PRODUCTS, getBadgeColorClass, getCardPresetClass } from "./productCatalog.helpers";
  import CatalogCheckoutModal from "./catalog/CatalogCheckoutModal.svelte";
  import CatalogPriceTable from "./catalog/CatalogPriceTable.svelte";
  import CatalogBentoSpotlight from "./catalog/CatalogBentoSpotlight.svelte";
  import CatalogSidebarFilter from "./catalog/CatalogSidebarFilter.svelte";
  import CatalogGridStandard from "./catalog/CatalogGridStandard.svelte";
  import CatalogListCompact from "./catalog/CatalogListCompact.svelte";
  import CatalogCarouselMasonry from "./catalog/CatalogCarouselMasonry.svelte";
  import { fly } from "svelte/transition";

  export let props: ProductCatalogProps & { storeId?: string } = {};
  export let styles: SectionStyles = {};
  export let layoutPreset: string = "grid_standard";

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || "grid_standard";

  let dynamicProducts: ProductItem[] = [];
  let categories: { id: string; name: string; slug: string }[] = [];
  let activeCategoryId: string = "all";
  interface CartItem {
    product: ProductItem;
    selections: Record<string, { name: string }>;
    variantId: string;
    qty: number;
    price: number;
    subtotal: number;
  }

  let currentView: "catalog" | "checkout" = "catalog";
  let storeWaNumber: string = "";
  let cart: CartItem[] = [];
  let form = { name: "", phone: "", address: "", delivery: "Reguler", notes: "" };

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
        let base = typeof product.price === "number" ? product.price : parseFloat(String(product.price || 0).replace(/[^0-9.-]+/g, "")) || 0;
        if (product.variants && Array.isArray(product.variants)) {
          for (const group of product.variants) {
            const selectedOptionName = selections[group.groupName];
            if (selectedOptionName && group.options) {
              const opt = group.options.find((o: Record<string, unknown>) => o.name === selectedOptionName);
              if (opt && typeof opt.priceAdjustment === "number") base += opt.priceAdjustment;
            }
          }
        }
        cart = [...cart, { product, variantId, selections: selections as any, qty: 1, price: base, subtotal: base }];
      }
  };

  const handleBuyNow = (product: ProductItem, selections: Record<string, string>) => {
    handleAddToCart(product, selections);
    currentView = "checkout";
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
      alert("Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Pengiriman.");
      return;
    }
    const itemsSummary = detailedCart
      .map((item) => {
        const p = item.product;
        const s = item.selections;
        return `• ${p.name} (x${item.qty}) - Rp ${item.subtotal.toLocaleString("id-ID")}\n  Varian: ${Object.values(s).map(opt => opt.name).join(", ") || "Standar"}`;
      })
      .join("\n");
    const message = `Halo, saya ingin memesan dari katalog toko:\n\n*DAFTAR PESANAN:*\n${itemsSummary}\n\n*TOTAL:* Rp ${cartTotal.toLocaleString("id-ID")}\n\n*DATA PENGIRIMAN:*\nNama: ${form.name}\nWhatsApp: ${form.phone}\nAlamat: ${form.address}\nPengiriman: ${form.delivery}\nCatatan: ${form.notes || "-"}\n\nMohon konfirmasi ketersediaan & info pembayaran. Terima kasih!`;
    const rawTargetPhone = (storeWaNumber || (props.whatsappNumber as string) || (typeof window !== 'undefined' ? localStorage.getItem('storeWaNumber') : '') || '6281234567890') as string;
    let targetPhone = rawTargetPhone.replace(/[^0-9]/g, "");
    if (targetPhone.startsWith("0")) targetPhone = "62" + targetPhone.slice(1);
    if (!targetPhone.startsWith("62")) targetPhone = "62" + targetPhone;
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  $: products = ((dynamicProducts.length > 0 ? dynamicProducts : (Array.isArray(props.products) && props.products.length > 0 ? props.products : DEFAULT_DEMO_PRODUCTS)) || DEFAULT_DEMO_PRODUCTS) as ProductItem[];
  $: cardPresetClass = getCardPresetClass(styles?.cardPreset || '');
  $: isHorizontalLayout = styles?.cardPreset === "horizontal" || activePreset === "list_compact";
  $: cardRadiusClass = styles?.cardRadius === "sharp" ? "rounded-none" : styles?.cardRadius === "smooth" ? "rounded-2xl" : styles?.cardRadius === "extra_rounded" ? "rounded-3xl" : "rounded-xl";
  $: imageAspectClass = styles?.imageAspectRatio === "square" ? "aspect-square" : styles?.imageAspectRatio === "portrait" ? "aspect-[3/4]" : styles?.imageAspectRatio === "widescreen" ? "aspect-video" : isHorizontalLayout ? "aspect-square sm:aspect-[4/3]" : "aspect-square";
  $: badgePosClass = styles?.badgePosition === "top_right" ? "top-3 right-3" : "top-3 left-3";
  $: badgeColorClass = getBadgeColorClass(styles?.badgeColor || '');
  $: nameSizeClass = styles?.productNameSize === "sm" ? "text-xs" : styles?.productNameSize === "lg" ? "text-base" : "text-sm";
  $: nameWeightClass = styles?.productNameWeight === "normal" ? "font-normal" : styles?.productNameWeight === "semibold" ? "font-semibold" : styles?.productNameWeight === "extrabold" ? "font-black" : "font-bold";
  $: ctaBtnRadiusClass = styles?.ctaButtonRadius === "sharp" ? "rounded-none" : styles?.ctaButtonRadius === "smooth" ? "rounded-xl" : styles?.ctaButtonRadius === "pill" ? "rounded-full" : "rounded-lg";
</script>

<div data-node="product_catalog_container" class="w-full box-border py-12 relative">
  <!-- Dynamic Category Filter Rail -->
  {#if categories.length > 0}
    <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
      <button
        type="button"
        on:click={() => (activeCategoryId = "all")}
        class="px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer {activeCategoryId === 'all'
          ? 'bg-slate-900 text-white dark:bg-primary dark:text-white shadow-xs'
          : 'bg-nested/80 border border-light text-secondary hover:text-main'}"
      >
        Semua Produk
      </button>
      {#each categories as cat}
        <button
          type="button"
          on:click={() => (activeCategoryId = cat.id)}
          class="px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer {activeCategoryId === cat.id
            ? 'bg-slate-900 text-white dark:bg-primary dark:text-white shadow-xs'
            : 'bg-nested/80 border border-light text-secondary hover:text-main'}"
        >
          {cat.name}
        </button>
      {/each}
    </div>
  {/if}

  {#if activePreset === "bento_spotlight"}
    <CatalogBentoSpotlight
      {products}
      {cardPresetClass}
      {cardRadiusClass}
      {imageAspectClass}
      {badgePosClass}
      {badgeColorClass}
      {nameSizeClass}
      {nameWeightClass}
      {ctaBtnRadiusClass}
      {isHorizontalLayout}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
    />
  {:else if activePreset === "price_table"}
    <CatalogPriceTable {products} onBuyNow={handleBuyNow} />
  {:else if activePreset === "sidebar_filter"}
    <CatalogSidebarFilter
      {products}
      {categories}
      {activeCategoryId}
      {cardPresetClass}
      {cardRadiusClass}
      {imageAspectClass}
      {badgePosClass}
      {badgeColorClass}
      {nameSizeClass}
      {nameWeightClass}
      {ctaBtnRadiusClass}
      {isHorizontalLayout}
      onCategorySelect={(id) => (activeCategoryId = id)}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
    />
  {:else if activePreset === "list_compact"}
    <CatalogListCompact
      {products}
      {activePreset}
      {cardPresetClass}
      {cardRadiusClass}
      {imageAspectClass}
      {badgePosClass}
      {badgeColorClass}
      {nameSizeClass}
      {nameWeightClass}
      {ctaBtnRadiusClass}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
    />
  {:else if activePreset === "horizontal_carousel" || activePreset === "masonry_dynamic" || activePreset === "grid_3_wide"}
    <CatalogCarouselMasonry
      {activePreset}
      {products}
      {cardPresetClass}
      {cardRadiusClass}
      {imageAspectClass}
      {badgePosClass}
      {badgeColorClass}
      {nameSizeClass}
      {nameWeightClass}
      {ctaBtnRadiusClass}
      {isHorizontalLayout}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
    />
  {:else}
    <CatalogGridStandard
      {products}
      {activePreset}
      {cardPresetClass}
      {cardRadiusClass}
      {imageAspectClass}
      {badgePosClass}
      {badgeColorClass}
      {nameSizeClass}
      {nameWeightClass}
      {ctaBtnRadiusClass}
      {isHorizontalLayout}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
    />
  {/if}

  <!-- Floating Sticky Cart Pill -->
  {#if totalCartItems > 0 && currentView === "catalog"}
    <div transition:fly={{ y: 20, duration: 250 }} class="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        on:click={() => (currentView = "checkout")}
        class="bg-slate-900 text-white dark:bg-primary dark:text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-sm group"
      >
        <div class="relative">
          <ShoppingCart size={18} />
          <span class="absolute -top-2 -right-2 bg-orange text-white text-3xs w-4 h-4 rounded-full flex items-center justify-center font-mono">
            {totalCartItems}
          </span>
        </div>
        <span>Keranjang</span>
        <span class="font-mono bg-white/20 px-2 py-0.5 rounded-full text-xs">
          Rp {cartTotal.toLocaleString("id-ID")}
        </span>
      </button>
    </div>
  {/if}

  <!-- Integrated WhatsApp Checkout Dialog Modal -->
  {#if currentView === "checkout"}
    <CatalogCheckoutModal
      {detailedCart}
      {cartTotal}
      bind:form
      onBackToCatalog={() => (currentView = "catalog")}
      onUpdateQty={updateCartQty}
      onRemoveItem={removeFromCart}
      onCheckout={handleCheckout}
    />
  {/if}
</div>
