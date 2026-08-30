<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '@/components/ui';
  
  interface Category {
    id: string;
    name: string;
    description: string | null;
  }

  let categories: Category[] = [];
  let isLoading = true;
  let isSaving = false;
  let error: string | null = null;
  let success: string | null = null;

  // Modal state
  let isModalOpen = false;
  let editingCategory: Category | null = null;
  let formName = '';
  let formDescription = '';

  const fetchCategories = async () => {
    isLoading = true;
    error = null;
    try {
      const res = await fetch('/api/categories');
      const data = (await res.json()) as { ok?: boolean; data?: Category[]; error?: { message?: string } };
      if (data.ok && data.data) {
        categories = data.data;
      } else {
        error = data.error?.message || 'Gagal memuat kategori';
      }
    } catch {
      error = 'Gagal memuat kategori';
    } finally {
      isLoading = false;
    }
  };

  onMount(() => {
    fetchCategories();
  });

  const openAddModal = () => {
    editingCategory = null;
    formName = '';
    formDescription = '';
    error = null;
    isModalOpen = true;
  };

  const openEditModal = (category: Category) => {
    editingCategory = category;
    formName = category.name;
    formDescription = category.description || '';
    error = null;
    isModalOpen = true;
  };

  const handleSubmit = async () => {
    if (!formName.trim()) return;
    
    isSaving = true;
    error = null;
    success = null;
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, description: formDescription }),
      });
      
      const data = (await res.json()) as { ok?: boolean; error?: { message?: string } };
      if (data.ok) {
        await fetchCategories();
        isModalOpen = false;
        success = editingCategory ? 'Kategori berhasil diperbarui.' : 'Kategori berhasil ditambahkan.';
        setTimeout(() => success = null, 3000);
      } else {
        error = data.error?.message || 'Gagal menyimpan kategori';
      }
    } catch {
      error = 'Gagal menyimpan kategori';
    } finally {
      isSaving = false;
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Hapus kategori ini secara permanen?')) return;
    
    error = null;
    success = null;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = (await res.json()) as { ok?: boolean; error?: { message?: string } };
      if (data.ok) {
        categories = categories.filter(c => c.id !== id);
        success = 'Kategori berhasil dihapus.';
        setTimeout(() => success = null, 3000);
      } else {
        error = data.error?.message || 'Gagal menghapus kategori';
      }
    } catch {
      error = 'Gagal menghapus kategori';
    }
  };
</script>

<div class="space-y-6">
  <!-- Header Actions -->
  <div class="flex items-center justify-between bg-base-100 p-1 rounded-xl shadow-sm border border-base-200">
    <div class="px-4 py-2">
      <p class="text-sm text-base-content/60 font-medium">Total <span class="text-base-content font-bold">{categories.length}</span> kategori</p>
    </div>
    <Button 
      variant="dark"
      size="sm"
      className="rounded-xl font-bold"
      on:click={openAddModal}
    >
      <span class="material-symbols-outlined text-[18px]">add</span>
      <span>Tambah Kategori</span>
    </Button>
  </div>

  <!-- Notifications -->
  {#if error && !isModalOpen}
    <div class="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-xl border border-red-100 dark:border-red-800/50 flex gap-3">
      <span class="material-symbols-outlined mt-0.5 text-[20px]">error</span>
      <p class="text-sm">{error}</p>
    </div>
  {/if}

  {#if success && !isModalOpen}
    <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-100 dark:border-emerald-800/50 flex gap-3">
      <span class="material-symbols-outlined mt-0.5 text-[20px]">check_circle</span>
      <p class="text-sm">{success}</p>
    </div>
  {/if}

  <!-- Content -->
  <div class="bg-base-100 rounded-2xl border border-base-200 overflow-hidden shadow-sm min-h-[400px] flex flex-col">
    {#if isLoading}
      <div class="flex-1 flex items-center justify-center p-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
    {:else if categories.length === 0}
      <div class="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-sm mx-auto">
        <div class="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4 text-base-content/30">
          <span class="material-symbols-outlined text-[32px]">category</span>
        </div>
        <h3 class="text-lg font-semibold text-base-content tracking-tight mb-1">Belum ada kategori</h3>
        <p class="text-sm text-base-content/60 mb-6">Kelompokkan produk Anda dengan menambahkan kategori pertama.</p>
        <Button variant="dark" size="sm" className="rounded-xl font-bold" on:click={openAddModal}>
          Buat Kategori
        </Button>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-base-50/50 border-b border-base-200">
              <th class="px-6 py-4 text-xs font-semibold text-base-content/50 uppercase tracking-wider w-1/3">Nama Kategori</th>
              <th class="px-6 py-4 text-xs font-semibold text-base-content/50 uppercase tracking-wider hidden sm:table-cell">Deskripsi</th>
              <th class="px-6 py-4 text-xs font-semibold text-base-content/50 uppercase tracking-wider text-right w-24">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-base-200">
            {#each categories as category}
              <tr class="group hover:bg-base-50/50 transition-colors">
                <td class="px-6 py-4 align-top">
                  <p class="font-medium text-base-content">{category.name}</p>
                </td>
                <td class="px-6 py-4 align-top hidden sm:table-cell">
                  {#if category.description}
                    <p class="text-sm text-base-content/70 line-clamp-2">{category.description}</p>
                  {:else}
                    <p class="text-sm text-base-content/30 italic">Tidak ada deskripsi</p>
                  {/if}
                </td>
                <td class="px-6 py-4 align-top text-right">
                  <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                    <Button 
                      variant="secondary"
                      size="icon"
                      on:click={() => openEditModal(category)}
                      title="Edit"
                    >
                      <span class="material-symbols-outlined text-[18px]">edit</span>
                    </Button>
                    <Button 
                      variant="destructive"
                      size="icon"
                      className="!bg-nested hover:!bg-rose-500/10 !border-light hover:!border-rose-500/20 !text-secondary hover:!text-rose-600 shadow-2xs"
                      on:click={() => deleteCategory(category.id)}
                      title="Hapus"
                    >
                      <span class="material-symbols-outlined text-[18px]">delete</span>
                    </Button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  <!-- Modal Form -->
  {#if isModalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <button 
        type="button"
        class="absolute inset-0 bg-black/40 backdrop-blur-sm border-0 cursor-default transition-opacity"
        aria-label="Tutup"
        on:click={() => { if(!isSaving) isModalOpen = false; }}
      ></button>
      
      <!-- Dialog -->
      <div class="relative bg-base-100 w-full max-w-md rounded-2xl shadow-2xl border border-base-200 overflow-hidden transform transition-all">
        <div class="px-6 py-5 border-b border-base-200 flex items-center justify-between bg-base-50/50">
          <h3 class="font-bold text-lg tracking-tight text-base-content">
            {editingCategory ? 'Edit Kategori' : 'Kategori Baru'}
          </h3>
          <Button 
            variant="secondary"
            size="icon"
            on:click={() => (isModalOpen = false)}
            disabled={isSaving}
            title="Tutup"
          >
            <span class="material-symbols-outlined text-[20px]">close</span>
          </Button>
        </div>

        <div class="p-6">
          {#if error}
            <div class="mb-5 p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg border border-red-100 dark:border-red-800/50 flex gap-2 text-sm">
              <span class="material-symbols-outlined text-[18px]">error</span>
              <p>{error}</p>
            </div>
          {/if}

          <div class="space-y-5">
            <div class="form-control">
              <label class="label mb-1" for="category-name">
                <span class="label-text font-medium text-base-content">Nama Kategori</span>
              </label>
              <input 
                id="category-name"
                type="text" 
                placeholder="Mis: Minuman Dingin" 
                class="input input-bordered w-full bg-base-100 focus:input-primary transition-colors"
                bind:value={formName}
                disabled={isSaving}
              />
            </div>

            <div class="form-control">
              <label class="label mb-1" for="category-desc">
                <span class="label-text font-medium text-base-content">Deskripsi</span>
                <span class="label-text-alt text-base-content/50">Opsional</span>
              </label>
              <textarea 
                id="category-desc"
                class="textarea textarea-bordered h-24 bg-base-100 focus:textarea-primary transition-colors resize-none" 
                placeholder="Deskripsi singkat..."
                bind:value={formDescription}
                disabled={isSaving}
              ></textarea>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-base-50/50 border-t border-base-200 flex justify-end gap-3">
          <Button 
            variant="secondary"
            size="sm"
            on:click={() => (isModalOpen = false)}
            disabled={isSaving}
          >
            Batal
          </Button>
          <Button 
            variant="dark"
            size="sm"
            on:click={handleSubmit}
            disabled={isSaving || !formName.trim()}
            loading={isSaving}
            className="font-bold"
          >
            Simpan
          </Button>
        </div>
      </div>
    </div>
  {/if}
</div>
