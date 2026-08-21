<script lang="ts">
  import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import {
    makeHandleArrayItemChange,
    makeHandleAddArrayItem,
    makeHandleRemoveArrayItem,
    makeHandleMoveArrayItem,
  } from './content.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  interface FeatureItem {
    icon?: string;
    title?: string;
    description?: string;
  }

  $: handleArrayItemChange = makeHandleArrayItemChange(section, onUpdate);
  $: handleAddArrayItem = makeHandleAddArrayItem(section, onUpdate);
  $: handleRemoveArrayItem = makeHandleRemoveArrayItem(section, onUpdate);
  $: handleMoveArrayItem = makeHandleMoveArrayItem(section, onUpdate);

  $: features = (section.props?.features as FeatureItem[]) || [];
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between">
    <span class="block font-semibold text-base-content/80">Daftar Fitur / Keunggulan</span>
    <button
      type="button"
      on:click={() => handleAddArrayItem('features', { icon: 'star', title: 'Fitur Baru', description: 'Deskripsi keunggulan produk/layanan Anda.' })}
      class="flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-400 cursor-pointer"
    >
      <Plus size={12} />
      <span>Tambah Fitur</span>
    </button>
  </div>

  <div class="space-y-3">
    {#each features as feature, index}
      <div class="p-3 bg-base-200/50 dark:bg-slate-950/60 border border-base-300 dark:border-slate-800 rounded-lg space-y-2">
        <div class="flex items-center justify-between gap-2">
          <input
            type="text"
            value={feature.icon ?? ''}
            on:input={(e) => handleArrayItemChange('features', index, 'icon', e.currentTarget.value)}
            class="w-16 px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-center text-base-content text-sm focus:outline-none focus:border-blue-500"
            placeholder="Nama Icon"
          />
          <input
            type="text"
            value={feature.title ?? ''}
            on:input={(e) => handleArrayItemChange('features', index, 'title', e.currentTarget.value)}
            class="flex-1 px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
            placeholder="Judul Fitur"
          />
          <div class="flex items-center">
            <button
              type="button"
              on:click={() => handleMoveArrayItem('features', index, 'up')}
              disabled={index === 0}
              class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              title="Pindah ke Atas"
            >
              <ChevronUp size={13} />
            </button>
            <button
              type="button"
              on:click={() => handleMoveArrayItem('features', index, 'down')}
              disabled={index === features.length - 1}
              class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              title="Pindah ke Bawah"
            >
              <ChevronDown size={13} />
            </button>
            <button
              type="button"
              on:click={() => handleRemoveArrayItem('features', index)}
              class="p-1 text-base-content/50 hover:text-rose-500 rounded transition-colors cursor-pointer"
              title="Hapus Fitur"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        <textarea
          value={feature.description ?? ''}
          on:input={(e) => handleArrayItemChange('features', index, 'description', e.currentTarget.value)}
          rows="2"
          class="w-full px-2.5 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded text-base-content focus:outline-none focus:border-blue-500"
          placeholder="Deskripsi singkat fitur"
        />
      </div>
    {/each}
  </div>
</div>
