<script lang="ts">
  import { Plus, Trash2 } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from '../content.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);

  $: beforeTitle = (section.props?.beforeTitle as string) ?? 'Produk Pasaran Biasa';
  $: afterTitle = (section.props?.afterTitle as string) ?? 'Olahan Dapur UMKM Kami';

  $: beforeItems = ((section.props?.beforeItems as string[]) || [
    'Memakai minyak curah berulang kali',
    'Pengawet kimia sintetis berlebih',
    'Tekstur keras dan cepat tengik',
    'Tanpa jaminan sertifikasi resmi',
  ]) as string[];

  $: afterItems = ((section.props?.afterItems as string[]) || [
    'Minyak kelapa murni sekali pakai',
    '100% bumbu rempah segar alami',
    'Renyah tahan 6 bulan berkat kemasan vakum',
    'Bersertifikat Halal MUI & BPOM',
  ]) as string[];

  function updateBeforeItem(index: number, val: string) {
    const list = [...beforeItems];
    list[index] = val;
    handlePropChange('beforeItems', list);
  }

  function addBeforeItem() {
    handlePropChange('beforeItems', [...beforeItems, 'Kekurangan produk pasaran']);
  }

  function removeBeforeItem(index: number) {
    const list = beforeItems.filter((_, i) => i !== index);
    handlePropChange('beforeItems', list);
  }

  function updateAfterItem(index: number, val: string) {
    const list = [...afterItems];
    list[index] = val;
    handlePropChange('afterItems', list);
  }

  function addAfterItem() {
    handlePropChange('afterItems', [...afterItems, 'Keunggulan produk UMKM']);
  }

  function removeAfterItem(index: number) {
    const list = afterItems.filter((_, i) => i !== index);
    handlePropChange('afterItems', list);
  }
</script>

<div class="pt-3 border-t border-base-300 dark:border-slate-800 space-y-4">
  <!-- Sisi Sebelum / Pasaran Biasa -->
  <div class="space-y-2 p-3 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-rose-700 dark:text-rose-400">Judul Kolom Sebelum / Biasa</span>
      <button
        type="button"
        on:click={addBeforeItem}
        class="flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-500 cursor-pointer"
      >
        <Plus size={12} />
        <span>Tambah Poin</span>
      </button>
    </div>
    <input
      type="text"
      value={beforeTitle}
      on:input={(e) => handlePropChange('beforeTitle', e.currentTarget.value)}
      class="w-full px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-rose-300 dark:border-rose-800 rounded text-xs text-base-content focus:outline-none"
    />
    <div class="space-y-1.5 pt-1">
      {#each beforeItems as item, idx}
        <div class="flex items-center gap-1.5">
          <input
            type="text"
            value={item}
            on:input={(e) => updateBeforeItem(idx, e.currentTarget.value)}
            class="flex-1 px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-xs text-base-content focus:outline-none"
            placeholder="Poin kekurangan"
          />
          <button
            type="button"
            on:click={() => removeBeforeItem(idx)}
            class="p-1 text-base-content/50 hover:text-rose-500 rounded cursor-pointer"
            title="Hapus Poin"
          >
            <Trash2 size={13} />
          </button>
        </div>
      {/each}
    </div>
  </div>

  <!-- Sisi Sesudah / Produk UMKM Kami -->
  <div class="space-y-2 p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400">Judul Kolom Sesudah / UMKM</span>
      <button
        type="button"
        on:click={addAfterItem}
        class="flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:text-emerald-500 cursor-pointer"
      >
        <Plus size={12} />
        <span>Tambah Poin</span>
      </button>
    </div>
    <input
      type="text"
      value={afterTitle}
      on:input={(e) => handlePropChange('afterTitle', e.currentTarget.value)}
      class="w-full px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-800 rounded text-xs text-base-content focus:outline-none"
    />
    <div class="space-y-1.5 pt-1">
      {#each afterItems as item, idx}
        <div class="flex items-center gap-1.5">
          <input
            type="text"
            value={item}
            on:input={(e) => updateAfterItem(idx, e.currentTarget.value)}
            class="flex-1 px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-xs text-base-content focus:outline-none"
            placeholder="Poin keunggulan"
          />
          <button
            type="button"
            on:click={() => removeAfterItem(idx)}
            class="p-1 text-base-content/50 hover:text-rose-500 rounded cursor-pointer"
            title="Hapus Poin"
          >
            <Trash2 size={13} />
          </button>
        </div>
      {/each}
    </div>
  </div>
</div>
