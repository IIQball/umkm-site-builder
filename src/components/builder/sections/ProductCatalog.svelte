<script lang="ts">
  import { editorStore, canvasStore } from "../stores/editorStore";
  import type {
    ProductCatalogProps,
    SectionStyles,
    ProductItem,
  } from "@/types";
  import { Package, ShoppingBag, MessageCircle } from "lucide-svelte";
  import {
    DEFAULT_DEMO_PRODUCTS,
    getBadgeColorClass,
    getCardPresetClass,
  } from "./productCatalog.helpers";
  import { onMount } from "svelte";
  import { generateWhatsAppOrderUrl } from "../../../lib/whatsapp";

  export let props: ProductCatalogProps & { storeId?: string } = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = "";
  export let isActive: boolean = false;
  export let layoutPreset: string = "grid_standard";

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || "grid_standard";

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
    if (activePreset === 'grid_2_col_large') {
      return isMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';
    }
    if (activePreset === 'masonry_catalog') {
      return isMobileView ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
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
    (cardPreset === "horizontal" || activePreset === 'horizontal_card_slider') && (!isMobileView || colMobile === 1);
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
  $: ctaWidthClass =
    (props?.ctaButtonWidth ?? styles?.ctaButtonWidth) === "compact"
      ? "w-auto px-4 py-2 self-start"
      : "w-full py-2.5";
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
  $: ctaBtnColor = String(
    props?.ctaButtonColor ?? styles?.ctaButtonColor ?? "var(--theme-primary, #2563eb)",
  );
  $: ctaBtnTextColor = String(
    props?.ctaButtonTextColor ?? styles?.ctaButtonTextColor ?? "#ffffff",
  );
  $: showWhatsAppIcon =
    (props?.showWhatsAppIcon ?? styles?.showWhatsAppIcon) !== false;
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

<div class="w-full box-border py-12">
  <!-- Section Header -->
  <div class="mb-8 text-center">
    <h2
      class={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${hasCustomColor ? "" : "text-slate-900 dark:text-white"}`}
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

  <!-- Catalog View -->
  {#if isLoading && currentPage === 1}
    <div class="py-12 flex justify-center">
      <div class="loading loading-spinner loading-lg text-blue-500"></div>
    </div>
  {:else if products.length === 0}
    <div
      class="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center gap-2"
    >
      <ShoppingBag size={28} class="text-slate-300 dark:text-slate-600" />
      <p class="text-xs">
        Belum ada produk di katalog. Tambahkan item di panel samping.
      </p>
    </div>
  {:else if activePreset === 'catalog_table_menu'}
    <!-- Preset E: Table Menu List (Clean Striped Menu List with 48px mini thumb & instant order button) -->
    <div class="w-full overflow-x-auto rounded-2xl border border-base-200 dark:border-slate-800 bg-[var(--theme-surface,#ffffff)] dark:bg-slate-900 shadow-sm">
      <table class="w-full text-left text-xs sm:text-sm">
        <thead class="bg-base-200/60 dark:bg-slate-800/80 text-[var(--theme-text-primary,#0f172a)] font-bold border-b border-base-200 dark:border-slate-800">
          <tr>
            <th class="p-4">Item Menu / Produk</th>
            <th class="p-4 hidden sm:table-cell">Deskripsi</th>
            <th class="p-4">Harga</th>
            <th class="p-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-base-200 dark:divide-slate-800">
          {#each products as product}
            <tr class="hover:bg-base-100/50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="p-4 flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                  {#if product.imageUrl}
                    <img src={product.imageUrl} alt={product.name} class="w-full h-full object-cover" />
                  {:else}
                    <div class="w-full h-full flex items-center justify-center text-slate-400">
                      <Package size={16} />
                    </div>
                  {/if}
                </div>
                <div>
                  <p class="font-bold text-[var(--theme-text-primary,#0f172a)]">{product.name || "Nama Produk"}</p>
                  {#if product.badge}
                    <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 mt-0.5 sm:hidden">{product.badge}</span>
                  {/if}
                </div>
              </td>
              <td class="p-4 hidden sm:table-cell text-xs text-[var(--theme-text-muted,#64748b)] max-w-xs truncate">
                {product.description || "-"}
              </td>
              <td class="p-4 font-mono font-bold text-[var(--theme-primary,#2563eb)] whitespace-nowrap">
                Rp {typeof product.price === "number" ? product.price.toLocaleString("id-ID") : product.price || "0"}
              </td>
              <td class="p-4 text-right">
                <a
                  href={activeStoreId && storeWaNumber
                    ? generateWhatsAppOrderUrl(storeWaNumber, product.name || "", typeof product.price === "number" ? product.price : undefined)
                    : "#"}
                  target={activeStoreId && storeWaNumber ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={`background-color: ${ctaBtnColor}; color: ${ctaBtnTextColor};`}
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:brightness-105"
                >
                  <MessageCircle size={12} />
                  <span class="hidden sm:inline">Pesan</span>
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

  {:else if activePreset === 'featured_hero_product' && products.length >= 3}
    {@const heroProd = products[0]}
    <!-- Preset B: Featured Hero Product (1 large card left Col 1-7, 2 small cards right Col 8-12) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch w-full">
      <div class="md:col-span-7 p-6 rounded-3xl bg-[var(--theme-surface,#ffffff)] dark:bg-slate-900 border border-base-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
        <div class="w-full aspect-[16/10] rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4 relative">
          {#if heroProd.imageUrl}
            <img src={heroProd.imageUrl} alt={heroProd.name} class="w-full h-full object-cover" />
          {/if}
          {#if heroProd.badge}
            <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow">{heroProd.badge}</span>
          {/if}
        </div>
        <div>
          <h3 class="text-xl sm:text-2xl font-black text-[var(--theme-text-primary,#0f172a)] mb-2">{heroProd.name}</h3>
          <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] mb-4 line-clamp-3">{heroProd.description}</p>
          <div class="flex items-center justify-between pt-4 border-t border-base-200 dark:border-slate-800">
            <p class="text-xl font-extrabold text-[var(--theme-primary,#2563eb)] font-mono">
              Rp {typeof heroProd.price === "number" ? heroProd.price.toLocaleString("id-ID") : heroProd.price}
            </p>
            <a
              href={activeStoreId && storeWaNumber
                ? generateWhatsAppOrderUrl(storeWaNumber, heroProd.name || "", typeof heroProd.price === "number" ? heroProd.price : undefined)
                : "#products"}
              target={activeStoreId && storeWaNumber ? "_blank" : undefined}
              rel="noopener noreferrer"
              style={`background-color: ${ctaBtnColor}; color: ${ctaBtnTextColor};`}
              class="px-6 py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer"
            >
              Beli Sekarang
            </a>
          </div>
        </div>
      </div>

      <!-- 2 Small Products Stacked on Right (Col 8-12) -->
      <div class="md:col-span-5 flex flex-col gap-6">
        {#each products.slice(1, 3) as p}
          <div class="p-4 rounded-2xl bg-[var(--theme-surface,#ffffff)] dark:bg-slate-900 border border-base-200 dark:border-slate-800 shadow-sm flex gap-4 items-center flex-1">
            <div class="w-28 h-28 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
              {#if p.imageUrl}
                <img src={p.imageUrl} alt={p.name} class="w-full h-full object-cover" />
              {/if}
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)] truncate">{p.name}</h4>
              <p class="text-xs font-mono font-bold text-[var(--theme-primary,#2563eb)] mt-1">
                Rp {typeof p.price === "number" ? p.price.toLocaleString("id-ID") : p.price}
              </p>
              <a
                href={activeStoreId && storeWaNumber
                  ? generateWhatsAppOrderUrl(storeWaNumber, p.name || "", typeof p.price === "number" ? p.price : undefined)
                  : "#products"}
                target={activeStoreId && storeWaNumber ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={`background-color: ${ctaBtnColor}; color: ${ctaBtnTextColor};`}
                class="inline-block mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Pesan
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>

  {:else}
    <!-- Grid Standard / Masonry / 2-Col Large / Carousel Scroll / List Compact -->
    <div
      data-node="product_grid"
      class={activePreset === 'carousel_scroll' || activePreset === 'horizontal_card_slider'
        ? "flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar w-full"
        : activePreset === 'list_compact'
          ? "flex flex-col gap-4 w-full"
          : `grid ${gridColClass} ${gridGapClass}`}
    >
      {#each products as product, index (product.name + index)}
        {@const isEven = index % 2 === 0}
        <div
          data-node="product_card"
          role="listitem"
          draggable={isActive}
          on:dragstart={(e) => onDragStart(e, index)}
          on:dragover={(e) => onDragOver(e, index)}
          on:dragleave={() => (dropTargetIdx = null)}
          on:drop={(e) => onDrop(e, index)}
          class={`relative overflow-hidden transition-all duration-200 ${cardRadiusClass} ${cardPresetClass} ${
            activePreset === 'carousel_scroll'
              ? "min-w-[260px] max-w-[280px] snap-start flex flex-col"
              : activePreset === 'horizontal_card_slider'
                ? "min-w-[320px] sm:min-w-[420px] snap-start flex flex-row items-stretch"
                : isHorizontalLayout || activePreset === 'list_compact'
                  ? "flex flex-row items-stretch"
                  : "flex flex-col"
          } ${isActive ? "cursor-grab active:cursor-grabbing" : ""} ${
            dropTargetIdx === index ? "ring-2 ring-blue-500 shadow-xl" : ""
          } ${draggedIdx === index ? "opacity-30" : ""}`}
        >
          <!-- Image with Nested Radius -->
          <div
            data-node="product_image"
            class={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${
              isHorizontalLayout || activePreset === 'list_compact' || activePreset === 'horizontal_card_slider'
                ? "w-32 sm:w-44 flex-shrink-0"
                : "w-full"
            }`}
          >
            {#if product.imageUrl}
              <img
                src={product.imageUrl}
                alt={product.name || "Produk"}
                class={`${
                  activePreset === 'masonry_catalog'
                    ? isEven ? 'aspect-square w-full object-cover' : 'aspect-[3/4] w-full object-cover'
                    : imageAspectClass
                } transition-transform duration-300 hover:scale-105`}
                loading="lazy"
              />
            {:else}
              <div
                class={`w-full ${
                  isHorizontalLayout || activePreset === 'list_compact' || activePreset === 'horizontal_card_slider'
                    ? "h-full min-h-[140px]"
                    : "h-48"
                } flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4`}
              >
                <Package size={26} class="text-slate-300 dark:text-slate-600" />
                <span class="text-[10px] font-medium text-slate-400">Foto Produk</span>
              </div>
            {/if}
            {#if product.badge}
              <div data-node="product_badge" class={`absolute ${badgePosClass} z-10`}>
                <span
                  class={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${badgeColorClass}`}
                  >{product.badge}</span
                >
              </div>
            {/if}
          </div>

          <!-- Details -->
          <div
            class={`p-4 flex-1 flex flex-col justify-between ${
              isHorizontalLayout || activePreset === 'list_compact' || activePreset === 'horizontal_card_slider'
                ? "min-w-0"
                : ""
            }`}
          >
            <div>
              <h3
                data-node="product_title"
                class={`mb-1.5 text-[var(--theme-text-primary,#0f172a)] line-clamp-2 ${nameSizeClass} ${nameWeightClass}`}
              >
                {product.name || "Nama Produk"}
              </h3>
              {#if product.description}
                <p
                  class="text-xs text-[var(--theme-text-muted,#64748b)] line-clamp-2 leading-relaxed mb-1"
                >
                  {product.description}
                </p>
              {/if}
            </div>

            {#if isInlinePrice}
              <div
                class="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2"
              >
                <div data-node="product_price" class="min-w-0">
                  <span
                    class="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block leading-tight"
                    >Harga</span
                  >
                  <p
                    class="text-sm sm:text-base font-extrabold text-[var(--theme-primary,#2563eb)] font-mono truncate"
                  >
                    Rp {typeof product.price === "number"
                      ? product.price.toLocaleString("id-ID")
                      : product.price || "0"}
                  </p>
                </div>
                <div data-node="product_cta">
                  <a
                    href={activeStoreId && storeWaNumber
                      ? generateWhatsAppOrderUrl(
                          storeWaNumber,
                          product.name || "",
                          typeof product.price === "number"
                            ? product.price
                            : undefined,
                        )
                      : "#"}
                    target={activeStoreId && storeWaNumber ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    on:click={(e) => {
                      if (isActive) e.preventDefault();
                    }}
                    style={`background-color: ${ctaBtnColor}; color: ${ctaBtnTextColor};`}
                    class={`px-3.5 py-2 text-xs font-semibold shadow-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${ctaBtnRadiusClass}`}
                  >
                    {#if showWhatsAppIcon}<MessageCircle size={14} />{/if}
                    <span>Beli Sekarang</span>
                  </a>
                </div>
              </div>
            {:else}
              <div class="mt-2">
                <p
                  data-node="product_price"
                  class="text-base sm:text-lg font-extrabold text-[var(--theme-primary,#2563eb)] mb-3 font-mono"
                >
                  Rp {typeof product.price === "number"
                    ? product.price.toLocaleString("id-ID")
                    : product.price || "0"}
                </p>
                <div data-node="product_cta">
                  <a
                    href={activeStoreId && storeWaNumber
                      ? generateWhatsAppOrderUrl(
                          storeWaNumber,
                          product.name || "",
                          typeof product.price === "number"
                            ? product.price
                            : undefined,
                        )
                      : "#"}
                    target={activeStoreId && storeWaNumber ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    on:click={(e) => {
                      if (isActive) e.preventDefault();
                    }}
                    style={`background-color: ${ctaBtnColor}; color: ${ctaBtnTextColor};`}
                    class={`${ctaWidthClass} text-xs font-semibold shadow-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${ctaBtnRadiusClass}`}
                  >
                    {#if showWhatsAppIcon}<MessageCircle size={14} />{/if}
                    <span>Beli Sekarang</span>
                  </a>
                </div>
              </div>
            {/if}
          </div>
        </div>
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
