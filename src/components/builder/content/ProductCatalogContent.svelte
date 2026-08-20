<script lang="ts">
  import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import {
    makeHandlePropChange,
    makeHandleArrayItemChange,
    makeHandleAddArrayItem,
    makeHandleRemoveArrayItem,
    makeHandleMoveArrayItem,
  } from './content.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: handleArrayItemChange = makeHandleArrayItemChange(section, onUpdate);
  $: handleAddArrayItem = makeHandleAddArrayItem(section, onUpdate);
  $: handleRemoveArrayItem = makeHandleRemoveArrayItem(section, onUpdate);
  $: handleMoveArrayItem = makeHandleMoveArrayItem(section, onUpdate);
</script>

<div class="space-y-3">
  <div>
    <label for="catalog-title" class="block font-semibold text-base-content/80 mb-1">Judul Katalog (Title)</label>
    <input
      id="catalog-title"
      type="text"
      value={section.props?.title ?? ''}
      on:input={(e) => handlePropChange('title', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
      placeholder="Katalog Produk Pilihan"
    />
  </div>

  <div>
    <label for="catalog-subtitle" class="block font-semibold text-base-content/80 mb-1">Subjudul (Subtitle)</label>
    <textarea
      id="catalog-subtitle"
      value={section.props?.subtitle ?? ''}
      on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
      rows="2"
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 resize-y"
      placeholder="Pilih produk terbaik kami dengan jaminan mutu dan kemudahan pemesanan"
    />
  </div>

  <div class="flex items-center justify-between pt-2 border-t border-base-200 dark:border-slate-800">
    <span class="block font-semibold text-base-content/80">Daftar Produk ({ (section.props?.products || []).length })</span>
    <button
      type="button"
      on:click={() => handleAddArrayItem('products', { name: 'Produk Baru', price: 50000, imageUrl: '', badge: 'Terlaris' })}
      class="flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-400 cursor-pointer"
    >
      <Plus size={12} />
      <span>Tambah Item</span>
    </button>
  </div>

  {#if (section.props?.products || []).length === 0}
    <div class="p-4 text-center border border-dashed border-base-300 dark:border-slate-800 rounded-lg text-base-content/50">
      <p>Belum ada produk preview.</p>
      <button
        type="button"
        on:click={() => handleAddArrayItem('products', { name: 'Produk Contoh', price: 75000, imageUrl: '', badge: 'Populer' })}
        class="mt-2 text-xs text-blue-500 hover:underline inline-block cursor-pointer"
      >
        + Buat Produk Contoh
      </button>
    </div>
  {:else}
    <div class="space-y-3">
      {#each section.props?.products || [] as product, index}
        <div class="p-3 bg-base-200/50 dark:bg-slate-950/60 border border-base-300 dark:border-slate-800 rounded-lg space-y-2">
          <div class="flex items-center justify-between gap-1.5">
            <input
              type="text"
              value={product.name ?? ''}
              on:input={(e) => handleArrayItemChange('products', index, 'name', e.currentTarget.value)}
              class="flex-1 px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
              placeholder="Nama Produk"
            />
            <div class="flex items-center">
              <button
                type="button"
                on:click={() => handleMoveArrayItem('products', index, 'up')}
                disabled={index === 0}
                class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                title="Pindah ke Atas"
              >
                <ChevronUp size={13} />
              </button>
              <button
                type="button"
                on:click={() => handleMoveArrayItem('products', index, 'down')}
                disabled={index === (section.props?.products || []).length - 1}
                class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                title="Pindah ke Bawah"
              >
                <ChevronDown size={13} />
              </button>
              <button
                type="button"
                on:click={() => handleRemoveArrayItem('products', index)}
                class="p-1 text-base-content/50 hover:text-rose-500 rounded transition-colors cursor-pointer"
                title="Hapus Produk"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={product.price ?? 0}
              on:input={(e) => handleArrayItemChange('products', index, 'price', Number(e.currentTarget.value))}
              class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500 font-mono"
              placeholder="Harga (Rp)"
            />
            <input
              type="text"
              value={product.badge ?? ''}
              on:input={(e) => handleArrayItemChange('products', index, 'badge', e.currentTarget.value)}
              class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
              placeholder="Badge (opsional)"
            />
          </div>

          <input
            type="text"
            value={product.imageUrl ?? ''}
            on:input={(e) => handleArrayItemChange('products', index, 'imageUrl', e.currentTarget.value)}
            class="w-full px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
            placeholder="URL Foto Produk"
          />
        </div>
      {/each}
    </div>
  {/if}
</div>
