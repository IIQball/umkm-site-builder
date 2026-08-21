<script lang="ts">
  import { onMount } from "svelte";

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
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: newStatus }),
      });
      if (res.ok) {
        product.isAvailable = newStatus;
        products = [...products];
      } else {
        product.isAvailable = !newStatus;
        products = [...products];
        alert("Gagal mengubah status");
      }
    } catch (e) {
      product.isAvailable = !newStatus;
      products = [...products];
    }
  }

  const handleToggleEvent = (
    e: CustomEvent<{ product: Product; newStatus: boolean }>,
  ) => {
    toggleStatus(e.detail.product, e.detail.newStatus);
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

  onMount(() => {
    if (storeId) fetchProducts();
  });

  // Derived stats
  $: totalProducts = products.length;
  $: activeProducts = products.filter((p) => p.isAvailable).length;
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
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold tracking-tight text-base-content">
        Daftar Produk
      </h2>
      <button
        class="btn bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white border-none shadow-sm rounded-xl px-5"
        on:click={openAddModal}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Tambah Produk
      </button>
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
          {#each products as product}
            <ProductTableRow
              {product}
              {categories}
              on:edit={(e) => openEditModal(e.detail)}
              on:delete={(e) => openDeleteModal(e.detail)}
              on:toggle={handleToggleEvent}
            />
          {/each}
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
