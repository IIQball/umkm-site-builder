<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { toast } from "@/lib/toast";

  import type { InferSelectModel } from "drizzle-orm";
  import type { products as productsSchema } from "../../db/schema";
  import ProductFormModal from "./ProductFormModal.svelte";
  import ProductDeleteModal from "./ProductDeleteModal.svelte";
  import ProductTableRow from "./ProductTableRow.svelte";

  type Product = InferSelectModel<typeof productsSchema>;
  type Category = { id: string; name: string };

  export let storeId: string;
  export let categories: Category[];

  let products: Product[] = [];
  let searchCategoryName = "";
  $: filteredProducts = products.filter(p => {
    if (!searchCategoryName || searchCategoryName.toLowerCase() === "semua kategori") return true;
    const catName = categories.find(c => c.id === p.categoryId)?.name || "";
    return catName.toLowerCase().includes(searchCategoryName.toLowerCase());
  });

  $: displayedCategories = categories.filter(c => 
    !searchCategoryName || 
    searchCategoryName.toLowerCase() === "semua kategori" || 
    c.name.toLowerCase().includes(searchCategoryName.toLowerCase())
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
  }

  const openAddModal = () => {
    editingProduct = null;
    showFormModal = true;
  }

  const openEditModal = (product: Product) => {
    editingProduct = product;
    showFormModal = true;
  }

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
        toast.success(data.message || "Status stok berhasil diubah");
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
  }

  function handleToggleEvent(e: CustomEvent<{ product: Product, newStatus: boolean }>) {
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
  }

  const handleOpenAdd = () => openAddModal();

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

  // Derived stats
  $: totalProducts = filteredProducts.length;
  $: activeProducts = filteredProducts.filter((p) => p.isAvailable).length;
  $: inactiveProducts = totalProducts - activeProducts;
</script>

<div>
  <!-- Stat Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    <div class="p-5 rounded-2xl bg-base-100 border border-base-200 shadow-sm space-y-1">
      <p class="text-xs text-base-content/50 font-medium uppercase tracking-wider">Total Produk</p>
      <p class="text-3xl font-extrabold text-base-content">{totalProducts}</p>
      <p class="text-xs text-base-content/40">Seluruh produk terdaftar</p>
    </div>

    <div class="p-5 rounded-2xl bg-base-100 border border-base-200 shadow-sm space-y-1">
      <p class="text-xs text-base-content/50 font-medium uppercase tracking-wider">Produk Aktif</p>
      <p class="text-3xl font-extrabold text-success">{activeProducts}</p>
      <p class="text-xs text-base-content/40">Siap untuk dijual</p>
    </div>

    <div class="p-5 rounded-2xl bg-base-100 border border-base-200 shadow-sm space-y-1">
      <p class="text-xs text-base-content/50 font-medium uppercase tracking-wider">Produk Tidak Aktif</p>
      <p class="text-3xl font-extrabold text-base-content">{inactiveProducts}</p>
      <p class="text-xs text-base-content/40">Stok nonaktif</p>
    </div>
  </div>

  <!-- Kontainer Tabel Utama -->
  <div class="bg-base-100 border border-base-200 shadow-sm rounded-2xl overflow-hidden p-6 mb-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-2xl font-bold tracking-tight text-base-content">
        Daftar Produk
      </h2>
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <div class="dropdown dropdown-end {isDropdownOpen ? 'dropdown-open' : ''}">
          <div class="relative w-full min-w-[160px] max-w-[200px]">
            <input 
              id="categorySearchInput"
              type="text"
              placeholder="Ketik kategori..."
              bind:value={searchCategoryName}
              on:focus={() => isDropdownOpen = true}
              on:blur={() => setTimeout(() => isDropdownOpen = false, 200)}
              class="input input-bordered input-sm bg-base-100 w-full pr-8"
            />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div 
              class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
              on:mousedown|preventDefault={() => {
                if (isDropdownOpen) {
                  isDropdownOpen = false;
                  document.getElementById('categorySearchInput')?.blur();
                } else {
                  isDropdownOpen = true;
                  document.getElementById('categorySearchInput')?.focus();
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <ul class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-xl w-52 mt-1 max-h-60 overflow-y-auto border border-base-200">
            <li>
              <button type="button" class="font-medium cursor-pointer text-base-content w-full text-left" on:click={() => selectCategory("Semua Kategori")}>
                Semua Kategori
              </button>
            </li>
            {#each displayedCategories as category}
              <li>
                <button type="button" class="cursor-pointer text-base-content w-full text-left" on:click={() => selectCategory(category.name)}>
                  {category.name}
                </button>
              </li>
            {/each}
            {#if displayedCategories.length === 0}
              <li class="px-4 py-2 text-xs text-base-content/50 text-center">Kategori tidak ditemukan</li>
            {/if}
          </ul>
        </div>
      </div>
    </div>

  {#if error}
    <div class="alert alert-error mb-4 shadow-sm rounded-xl">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        /></svg
      >
      <span>{error}</span>
    </div>
  {/if}

  {#if loading}
    <div class="flex justify-center my-12">
      <span class="loading loading-spinner loading-md text-primary"></span>
    </div>
  {:else if products.length === 0}
    <div
      class="text-center py-12 border border-dashed border-blue-300 dark:border-blue-800 rounded-2xl"
    >
      <p class="text-base-content/60">
        Belum ada produk. Silakan tambahkan produk pertama Anda.
      </p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table w-full text-sm">
        <thead
          class="bg-base-200/50 text-base-content/60 border-b border-base-200"
        >
          <tr>
            <th class="font-medium px-4 py-3">Produk</th>
            <th class="font-medium px-4 py-3">Kategori</th>
            <th class="font-medium px-4 py-3">Deskripsi</th>
            <th class="font-medium px-4 py-3">Harga</th>
            <th class="font-medium px-4 py-3">Status</th>
            <th class="font-medium px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-base-200">
          {#if filteredProducts.length === 0}
            <tr>
              <td colspan="6" class="text-center py-8 text-base-content/50">
                Tidak ada produk di kategori ini.
              </td>
            </tr>
          {:else}
            {#each filteredProducts as product}
              <ProductTableRow
                {product}
                {categories}
                on:edit={handleEdit}
                on:delete={handleDelete}
                on:toggle={handleToggleEvent}
              />
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  {/if}
  </div>

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
