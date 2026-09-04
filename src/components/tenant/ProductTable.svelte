<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { toast } from "@/lib/toast";

  import type { InferSelectModel } from "drizzle-orm";
  import type { products as productsSchema } from "../../db/schema";
  import ProductFormModal from "./ProductFormModal.svelte";
  import ProductDeleteModal from "./ProductDeleteModal.svelte";
  import ProductTableRow from "./ProductTableRow.svelte";

  import { StatCard, Card, Table, Input } from "@/components/ui";

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

<div class="space-y-8">
  <!-- Stat Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
    {#key totalProducts}
      <StatCard
        label="Total Produk"
        value={totalProducts}
        description="Seluruh produk terdaftar"
        icon="inventory_2"
        cardTheme="default"
        delayClass="delay-100"
      />
    {/key}
    {#key activeProducts}
      <StatCard
        label="Produk Aktif"
        value={activeProducts}
        description="Siap untuk dijual"
        icon="check_circle"
        cardTheme="default"
        delayClass="delay-200"
      />
    {/key}
    {#key inactiveProducts}
      <StatCard
        label="Tidak Aktif"
        value={inactiveProducts}
        description="Stok nonaktif"
        icon="block"
        cardTheme="default"
        delayClass="delay-300"
      />
    {/key}
  </div>

  <!-- Kontainer Tabel Utama -->
  <Card padding="lg" className="animate-fade-in-up delay-400">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
    >
      <h2 class="text-heading-md font-bold tracking-tight text-main">
        Daftar Produk
      </h2>
      <div class="flex items-center gap-3">
        <div
          class="dropdown dropdown-end {isDropdownOpen ? 'dropdown-open' : ''}"
        >
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
          <ul
            class="dropdown-content z-20 menu p-2 shadow-md bg-card rounded-xl w-full mt-2 max-h-60 overflow-y-auto border border-light"
          >
            <li>
              <button
                type="button"
                class="text-sm font-bold font-sans cursor-pointer text-main w-full text-left hover:bg-nested/80"
                on:click={() => selectCategory("Semua Kategori")}
              >
                Semua Kategori
              </button>
            </li>
            {#each displayedCategories as category}
              <li>
                <button
                  type="button"
                  class="text-sm font-medium font-sans cursor-pointer text-main w-full text-left hover:bg-nested/80"
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
      <div
        class="text-center py-16 rounded-2xl border border-dashed border-light"
      >
        <span class="material-symbols-outlined text-4xl text-muted mb-3"
          >inventory_2</span
        >
        <h3 class="text-lg font-bold text-main mb-1">Belum ada produk</h3>
        <p class="text-body-sm text-secondary">
          Silakan tambahkan produk pertama Anda.
        </p>
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
        {#if filteredProducts.length === 0}
          <tr>
            <td colspan="6" class="text-center py-8 text-secondary">
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
      </Table>
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
