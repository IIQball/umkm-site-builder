<script lang="ts">
  import { onMount } from 'svelte';
  import { Plus, Folder, Trash2, Edit2, Check, RefreshCw } from 'lucide-svelte';
  import { Card, Input, Textarea, Button, Modal } from '@/components/ui';
  import { toast } from '@/lib/toast';

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
      toast.error('Gagal mengambil data kategori');
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

      toast.success(isEditing ? 'Kategori berhasil diperbarui' : 'Kategori baru berhasil ditambahkan');
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

      toast.success(`Kategori "${deletingCategory.name}" berhasil dihapus`);
      showDeleteModal = false;
      deletingCategory = null;
      await fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus kategori');
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

<Card variant="bordered" padding="none" radius="xl" topBeam="indigo-500">
  <!-- Table Header & Controls (matching DesignerMutationTable style) -->
  <div class="px-6 md:px-7 py-5 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-base">category</span>
        </div>
        <h3 class="text-heading-md text-main font-bold">Master Kategori Template</h3>
      </div>
      <p class="text-body-sm text-secondary mt-0.5 ml-10.5">
        Daftar ceruk bisnis, slug URL, ikon antarmuka, dan opsi modifikasi data
      </p>
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
          class="bg-nested/80 border border-light rounded-xl pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary/50 focus:bg-card transition-all w-48 sm:w-56"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          on:click={fetchCategories}
          disabled={loading}
          class="p-2 rounded-xl bg-nested/80 hover:bg-card border border-light text-secondary hover:text-main shadow-2xs transition-all cursor-pointer"
          title="Refresh Data"
          aria-label="Refresh Data"
        >
          <RefreshCw size={14} class={loading ? 'animate-spin' : ''} />
        </button>

        <button
          type="button"
          on:click={openCreateModal}
          class="inline-flex items-center gap-2 bg-gradient-to-r from-primary via-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/25 border border-primary/30 transition-all cursor-pointer flex-shrink-0"
        >
          <Plus size={16} class="stroke-[2.5]" />
          <span>Tambah Kategori Baru</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Categories Table Content -->
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-light bg-nested/50 text-2xs uppercase tracking-wider text-muted font-heading font-bold">
          <th class="px-6 py-4">Kategori & Ikon</th>
          <th class="px-6 py-4">Slug URL</th>
          <th class="px-6 py-4">Deskripsi</th>
          <th class="px-6 py-4 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[var(--color-border-light)] text-sm">
        {#if filteredCategories.length === 0}
          <tr>
            <td colspan="4" class="px-6 py-16 text-center text-muted">
              <div class="w-12 h-12 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
                <Folder size={24} />
              </div>
              <p class="font-bold text-main text-sm font-heading">Tidak Ada Kategori Ditemukan</p>
              <p class="text-xs text-secondary mt-1 max-w-sm mx-auto font-sans">
                Gunakan tombol "Tambah Kategori" untuk membuat kategori ceruk bisnis baru.
              </p>
            </td>
          </tr>
        {:else}
          {#each filteredCategories as cat (cat.id)}
            <tr class="hover:bg-nested/30 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-card border border-light text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <span class="material-symbols-outlined text-lg">{cat.icon || 'folder'}</span>
                  </div>
                  <div>
                    <span class="font-bold text-xs text-main block">{cat.name}</span>
                    <span class="text-3xs font-mono text-muted block">ID: #{cat.id.slice(-6)}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 font-mono text-xs text-secondary">
                <span class="bg-nested/80 px-2 py-0.5 rounded-md border border-light">{cat.slug}</span>
              </td>
              <td class="px-6 py-4 text-xs text-secondary max-w-xs truncate font-sans">
                {cat.description || '-'}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    on:click={() => openEditModal(cat)}
                    class="p-1.5 rounded-lg text-secondary hover:text-main hover:bg-nested border border-transparent hover:border-light transition-all cursor-pointer"
                    title="Edit Kategori"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    type="button"
                    on:click={() => openDeleteConfirm(cat)}
                    class="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                    title="Hapus Kategori"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</Card>

<!-- Modal Create / Edit Category -->
<Modal bind:open={showFormModal} title={isEditing ? 'Edit Kategori Template' : 'Tambah Kategori Template Baru'}>
  <form on:submit={handleSave} class="space-y-4" novalidate>
    {#if formError}
      <div class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
        <span class="material-symbols-outlined text-base flex-shrink-0">error</span>
        <p class="font-sans">{formError}</p>
      </div>
    {/if}

    <Input
      id="cat-name"
      label="Nama Kategori"
      required
      placeholder="Contoh: Kuliner & Makanan"
      value={formName}
      on:input={handleNameInput}
      disabled={isSaving}
    />

    <Input
      id="cat-slug"
      label="Slug URL (Unik)"
      required
      placeholder="contoh: kuliner-makanan"
      bind:value={formSlug}
      disabled={isSaving}
      className="font-mono text-xs"
      helper="Hanya huruf kecil, angka, dan strip (-)"
    />

    <!-- Icon Selector -->
    <div class="space-y-1.5">
      <span class="text-label-caps text-muted font-bold block">Pilih Ikon Material</span>
      <div class="grid grid-cols-3 gap-2">
        {#each iconOptions as opt}
          <button
            type="button"
            on:click={() => (formIcon = opt.value)}
            class="flex items-center gap-2 p-2 rounded-xl border text-xs transition-all cursor-pointer {formIcon === opt.value ? 'bg-primary/15 border-primary text-primary font-bold shadow-2xs' : 'bg-nested/60 border-light text-secondary hover:text-main'}"
          >
            <span class="material-symbols-outlined text-base">{opt.value}</span>
            <span class="truncate">{opt.label.split(' ')[0]}</span>
          </button>
        {/each}
      </div>
    </div>

    <Textarea
      id="cat-desc"
      label="Deskripsi Kategori (Opsional)"
      placeholder="Jelaskan jenis template yang masuk dalam kategori ini..."
      bind:value={formDescription}
      rows={3}
      disabled={isSaving}
    />

    <div class="pt-3 flex items-center justify-end gap-2 border-t border-light">
      <Button variant="secondary" size="sm" on:click={() => (showFormModal = false)} disabled={isSaving}>
        Batal
      </Button>
      <Button type="submit" variant="primary" size="sm" loading={isSaving} disabled={isSaving}>
        <Check size={14} class="mr-1" />
        <span>{isEditing ? 'Simpan Perubahan' : 'Buat Kategori'}</span>
      </Button>
    </div>
  </form>
</Modal>

<!-- Modal Konfirmasi Hapus -->
<Modal bind:open={showDeleteModal} title="Konfirmasi Penghapusan Kategori">
  <div class="space-y-4">
    <p class="text-sm text-secondary leading-relaxed">
      Apakah Anda yakin ingin menghapus kategori <strong class="text-main">"{deletingCategory?.name}"</strong>?
    </p>
    <p class="text-xs text-muted bg-nested p-3 rounded-xl border border-light">
      Template yang sebelumnya menggunakan kategori ini tidak akan terhapus, namun status kategorinya akan menjadi tidak terkategori (null).
    </p>
    <div class="flex items-center justify-end gap-2 pt-2 border-t border-light">
      <Button variant="secondary" size="sm" on:click={() => (showDeleteModal = false)} disabled={isDeleting}>
        Batal
      </Button>
      <Button variant="destructive" size="sm" on:click={handleDelete} loading={isDeleting} disabled={isDeleting}>
        <Trash2 size={14} class="mr-1" />
        <span>Hapus Kategori</span>
      </Button>
    </div>
  </div>
</Modal>
