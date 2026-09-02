<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { InferSelectModel } from "drizzle-orm";
  import type { products as productsSchema } from "../../db/schema";
  import type { VariantGroup } from "../../schemas/product-variant.schema";
  import ImageUpload from "../shared/ImageUpload.svelte";
  import { Button, Input } from "@/components/ui";
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
  let dialogElement: HTMLDialogElement;
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
      imageUrls = Array.isArray(editingProduct.imageUrls)
        ? editingProduct.imageUrls.map(String)
        : [];
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

    if (dialogElement && !dialogElement.open) {
      dialogElement.showModal();
    }
  } else if (!showModal && wasOpen) {
    wasOpen = false;
    if (dialogElement && dialogElement.open) {
      dialogElement.close();
    }
  }

  const closeModal = () => {
    showModal = false;
    errorMessage = "";
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
    if (basePrice < 0 || isNaN(basePrice)) {
      fieldErrors.basePrice = "Harga dasar tidak valid";
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
      const finalSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const cleanedVariants = variantGroups
        .filter((g) => g.groupName.trim() && g.options.length > 0)
        .map((g) => ({
          ...g,
          options: g.options.filter((o) => o.name.trim()),
        }))
        .filter((g) => g.options.length > 0);

      const payload = {
        storeId,
        categoryId,
        name,
        slug: finalSlug,
        basePrice,
        description,
        isAvailable,
        sortOrder,
        variants: cleanedVariants,
        imageUrls,
      };

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

<dialog
  class="modal backdrop-blur-sm"
  bind:this={dialogElement}
  on:close={closeModal}
>
  <div class="modal-box rounded-2xl p-6 md:p-8 max-w-2xl bg-card border border-light shadow-xl">
    <h3 class="font-bold text-heading-md text-main tracking-tight font-heading mb-6">
      {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
    </h3>

    {#if errorMessage}
      <div class="alert alert-error mb-4 shadow-sm">
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

    <div class="modal-action mt-8 flex items-center justify-end gap-3">
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
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
