<script lang="ts">
  import { onMount } from 'svelte';
  import { Plus, Trash2, Edit2, RefreshCw } from 'lucide-svelte';
  import { Card, Badge, Table, Textarea, Button, Modal, Pagination } from '@/components/ui';
  import { formatDate } from '@/lib/utils';
  import { addToast } from '@/lib/toast';

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

  const iconOptions = [
    { value: 'restaurant', label: 'Kuliner (restaurant)' },
    { value: 'checkroom', label: 'Fashion (checkroom)' },
    { value: 'work', label: 'Jasa/Bisnis (work)' },
    { value: 'grid_view', label: 'Retail/Katalog (grid_view)' },
    { value: 'devices', label: 'Digital/Teknologi (devices)' },
    { value: 'local_cafe', label: 'Kafe (local_cafe)' },
    { value: 'spa', label: 'Kecantikan/Spa (spa)' },
    { value: 'fitness_center', label: 'Olahraga/Fitnes (fitness_center)' },
    { value: 'folder', label: 'Folder Umum (folder)' },
  ];

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

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

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

  const openEditModal = (cat: typeof categories[0]) => {
    isEditing = true;
    editingId = cat.id;
    formName = cat.name;
    formSlug = cat.slug;
    formDescription = cat.description || '';
    formIcon = cat.icon || 'folder';
    formError = null;
    showFormModal = true;
  };

  const handleSave = async (e: Event) => {
    e.preventDefault();
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
      const endpoint = isEditing
        ? `/api/admin/template-categories/${editingId}`
        : '/api/admin/template-categories';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          slug: formSlug.trim(),
          description: formDescription.trim() || undefined,
          icon: formIcon,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error?.message || 'Gagal menyimpan kategori');
      }

      addToast({
        type: 'success',
        message: isEditing ? 'Kategori berhasil diperbarui' : 'Kategori baru berhasil ditambahkan',
      });
      showFormModal = false;
      await fetchCategories();
    } catch (err) {
      formError = err instanceof Error ? err.message : 'Terjadi kesalahan';
    } finally {
      isSaving = false;
    }
  };

  const openDeleteConfirm = (cat: typeof categories[0]) => {
    deletingCategory = { id: cat.id, name: cat.name };
    showDeleteModal = true;
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

  const tableHeaders = [
    { label: 'Kategori Bisnis' },
    { label: 'Slug URL', width: 'w-48' },
    { label: 'Ikon UI', align: 'center' as const, width: 'w-28' },
    { label: 'Tanggal Dibuat', width: 'w-40' },
    { label: 'Aksi', align: 'right' as const, width: 'w-36' },
  ];
</script>

<Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden">
  <!-- Table Header & Controls -->
  <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">category</span>
      </div>
      <div>
        <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
          Master Kategori Template
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          Daftar ceruk bisnis, slug URL, ikon antarmuka, dan opsi modifikasi data
        </p>
      </div>
    </div>

    <!-- Actions & Search Box -->
    <div class="flex flex-wrap items-center gap-2.5">
      <!-- Search Input Capsule -->
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">search</span>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari kategori / slug..."
          class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-blue-500 focus:bg-card transition-all w-48 sm:w-56"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <Button
          variant="secondary"
          size="icon"
          on:click={fetchCategories}
          disabled={loading}
          title="Refresh Data"
        >
          <RefreshCw size={14} class={loading ? 'animate-spin' : ''} />
        </Button>

        <Button
          variant="primary"
          size="sm"
          on:click={openCreateModal}
        >
          <Plus size={15} class="stroke-[2.5]" />
          <span>Tambah Kategori</span>
        </Button>
      </div>
    </div>
  </div>

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
    <Table headers={tableHeaders} minWidth="min-w-[700px]">
      {#each paginatedCategories as cat (cat.id)}
        <tr class="hover:bg-nested/40 transition-colors group">
          <!-- Name + Description -->
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 shadow-2xs">
                <span class="material-symbols-outlined text-base">{cat.icon || 'folder'}</span>
              </div>
              <div class="min-w-0">
                <span class="font-bold text-xs text-main block font-sans">
                  {cat.name}
                </span>
                {#if cat.description}
                  <span class="text-3xs text-secondary block truncate font-sans max-w-xs mt-0.5">
                    {cat.description}
                  </span>
                {/if}
              </div>
            </div>
          </td>

          <!-- Slug URL -->
          <td class="px-4 py-4">
            <span class="font-mono text-2xs font-bold text-secondary bg-nested/80 px-2 py-1 rounded-lg border border-light">
              {cat.slug}
            </span>
          </td>

          <!-- Icon Badge -->
          <td class="px-4 py-4 text-center">
            <Badge variant="primary" size="sm">
              {cat.icon || 'folder'}
            </Badge>
          </td>

          <!-- Created Date -->
          <td class="px-4 py-4 text-2xs text-secondary font-mono whitespace-nowrap">
            {cat.createdAt ? formatDate(cat.createdAt) : '—'}
          </td>

          <!-- Actions -->
          <td class="px-6 py-4 text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-1.5">
              <Button
                variant="secondary"
                size="icon"
                on:click={() => openEditModal(cat)}
                title="Edit Kategori"
              >
                <Edit2 size={13} />
              </Button>

              <Button
                variant="destructive"
                size="icon"
                className="!bg-nested hover:!bg-rose-500/10 !border-light hover:!border-rose-500/20 !text-secondary hover:!text-rose-600 shadow-2xs"
                on:click={() => openDeleteConfirm(cat)}
                title="Hapus Kategori"
              >
                <Trash2 size={13} />
              </Button>
            </div>
          </td>
        </tr>
      {/each}
    </Table>

    <!-- DaisyUI Pagination Footer -->
    <Pagination
      bind:currentPage
      totalItems={filteredCategories.length}
      {pageSize}
    />
  {/if}
</Card>

<!-- Create / Edit Modal -->
<Modal
  open={showFormModal}
  size="md"
  on:close={() => (showFormModal = false)}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/25 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">{isEditing ? 'edit' : 'add_circle'}</span>
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          {isEditing ? 'Edit Kategori Template' : 'Tambah Kategori Template Baru'}
        </h3>
        <p class="text-2xs text-muted mt-0.5">
          {isEditing ? 'Perbarui informasi ceruk bisnis' : 'Daftarkan klasifikasi template untuk desainer'}
        </p>
      </div>
    </div>
  </svelte:fragment>

  <form on:submit={handleSave} class="space-y-4 pt-1">
    {#if formError}
      <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-sans">
        {formError}
      </div>
    {/if}

    <div class="space-y-1.5">
      <label for="cat_name" class="text-xs font-bold text-main block font-heading">
        Nama Kategori <span class="text-rose-500">*</span>
      </label>
      <input
        id="cat_name"
        type="text"
        value={formName}
        on:input={handleNameInput}
        placeholder="Contoh: Kuliner & Minuman"
        required
        class="w-full bg-nested/80 border border-light rounded-xl px-3.5 py-2 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary/50 focus:bg-card transition-all font-sans"
      />
    </div>

    <div class="space-y-1.5">
      <label for="cat_slug" class="text-xs font-bold text-main block font-heading">
        Slug URL <span class="text-rose-500">*</span>
      </label>
      <input
        id="cat_slug"
        type="text"
        bind:value={formSlug}
        placeholder="kuliner-dan-minuman"
        required
        class="w-full bg-nested/80 border border-light rounded-xl px-3.5 py-2 text-xs text-main placeholder:text-muted font-mono focus:outline-none focus:border-primary/50 focus:bg-card transition-all"
      />
    </div>

    <div class="space-y-1.5">
      <label for="cat_icon" class="text-xs font-bold text-main block font-heading">
        Ikon Representatif (Google Material Symbols)
      </label>
      <div class="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 bg-nested/50 rounded-2xl border border-light">
        {#each iconOptions as opt}
          <button
            type="button"
            on:click={() => (formIcon = opt.value)}
            class="flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all text-left {formIcon === opt.value
              ? 'bg-primary text-white border-primary shadow-2xs font-bold'
              : 'bg-card hover:bg-nested border-light text-main'}"
          >
            <span class="material-symbols-outlined text-sm flex-shrink-0">{opt.value}</span>
            <span class="truncate">{opt.value}</span>
          </button>
        {/each}
      </div>
    </div>

    <div class="space-y-1.5">
      <label for="cat_desc" class="text-xs font-bold text-main block font-heading">
        Deskripsi Singkat (Opsional)
      </label>
      <Textarea
        id="cat_desc"
        bind:value={formDescription}
        placeholder="Template yang cocok untuk restoran, cafe, kedai kopi, dan catering..."
        rows={2}
        className="text-xs font-sans"
      />
    </div>

    <div class="flex items-center justify-end gap-2 pt-3 border-t border-light">
      <Button
        variant="secondary"
        size="sm"
        className="rounded-xl font-bold"
        on:click={() => (showFormModal = false)}
        disabled={isSaving}
      >
        Batal
      </Button>
      <Button
        type="submit"
        variant="primary"
        size="sm"
        className="rounded-xl font-bold"
        disabled={isSaving}
      >
        {isSaving ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah Kategori'}
      </Button>
    </div>
  </form>
</Modal>

<!-- Delete Confirm Modal -->
<Modal
  open={showDeleteModal}
  size="sm"
  on:close={() => (showDeleteModal = false)}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/25 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <Trash2 size={18} />
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          Hapus Kategori Template
        </h3>
        <p class="text-2xs text-muted mt-0.5">
          Tindakan ini tidak dapat dibatalkan
        </p>
      </div>
    </div>
  </svelte:fragment>

  {#if deletingCategory}
    <div class="space-y-4 pt-1">
      <p class="text-xs text-secondary leading-relaxed font-sans">
        Apakah Anda yakin ingin menghapus kategori <strong class="text-main">{deletingCategory.name}</strong>?
      </p>

      <div class="flex items-center justify-end gap-2 pt-2">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold"
          on:click={() => (showDeleteModal = false)}
          disabled={isDeleting}
        >
          Batal
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="rounded-xl font-bold"
          on:click={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Menghapus...' : 'Konfirmasi Hapus'}
        </Button>
      </div>
    </div>
  {/if}
</Modal>
