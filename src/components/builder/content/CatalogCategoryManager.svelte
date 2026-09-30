<script lang="ts">
  import { Plus, Trash2, Tags } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import { slugify } from '@/lib/utils/format';
  import type { CatalogCategory } from '../sections/productCatalog.helpers';

  export let categories: CatalogCategory[] = [];
  export let onUpdateCategories: (cats: CatalogCategory[]) => void = () => {};

  let newCategoryName: string = '';

  function handleAdd() {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    const slug = slugify(trimmed);
    const id = `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const updated = [...categories, { id, name: trimmed, slug }];
    newCategoryName = '';
    onUpdateCategories(updated);
  }

  function handleNameChange(index: number, name: string) {
    const updated = [...categories];
    const slug = slugify(name);
    updated[index] = { ...updated[index], name, slug };
    onUpdateCategories(updated);
  }

  function handleRemove(index: number) {
    const updated = categories.filter((_, i) => i !== index);
    onUpdateCategories(updated);
  }
</script>

<div class="space-y-2 p-3 bg-base-200/50 border border-base-300 rounded-xl text-left">
  <div class="flex items-center gap-1.5 pb-2 border-b border-base-300/60">
    <Tags size={14} class="text-primary" />
    <span class="font-heading font-bold text-xs text-base-content">Kelola Kategori Produk (Desainer)</span>
  </div>

  <div class="flex gap-1.5 pt-1">
    <input
      type="text"
      bind:value={newCategoryName}
      placeholder="Nama Kategori Baru..."
      on:keydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
      class="flex-1 px-2.5 py-1 text-xs bg-base-100 border border-base-300 rounded-lg text-base-content focus:outline-none focus:border-primary"
    />
    <Button
      type="button"
      size="xs"
      variant="primary"
      on:click={handleAdd}
      disabled={!newCategoryName.trim()}
      class="!px-2.5 !py-1 !h-auto !min-h-0 text-xs font-heading font-semibold gap-1"
    >
      <Plus size={12} />
      <span>Tambah</span>
    </Button>
  </div>

  {#if categories.length === 0}
    <p class="text-[11px] text-base-content/50 italic py-1">Belum ada kategori kustom. Menggunakan kategori bawaan.</p>
  {:else}
    <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1 pt-1">
      {#each categories as cat, index (cat.id || index)}
        <div class="flex items-center gap-1.5 bg-base-100 p-1.5 rounded-lg border border-base-200">
          <input
            type="text"
            value={cat.name}
            on:input={(e) => handleNameChange(index, e.currentTarget.value)}
            class="flex-1 px-2 py-0.5 text-xs bg-transparent border-0 text-base-content focus:outline-none font-medium"
            placeholder="Nama Kategori"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            on:click={() => handleRemove(index)}
            class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/40 hover:text-rose-500 rounded transition-colors"
            title="Hapus Kategori"
          >
            <Trash2 size={12} />
          </Button>
        </div>
      {/each}
    </div>
  {/if}
</div>
