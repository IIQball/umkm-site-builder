<script lang="ts">
  import { onMount } from 'svelte';
  import { Plus } from 'lucide-svelte';
  import { Card, Button, Pagination } from '@/components/ui';
  import { addToast } from '@/lib/toast';
  import CategoryHeader from './category/CategoryHeader.svelte';
  import CategoryTable from './category/CategoryTable.svelte';
  import CategoryFormModal from './category/CategoryFormModal.svelte';
  import CategoryDeleteModal from './category/CategoryDeleteModal.svelte';
  import { iconOptions, generateSlug } from './category/category.helpers';

  export let initialCategories: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    createdAt?: string | Date;
  }> = [];

  let categories = [...initialCategories];
  let searchQuery = '';
  let loading = false;
  let isSaving = false;
  let currentPage = 1;
  const pageSize = 10;

  // Modal State
  let showFormModal = false;
  let isEditing = false;
  let editingId = '';
  let formName = '';
  let formSlug = '';
  let formDescription = '';
  let formIcon = 'folder';
  let formError: string | null = null;

  // Delete Confirm Modal State
  let showDeleteModal = false;
  let deletingCategory: { id: string; name: string } | null = null;
  let isDeleting = false;

  $: filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  $: {
    searchQuery;
    currentPage = 1;
  }

  $: paginatedCategories = filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleNameInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    formName = target.value;
    if (!isEditing) {
      formSlug = generateSlug(formName);
    }
  };

  const fetchCategories = async () => {
    loading = true;
    try {
      const res = await fetch('/api/admin/template-categories');
      const json = await res.json();
      if (json.ok && Array.isArray(json.data)) {
        categories = json.data;
      }
    } catch {
      addToast({
        type: 'error',
        message: 'Gagal mengambil data kategori',
      });
    } finally {
      loading = false;
    }
  };

  const openCreateModal = () => {
    isEditing = false;
    editingId = '';
    formName = '';
    formSlug = '';
    formDescription = '';
    formIcon = 'folder';
    formError = null;
    showFormModal = true;
  };

  const openEditModal = (cat: (typeof categories)[0]) => {
    isEditing = true;
    editingId = cat.id;
    formName = cat.name;
    formSlug = cat.slug;
    formDescription = cat.description || '';
    formIcon = cat.icon || 'folder';
    formError = null;
    showFormModal = true;
  };

  const openDeleteConfirm = (cat: (typeof categories)[0]) => {
    deletingCategory = cat;
    showDeleteModal = true;
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      formError = 'Nama kategori wajib diisi';
      return;
    }
    if (!formSlug.trim()) {
      formError = 'Slug kategori wajib diisi';
      return;
    }

    isSaving = true;
    formError = null;

    try {
      const url = isEditing
        ? `/api/admin/template-categories/${editingId}`
        : '/api/admin/template-categories';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          slug: formSlug.trim(),
          description: formDescription.trim() || undefined,
          icon: formIcon.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error?.message || 'Gagal menyimpan kategori');
      }

      addToast({
        type: 'success',
        message: isEditing ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan',
      });

      showFormModal = false;
      await fetchCategories();
    } catch (err) {
      formError = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    } finally {
      isSaving = false;
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    isDeleting = true;

    try {
      const res = await fetch(`/api/admin/template-categories/${deletingCategory.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error?.message || 'Gagal menghapus kategori');
      }

      addToast({
        type: 'success',
        message: `Kategori "${deletingCategory.name}" berhasil dihapus`,
      });

      showDeleteModal = false;
      deletingCategory = null;
      await fetchCategories();
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal menghapus kategori',
      });
    } finally {
      isDeleting = false;
    }
  };

  onMount(() => {
    if (initialCategories.length === 0) {
      fetchCategories();
    }
  });
</script>

<Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden">
  <CategoryHeader
    bind:searchQuery
    {loading}
    onRefresh={fetchCategories}
    onCreate={openCreateModal}
  />

  <!-- Categories Table Content -->
  {#if filteredCategories.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
        <span class="material-symbols-outlined text-2xl">category</span>
      </div>
      <h4 class="font-bold text-main text-base font-heading mb-1">Tidak Ada Kategori Ditemukan</h4>
      <p class="text-xs text-secondary max-w-sm mx-auto font-sans leading-relaxed">
        {searchQuery ? 'Tidak ada kategori yang cocok dengan pencarian Anda.' : 'Belum ada kategori template terdaftar. Tambahkan kategori baru sekarang.'}
      </p>
      {#if !searchQuery}
        <div class="mt-4">
          <Button
            variant="primary"
            size="sm"
            className="rounded-2xl font-bold"
            on:click={openCreateModal}
          >
            <Plus size={14} />
            <span>Tambah Kategori Pertama</span>
          </Button>
        </div>
      {/if}
    </div>
  {:else}
    <CategoryTable
      {paginatedCategories}
      onEdit={openEditModal}
      onDelete={openDeleteConfirm}
    />

    <Pagination
      bind:currentPage
      totalItems={filteredCategories.length}
      {pageSize}
    />
  {/if}
</Card>

<!-- Create / Edit Modal -->
<CategoryFormModal
  bind:showModal={showFormModal}
  {isEditing}
  {formName}
  {formSlug}
  {formDescription}
  {formIcon}
  {formError}
  {isSaving}
  {iconOptions}
  onNameInput={handleNameInput}
  onSave={handleSave}
  onClose={() => (showFormModal = false)}
/>

<!-- Delete Confirm Modal -->
<CategoryDeleteModal
  bind:showModal={showDeleteModal}
  {deletingCategory}
  {isDeleting}
  onClose={() => (showDeleteModal = false)}
  onConfirm={handleDelete}
/>
