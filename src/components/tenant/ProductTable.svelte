<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { toast } from "@/lib/toast";

  import type { InferSelectModel } from "drizzle-orm";
  import type { products as productsSchema } from "../../db/schema";
  import ProductFormModal from "./ProductFormModal.svelte";
  import ProductDeleteModal from "./ProductDeleteModal.svelte";
  import ProductTableRow from "./ProductTableRow.svelte";

  import { StatCard, Card, Table, Input, Button, Pagination } from "@/components/ui";
  type Product = InferSelectModel<typeof productsSchema>;
  type Category = { id: string; name: string };

  export let storeId: string;
  export let categories: Category[];

  let products: Product[] = [];
  let searchCategoryName = "";
  $: filteredProducts = products.filter((p) => {
    if (
      !searchCategoryName ||
      searchCategoryName.toLowerCase() === "semua kategori"
    )
      return true;
    const catName = categories.find((c) => c.id === p.categoryId)?.name || "";
    return catName.toLowerCase().includes(searchCategoryName.toLowerCase());
  });

  let currentPage = 1;
  const itemsPerPage = 5;
  
  // Reset pagination on search change
  $: if (searchCategoryName !== undefined) {
    currentPage = 1;
  }

  $: totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  $: paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  $: displayedCategories = categories.filter(
    (c) =>
      !searchCategoryName ||
      searchCategoryName.toLowerCase() === "semua kategori" ||
      c.name.toLowerCase().includes(searchCategoryName.toLowerCase()),
  );

  let isDropdownOpen = false;

  const selectCategory = (name: string) => {
    searchCategoryName = name;
    isDropdownOpen = false;
  };

  let loading = true;
  let error = "";

  let showFormModal = false;
  let editingProduct: Product | null = null;

  let showDeleteModal = false;
  let deletingId: string | null = null;

  const openDeleteModal = (id: string) => {
    deletingId = id;
    showDeleteModal = true;
  };

  const openAddModal = () => {
    editingProduct = null;
    showFormModal = true;
  };

  const openEditModal = (product: Product) => {
    editingProduct = product;
    showFormModal = true;
  };

  const toggleStatus = async (product: Product, newStatus: boolean) => {
    try {
      const res = await fetch(`/api/products/${product.id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        product.isAvailable = newStatus;
        products = [...products];
        toast.success("Status stok berhasil diubah");
      } else {
        product.isAvailable = !newStatus;
        products = [...products];
        toast.error(data.error?.message || "Gagal mengubah status");
      }
    } catch (e) {
      product.isAvailable = !newStatus;
      products = [...products];
      toast.error("Terjadi kesalahan jaringan");
    }
  };

  function handleToggleEvent(
    e: CustomEvent<{ product: Product; newStatus: boolean }>,
  ) {
    toggleStatus(e.detail.product, e.detail.newStatus);
  }

  function handleEdit(e: CustomEvent<Product>) {
    openEditModal(e.detail);
  }

  function handleDelete(e: CustomEvent<string>) {
    openDeleteModal(e.detail);
  }

  const fetchProducts = async () => {
    loading = true;
    error = "";
    try {
      const res = await fetch(`/api/products?storeId=${storeId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.ok) {
        products = data.data;
      } else {
        error = data.error.message;
      }
    } catch (e: unknown) {
      error =
        e instanceof Error ? e.message : "Terjadi kesalahan tidak dikenal";
    } finally {
      loading = false;
    }
  };

  const handleOpenAdd = () => {
    if (products.length >= 10) {
      toast.error("Batas maksimum 10 produk tercapai. Fitur berbayar.");
      return;
    }
    openAddModal();
  };

  onMount(() => {
    if (storeId) fetchProducts();
    if (typeof window !== "undefined") {
      window.addEventListener("open-add-product", handleOpenAdd);
    }
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("open-add-product", handleOpenAdd);
    }
  });

  // Derived stats for real-time reactivity
  $: totalProducts = filteredProducts.length;
  $: activeProducts = filteredProducts.filter((p) => p.isAvailable).length;
  $: inactiveProducts = totalProducts - activeProducts;
  $: categoryCount = displayedCategories.length;
</script>

<div class="space-y-8">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {#key totalProducts}
      <StatCard
        label="Total Produk"
        value={totalProducts}
        rawValue={totalProducts}
        icon="shopping_bag"
        cardTheme="dark"
        badge="Katalog"
        footerText="Jumlah produk dibuat"
        delayClass="delay-100"
      />
    {/key}
    {#key activeProducts}
      <StatCard
        label="Produk Aktif"
        value={activeProducts}
        rawValue={activeProducts}
        icon="check_circle"
        cardTheme="default"
        badge="Aktif"
        footerText="Tersedia untuk dijual"
        delayClass="delay-150"
      />
    {/key}
    {#key inactiveProducts}
      <StatCard
        label="Stok Terbatas"
        value={0}
        rawValue={0}
        icon="warning"
        cardTheme="orange"
        badge="Perhatian"
        footerText="Produk dengan stok < 5"
        delayClass="delay-200"
      />
    {/key}
    {#key categoryCount}
      <StatCard
        label="Kategori"
        value={categoryCount}
        rawValue={categoryCount}
        icon="layers"
        cardTheme="blue"
        badge="Organisir"
        footerText="Kategori produk toko"
        delayClass="delay-250"
      />
    {/key}
  </div>

  <!-- Kontainer Tabel Utama -->
  <Card
    variant="bordered"
    padding="none"
    radius="2xl"
    className="shadow-xs overflow-hidden animate-fade-in-up delay-400"
  >
    <div
      class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs"
        >
          <span class="material-symbols-outlined text-lg">inventory_2</span>
        </div>
        <div>
          <h3
            class="text-heading-md text-main font-bold font-heading leading-tight"
          >
            Daftar Produk
          </h3>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">
            Kelola daftar produk, varian, dan harga untuk toko Anda
          </p>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2.5">
        <div class="relative {isDropdownOpen ? 'block' : ''}">
          <div class="relative w-full min-w-[200px]">
            <Input
              id="categorySearchInput"
              placeholder="Ketik kategori..."
              bind:value={searchCategoryName}
              on:focus={() => (isDropdownOpen = true)}
              on:blur={() => setTimeout(() => (isDropdownOpen = false), 200)}
              size="sm"
            >
              <svelte:fragment slot="prefix">
                <span class="material-symbols-outlined text-lg"
                  >filter_list</span
                >
              </svelte:fragment>
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                slot="suffix"
                class="flex items-center cursor-pointer px-1"
                on:mousedown|preventDefault={() => {
                  if (isDropdownOpen) {
                    isDropdownOpen = false;
                    document.getElementById("categorySearchInput")?.blur();
                  } else {
                    isDropdownOpen = true;
                    document.getElementById("categorySearchInput")?.focus();
                  }
                }}
              >
                <span class="material-symbols-outlined text-base"
                  >expand_more</span
                >
              </div>
            </Input>
          </div>
          {#if isDropdownOpen}
            <ul
              class="absolute right-0 z-20 p-1.5 flex flex-col gap-0.5 shadow-md bg-card rounded-xl w-full mt-2 max-h-60 overflow-y-auto border border-light"
            >
              <li>
                <button
                  type="button"
                  class="text-sm font-bold font-sans cursor-pointer text-main w-full text-left px-3 py-2 rounded-lg hover:bg-nested/80"
                  on:click={() => selectCategory("Semua Kategori")}
                >
                  Semua Kategori
                </button>
              </li>
              {#each displayedCategories as category}
                <li>
                  <button
                    type="button"
                    class="text-sm font-medium font-sans cursor-pointer text-main w-full text-left px-3 py-2 rounded-lg hover:bg-nested/80"
                    on:click={() => selectCategory(category.name)}
                  >
                    {category.name}
                  </button>
                </li>
              {/each}
              {#if displayedCategories.length === 0}
                <li class="px-4 py-2 text-sm font-sans text-muted text-center">
                  Kategori tidak ditemukan
                </li>
              {/if}
            </ul>
          {/if}
        </div>
      </div>
    </div>

    {#if error}
      <div
        class="mb-4 p-4 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-500/20 flex gap-3 items-center animate-fade-in"
      >
        <span class="material-symbols-outlined text-lg">error</span>
        <span class="text-sm font-medium">{error}</span>
      </div>
    {/if}

    {#if loading}
      <div class="flex justify-center my-12">
        <span class="loading loading-spinner loading-md text-primary"></span>
      </div>
    {:else if products.length === 0}
      <div class="py-16 px-8 flex flex-col items-center text-center">
        <div
          class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs"
        >
          <span class="material-symbols-outlined text-2xl">inventory_2</span>
        </div>
        <h4 class="text-heading-md font-bold text-main mb-1.5 font-heading">
          Belum Ada Produk
        </h4>
        <p
          class="text-body-sm text-secondary max-w-xs leading-relaxed mb-4 font-sans"
        >
          Silakan tambahkan produk pertama Anda.
        </p>
        <div class="mt-2">
          <Button variant="primary" size="sm" on:click={handleOpenAdd}>
            <span class="material-symbols-outlined text-base">add</span>
            <span>Tambah Produk</span>
          </Button>
        </div>
      </div>
    {:else}
      <Table
        headers={[
          { label: "Produk" },
          { label: "Kategori" },
          { label: "Deskripsi" },
          { label: "Harga" },
          { label: "Status" },
          { label: "Aksi", align: "right" },
        ]}
      >
        {#if paginatedProducts.length === 0}
          <tr>
            <td colspan="6" class="text-center py-8 text-secondary">
              Tidak ada produk di kategori ini.
            </td>
          </tr>
        {:else}
          {#each paginatedProducts as product}
            <ProductTableRow
              {product}
              {categories}
              on:edit={handleEdit}
              on:delete={handleDelete}
              on:toggle={handleToggleEvent}
            />
          {/each}
        {/if}
      </Table>
      
      {#if totalPages > 1}
        <div class="px-6 py-4 border-t border-light flex justify-center">
          <Pagination
            {currentPage}
            totalItems={filteredProducts.length}
            pageSize={itemsPerPage}
            on:pageChange={(e) => (currentPage = e.detail)}
          />
        </div>
      {/if}
    {/if}
  </Card>

  <ProductFormModal
    bind:showModal={showFormModal}
    {storeId}
    {categories}
    {editingProduct}
    on:success={fetchProducts}
  />

  <ProductDeleteModal
    bind:showModal={showDeleteModal}
    {deletingId}
    on:success={fetchProducts}
  />
</div>
