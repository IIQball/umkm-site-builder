<script lang="ts">
  import { productImageUrls } from '@/lib/products/image';
  import { createEventDispatcher } from "svelte";
  import type { InferSelectModel } from "drizzle-orm";
  import type { products as productsSchema } from "../../db/schema";
  import type { VariantGroup } from "../../schemas/product-variant.schema";
  import ImageUpload from "../shared/ImageUpload.svelte";
  import { Button, Input, Modal } from "@/components/ui";
  import ProductVariantEditor from "./product/ProductVariantEditor.svelte";
  import ProductBasicFields from "./product/ProductBasicFields.svelte";
  import { deserializeVariants, validateVariantGroups } from "./product/productForm.helpers";

  type Product = InferSelectModel<typeof productsSchema>;
  type Category = { id: string; name: string };

  export let showModal = false;
  export let storeId: string;
  export let categories: Category[];
  export let editingProduct: Product | null = null;

  const dispatch = createEventDispatcher();
  let formLoading = false;
  let wasOpen = false;
  let errorMessage = "";

  // Form fields
  let name = "";
  let categoryId = "";
  let basePrice = 0;
  let description = "";
  let isAvailable = true;
  let sortOrder = 0;
  let imageUrls: string[] = [];
  let variantGroups: VariantGroup[] = [];
  let fieldErrors: Record<string, string> = {};

  function handleSortOrderInput(e: CustomEvent | Event) {
    const customEvent = e as CustomEvent;
    const target = (customEvent.detail?.target || e.target) as HTMLInputElement;
    if (target) {
      sortOrder = parseInt(target.value.replace(/\D/g, "")) || 0;
    }
  }

  // React to showModal changes safely to prevent continuous resetting
  $: if (showModal && !wasOpen) {
    wasOpen = true;
    errorMessage = "";
    fieldErrors = {};

    if (editingProduct) {
      name = editingProduct.name;
      categoryId = editingProduct.categoryId;
      basePrice = editingProduct.basePrice;
      description = editingProduct.description || "";
      isAvailable = editingProduct.isAvailable;
      sortOrder = editingProduct.sortOrder;
      variantGroups = deserializeVariants(editingProduct.variants);
      imageUrls = productImageUrls(editingProduct.imageUrls);
    } else {
      name = "";
      categoryId = categories.length > 0 ? categories[0].id : "";
      basePrice = 0;
      description = "";
      isAvailable = true;
      sortOrder = 0;
      variantGroups = [];
      imageUrls = [];
    }
  } else if (!showModal && wasOpen) {
    wasOpen = false;
  }

  const closeModal = () => {
    showModal = false;
    errorMessage = "";
    dispatch("close");
  };

  const handleSaveProduct = async () => {
    errorMessage = "";
    fieldErrors = {};
    let isValid = true;

    if (!name || name.trim().length < 2) {
      fieldErrors.name = "Nama produk wajib diisi (minimal 2 karakter)";
      isValid = false;
    }
    if (!categoryId) {
      fieldErrors.categoryId = "Kategori produk wajib dipilih";
      isValid = false;
    }
    if (basePrice < 0) {
      fieldErrors.basePrice = "Harga dasar tidak boleh negatif";
      isValid = false;
    }
    if (imageUrls.length === 0) {
      fieldErrors.imageUrls = "Mohon unggah minimal 1 gambar produk";
      isValid = false;
    }
    
    if (!validateVariantGroups(variantGroups, (k, msg) => { fieldErrors[k] = msg; })) {
      isValid = false;
    }

    if (!isValid) return;

    formLoading = true;
    try {
      const payload = {
        name,
        categoryId,
        basePrice,
        description,
        isAvailable,
        sortOrder,
        imageUrls,
        variants: variantGroups,
      };

      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : `/api/stores/${storeId}/products`;
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.ok) {
        closeModal();
        dispatch("success");
      } else {
        let errorMsg = data.error.message;
        if (errorMsg === "Validation failed" || errorMsg === "Validasi gagal") {
          errorMsg = "Pastikan semua form wajib sudah terisi dengan benar.";
        }
        errorMessage = "Gagal menyimpan: " + errorMsg;
      }
    } catch (e: unknown) {
      errorMessage =
        "Error: " +
        (e instanceof Error ? e.message : "Terjadi kesalahan tidak dikenal");
    } finally {
      formLoading = false;
    }
  };
</script>

<Modal
  open={showModal}
  on:close={closeModal}
  size="lg"
  title={editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
>
  {#if errorMessage}
    <div class="alert alert-error mb-4 shadow-xs">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{errorMessage}</span>
    </div>
  {/if}

  <ProductBasicFields
    bind:name
    bind:categoryId
    bind:basePrice
    bind:description
    {categories}
    {fieldErrors}
  />

  <div class="w-full mb-5 mt-4">
    <div class="block text-label-caps text-muted mb-1.5">Gambar Produk</div>
    <div
      class="border rounded-2xl p-2 bg-nested"
      class:border-error={fieldErrors.imageUrls}
    >
      <ImageUpload
        folder="products"
        maxFiles={1}
        existingUrls={imageUrls}
        onUpload={(urls) => {
          imageUrls = urls;
          fieldErrors.imageUrls = "";
        }}
      />
    </div>
    {#if fieldErrors.imageUrls}
      <span class="text-error text-xs mt-1">{fieldErrors.imageUrls}</span>
    {/if}
  </div>

  <!-- Variant Groups Editor -->
  <ProductVariantEditor
    bind:variantGroups
    {fieldErrors}
  />

  <div class="mb-3">
    <Input
      label="Urutan Tampil"
      type="text"
      inputmode="numeric"
      value={sortOrder}
      on:input={handleSortOrderInput}
    />
  </div>

  <div class="form-control mb-4">
    <label class="label cursor-pointer justify-start gap-4">
      <span class="block text-label-caps text-muted mb-0">Tersedia</span>
      <input
        id="product-avail"
        type="checkbox"
        class="toggle toggle-success toggle-sm"
        bind:checked={isAvailable}
      />
    </label>
  </div>

  <svelte:fragment slot="footer">
    <Button
      variant="secondary"
      size="sm"
      disabled={formLoading}
      on:click={closeModal}
    >
      Batal
    </Button>
    <Button
      variant="dark"
      size="sm"
      on:click={handleSaveProduct}
      disabled={formLoading}
      loading={formLoading}
      className="font-bold"
    >
      Simpan
    </Button>
  </svelte:fragment>
</Modal>
