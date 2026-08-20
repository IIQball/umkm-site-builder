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
  <!-- Stat Cards: Dipindah ke atas -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
    <div
      class="stat bg-base-100 rounded-2xl shadow-sm border border-[var(--color-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default"
    >
      <div class="stat-title text-base-content/70 font-medium">
        Total Produk
      </div>
      <div class="stat-value text-[var(--color-primary)]">{totalProducts}</div>
      <div class="stat-desc">Seluruh produk terdaftar</div>
    </div>

    <div
      class="stat bg-base-100 rounded-2xl shadow-sm border border-[var(--color-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default"
    >
      <div class="stat-title text-base-content/70 font-medium">
        Produk Aktif
      </div>
      <div class="stat-value text-success">{activeProducts}</div>
      <div class="stat-desc">Siap untuk dijual</div>
    </div>

    <div
      class="stat bg-base-100 rounded-2xl shadow-sm border border-[var(--color-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default"
    >
      <div class="stat-title text-base-content/70 font-medium">
        Produk tidak aktif
      </div>
      <div class="stat-value text-base-content/40">{inactiveProducts}</div>
      <div class="stat-desc">Stok nonaktif</div>
    </div>
  </div>

  <!-- Kontainer Tabel Utama (Putih) -->
  <div class="bg-base-100 border border-[var(--color-border)] shadow-sm rounded-2xl overflow-hidden p-6 mb-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold tracking-tight text-base-content">
        Daftar Produk
      </h2>
      <button
        class="btn bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white border-none shadow-sm rounded-lg"
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
    <div class="alert alert-error mb-4 shadow-sm rounded-lg">
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
      class="text-center py-12 border border-dashed border-base-300 rounded-2xl bg-base-50/50"
    >
      <p class="text-base-content/60">
        Belum ada produk. Silakan tambahkan produk pertama Anda.
      </p>
    </div>
  {:else}
    <div
      class="overflow-x-auto rounded-xl border border-base-200 bg-base-100 shadow-sm"
    >
      <table class="table w-full text-sm">
        <thead
          class="bg-base-200/40 text-base-content/60 border-b border-base-200"
        >
          <tr>
            <th class="font-medium px-4 py-3">Produk</th>
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
