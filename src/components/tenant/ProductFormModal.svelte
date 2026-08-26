<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Product, Category } from '@/types/common';
  import ImageUpload from '../shared/ImageUpload.svelte';
  import {
    parseProductVariants,
    formatInitialVariantsText,
    submitProductForm,
  } from './productForm.helpers';
  import { Loader2 } from 'lucide-svelte';

  export let showModal = false;
  export let storeId: string;
  export let categories: Category[];
  export let editingProduct: Product | null = null;

  const dispatch = createEventDispatcher();
  let dialogElement: HTMLDialogElement;
  let formLoading = false;
  let wasOpen = false;
  let errorMessage = '';

  // Form fields
  let name = '';
  let categoryId = '';
  let basePrice = 0;
  let description = '';
  let isAvailable = true;
  let sortOrder = 0;
  let imageUrls: string[] = [];
  let variantsText = '';

  $: if (showModal && !wasOpen) {
    wasOpen = true;
    errorMessage = '';
    if (editingProduct) {
      name = editingProduct.name;
      categoryId = editingProduct.categoryId;
      basePrice = editingProduct.basePrice;
      description = editingProduct.description || '';
      isAvailable = editingProduct.isAvailable ?? true;
      sortOrder = editingProduct.sortOrder;
      variantsText = formatInitialVariantsText(editingProduct);
      imageUrls = Array.isArray(editingProduct.imageUrls) ? [...editingProduct.imageUrls] : [];
    } else {
      name = '';
      categoryId = categories[0]?.id || '';
      basePrice = 0;
      description = '';
      isAvailable = true;
      sortOrder = 0;
      variantsText = '';
      imageUrls = [];
    }
  }

  $: if (!showModal) {
    wasOpen = false;
  }

  $: if (dialogElement) {
    if (showModal && !dialogElement.open) {
      dialogElement.showModal();
    } else if (!showModal && dialogElement.open) {
      dialogElement.close();
    }
  }

  function handleClose() {
    dispatch('close');
  }

  async function handleSubmit() {
    formLoading = true;
    errorMessage = '';

    try {
      const variants = parseProductVariants(variantsText);
      await submitProductForm(storeId, editingProduct, {
        name,
        categoryId,
        basePrice,
        description,
        isAvailable,
        sortOrder,
        imageUrls,
        variants,
      });

      dispatch('saved');
      handleClose();
    } catch (err: any) {
      errorMessage = err.message || 'Terjadi kesalahan sistem';
    } finally {
      formLoading = false;
    }
  }
</script>

<dialog
  bind:this={dialogElement}
  class="modal modal-bottom sm:modal-middle"
  on:close={handleClose}
>
  <div class="modal-box max-w-2xl bg-base-100 dark:bg-slate-900 border border-base-200 dark:border-slate-800 text-xs">
    <h3 class="font-bold text-base text-base-content mb-4">
      {editingProduct ? 'Edit Data Produk' : 'Tambah Produk Baru'}
    </h3>

    {#if errorMessage}
      <div class="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
        {errorMessage}
      </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div class="space-y-1">
        <label for="prod-name" class="block font-semibold text-base-content/80">Nama Produk</label>
        <input
          id="prod-name"
          type="text"
          bind:value={name}
          required
          placeholder="Nama produk dagangan"
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label for="prod-cat" class="block font-semibold text-base-content/80">Kategori</label>
          <select
            id="prod-cat"
            bind:value={categoryId}
            required
            class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-xl"
          >
            {#each categories as category}
              <option value={category.id}>{category.name}</option>
            {/each}
          </select>
        </div>

        <div class="space-y-1">
          <label for="prod-price" class="block font-semibold text-base-content/80">Harga Dasar (Rp)</label>
          <input
            id="prod-price"
            type="number"
            bind:value={basePrice}
            required
            min="0"
            class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-xl"
          />
        </div>
      </div>

      <div class="space-y-1">
        <label for="prod-desc" class="block font-semibold text-base-content/80">Deskripsi Produk</label>
        <textarea
          id="prod-desc"
          bind:value={description}
          rows="3"
          placeholder="Deskripsi singkat produk..."
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-xl"
        ></textarea>
      </div>

      <div class="space-y-1">
        <label for="prod-variants" class="block font-semibold text-base-content/80">Varian (Pisahkan dengan koma)</label>
        <input
          id="prod-variants"
          type="text"
          bind:value={variantsText}
          placeholder="Contoh: Merah, Biru, Hijau atau S, M, L"
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-xl"
        />
      </div>

      <div class="space-y-1">
        <ImageUpload
          bind:value={imageUrls}
          maxFiles={4}
          folder={`stores/${storeId}/products`}
          label="Foto Produk"
        />
      </div>

      <div class="flex items-center gap-2 pt-2">
        <input
          id="prod-avail"
          type="checkbox"
          bind:checked={isAvailable}
          class="checkbox checkbox-primary checkbox-sm"
        />
        <label for="prod-avail" class="font-medium text-base-content cursor-pointer">Produk Tersedia untuk Dijual</label>
      </div>

      <div class="modal-action pt-4 border-t border-base-200 dark:border-slate-800">
        <button type="button" class="btn btn-ghost btn-sm" on:click={handleClose}>
          Batal
        </button>
        <button
          type="submit"
          class="btn btn-primary btn-sm"
          disabled={formLoading}
        >
          {#if formLoading}
            <Loader2 size={13} class="animate-spin" />
          {/if}
          <span>{editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}</span>
        </button>
      </div>
    </form>
  </div>
</dialog>
