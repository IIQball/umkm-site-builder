<script lang="ts">
  import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import type { FeatureItem } from '@/types';
  import {
    makeHandleArrayItemChange,
    makeHandleAddArrayItem,
    makeHandleRemoveArrayItem,
    makeHandleMoveArrayItem,
  } from '../content.helpers';
  import { FEATURE_ICON_OPTIONS } from '../../sections/features/featureIcons';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;
  export let hasImageSupport: boolean = false;

  $: handleArrayItemChange = makeHandleArrayItemChange(section, onUpdate);
  $: handleAddArrayItem = makeHandleAddArrayItem(section, onUpdate);
  $: handleRemoveArrayItem = makeHandleRemoveArrayItem(section, onUpdate);
  $: handleMoveArrayItem = makeHandleMoveArrayItem(section, onUpdate);

  $: itemsKey = Array.isArray(section.props?.items) ? 'items' : 'features';
  $: features = ((section.props?.[itemsKey] as FeatureItem[]) ||
    (section.props?.features as FeatureItem[]) ||
    (section.props?.items as FeatureItem[]) ||
    []) as FeatureItem[];

  function handleFeatureFieldChange(index: number, field: string, val: unknown) {
    handleArrayItemChange(itemsKey, index, field, val);
    if (section.props?.features && itemsKey === 'items') {
      handleArrayItemChange('features', index, field, val);
    }
  }
</script>

<div class="pt-3 border-t border-base-300 dark:border-slate-800 space-y-3">
  <div class="flex items-center justify-between">
    <span class="block font-semibold text-xs text-base-content/80">Daftar Fitur / Benefit</span>
    <button
      type="button"
      on:click={() =>
        handleAddArrayItem(itemsKey, {
          id: `f-${Date.now()}`,
          icon: 'sparkles',
          iconName: 'sparkles',
          title: 'Keunggulan Baru',
          description: 'Deskripsi singkat keunggulan dan nilai tambah produk Anda.',
          badge: 'Baru',
        })}
      class="flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-400 cursor-pointer"
    >
      <Plus size={12} />
      <span>Tambah Fitur</span>
    </button>
  </div>

  <div class="space-y-3">
    {#each features as feature, index}
      <div class="p-3 bg-base-200/50 dark:bg-slate-950/60 border border-base-300 dark:border-slate-800 rounded-xl space-y-2.5">
        <!-- Row 1: Icon Selector, Title, Reorder & Delete -->
        <div class="flex items-center justify-between gap-2">
          <select
            value={feature.iconName || feature.icon || 'sparkles'}
            on:change={(e) => {
              handleFeatureFieldChange(index, 'icon', e.currentTarget.value);
              handleFeatureFieldChange(index, 'iconName', e.currentTarget.value);
            }}
            class="w-28 px-2 py-1 bg-base-100 dark:bg-slate-900 border border-base-300 dark:border-slate-700 rounded text-xs text-base-content focus:outline-none focus:border-blue-500"
          >
            {#each FEATURE_ICON_OPTIONS as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>

          <input
            type="text"
            value={feature.title ?? ''}
            on:input={(e) => handleFeatureFieldChange(index, 'title', e.currentTarget.value)}
            class="flex-1 px-2.5 py-1 bg-base-100 dark:bg-slate-900 border border-base-300 dark:border-slate-700 rounded text-xs text-base-content font-medium focus:outline-none focus:border-blue-500"
            placeholder="Judul Fitur"
          />

          <div class="flex items-center">
            <button
              type="button"
              on:click={() => handleMoveArrayItem(itemsKey, index, 'up')}
              disabled={index === 0}
              class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              title="Pindah ke Atas"
            >
              <ChevronUp size={13} />
            </button>
            <button
              type="button"
              on:click={() => handleMoveArrayItem(itemsKey, index, 'down')}
              disabled={index === features.length - 1}
              class="p-1 text-base-content/50 hover:text-base-content disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              title="Pindah ke Bawah"
            >
              <ChevronDown size={13} />
            </button>
            <button
              type="button"
              on:click={() => handleRemoveArrayItem(itemsKey, index)}
              class="p-1 text-base-content/50 hover:text-rose-500 rounded transition-colors cursor-pointer"
              title="Hapus Fitur"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <!-- Row 2: Badge & Action Label -->
        <div class="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={feature.badge ?? ''}
            on:input={(e) => handleFeatureFieldChange(index, 'badge', e.currentTarget.value)}
            class="w-full px-2 py-1 bg-base-100 dark:bg-slate-900 border border-base-300 dark:border-slate-700 rounded text-xs text-base-content focus:outline-none"
            placeholder="Label Badge (opsional)"
          />
          <input
            type="text"
            value={feature.statLabel ?? ''}
            on:input={(e) => handleFeatureFieldChange(index, 'statLabel', e.currentTarget.value)}
            class="w-full px-2 py-1 bg-base-100 dark:bg-slate-900 border border-base-300 dark:border-slate-700 rounded text-xs text-base-content focus:outline-none"
            placeholder="Teks Tombol/Stat (opsional)"
          />
        </div>

        <!-- Row 3: Description -->
        <textarea
          value={feature.description ?? ''}
          on:input={(e) => handleFeatureFieldChange(index, 'description', e.currentTarget.value)}
          rows="2"
          class="w-full px-2.5 py-1 bg-base-100 dark:bg-slate-900 border border-base-300 dark:border-slate-700 rounded text-xs text-base-content focus:outline-none focus:border-blue-500 resize-y"
          placeholder="Deskripsi singkat keunggulan..."
        />

        <!-- Row 4: Links and Conditional Image URL -->
        {#if hasImageSupport}
          <div class="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={feature.imageUrl ?? ''}
              on:input={(e) => handleFeatureFieldChange(index, 'imageUrl', e.currentTarget.value)}
              class="w-full px-2 py-1 bg-base-100 dark:bg-slate-900 border border-base-300 dark:border-slate-700 rounded text-[11px] text-base-content focus:outline-none"
              placeholder="URL Gambar Item (opsional)"
            />
            <input
              type="text"
              value={feature.linkUrl ?? ''}
              on:input={(e) => handleFeatureFieldChange(index, 'linkUrl', e.currentTarget.value)}
              class="w-full px-2 py-1 bg-base-100 dark:bg-slate-900 border border-base-300 dark:border-slate-700 rounded text-[11px] text-base-content focus:outline-none"
              placeholder="URL Tautan / Link (opsional)"
            />
          </div>
        {:else}
          <div>
            <input
              type="text"
              value={feature.linkUrl ?? ''}
              on:input={(e) => handleFeatureFieldChange(index, 'linkUrl', e.currentTarget.value)}
              class="w-full px-2 py-1 bg-base-100 dark:bg-slate-900 border border-base-300 dark:border-slate-700 rounded text-[11px] text-base-content focus:outline-none"
              placeholder="URL Tautan / Link (opsional)"
            />
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
