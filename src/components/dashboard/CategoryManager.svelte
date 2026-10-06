<script lang="ts">
  import { onMount } from 'svelte';
  import { Button, Card, Table, StatCard } from '@/components/ui';
  import { toast } from '@/lib/toast';
  import { slugify } from '@/lib/utils';
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


  // Modal state
  let isModalOpen = false;
  let editingCategory: Category | null = null;
  let formName = '';
  let formSlug = '';

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
        categories = data.data || [];
      } else {
        error = data?.error?.message || data?.error || 'Gagal memuat kategori';
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
    if (categories.length >= 5) {
      toast.error("Batas maksimum 5 kategori tercapai. Fitur berbayar.");
      return;
    }
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
        window.dispatchEvent(new CustomEvent('quota-updated'));
        toast.success(editingCategory ? 'Kategori berhasil diperbarui.' : 'Kategori berhasil ditambahkan.');
      } else {
        error = data?.error?.message || data?.error || 'Gagal menyimpan kategori';
        toast.error(error as string);
      }
    } catch {
      error = 'Gagal menyimpan kategori';
      toast.error(error as string);
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
    try {
      const res = await fetch(`/api/categories?id=${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        categories = categories.filter(c => c.id !== deleteId);
        window.dispatchEvent(new CustomEvent('quota-updated'));
        toast.success('Kategori berhasil dihapus.');
        isDeleteModalOpen = false;
      } else {
        error = data?.error?.message || data?.error || 'Gagal menghapus kategori';
        toast.error(error as string);
      }
    } catch {
      error = 'Gagal menghapus kategori';
      toast.error(error as string);
    } finally {
      isDeleting = false;
    }
  };
  $: totalCategories = categories.length;
  $: activeCategories = categories.length;
  $: inactiveCategories = totalCategories - activeCategories;
</script>

<div class="space-y-8">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {#key totalCategories}
      <StatCard 
        label="Total Kategori" 
        value={totalCategories} 
        rawValue={totalCategories}
        icon="layers" 
        cardTheme="dark"
        badge="Organisasi"
        footerText="Total kategori dibuat"
        delayClass="delay-100"
      />
    {/key}
    {#key activeCategories}
      <StatCard 
        label="Kategori Aktif" 
        value={activeCategories} 
        rawValue={activeCategories}
        icon="check_circle" 
        cardTheme="default"
        badge="Aktif"
        footerText="Kategori yang aktif"
        delayClass="delay-150"
      />
    {/key}
    {#key inactiveCategories}
      <StatCard 
        label="Tidak Aktif" 
        value={inactiveCategories} 
        rawValue={inactiveCategories}
        icon="visibility_off" 
        cardTheme="orange"
        badge="Tersembunyi"
        footerText="Kategori tidak ditampilkan"
        delayClass="delay-200"
      />
    {/key}
    <StatCard 
      label="Status Organisir" 
      value="—" 
      icon="done_all" 
      cardTheme="blue"
      badge="Siap"
      footerText="Kategori terorganisir"
      delayClass="delay-250"
    />
  </div>
  <!-- Content -->
  <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden animate-fade-in-up delay-300">
    <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-lg">category</span>
        </div>
        <div>
          <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
            Daftar Kategori Produk
          </h3>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">
            Kelola grup pengkategorian untuk mengorganisir katalog produk Anda
          </p>
        </div>
      </div>
    </div>
    {#if isLoading}
      <div class="flex-1 flex items-center justify-center p-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
    {:else if categories.length === 0}
      <div class="py-16 px-8 flex flex-col items-center text-center">
        <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
          <span class="material-symbols-outlined text-2xl">category</span>
        </div>
        <h4 class="text-heading-md font-bold text-main mb-1.5 font-heading">Belum Ada Kategori</h4>
        <p class="text-body-sm text-secondary max-w-xs leading-relaxed mb-4 font-sans">
          Kelompokkan produk Anda dengan menambahkan kategori pertama.
        </p>
        <div class="mt-2">
          <Button
            variant="primary"
            size="sm"
            on:click={openAddModal}
          >
            <span class="material-symbols-outlined text-base">add</span>
            <span>Buat Kategori</span>
          </Button>
        </div>
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
