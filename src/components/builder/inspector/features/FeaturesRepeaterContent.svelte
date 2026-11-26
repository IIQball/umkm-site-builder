<script lang="ts">
  import { Plus } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { TemplateSection } from '@/schemas';
  import type { FeatureItem } from '@/types';
  import {
    makeHandleArrayItemChange,
    makeHandleAddArrayItem,
    makeHandleRemoveArrayItem,
    makeHandleMoveArrayItem,
  } from '../content.helpers';
  import FeatureItemCard from './FeatureItemCard.svelte';

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
    {#each features as feature, index (feature.id || index)}
      <FeatureItemCard
        {feature}
        {index}
        totalFeatures={features.length}
        {hasItemImages}
        onFieldChange={(field, val) => handleFeatureFieldChange(index, field, val)}
        onMove={(dir) => handleMoveArrayItem(itemsKey, index, dir)}
        onRemove={() => handleRemoveArrayItem(itemsKey, index)}
      />
    {/each}
  </div>
</div>
