<script lang="ts">
  import { onMount } from 'svelte';
  import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-svelte';
  
  interface Category {
    id: string;
    name: string;
    description: string | null;
  }

  let categories: Category[] = [];
  let isLoading = true;
  let isSaving = false;
  let error: string | null = null;

  // Modal state
  let isModalOpen = false;
  let editingCategory: Category | null = null;
  let formName = '';
  let formDescription = '';

  onMount(fetchCategories);

  async function fetchCategories() {
    isLoading = true;
    error = null;
    try {
      const res = await fetch('/api/categories');
      const data = await res.json() as any;
      if (data.ok) {
        categories = data.data;
      } else {
        error = data.error.message;
      }
    } catch (e) {
      error = 'Gagal memuat kategori';
    } finally {
      isLoading = false;
    }
  }

  function openAddModal() {
    editingCategory = null;
    formName = '';
    formDescription = '';
    isModalOpen = true;
  }

  function openEditModal(category: Category) {
    editingCategory = category;
    formName = category.name;
    formDescription = category.description || '';
    isModalOpen = true;
  }

  async function handleSubmit() {
    if (!formName.trim()) return;
    
    isSaving = true;
    error = null;
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, description: formDescription }),
      });
      
      const data = await res.json() as any;
      if (data.ok) {
        await fetchCategories();
        isModalOpen = false;
      } else {
        error = data.error.message;
      }
    } catch (e) {
      error = 'Gagal menyimpan kategori';
    } finally {
      isSaving = false;
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm('Hapus kategori ini?')) return;
    
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json() as any;
      if (data.ok) {
        categories = categories.filter(c => c.id !== id);
      } else {
        alert(data.error.message);
      }
    } catch (e) {
      alert('Gagal menghapus kategori');
    }
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <div>
      <h2 class="text-2xl font-bold">Kategori Produk</h2>
      <p class="text-gray-500">Kelola kategori untuk mengelompokkan produk Anda.</p>
    </div>
    <button class="btn btn-primary" on:click={openAddModal}>
      <Plus size={20} />
      Tambah Kategori
    </button>
  </div>

  {#if error && !isModalOpen}
    <div class="alert alert-error">
      <span>{error}</span>
    </div>
  {/if}

  {#if isLoading}
    <div class="flex justify-center py-12">
      <Loader2 class="animate-spin" size={48} />
    </div>
  {:else if categories.length === 0}
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body items-center text-center py-12">
        <h3 class="card-title text-xl mb-2">Belum ada kategori</h3>
        <p class="text-gray-500 mb-6">Mulai dengan menambahkan kategori pertama Anda.</p>
        <button class="btn btn-primary" on:click={openAddModal}>
          <Plus size={20} />
          Tambah Kategori
        </button>
      </div>
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each categories as category}
        <div class="card bg-base-100 shadow-md border border-base-200">
          <div class="card-body">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="card-title">{category.name}</h3>
                {#if category.description}
                  <p class="text-sm text-gray-500 mt-1 line-clamp-2">{category.description}</p>
                {/if}
              </div>
              <div class="flex gap-1">
                <button 
                  class="btn btn-ghost btn-sm btn-square text-primary"
                  on:click={() => openEditModal(category)}
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  class="btn btn-ghost btn-sm btn-square text-error"
                  on:click={() => deleteCategory(category.id)}
                  title="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Modal -->
  {#if isModalOpen}
    <div class="modal modal-open">
      <div class="modal-box">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-lg">
            {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
          </h3>
          <button class="btn btn-ghost btn-sm btn-square" on:click={() => isModalOpen = false}>
            <X size={20} />
          </button>
        </div>

        <div class="space-y-4">
          {#if error}
            <div class="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          {/if}

          <div class="form-control w-full">
            <label class="label" for="category-name">
              <span class="label-text font-semibold">Nama Kategori</span>
            </label>
            <input 
              id="category-name"
              type="text" 
              placeholder="Contoh: Makanan Penutup" 
              class="input input-bordered w-full"
              bind:value={formName}
              disabled={isSaving}
            />
          </div>

          <div class="form-control w-full">
            <label class="label" for="category-desc">
              <span class="label-text font-semibold">Deskripsi (Opsional)</span>
            </label>
            <textarea 
              id="category-desc"
              class="textarea textarea-bordered h-24" 
              placeholder="Jelaskan apa saja produk dalam kategori ini..."
              bind:value={formDescription}
              disabled={isSaving}
            ></textarea>
          </div>
        </div>

        <div class="modal-action">
          <button 
            class="btn btn-ghost" 
            on:click={() => isModalOpen = false}
            disabled={isSaving}
          >
            Batal
          </button>
          <button 
            class="btn btn-primary" 
            on:click={handleSubmit}
            disabled={isSaving || !formName.trim()}
          >
            {#if isSaving}
              <span class="loading loading-spinner loading-xs"></span>
            {/if}
            Simpan
          </button>
        </div>
      </div>
      <button 
        type="button" 
        class="modal-backdrop bg-black/50 border-0 cursor-default" 
        aria-label="Tutup modal"
        on:click={() => isModalOpen = false}
      ></button>
    </div>
  {/if}
</div>
