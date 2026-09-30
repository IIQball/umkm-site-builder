<script lang="ts">
  import { Layers, Trash2, Plus } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';
  import {
    DEFAULT_SLOTS_BY_SECTION,
    SLOT_LABELS,
    getDefaultHeroSlots,
    getHeroSlotLabel,
    getEffectiveHeroElementOrder,
    getDefaultFeaturesSlots,
    getFeaturesSlotLabel,
    getEffectiveFeaturesElementOrder,
    getDefaultCatalogSlots,
    getCatalogSlotLabel,
    getEffectiveCatalogElementOrder,
    getAddedSlotDefaultProps,
  } from './sectionSlot.helpers';
  import type { ProductItem } from '@/types';
  import HeaderSlotControls from './HeaderSlotControls.svelte';

  export let section: TemplateSection;

  $: isHeader = section.type === 'header_announcement';
  $: preset =
    section.layoutPreset ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    (section.type === 'hero' ? 'split_left_text' : section.type === 'features' ? 'grid_3_cards' : section.type === 'product_catalog' ? 'grid_standard' : 'default_split');

  $: products = (Array.isArray(section.props?.products)
    ? (section.props.products as ProductItem[])
    : undefined);

  $: defaultStandardSlots =
    section.type === 'hero'
      ? getDefaultHeroSlots(preset)
      : section.type === 'features'
        ? getDefaultFeaturesSlots(preset)
        : section.type === 'product_catalog'
          ? getDefaultCatalogSlots(preset, products)
          : DEFAULT_SLOTS_BY_SECTION[section.type] || [];

  $: standardElementOrder =
    section.type === 'hero'
      ? getEffectiveHeroElementOrder(
          preset,
          section.props?.elementOrder,
          section.props?.heroPreset as string
        )
      : section.type === 'features'
        ? getEffectiveFeaturesElementOrder(
            preset,
            section.props?.elementOrder,
            section.props?.featuresPreset as string
          )
        : section.type === 'product_catalog'
          ? getEffectiveCatalogElementOrder(
              preset,
              section.props?.elementOrder,
              products,
              section.props?.catalogPreset as string
            )
          : (Array.isArray(section.props?.elementOrder) && section.props.elementOrder.length > 0
              ? (section.props.elementOrder as string[])
              : defaultStandardSlots
            ).filter((s) => defaultStandardSlots.includes(s));

  $: missingStandardSlots = defaultStandardSlots.filter((s) => !standardElementOrder.includes(s));

  const getSlotLabel = (slot: string): string => {
    if (section.type === 'hero') return getHeroSlotLabel(slot, preset);
    if (section.type === 'features') return getFeaturesSlotLabel(slot, preset);
    if (section.type === 'product_catalog') return getCatalogSlotLabel(slot, preset, products);
    return SLOT_LABELS[slot] || slot;
  };

  const handleDeleteSlot = (slot: string) => {
    const newOrder = standardElementOrder.filter((s) => s !== slot);
    editorStore.updateSectionProps(section.id, {
      elementOrder: newOrder,
      ...(section.type === 'hero' ? { heroPreset: preset, layoutPreset: preset } : {}),
      ...(section.type === 'features' ? { featuresPreset: preset, layoutPreset: preset } : {}),
      ...(section.type === 'product_catalog' ? { catalogPreset: preset, layoutPreset: preset } : {}),
    });
    editorStore.deleteNode(section.id, slot);
  };

  const handleAddSlot = (slot: string) => {
    if (standardElementOrder.includes(slot)) return;
    const newOrder = [...standardElementOrder, slot];
    const defaultProps = getAddedSlotDefaultProps(slot, section.type);
    editorStore.updateSectionProps(section.id, {
      elementOrder: newOrder,
      ...(section.type === 'hero' ? { heroPreset: preset, layoutPreset: preset } : {}),
      ...(section.type === 'features' ? { featuresPreset: preset, layoutPreset: preset } : {}),
      ...(section.type === 'product_catalog' ? { catalogPreset: preset, layoutPreset: preset } : {}),
      ...defaultProps,
    });
  };
</script>

{#if isHeader}
  <HeaderSlotControls {section} {preset} />
{:else if standardElementOrder.length > 0}
  <div class="space-y-3">
    <div class="flex items-center justify-between border-b border-base-200 pb-1.5">
      <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70">
        <Layers size={13} class="text-[var(--theme-primary, var(--color-primary))]" />
        <span>Elemen Section</span>
      </div>
      <span class="badge badge-ghost badge-xs font-mono font-semibold">
        {standardElementOrder.length} Elemen
      </span>
    </div>

    <div class="space-y-1.5">
      {#each standardElementOrder as slot (slot)}
        <div class="flex items-center justify-between p-2 rounded-lg bg-base-200/50 border border-base-300 text-xs">
          <span class="font-medium text-base-content">{getSlotLabel(slot)}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            on:click={() => handleDeleteSlot(slot)}
            class="!w-6 !h-6 !min-h-0 !p-0 text-base-content/40 hover:text-error hover:bg-error/10"
            title="Hapus Elemen"
            aria-label="Hapus Elemen"
          >
            <Trash2 size={12} />
          </Button>
        </div>
      {/each}

      {#if missingStandardSlots.length > 0}
        <div class="flex flex-wrap gap-1 pt-1">
          {#each missingStandardSlots as slot}
            <Button
              type="button"
              variant="ghost"
              size="xs"
              on:click={() => handleAddSlot(slot)}
              class="!h-auto !min-h-0 !py-1 !px-2 border border-dashed border-primary/40 text-primary hover:bg-primary/10 gap-1 font-semibold"
            >
              <Plus size={10} />
              <span>Tambah {getSlotLabel(slot)}</span>
            </Button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}
