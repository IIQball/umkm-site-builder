<script lang="ts">
  import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { TemplateSection } from '@/schemas';
  import type { FeatureItem } from '@/types';
  import {
    makeHandleArrayItemChange,
    makeHandleAddArrayItem,
    makeHandleRemoveArrayItem,
    makeHandleMoveArrayItem,
  } from '../content.helpers';
  import { FEATURE_ICON_OPTIONS } from '../../sections/features/featureIcons';
  import SearchableIconDropdown from '../../inspector/SearchableIconDropdown.svelte';
  import ImageUploadDropzone from '../../inspector/ImageUploadDropzone.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;
  export let hasItemImages: boolean = false;

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

<div class="pt-3 border-t border-base-300 space-y-3 text-left">
  <div class="flex items-center justify-between">
    <span class="block font-semibold text-xs text-base-content/80">Daftar Fitur / Benefit</span>
    <Button
      type="button"
      variant="ghost"
      size="xs"
      on:click={() =>
        handleAddArrayItem(itemsKey, {
          id: `f-${Date.now()}`,
          icon: 'sparkles',
          iconName: 'sparkles',
          title: 'Keunggulan Baru',
          description: 'Deskripsi singkat keunggulan dan nilai tambah produk Anda.',
          badge: 'Baru',
        })}
      class="!h-auto !min-h-0 !py-1 !px-2 text-primary gap-1"
    >
      <Plus size={12} />
      <span>Tambah Fitur</span>
    </Button>
  </div>

  <div class="space-y-3">
    {#each features as feature, index}
      <div class="p-3 bg-base-200/50 border border-base-300 rounded-xl space-y-2.5">
        <!-- Row 1: Searchable Icon Selector, Title, Reorder & Delete -->
        <div class="flex items-center justify-between gap-2">
          <div class="w-32 shrink-0">
            <SearchableIconDropdown
              label=""
              options={FEATURE_ICON_OPTIONS}
              selectedIcon={feature.iconName || feature.icon || 'sparkles'}
              onSelect={(val) => {
                handleFeatureFieldChange(index, 'icon', val);
                handleFeatureFieldChange(index, 'iconName', val);
              }}
            />
          </div>

          <input
            type="text"
            value={feature.title ?? ''}
            on:input={(e) => handleFeatureFieldChange(index, 'title', e.currentTarget.value)}
            class="input input-bordered input-xs flex-1 font-medium"
            placeholder="Judul Fitur"
          />

          <div class="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              on:click={() => handleMoveArrayItem(itemsKey, index, 'up')}
              disabled={index === 0}
              class="!w-6 !h-6 !min-h-0 !p-0 disabled:opacity-20"
              title="Pindah ke Atas"
            >
              <ChevronUp size={13} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              on:click={() => handleMoveArrayItem(itemsKey, index, 'down')}
              disabled={index === features.length - 1}
              class="!w-6 !h-6 !min-h-0 !p-0 disabled:opacity-20"
              title="Pindah ke Bawah"
            >
              <ChevronDown size={13} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              on:click={() => handleRemoveArrayItem(itemsKey, index)}
              class="!w-6 !h-6 !min-h-0 !p-0 text-base-content/50 hover:text-error"
              title="Hapus Fitur"
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </div>

        <!-- Row 2: Badge & Action Label -->
        <div class="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={feature.badge ?? ''}
            on:input={(e) => handleFeatureFieldChange(index, 'badge', e.currentTarget.value)}
            class="input input-bordered input-xs w-full"
            placeholder="Label Badge (opsional)"
          />
          <input
            type="text"
            value={feature.statLabel ?? ''}
            on:input={(e) => handleFeatureFieldChange(index, 'statLabel', e.currentTarget.value)}
            class="input input-bordered input-xs w-full"
            placeholder="Teks Tombol/Stat (opsional)"
          />
        </div>

        <!-- Row 3: Description -->
        <textarea
          value={feature.description ?? ''}
          on:input={(e) => handleFeatureFieldChange(index, 'description', e.currentTarget.value)}
          rows="2"
          class="textarea textarea-bordered textarea-xs w-full resize-y"
          placeholder="Deskripsi singkat keunggulan..."></textarea>

        <!-- Row 4: Conditional Image Upload Dropzone (Only for presets supporting item images) -->
        {#if hasItemImages}
          <div class="pt-1 border-t border-base-200 space-y-2">
            <ImageUploadDropzone
              compact={true}
              imageUrl={feature.imageUrl || ''}
              onImageChange={(url) => handleFeatureFieldChange(index, 'imageUrl', url)}
              label={`Gambar Fitur #${index + 1}`}
              placeholderTitle="Tarik Gambar ke Sini"
              placeholderSubtitle="pilih manual"
            />
          </div>
        {/if}

        <!-- Row 5: Link / URL -->
        <div>
          <input
            type="text"
            value={feature.linkUrl ?? ''}
            on:input={(e) => handleFeatureFieldChange(index, 'linkUrl', e.currentTarget.value)}
            class="input input-bordered input-xs w-full text-[11px]"
            placeholder="URL Tautan / Link (opsional, misal #katalog)"
          />
        </div>
      </div>
    {/each}
  </div>
</div>
