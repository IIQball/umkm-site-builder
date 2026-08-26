<script lang="ts">
  import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import type { FeatureItem } from '@/types/templates';
  import {
    makeHandlePropChange,
    makeHandleArrayItemChange,
    makeHandleAddArrayItem,
    makeHandleRemoveArrayItem,
    makeHandleMoveArrayItem,
  } from './content.helpers';
  import ImageUpload from '@/components/shared/ImageUpload.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: handleArrayItemChange = makeHandleArrayItemChange(section, onUpdate);
  $: handleAddArrayItem = makeHandleAddArrayItem(section, onUpdate);
  $: handleRemoveArrayItem = makeHandleRemoveArrayItem(section, onUpdate);
  $: handleMoveArrayItem = makeHandleMoveArrayItem(section, onUpdate);

  $: features = (section.props?.features as FeatureItem[]) || [];
  $: imageUrl = (section.props?.imageUrl as string) || '';
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <span class="block font-semibold text-xs text-base-content/80">Daftar Fitur / Keunggulan</span>
    <button
      type="button"
      on:click={() => handleAddArrayItem('features', { icon: 'star', title: 'Fitur Baru', description: 'Deskripsi keunggulan produk/layanan Anda.' })}
      class="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
    >
      <Plus size={13} />
      <span>Tambah Fitur</span>
    </button>
  </div>

  <div class="space-y-3">
    {#each features as feature, index}
      <div class="p-3 bg-base-200/50 dark:bg-slate-950/60 border border-base-300 dark:border-slate-800 rounded-xl space-y-2">
        <div class="flex items-center justify-between gap-2">
          <input
            type="text"
            value={feature.icon ?? ''}
            on:input={(e) => handleArrayItemChange('features', index, 'icon', e.currentTarget.value)}
            class="w-20 px-2 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded-lg text-center text-base-content text-xs focus:outline-none focus:border-blue-500 font-mono"
            placeholder="Icon"
          />
          <input
            type="text"
            value={feature.title ?? ''}
            on:input={(e) => handleArrayItemChange('features', index, 'title', e.currentTarget.value)}
            class="flex-1 px-2.5 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded-lg text-base-content text-xs focus:outline-none focus:border-blue-500 font-semibold"
            placeholder="Judul Fitur"
          />
          <div class="flex items-center gap-0.5">
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
          class="w-full px-2.5 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-700 rounded-lg text-base-content text-xs focus:outline-none focus:border-blue-500 resize-y"
          placeholder="Deskripsi singkat fitur..."
        />
      </div>
    {/each}
  </div>

  <!-- Optional Side Illustration Image -->
  {#if section.layoutPreset === 'split_image_feature' || section.props?.imageUrl}
    <div class="p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800 space-y-2">
      <span class="block font-semibold text-xs text-base-content/80">Gambar Ilustrasi Samping (Split Image)</span>
      <ImageUpload
        value={imageUrl}
        maxFiles={1}
        folder="templates"
        compact={true}
        label="File Gambar Ilustrasi"
        onSingleUpload={(url) => handlePropChange('imageUrl', url)}
      />
    </div>
  {/if}
</div>
