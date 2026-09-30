<script lang="ts">
  import { LayoutGrid, Plus, Trash2, Info } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let handlePropChange: (key: string, value: any) => void;

  interface CategoryItem {
    name: string;
    description?: string;
    href?: string;
  }

  $: categories = (Array.isArray(section.props?.categories) && section.props.categories.length > 0
    ? section.props.categories
    : [
        { name: 'Makanan', description: 'Kuliner & Snack', href: '#produk' },
        { name: 'Fashion', description: 'Pakaian & Batik', href: '#produk' },
        { name: 'Kerajinan', description: 'Handmade UMKM', href: '#produk' },
        { name: 'Minuman', description: 'Kopi & Herbal', href: '#produk' },
      ]) as CategoryItem[];

  const handleAddCategory = () => {
    const updated = [
      ...categories,
      { name: 'Kategori Baru', description: 'Deskripsi produk', href: '#produk' },
    ];
    handlePropChange('categories', updated);
  };

  const handleUpdate = (index: number, field: keyof CategoryItem, value: string) => {
    const updated = categories.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    handlePropChange('categories', updated);
  };

  const handleRemove = (index: number) => {
    const updated = categories.filter((_, idx) => idx !== index);
    handlePropChange('categories', updated);
  };
</script>

<div class="space-y-3 p-3 bg-base-200/40 rounded-xl border border-base-200">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
      <LayoutGrid size={14} class="text-[var(--theme-primary,var(--color-primary))]" />
      <span>Menu Kategori Mega Menu</span>
    </div>
    <Button
      type="button"
      variant="outline"
      size="xs"
      on:click={handleAddCategory}
      class="!h-auto !min-h-0 !py-1 !px-2 gap-1 font-medium"
      title="Tambah Kategori Baru"
    >
      <Plus size={12} />
      <span>Tambah</span>
    </Button>
  </div>

  <div class="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
    <Info size={14} class="text-blue-500 flex-shrink-0 mt-0.5" />
    <div class="text-[11px] leading-relaxed">
      <span class="font-bold block">Integrasi Otomatis Tenant</span>
      Daftar di bawah digunakan sebagai pratinjau konten desainer template. Saat dipakai oleh toko tenant, kategori akan otomatis terisi sesuai kategori produk nyata dari toko.
    </div>
  </div>

  <div class="space-y-2.5 max-h-64 overflow-y-auto pr-1">
    {#each categories as cat, idx}
      <div class="p-2.5 bg-base-100 rounded-lg border border-base-200 space-y-2 text-xs">
        <div class="flex items-center justify-between gap-2">
          <span class="font-semibold text-[11px] text-base-content/80">Kategori #{idx + 1}</span>
          {#if categories.length > 1}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              on:click={() => handleRemove(idx)}
              class="!w-6 !h-6 !min-h-0 !p-1 text-rose-500 hover:bg-rose-500/10"
              title="Hapus Kategori"
            >
              <Trash2 size={12} />
            </Button>
          {/if}
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label for={`cat-name-${idx}`} class="block text-[10px] text-base-content/60 mb-0.5">Nama</label>
            <input
              id={`cat-name-${idx}`}
              type="text"
              value={cat.name}
              on:input={(e) => handleUpdate(idx, 'name', e.currentTarget.value)}
              class="input input-bordered input-xs w-full"
              placeholder="cth. Makanan"
            />
          </div>
          <div>
            <label for={`cat-desc-${idx}`} class="block text-[10px] text-base-content/60 mb-0.5">Deskripsi</label>
            <input
              id={`cat-desc-${idx}`}
              type="text"
              value={cat.description ?? ''}
              on:input={(e) => handleUpdate(idx, 'description', e.currentTarget.value)}
              class="input input-bordered input-xs w-full"
              placeholder="cth. Snack & Kuliner"
            />
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
