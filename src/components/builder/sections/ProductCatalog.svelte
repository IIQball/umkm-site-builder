<script lang="ts">
  import { editorStore, canvasStore } from "../stores/editorStore";
  import type {
    ProductCatalogProps,
    SectionStyles,
    ProductItem,
  } from "@/types";
  import { ShoppingBag } from "lucide-svelte";
  import {
    DEFAULT_DEMO_PRODUCTS,
    getBadgeColorClass,
    getCardPresetClass,
  } from "./productCatalog.helpers";
  import { onMount } from "svelte";
  import ProductCatalogCard from "./catalog/ProductCatalogCard.svelte";
  import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-svelte";
  import { slide, fly } from "svelte/transition";
  import WhatsAppIcon from "../../ui/WhatsAppIcon.svelte";

  export let props: ProductCatalogProps & { storeId?: string } = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = "";
  export let isActive: boolean = false;
  export let layoutPreset: string = "grid_standard";

  $: activePreset =
    layoutPreset ||
    (props?.layoutPreset as string) ||
    (styles?.layoutPreset as string) ||
    "grid_standard";

  $: activeStoreId =
    props.storeId ||
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("storeId")
      : null);
  let dynamicProducts: ProductItem[] = [];
  let categories: { id: string; name: string; slug: string }[] = [];
  let activeCategoryId: string = "all";
  let storeWaNumber: string = "";
  let currentPage = 1;
  let totalPages = 1;
  let isLoading = false;

  let currentView: "catalog" | "checkout" = "catalog";
  let cart: any[] = [];
  let form = {
    name: "",
    phone: "",
    address: "",
    delivery: "Reguler",
    notes: "",
  };

  $: totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  // Re-calculate subtotal for safety
  $: detailedCart = cart.map((item) => ({
    ...item,
    subtotal: item.price * item.qty,
  }));
  $: cartTotal = detailedCart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleAddToCart = (
    product: ProductItem,
    selections: Record<string, string>,
  ) => {
    const variantId = JSON.stringify(selections);
    const existing = cart.find(
      (c) => c.product.id === product.id && c.variantId === variantId,
    );

    if (existing) {
      existing.qty++;
      cart = [...cart];
    } else {
      let base =
        typeof product.price === "number"
          ? product.price
          : parseFloat(String(product.price || 0).replace(/[^0-9.-]+/g, "")) ||
            0;
      if (product.variants && Array.isArray(product.variants)) {
        for (const group of product.variants) {
          const selectedOptionName = selections[group.groupName];
          if (selectedOptionName && group.options) {
            const opt = group.options.find(
              (o: any) => o.name === selectedOptionName,
            );
            if (opt && typeof opt.priceAdjustment === "number") {
              base += opt.priceAdjustment;
            }
          }
        }
      }
      cart = [
        ...cart,
        { product, variantId, selections, qty: 1, price: base, subtotal: base },
      ];
    }
  };

  const handleBuyNow = (
    product: ProductItem,
    selections: Record<string, string>,
  ) => {
    handleAddToCart(product, selections);
    currentView = "checkout";
  };

  const updateCartQty = (idx: number, delta: number) => {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) {
      cart = cart.filter((_, i) => i !== idx);
    } else {
      cart = [...cart];
    }
  };

  const removeFromCart = (idx: number) => {
    cart = cart.filter((_, i) => i !== idx);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    if (!form.name || !form.phone || !form.address)
      return alert("Mohon lengkapi Nama, No. WhatsApp, dan Alamat.");

    const formatIDR = (num: number) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(num);
    let text = `Halo, saya ingin memesan produk berikut:\n\n*Detail Pesanan:*\n`;
    detailedCart.forEach((item) => {
      let variantStr = Object.entries(item.selections)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      text += `- ${item.product.name}\n  Varian: ${variantStr || "-"} (${item.qty}x)\n  Subtotal: ${formatIDR(item.subtotal)}\n`;
    });
    text += `\n*Total Harga Produk:* ${formatIDR(cartTotal)}\n`;
    text += `\n*Data Pengiriman:*\nNama: ${form.name}\nNo. HP: ${form.phone}\nAlamat: ${form.address}\nPengantaran: ${form.delivery}\n`;
    if (form.notes) text += `Catatan: ${form.notes}\n`;
    text += `\nMohon info total biaya beserta ongkirnya ya. Terima kasih!`;

    const waNum = storeWaNumber || props?.storeWaNumber || "6281234567890";
    window.open(
      `https://wa.me/${String(waNum).replace(/\D/g, "")}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  $: rawProducts = Array.isArray(props?.products) ? props.products : [];
  $: products = activeStoreId
    ? dynamicProducts
    : ((rawProducts.length > 0
        ? rawProducts
        : DEFAULT_DEMO_PRODUCTS) as ProductItem[]);
  $: isMobileView = $canvasStore?.viewMode === "mobile";
  $: isTabletView = $canvasStore?.viewMode === "tablet";
  $: hasCustomColor = !!styles?.color;

  $: colDesktop = Number(props?.columnsDesktop ?? styles?.columnsDesktop ?? 3);
  $: colTablet = Number(props?.columnsTablet ?? styles?.columnsTablet ?? 2);
  $: colMobile = Number(props?.columnsMobile ?? styles?.columnsMobile ?? 1);

  $: gridColClass = (() => {
    if (isMobileView) return colMobile === 2 ? "grid-cols-2" : "grid-cols-1";
    if (isTabletView) return colTablet === 3 ? "grid-cols-3" : "grid-cols-2";
    const m = colMobile === 2 ? "grid-cols-2" : "grid-cols-1";
    const t = colTablet === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
    const d =
      colDesktop === 2
        ? "lg:grid-cols-2"
        : colDesktop === 4
          ? "lg:grid-cols-4"
          : colDesktop === 5
            ? "lg:grid-cols-5"
            : "lg:grid-cols-3";
    return `${m} ${t} ${d}`;
  })();

  $: gridGapVal = props?.gridGap ?? styles?.gridGap ?? "normal";
  $: gridGapClass =
    isMobileView || gridGapVal === "compact" || gridGapVal === "12px"
      ? "gap-3"
      : gridGapVal === "relaxed" || gridGapVal === "32px"
        ? "gap-6 sm:gap-8"
        : "gap-4 sm:gap-5";

  $: cardPreset = String(
    props?.cardPreset ?? styles?.cardPreset ?? "elevated_shadow",
  );
  $: isHorizontalLayout =
    cardPreset === "horizontal" && (!isMobileView || colMobile === 1);
  $: cardRadiusVal = String(
    props?.cardRadius ?? styles?.cardRadius ?? "smooth",
  );
  $: cardRadiusClass =
    cardRadiusVal === "sharp" || cardRadiusVal === "0px"
      ? "rounded-none"
      : cardRadiusVal === "rounded" || cardRadiusVal === "8px"
        ? "rounded-lg"
        : cardRadiusVal === "extra_rounded" || cardRadiusVal === "24px"
          ? "rounded-3xl"
          : "rounded-2xl";

  $: aspectVal = String(
    props?.imageAspectRatio ?? styles?.imageAspectRatio ?? "square",
  );
  $: imageAspectClass = isHorizontalLayout
    ? "h-full w-full object-cover"
    : aspectVal === "portrait" || aspectVal === "3/4"
      ? "aspect-[3/4] w-full object-cover"
      : aspectVal === "widescreen" || aspectVal === "16/9"
        ? "aspect-[16/9] w-full object-cover"
        : aspectVal === "auto"
          ? "h-48 w-full object-cover"
          : "aspect-square w-full object-cover";

  $: badgePos = String(
    props?.badgePosition ?? styles?.badgePosition ?? "top_left",
  );
  $: badgePosClass =
    badgePos === "top_right" ? "top-3 right-3" : "top-3 left-3";
  $: badgeColorVal = String(props?.badgeColor ?? styles?.badgeColor ?? "rose");
  $: badgeColorClass = getBadgeColorClass(badgeColorVal);

  $: nameSizeVal = String(
    props?.productNameSize ?? styles?.productNameSize ?? "base",
  );
  $: nameSizeClass =
    nameSizeVal === "sm"
      ? "text-xs sm:text-sm"
      : nameSizeVal === "lg"
        ? "text-base sm:text-lg"
        : "text-sm sm:text-base";
  $: nameWeightVal = String(
    props?.productNameWeight ?? styles?.productNameWeight ?? "bold",
  );
  $: nameWeightClass =
    nameWeightVal === "normal"
      ? "font-normal"
      : nameWeightVal === "medium"
        ? "font-medium"
        : nameWeightVal === "semibold"
          ? "font-semibold"
          : nameWeightVal === "extrabold"
            ? "font-extrabold"
            : "font-bold";

  $: isInlinePrice =
    (props?.pricePlacement ?? styles?.pricePlacement ?? "stacked") === "inline";

  $: ctaBtnRadiusVal = String(
    props?.ctaButtonRadius ?? styles?.ctaButtonRadius ?? "smooth",
  );
  $: ctaBtnRadiusClass =
    ctaBtnRadiusVal === "sharp"
      ? "rounded-none"
      : ctaBtnRadiusVal === "rounded"
        ? "rounded-lg"
        : ctaBtnRadiusVal === "pill"
          ? "rounded-full"
          : "rounded-xl";
  $: cardPresetClass = getCardPresetClass(cardPreset);

  let draggedIdx: number | null = null;
  let dropTargetIdx: number | null = null;

  const onDragStart = (e: DragEvent, index: number) => {
    if (!isActive) return;
    draggedIdx = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
    }
  };
  const onDragOver = (e: DragEvent, index: number) => {
    if (draggedIdx === null || draggedIdx === index) return;
    e.preventDefault();
    dropTargetIdx = index;
  };
  const onDrop = (e: DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      draggedIdx = null;
      dropTargetIdx = null;
      return;
    }
    const list = [...products];
    const [moved] = list.splice(draggedIdx, 1);
    list.splice(targetIdx, 0, moved);
    editorStore.updateSectionProps(sectionId, { products: list });
    draggedIdx = null;
    dropTargetIdx = null;
  };

  const fetchCategories = async (storeId: string) => {
    try {
      const res = await fetch(`/api/categories?storeId=${storeId}`);
      if (res.ok) {
        categories = await res.json();
      }
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    }
  };

  const fetchProducts = async (
    storeId: string,
    page: number,
    categoryId: string,
    append = false,
  ) => {
    if (isLoading) return;
    isLoading = true;
    try {
      const url = new URL(
        `/api/stores/${storeId}/products`,
        window.location.origin,
      );
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", "12");
      if (categoryId && categoryId !== "all") {
        url.searchParams.set("categoryId", categoryId);
      }

      const res = await fetch(url.toString());
      if (res.ok) {
        const { data, pagination, store } = await res.json();
        if (store?.waNumber) storeWaNumber = store.waNumber;
        if (append) {
          dynamicProducts = [...dynamicProducts, ...data];
        } else {
          dynamicProducts = data;
        }
        currentPage = pagination.page;
        totalPages = pagination.totalPages;
      }
    } catch (e) {
      console.error("Failed to fetch products:", e);
    } finally {
      isLoading = false;
    }
  };

  onMount(() => {
    if (activeStoreId) {
      fetchCategories(activeStoreId);
      fetchProducts(activeStoreId, 1, "all");
    }
  });

  const handleCategorySelect = (categoryId: string) => {
    if (!activeStoreId || activeCategoryId === categoryId) return;
    activeCategoryId = categoryId;
    currentPage = 1;
    fetchProducts(activeStoreId, 1, categoryId, false);
  };

  const handleLoadMore = () => {
    if (!activeStoreId || currentPage >= totalPages) return;
    fetchProducts(activeStoreId, currentPage + 1, activeCategoryId, true);
  };
</script>

<div class="w-full relative overflow-hidden" style="min-height: 400px;">
  {#if currentView === "catalog"}
    <div in:fly={{ x: -20, duration: 400 }} out:fly={{ x: -20, duration: 300 }}>
      <!-- Section Header -->
      <div class="mb-8 pt-4 text-center relative flex flex-col items-center">
        {#if totalCartItems > 0}
          <div class="absolute top-2 right-4 sm:right-8 z-10">
            <button
              class="relative p-2 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
              on:click={() => (currentView = "checkout")}
            >
              <ShoppingCart size={28} class="text-slate-600 dark:text-slate-300" />
              <span
                class="absolute -top-1 -right-1 bg-[#4f00ff] text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800"
              >
                {totalCartItems}
              </span>
            </button>
          </div>
        {/if}
        <h2
          class={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 pr-12 pl-12 ${hasCustomColor ? "" : "text-slate-900 dark:text-white"}`}
        >
          {props?.title || "Katalog Produk Pilihan"}
        </h2>
        <p
          class={`text-xs sm:text-sm max-w-xl mx-auto ${hasCustomColor ? "opacity-80" : "text-slate-600 dark:text-slate-400"}`}
        >
          {props?.subtitle ||
            "Pilih produk terbaik kami dengan jaminan mutu dan kemudahan pemesanan"}
        </p>
      </div>

      <!-- Category Tabs -->
      {#if activeStoreId && categories.length > 0}
        <div class="flex items-center justify-center mb-8">
          <div
            class="flex overflow-x-auto hide-scrollbar gap-2 px-2 py-1 max-w-full"
          >
            <button
              type="button"
              on:click={() => handleCategorySelect("all")}
              class={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeCategoryId === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Semua
            </button>
            {#each categories as category}
              <button
                type="button"
                on:click={() => handleCategorySelect(category.id)}
                class={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeCategoryId === category.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {category.name}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Product Grid -->
      {#if isLoading && currentPage === 1}
        <div class="py-12 flex justify-center">
          <div class="loading loading-spinner loading-lg text-blue-500"></div>
        </div>
      {:else if products.length === 0}
        <div
          class="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center gap-2"
        >
          <ShoppingBag size={28} class="text-slate-300 dark:text-slate-600" />
          <p class="text-xs">Belum ada produk di katalog.</p>
        </div>
      {:else}
        <div
          data-node="product_grid"
          class={activePreset === "carousel_scroll"
            ? "flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar w-full"
            : activePreset === "list_compact"
              ? "flex flex-col gap-4 w-full"
              : `grid ${gridColClass} ${gridGapClass}`}
        >
          {#each products as product, index (product.name + index)}
            <ProductCatalogCard
              {product}
              {index}
              {activePreset}
              {isHorizontalLayout}
              {cardRadiusClass}
              {cardPresetClass}
              {imageAspectClass}
              {badgePosClass}
              {badgeColorClass}
              {nameSizeClass}
              {nameWeightClass}
              {isInlinePrice}
              {ctaBtnRadiusClass}
              {isActive}
              {draggedIdx}
              {dropTargetIdx}
              {onDragStart}
              {onDragOver}
              {onDrop}
              onDragLeave={() => (dropTargetIdx = null)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          {/each}
        </div>

        <!-- Load More Pagination -->
        {#if activeStoreId && currentPage < totalPages}
          <div class="mt-10 flex justify-center">
            <button
              type="button"
              on:click={handleLoadMore}
              disabled={isLoading}
              class="btn btn-outline border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 px-8 rounded-full font-semibold shadow-sm cursor-pointer"
            >
              {#if isLoading}
                <span class="loading loading-spinner loading-sm"></span>
                Memuat...
              {:else}
                Muat Lebih Banyak
              {/if}
            </button>
          </div>
        {/if}
      {/if}
    </div>
  {:else}
    <!-- CHECKOUT VIEW -->
    <div
      in:fly={{ x: 20, duration: 400, delay: 100 }}
      out:fly={{ x: 20, duration: 300 }}
      class="py-4 sm:py-8 max-w-5xl mx-auto text-left"
    >
      <div class="flex items-center gap-4 mb-8">
        <button
          class="btn btn-circle btn-ghost btn-sm hover:scale-105 active:scale-95 transition-all"
          on:click={() => (currentView = "catalog")}
        >
          <ArrowLeft size={20} />
        </button>
        <h2
          class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
        >
          Selesaikan Pesanan Anda
        </h2>
      </div>

      <div class="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <!-- BAGIAN KIRI: RINGKASAN PESANAN -->
        <div class="flex-1 lg:sticky lg:top-8 self-start">
          <div
            class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col h-fit"
          >
            <h3
              class="text-base font-bold mb-6 text-slate-800 dark:text-slate-100"
            >
              Ringkasan Pesanan
            </h3>

            {#if detailedCart.length === 0}
              <div
                class="p-8 text-center border border-slate-200 dark:border-slate-700 border-dashed rounded-2xl"
              >
                <p class="font-medium text-slate-500">Keranjang kosong.</p>
                <button
                  class="btn btn-sm mt-4 rounded-full bg-[var(--theme-primary,#4f00ff)] text-white hover:brightness-110 border-none hover:scale-105 transition-all"
                  on:click={() => (currentView = "catalog")}
                  >Kembali Belanja</button
                >
              </div>
            {:else}
              <div class="space-y-4 flex-1">
                {#each detailedCart as item, idx}
                  <div
                    class="flex gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl group hover:bg-slate-100 transition-colors"
                    transition:slide={{ duration: 300 }}
                  >
                    <div
                      class="w-[72px] h-[72px] rounded-xl overflow-hidden bg-slate-200 flex-shrink-0"
                    >
                      {#if item.product.imageUrl}
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      {/if}
                    </div>
                    <div class="flex-1 flex flex-col justify-center">
                      <h4
                        class="font-bold text-sm text-slate-900 dark:text-white line-clamp-1"
                      >
                        {item.product.name}
                      </h4>
                      <p class="text-[12px] text-slate-500 mt-0.5">
                        Varian: {Object.values(item.selections).join(", ")}
                      </p>
                      <p
                        class="text-[var(--theme-primary,#4f00ff)] font-extrabold font-mono mt-1.5 text-sm tracking-tight"
                      >
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div class="flex items-center gap-3">
                      <div
                        class="flex flex-col items-center bg-white dark:bg-slate-600 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-500"
                      >
                        <button
                          class="btn btn-xs btn-ghost rounded-none h-7 min-h-0 w-8 hover:bg-slate-100 text-slate-500"
                          on:click={() => updateCartQty(idx, 1)}
                          ><Plus size={14} /></button
                        >
                        <span class="text-xs font-bold w-8 text-center py-0.5"
                          >{item.qty}</span
                        >
                        <button
                          class="btn btn-xs btn-ghost rounded-none h-7 min-h-0 w-8 hover:bg-slate-100 text-slate-500"
                          on:click={() => updateCartQty(idx, -1)}
                          ><Minus size={14} /></button
                        >
                      </div>
                      <button
                        class="btn btn-ghost btn-sm btn-circle text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        on:click={() => removeFromCart(idx)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                {/each}
              </div>

              <div
                class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-between items-end"
              >
                <span class="font-bold text-slate-700 dark:text-slate-300"
                  >Total Harga</span
                >
                <div class="text-right">
                  <p
                    class="text-2xl font-black font-mono text-[var(--theme-primary,#4f00ff)] tracking-tight"
                  >
                    Rp {cartTotal.toLocaleString("id-ID")}
                  </p>
                  <p class="text-[10px] text-slate-400 mt-1">
                    *Belum termasuk ongkos kirim
                  </p>
                </div>
              </div>
            {/if}
          </div>
        </div>

        <!-- BAGIAN KANAN: INFORMASI PENGIRIMAN -->
        <div class="w-full lg:w-[480px]">
          <div
            class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-[0_2px_20px_rgba(0,0,0,0.02)]"
          >
            <h3
              class="text-base font-bold mb-6 text-slate-800 dark:text-slate-100"
            >
              Informasi Pengiriman
            </h3>

            <div class="space-y-5">
              <div class="flex flex-col sm:flex-row gap-5">
                <div class="flex-1">
                  <label
                    for="form-name"
                    class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2"
                    >Nama Lengkap *</label
                  >
                  <input
                    id="form-name"
                    type="text"
                    bind:value={form.name}
                    placeholder="Misal: Budi Santoso"
                    class="input input-sm h-11 w-full rounded-xl bg-slate-50 border-slate-200 focus:border-[var(--theme-primary,#4f00ff)] focus:ring-[var(--theme-primary,#4f00ff)] placeholder:text-slate-400 placeholder:italic placeholder:font-light transition-colors"
                  />
                </div>
                <div class="flex-1">
                  <label
                    for="form-phone"
                    class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2"
                    >Nomor WhatsApp *</label
                  >
                  <input
                    id="form-phone"
                    type="tel"
                    bind:value={form.phone}
                    placeholder="Contoh: 08123456789"
                    class="input input-sm h-11 w-full rounded-xl bg-slate-50 border-slate-200 focus:border-[var(--theme-primary,#4f00ff)] focus:ring-[var(--theme-primary,#4f00ff)] placeholder:text-slate-400 placeholder:italic placeholder:font-light transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  for="form-address"
                  class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2"
                  >Alamat Lengkap *</label
                >
                <textarea
                  id="form-address"
                  bind:value={form.address}
                  placeholder="Jalan, No Rumah, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Kodepos"
                  class="textarea w-full rounded-xl bg-slate-50 border-slate-200 h-24 focus:border-[var(--theme-primary,#4f00ff)] focus:ring-[var(--theme-primary,#4f00ff)] placeholder:text-slate-400 placeholder:italic placeholder:font-light transition-colors pt-3"
                ></textarea>
              </div>

              <div>
                <label
                  for="form-delivery"
                  class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2"
                  >Opsi Pengantaran *</label
                >
                <select
                  id="form-delivery"
                  bind:value={form.delivery}
                  class="select select-sm h-11 w-full rounded-xl bg-slate-50 border-slate-200 focus:border-[var(--theme-primary,#4f00ff)] focus:ring-[var(--theme-primary,#4f00ff)] transition-colors"
                >
                  <option value="Reguler">Reguler (Estimasi 2-3 Hari)</option>
                  <option value="Instan">Instan (Gojek/Grab)</option>
                </select>
              </div>

              <div class="mb-8">
                <label
                  for="form-notes"
                  class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2"
                  >Catatan Tambahan (Opsional)</label
                >
                <input
                  id="form-notes"
                  type="text"
                  bind:value={form.notes}
                  placeholder="Misal: Warna khusus, patokan rumah"
                  class="input input-sm h-11 w-full rounded-xl bg-slate-50 border-slate-200 focus:border-[var(--theme-primary,#4f00ff)] focus:ring-[var(--theme-primary,#4f00ff)] placeholder:text-slate-400 placeholder:italic placeholder:font-light transition-colors"
                />
              </div>

              <button
                class="btn w-full rounded-xl text-white shadow-md border-none flex gap-2 h-12 bg-[#25D366] hover:bg-[#20BA56] hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-sm"
                disabled={detailedCart.length === 0}
                on:click={handleCheckout}
              >
                <WhatsAppIcon size={18} /> Kirim Pesanan via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
