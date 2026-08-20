<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { InferSelectModel } from 'drizzle-orm';
  import type { products as productsSchema } from '../../db/schema';

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
  let errorMessage = '';

  // Form fields
  let name = '';
  let categoryId = '';
  let basePrice = 0;
  let description = '';
  let isAvailable = true;
  let sortOrder = 0;
  let imageFile: File | null = null;
  let variantsText = '';

  // React to showModal changes safely to prevent continuous resetting
  $: if (showModal && !wasOpen) {
    wasOpen = true;
    errorMessage = '';
    
    // Initialize form fields only once when opening
    if (editingProduct) {
      name = editingProduct.name;
      categoryId = editingProduct.categoryId;
      basePrice = editingProduct.basePrice;
      description = editingProduct.description || '';
      isAvailable = editingProduct.isAvailable;
      sortOrder = editingProduct.sortOrder;
      
      variantsText = Array.isArray(editingProduct.variants) 
        ? editingProduct.variants.map((v: unknown) => {
            if (typeof v === 'object' && v !== null && 'name' in v) {
              return String((v as { name: string }).name);
            }
            return JSON.stringify(v);
          }).join(', ') 
        : '';
    } else {
      name = '';
      categoryId = categories.length > 0 ? categories[0].id : '';
      basePrice = 0;
      description = '';
      isAvailable = true;
      sortOrder = 0;
      variantsText = '';
    }
    imageFile = null;

    if (dialogElement && !dialogElement.open) {
      dialogElement.showModal();
    }
  } else if (!showModal && wasOpen) {
    wasOpen = false;
    if (dialogElement && dialogElement.open) {
      dialogElement.close();
    }
  }

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      imageFile = target.files[0];
    }
  }

  const handlePriceInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    // Remove all non-digit characters
    const rawValue = target.value.replace(/\D/g, '');
    basePrice = rawValue ? parseInt(rawValue, 10) : 0;
    
    // Update cursor position properly (optional but good practice)
    const formatted = basePrice ? basePrice.toLocaleString('id-ID') : '';
    target.value = formatted;
  }

  const closeModal = () => {
    showModal = false;
    errorMessage = '';
  }

  const handleSaveProduct = async () => {
    errorMessage = '';
    if (!name || name.trim().length < 2) {
      errorMessage = 'Mohon isi Nama Produk minimal 2 karakter.';
      return;
    }
    if (!categoryId) {
      errorMessage = 'Mohon pilih Kategori produk terlebih dahulu.';
      return;
    }

    formLoading = true;
    try {
      const finalSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const formData = new FormData();
      formData.append('storeId', storeId);
      formData.append('categoryId', categoryId);
      formData.append('name', name);
      formData.append('slug', finalSlug);
      formData.append('basePrice', basePrice.toString());
      formData.append('description', description);
      formData.append('isAvailable', isAvailable.toString());
      formData.append('sortOrder', sortOrder.toString());
      
      const parsedVariants = variantsText.split(',').map(v => ({ name: v.trim() })).filter(v => v.name);
      formData.append('variants', JSON.stringify(parsedVariants));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      
      if (data.ok) {
        closeModal();
        dispatch('success');
      } else {
        let errorMsg = data.error.message;
        if (errorMsg === 'Validation failed') {
           errorMsg = 'Pastikan semua form wajib sudah terisi dengan benar.';
        }
        errorMessage = 'Gagal menyimpan: ' + errorMsg;
      }
    } catch (e: unknown) {
      errorMessage = 'Error: ' + (e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal');
    } finally {
      formLoading = false;
    }
  }
</script>

<dialog class="modal backdrop-blur-sm" bind:this={dialogElement} on:close={closeModal}>
  <div class="modal-box">
    <h3 class="font-bold text-lg mb-4">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
    
    {#if errorMessage}
      <div class="alert alert-error mb-4 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{errorMessage}</span>
      </div>
    {/if}
    
    <div class="form-control w-full mb-2">
      <label class="label" for="product-name"><span class="label-text">Nama Produk</span></label>
      <input id="product-name" type="text" class="input input-bordered w-full" bind:value={name} />
    </div>
    
    <div class="form-control w-full mb-2">
      <label class="label" for="product-category"><span class="label-text">Kategori</span></label>
      <select id="product-category" class="select select-bordered w-full" bind:value={categoryId}>
        {#if categories.length === 0}
          <option value="" disabled>Belum ada kategori</option>
        {/if}
        {#each categories as cat}
          <option value={cat.id}>{cat.name}</option>
        {/each}
      </select>
    </div>

    <div class="form-control w-full mb-2">
      <label class="label" for="product-price"><span class="label-text">Harga Dasar</span></label>
      <input 
        id="product-price" 
        type="text" 
        inputmode="numeric" 
        class="input input-bordered w-full" 
        value={basePrice ? basePrice.toLocaleString('id-ID') : ''}
        on:input={handlePriceInput} 
        placeholder="0"
      />
    </div>
    
    <div class="form-control w-full mb-2">
      <label class="label" for="product-desc"><span class="label-text">Deskripsi</span></label>
      <textarea id="product-desc" class="textarea textarea-bordered w-full" bind:value={description}></textarea>
    </div>
    
    <div class="form-control w-full mb-2">
      <label class="label" for="product-images"><span class="label-text">Gambar Produk</span></label>
      <input id="product-images" type="file" accept="image/png, image/jpeg, image/jpg, image/webp" class="file-input file-input-bordered w-full" on:change={handleFileChange} />
      {#if editingProduct}
        <div class="label"><span class="label-text-alt text-warning">Upload baru akan menimpa gambar lama</span></div>
      {/if}
    </div>
    
    <div class="form-control w-full mb-2">
      <label class="label" for="product-variants"><span class="label-text">Variasi (pisahkan dengan koma)</span></label>
      <input id="product-variants" type="text" class="input input-bordered w-full" bind:value={variantsText} placeholder="Merah, Biru, Hijau" />
    </div>
    
    <div class="form-control w-full mb-2">
      <label class="label" for="product-sort"><span class="label-text">Urutan Tampil</span></label>
      <input 
        id="product-sort" 
        type="text" 
        inputmode="numeric"
        class="input input-bordered w-full" 
        value={sortOrder} 
        on:input={(e) => sortOrder = parseInt(e.currentTarget.value.replace(/\D/g, '')) || 0} 
      />
    </div>
    
    <div class="form-control mb-4">
      <label class="label cursor-pointer" for="product-avail">
        <span class="label-text">Tersedia</span>
        <input id="product-avail" type="checkbox" class="toggle toggle-primary" bind:checked={isAvailable} />
      </label>
    </div>
    
    <div class="modal-action">
      <button class="btn" on:click={closeModal}>Batal</button>
      <button class="btn bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white border-none" on:click={handleSaveProduct} disabled={formLoading}>
        {#if formLoading}
          <span class="loading loading-spinner"></span>
        {/if}
        Simpan
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
