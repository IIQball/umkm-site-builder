<script lang="ts">
  import { onMount } from 'svelte';
  import { Button, Card, Table } from '@/components/ui';
  import TenantCategoryFormModal from './category/TenantCategoryFormModal.svelte';
  import TenantCategoryDeleteModal from './category/TenantCategoryDeleteModal.svelte';
  
  interface Category {
    id: string;
    name: string;
    slug: string;
    storeId: string;
    storeName?: string;
  }

  export let storeId: string = '';
  export let storeName: string = 'Toko Anda';

  let categories: Category[] = [];
  let isLoading = true;
  let isSaving = false;
  let error: string | null = null;
  let success: string | null = null;

  // Modal state
  let isModalOpen = false;
  let editingCategory: Category | null = null;
  let formName = '';
  let formSlug = '';

  const slugify = (text: string) =>
    text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

  $: formSlug = formName ? slugify(formName) : '';

  const fetchCategories = async () => {
    if (!storeId) {
      isLoading = false;
      return;
    }
    isLoading = true;
    error = null;
    try {
      const res = await fetch(`/api/categories?storeId=${storeId}`);
      const data = await res.json();
      if (res.ok) {
        categories = data;
      } else {
        error = data.error || 'Gagal memuat kategori';
      }
    } catch {
      error = 'Gagal memuat kategori';
    } finally {
      isLoading = false;
    }
  };

  onMount(() => {
    fetchCategories();

    const handleOpenAdd = () => openAddModal();
    window.addEventListener('open-add-category', handleOpenAdd);

    return () => {
      window.removeEventListener('open-add-category', handleOpenAdd);
    };
  });

  const openAddModal = () => {
    editingCategory = null;
    formName = '';
    error = null;
    isModalOpen = true;
  };

  const openEditModal = (category: Category) => {
    editingCategory = category;
    formName = category.name;
    error = null;
    isModalOpen = true;
  };

  const handleSubmit = async () => {
    if (!formName.trim() || !storeId) return;
    
    isSaving = true;
    error = null;
    success = null;
    try {
      const method = editingCategory ? 'PATCH' : 'POST';
      const bodyPayload = editingCategory 
        ? { id: editingCategory.id, name: formName, slug: formSlug } 
        : { storeId, name: formName, slug: formSlug };
        
      const res = await fetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });
      
      const data = await res.json();
      if (res.ok) {
        await fetchCategories();
        isModalOpen = false;
        success = editingCategory ? 'Kategori berhasil diperbarui.' : 'Kategori berhasil ditambahkan.';
        setTimeout(() => success = null, 3000);
      } else {
        error = data.error || 'Gagal menyimpan kategori';
      }
    } catch {
      error = 'Gagal menyimpan kategori';
    } finally {
      isSaving = false;
    }
  };

  // Delete Modal
  let deleteId: string | null = null;
  let isDeleteModalOpen = false;
  let isDeleting = false;

  const confirmDelete = (id: string) => {
    deleteId = id;
    error = null;
    isDeleteModalOpen = true;
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    isDeleting = true;
    error = null;
    success = null;
    try {
      const res = await fetch(`/api/categories?id=${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        categories = categories.filter(c => c.id !== deleteId);
        success = 'Kategori berhasil dihapus.';
        setTimeout(() => success = null, 3000);
        isDeleteModalOpen = false;
      } else {
        error = data.error || 'Gagal menghapus kategori';
      }
    } catch {
      error = 'Gagal menghapus kategori';
    } finally {
      isDeleting = false;
    }
  };
</script>

<div class="space-y-6 animate-fade-in-up">
  <!-- Header Actions -->
  <Card variant="flat" padding="sm" className="flex items-center justify-between">
    <div class="px-2">
      <p class="text-body-sm text-secondary font-medium">Total <span class="text-main font-bold">{categories.length}</span> kategori</p>
    </div>
  </Card>

  <!-- Notifications -->
  {#if error && !isModalOpen && !isDeleteModalOpen}
    <div class="p-4 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-500/20 flex gap-3 items-center animate-fade-in-up">
      <span class="material-symbols-outlined text-lg">error</span>
      <p class="text-sm font-medium">{error}</p>
    </div>
  {/if}

  {#if success && !isModalOpen && !isDeleteModalOpen}
    <div class="p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20 flex gap-3 items-center animate-fade-in-up">
      <span class="material-symbols-outlined text-lg">check_circle</span>
      <p class="text-sm font-medium">{success}</p>
    </div>
  {/if}

  <!-- Content -->
  <Card padding="none" className="min-h-[400px] flex flex-col">
    {#if isLoading}
      <div class="flex-1 flex items-center justify-center p-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
    {:else if categories.length === 0}
      <div class="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-sm mx-auto animate-fade-in">
        <div class="w-16 h-16 rounded-full bg-nested flex items-center justify-center mb-4 text-muted border border-light">
          <span class="material-symbols-outlined text-3xl">category</span>
        </div>
        <h3 class="text-heading-md font-bold text-main tracking-tight mb-1">Belum ada kategori</h3>
        <p class="text-body-sm text-secondary mb-6">Kelompokkan produk Anda dengan menambahkan kategori pertama.</p>
        <Button variant="dark" size="sm" className="font-bold" on:click={openAddModal}>
          Buat Kategori
        </Button>
      </div>
    {:else}
      <Table 
        headers={[
          { label: 'Nama Kategori Produk' },
          { label: 'Toko' },
          { label: 'Aksi', align: 'right', width: '120px' }
        ]}
      >
        {#each categories as category}
          <tr class="group hover:bg-nested/40 transition-colors">
            <td class="px-6 py-4 align-top">
              <p class="text-xs font-bold text-main font-sans">{category.name}</p>
            </td>
            <td class="px-6 py-4 align-top hidden sm:table-cell">
              <p class="text-xs font-medium text-secondary font-sans">{storeName || 'Unknown Store'}</p>
            </td>
            <td class="px-6 py-4 align-top text-right">
              <div class="flex items-center justify-end gap-1">
                <Button 
                  variant="secondary"
                  size="icon"
                  on:click={() => openEditModal(category)}
                  title="Edit"
                >
                  <span class="material-symbols-outlined text-base">edit</span>
                </Button>
                <Button 
                  variant="destructive"
                  size="icon"
                  className="!bg-nested hover:!bg-rose-500/10 !border-light hover:!border-rose-500/20 !text-secondary hover:!text-rose-600 shadow-2xs"
                  on:click={() => confirmDelete(category.id)}
                  title="Hapus"
                >
                  <span class="material-symbols-outlined text-base">delete</span>
                </Button>
              </div>
            </td>
          </tr>
        {/each}
      </Table>
    {/if}
  </Card>

  <!-- Modals -->
  <TenantCategoryDeleteModal
    bind:open={isDeleteModalOpen}
    {isDeleting}
    {error}
    onDelete={handleDelete}
  />

  <TenantCategoryFormModal
    bind:open={isModalOpen}
    isEditing={!!editingCategory}
    bind:formName
    {isSaving}
    {error}
    onSave={handleSubmit}
  />
</div>
