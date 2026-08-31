<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { InferSelectModel } from "drizzle-orm";
  import type { products as productsSchema } from "../../db/schema";
  import type { VariantGroup, VariantOption } from "../../schemas/product-variant.schema";
  import ImageUpload from "../shared/ImageUpload.svelte";
  import { Button } from "@/components/ui";

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

  // React to showModal changes safely to prevent continuous resetting
  $: if (showModal && !wasOpen) {
    wasOpen = true;
    errorMessage = "";

    // Initialize form fields only once when opening
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

  function deserializeVariants(raw: unknown): VariantGroup[] {
    if (!Array.isArray(raw) || raw.length === 0) return [];

    // Handle new structured format
    if (raw[0] && typeof raw[0] === "object" && "groupName" in raw[0]) {
      return raw as VariantGroup[];
    }

    // Migrate legacy flat format: [{ name: "S" }, { name: "L" }]
    if (raw[0] && typeof raw[0] === "object" && "name" in raw[0]) {
      const legacyOptions: VariantOption[] = raw.map((v: unknown) => ({
        name: typeof v === "object" && v !== null && "name" in v
          ? String((v as { name: string }).name)
          : String(v),
        priceAdjustment: 0,
        isAvailable: true,
      }));
      return [{ groupName: "Varian", options: legacyOptions }];
    }

    return [];
  }

  function addVariantGroup() {
    if (variantGroups.length >= 5) return;
    variantGroups = [
      ...variantGroups,
      { groupName: "", options: [{ name: "", priceAdjustment: 0, isAvailable: true }] },
    ];
  }

  function removeVariantGroup(groupIndex: number) {
    variantGroups = variantGroups.filter((_, i) => i !== groupIndex);
  }

  function addVariantOption(groupIndex: number) {
    if (variantGroups[groupIndex].options.length >= 20) return;
    variantGroups[groupIndex].options = [
      ...variantGroups[groupIndex].options,
      { name: "", priceAdjustment: 0, isAvailable: true },
    ];
    variantGroups = [...variantGroups];
  }

  function removeVariantOption(groupIndex: number, optionIndex: number) {
    variantGroups[groupIndex].options = variantGroups[groupIndex].options.filter(
      (_, i) => i !== optionIndex,
    );
    // Remove group if no options left
    if (variantGroups[groupIndex].options.length === 0) {
      removeVariantGroup(groupIndex);
    } else {
      variantGroups = [...variantGroups];
    }
  }

  function formatPriceAdjustment(value: number): string {
    if (value === 0) return "";
    const prefix = value > 0 ? "+" : "";
    return prefix + value.toLocaleString("id-ID");
  }

  function parsePriceAdjustment(raw: string): number {
    const cleaned = raw.replace(/[^0-9-]/g, "");
    return cleaned ? parseInt(cleaned, 10) : 0;
  }

  const handlePriceInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value.replace(/\D/g, "");
    basePrice = rawValue ? parseInt(rawValue, 10) : 0;
    const formatted = basePrice ? basePrice.toLocaleString("id-ID") : "";
    target.value = formatted;
  };

  const closeModal = () => {
    showModal = false;
    errorMessage = "";
  };

  let fieldErrors: Record<string, string> = {};

  function validateVariantGroups(): boolean {
    for (let gi = 0; gi < variantGroups.length; gi++) {
      const group = variantGroups[gi];
      if (!group.groupName.trim()) {
        fieldErrors[`variantGroup_${gi}`] = "Nama grup varian wajib diisi";
        return false;
      }
      for (let oi = 0; oi < group.options.length; oi++) {
        if (!group.options[oi].name.trim()) {
          fieldErrors[`variantOption_${gi}_${oi}`] = "Nama opsi wajib diisi";
          return false;
        }
      }
    }
    return true;
  }

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
    if (!validateVariantGroups()) {
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

      // Filter out empty groups
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
  <div class="modal-box rounded-2xl p-6 md:p-8 max-w-2xl">
    <h3 class="font-bold text-xl mb-6 text-base-content tracking-tight">
      {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
    </h3>

    {#if errorMessage}
      <div class="alert alert-error mb-4 shadow-sm">
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
        <span>{errorMessage}</span>
      </div>
    {/if}

    <div class="form-control w-full mb-2">
      <label class="label" for="product-name"
        ><span class="label-text font-medium text-base-content/80"
          >Nama Produk</span
        ></label
      >
      <input
        id="product-name"
        type="text"
        class="input input-bordered w-full rounded-xl bg-base-100"
        class:input-error={fieldErrors.name}
        bind:value={name}
      />
      {#if fieldErrors.name}
        <span class="text-error text-xs mt-1">{fieldErrors.name}</span>
      {/if}
    </div>

    <div class="form-control w-full mb-2">
      <label class="label" for="product-category"
        ><span class="label-text font-medium text-base-content/80"
          >Kategori</span
        ></label
      >
      <select
        id="product-category"
        class="select select-bordered w-full rounded-xl bg-base-100"
        class:select-error={fieldErrors.categoryId}
        bind:value={categoryId}
      >
        {#if categories.length === 0}
          <option value="" disabled>Belum ada kategori</option>
        {/if}
        {#each categories as cat}
          <option value={cat.id}>{cat.name}</option>
        {/each}
      </select>
      {#if fieldErrors.categoryId}
        <span class="text-error text-xs mt-1">{fieldErrors.categoryId}</span>
      {/if}
    </div>

    <div class="form-control w-full mb-2">
      <label class="label" for="product-price"
        ><span class="label-text font-medium text-base-content/80"
          >Harga Dasar</span
        ></label
      >
      <input
        id="product-price"
        type="text"
        inputmode="numeric"
        class="input input-bordered w-full rounded-xl bg-base-100"
        class:input-error={fieldErrors.basePrice}
        value={basePrice ? basePrice.toLocaleString("id-ID") : ""}
        on:input={handlePriceInput}
        placeholder="0"
      />
      {#if fieldErrors.basePrice}
        <span class="text-error text-xs mt-1">{fieldErrors.basePrice}</span>
      {/if}
    </div>

    <div class="form-control w-full mb-2">
      <label class="label" for="product-desc"
        ><span class="label-text font-medium text-base-content/80"
          >Deskripsi</span
        ></label
      >
      <textarea
        id="product-desc"
        class="textarea textarea-bordered w-full rounded-xl bg-base-100"
        bind:value={description}
      ></textarea>
    </div>

    <div class="form-control w-full mb-4 mt-2">
      <div class="label">
        <span class="label-text font-medium text-base-content/80"
          >Gambar Produk</span
        >
      </div>
      <div
        class="border rounded-2xl p-2 bg-base-100"
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
    <div class="mb-4">
      <div class="flex items-center justify-between mb-3">
        <span class="label-text font-medium text-base-content/80">
          Varian Produk
          {#if variantGroups.length > 0}
            <span class="badge badge-sm bg-base-200 border-none ml-1">{variantGroups.length}/5 grup</span>
          {/if}
        </span>
        {#if variantGroups.length < 5}
          <button
            type="button"
            class="btn btn-xs btn-ghost text-primary font-medium"
            on:click={addVariantGroup}
          >
            + Tambah Grup
          </button>
        {/if}
      </div>

      {#if variantGroups.length === 0}
        <div class="border border-dashed border-base-300 rounded-xl p-4 text-center">
          <p class="text-sm text-base-content/50">
            Belum ada varian. Klik "Tambah Grup" untuk menambahkan varian seperti Ukuran, Warna, dll.
          </p>
        </div>
      {/if}

      {#each variantGroups as group, gi}
        <div class="border border-base-200 rounded-xl p-4 mb-3 bg-base-100/50">
          <div class="flex items-center gap-2 mb-3">
            <input
              type="text"
              class="input input-bordered input-sm flex-1 rounded-lg bg-base-100"
              class:input-error={fieldErrors[`variantGroup_${gi}`]}
              bind:value={group.groupName}
              placeholder="Nama grup (contoh: Ukuran, Warna)"
            />
            <button
              type="button"
              class="btn btn-xs btn-ghost hover:bg-error/10 hover:text-error text-error/70"
              on:click={() => removeVariantGroup(gi)}
              title="Hapus grup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          {#if fieldErrors[`variantGroup_${gi}`]}
            <span class="text-error text-xs mb-2 block">{fieldErrors[`variantGroup_${gi}`]}</span>
          {/if}

          <!-- Option rows -->
          <div class="space-y-2">
            {#each group.options as option, oi}
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  class="input input-bordered input-xs flex-1 rounded-lg bg-base-100"
                  class:input-error={fieldErrors[`variantOption_${gi}_${oi}`]}
                  bind:value={option.name}
                  placeholder="Nama opsi (contoh: S, M, L)"
                />
                <div class="relative">
                  <input
                    type="text"
                    class="input input-bordered input-xs w-28 rounded-lg bg-base-100 text-right"
                    value={formatPriceAdjustment(option.priceAdjustment)}
                    on:input={(e) => {
                      option.priceAdjustment = parsePriceAdjustment(e.currentTarget.value);
                      variantGroups = [...variantGroups];
                    }}
                    placeholder="Selisih harga"
                    title="Selisih harga dari harga dasar (contoh: +5000 atau -2000)"
                  />
                </div>
                <input
                  type="checkbox"
                  class="toggle toggle-xs toggle-success"
                  bind:checked={option.isAvailable}
                  title={option.isAvailable ? "Tersedia" : "Tidak tersedia"}
                />
                <button
                  type="button"
                  class="btn btn-xs btn-ghost text-base-content/40 hover:text-error"
                  on:click={() => removeVariantOption(gi, oi)}
                  title="Hapus opsi"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {#if fieldErrors[`variantOption_${gi}_${oi}`]}
                <span class="text-error text-xs">{fieldErrors[`variantOption_${gi}_${oi}`]}</span>
              {/if}
            {/each}
          </div>

          {#if group.options.length < 20}
            <button
              type="button"
              class="btn btn-xs btn-ghost text-primary/70 mt-2 font-normal"
              on:click={() => addVariantOption(gi)}
            >
              + Tambah Opsi
            </button>
          {/if}
          <div class="text-xs text-base-content/40 mt-1">
            {group.options.length}/20 opsi
          </div>
        </div>
      {/each}
    </div>

    <div class="form-control w-full mb-2">
      <label class="label" for="product-sort"
        ><span class="label-text font-medium text-base-content/80"
          >Urutan Tampil</span
        ></label
      >
      <input
        id="product-sort"
        type="text"
        inputmode="numeric"
        class="input input-bordered w-full rounded-xl bg-base-100"
        value={sortOrder}
        on:input={(e) =>
          (sortOrder = parseInt(e.currentTarget.value.replace(/\D/g, "")) || 0)}
      />
    </div>

    <div class="form-control mb-4">
      <label class="label cursor-pointer" for="product-avail">
        <span class="label-text font-medium text-base-content/80">Tersedia</span
        >
        <input
          id="product-avail"
          type="checkbox"
          class="toggle toggle-primary"
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
        variant="primary"
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
