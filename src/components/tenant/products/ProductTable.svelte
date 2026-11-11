<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { toast } from "@/lib/toast";
  import { apiFetch } from "@/lib/api/parse-response";
  import type { InferSelectModel } from "drizzle-orm";
  import type { products as productsSchema } from "@/db/schema";
  import ProductFormModal from "./ProductFormModal.svelte";
  import ProductDeleteModal from "./ProductDeleteModal.svelte";
  import ProductTableRow from "./ProductTableRow.svelte";
  import ProductStatsRow from "./ProductStatsRow.svelte";
  import ProductCategoryFilter from "./ProductCategoryFilter.svelte";
  import { Card, Table, Button, Pagination } from "@/components/ui";

  type Product = InferSelectModel<typeof productsSchema>;
  type Category = { id: string; name: string };

  export let storeId: string;
  export let categories: Category[];
  export let maxProducts = 10;

  let products: Product[] = [];
  let searchCategoryName = "";
  let currentPage = 1;
  const itemsPerPage = 5;
  let loading = true;
  let error = "";

  let showFormModal = false;
  let editingProduct: Product | null = null;
  let showDeleteModal = false;
  let deletingId: string | null = null;

  $: filteredProducts = products.filter((p) => {
    if (!searchCategoryName || searchCategoryName.toLowerCase() === "semua kategori") return true;
    const catName = categories.find((c) => c.id === p.categoryId)?.name || "";
    return catName.toLowerCase().includes(searchCategoryName.toLowerCase());
  });

  $: if (searchCategoryName !== undefined) currentPage = 1;
  $: totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  $: paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  $: displayedCategoryCount = categories.filter(
    (c) => !searchCategoryName || searchCategoryName.toLowerCase() === "semua kategori" || c.name.toLowerCase().includes(searchCategoryName.toLowerCase())
  ).length;
  $: totalProducts = filteredProducts.length;
  $: activeProducts = filteredProducts.filter((p) => p.isAvailable).length;

  const toggleStatus = async (product: Product, newStatus: boolean) => {
    try {
      const result = await apiFetch(`/api/products/${product.id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: newStatus }),
        fallbackError: "Gagal mengubah status",
      });
      if (result.success) {
        product.isAvailable = newStatus;
        products = [...products];
        toast.success("Status stok berhasil diubah");
      } else {
        product.isAvailable = !newStatus;
        products = [...products];
        toast.error(result.message);
      }
    } catch {
      product.isAvailable = !newStatus;
      products = [...products];
      toast.error("Terjadi kesalahan jaringan");
    }
  };

  const fetchProducts = async () => {
    loading = true;
    error = "";
    try {
      const result = await apiFetch<Product[]>(`/api/products?storeId=${storeId}`, {
        cache: "no-store",
        fallbackError: "Gagal memuat daftar produk",
      });
      if (result.success && Array.isArray(result.data)) {
        products = result.data;
      } else {
        error = result.message;
        toast.error(error);
      }
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : "Terjadi kesalahan tidak dikenal";
      toast.error(error);
    } finally {
      loading = false;
    }
  };

  const handleOpenAdd = () => {
    if (products.length >= maxProducts) {
      toast.error(`Batas maksimum ${maxProducts} produk tercapai. Silakan ajukan peningkatan kuota.`);
      return;
    }
    editingProduct = null;
    showFormModal = true;
  };

  onMount(() => {
    if (storeId) fetchProducts();
    if (typeof window !== "undefined") window.addEventListener("open-add-product", handleOpenAdd);
  });

  onDestroy(() => {
    if (typeof window !== "undefined") window.removeEventListener("open-add-product", handleOpenAdd);
  });
</script>

<div class="space-y-8 min-w-0">
  <ProductStatsRow {totalProducts} {activeProducts} categoryCount={displayedCategoryCount} />

  <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden animate-fade-in-up delay-400">
    <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-lg">inventory_2</span>
        </div>
        <div class="min-w-0">
          <h3 class="text-heading-md text-main font-bold font-heading leading-tight">Daftar Produk</h3>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">Kelola daftar produk, varian, dan harga untuk toko Anda</p>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2.5">
        <ProductCategoryFilter bind:searchCategoryName {categories} />
      </div>
    </div>

    {#if error}
      <div class="m-4 p-4 bg-error/10 text-error rounded-xl border border-error/20 flex gap-3 items-center animate-fade-in">
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
        <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
          <span class="material-symbols-outlined text-2xl">inventory_2</span>
        </div>
        <h4 class="text-heading-md font-bold text-main mb-1.5 font-heading">Belum Ada Produk</h4>
        <p class="text-body-sm text-secondary max-w-xs leading-relaxed mb-4 font-sans">Silakan tambahkan produk pertama Anda.</p>
        <div class="mt-2">
          <Button variant="primary" size="sm" on:click={handleOpenAdd}>
            <span class="material-symbols-outlined text-base">add</span>
            <span>Tambah Produk</span>
          </Button>
        </div>
      </div>
    {:else}
      <Table headers={[{ label: "Produk" }, { label: "Kategori" }, { label: "Deskripsi" }, { label: "Harga" }, { label: "Status" }, { label: "Aksi", align: "right" }]}>
        {#if paginatedProducts.length === 0}
          <tr>
            <td colspan="6" class="text-center py-8 text-secondary">Tidak ada produk di kategori ini.</td>
          </tr>
        {:else}
          {#each paginatedProducts as product}
            <ProductTableRow
              {product}
              {categories}
              on:edit={(e) => { editingProduct = e.detail; showFormModal = true; }}
              on:delete={(e) => { deletingId = e.detail; showDeleteModal = true; }}
              on:toggle={(e) => toggleStatus(e.detail.product, e.detail.newStatus)}
            />
          {/each}
        {/if}
      </Table>

      {#if totalPages > 1}
        <div class="px-6 py-4 border-t border-light flex justify-center">
          <Pagination {currentPage} totalItems={filteredProducts.length} pageSize={itemsPerPage} on:pageChange={(e) => (currentPage = e.detail)} />
        </div>
      {/if}
    {/if}
  </Card>

  <ProductFormModal bind:showModal={showFormModal} {storeId} {categories} {editingProduct} on:success={fetchProducts} />
  <ProductDeleteModal bind:showModal={showDeleteModal} {deletingId} on:success={fetchProducts} />
</div>
