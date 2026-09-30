<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { Button } from '@/components/ui';
  import { editorStore } from '../stores/editorStore';
  import { getDefaultHeroSlots, getHeroSlotLabel, getEffectiveHeroElementOrder } from '../sections/hero/heroLayout.helpers';
  import { getDefaultFeaturesSlots, getFeaturesSlotLabel, getEffectiveFeaturesElementOrder } from '../sections/features/featuresLayout.helpers';
  import { getDefaultCatalogSlots, getCatalogSlotLabel, getEffectiveCatalogElementOrder } from '../sections/catalog/catalogLayout.helpers';
  import { getHeaderSupportedSlots } from '../sections/header/headerLayout.helpers';
  import type { ProductItem } from '@/types';
  import { getSectionNodes } from './layerPanel.helpers';

  export let section: TemplateSection;
  export let onClose: () => void;

  $: preset =
    (section.layoutPreset as string) ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    (section.type === 'hero' ? 'split_left_text' : section.type === 'features' ? 'grid_3_cards' : 'default_split');

  const addNode = (nodeType: string) => {
    editorStore.addNode(section.id, nodeType);
    onClose();
  };

  type NodeOption = { type: string; label: string };

  const genericNodeMap: Partial<Record<TemplateSection['type'], NodeOption[]>> = {
    product_catalog: [{ type: 'item', label: '+ Item Produk Baru' }],
    testimonials: [{ type: 'item', label: '+ Ulasan Pelanggan Baru' }],
    faq: [{ type: 'item', label: '+ Pertanyaan Tanya Jawab' }],
  };

  $: nodeOptions = (() => {
    if (section.type === 'hero') {
      const defaultSlots = getDefaultHeroSlots(preset);
      const activeOrder = getEffectiveHeroElementOrder(
        preset,
        section.props?.elementOrder,
        section.props?.heroPreset as string
      );
      const missing = defaultSlots.filter((s) => !activeOrder.includes(s));
      return missing.map((s) => ({
        type: s,
        label: `+ ${getHeroSlotLabel(s, preset)}`,
      }));
    }
    if (section.type === 'features') {
      const defaultSlots = getDefaultFeaturesSlots(preset);
      const activeOrder = getEffectiveFeaturesElementOrder(
        preset,
        section.props?.elementOrder,
        section.props?.featuresPreset as string
      );
      const missing = defaultSlots.filter((s) => !activeOrder.includes(s));
      return missing.map((s) => ({
        type: s,
        label: `+ ${getFeaturesSlotLabel(s, preset)}`,
      }));
    }
    if (section.type === 'header_announcement') {
      const activeNodes = getSectionNodes(section);
      const supported = getHeaderSupportedSlots(preset);
      const isTopBarId = (id: string) =>
        ['announcement', 'announcement_bar', 'contact_bar', 'delivery_bar', 'countdown_bar'].includes(id);
      const missing = supported.filter((slot) => {
        if (isTopBarId(slot.id)) {
          return !activeNodes.some((n) => isTopBarId(n.id));
        }
        return !activeNodes.some((n) => n.id === slot.id);
      });
      return missing.map((s) => ({
        type: s.id,
        label: `+ ${s.name}`,
      }));
    }
    if (section.type === 'product_catalog') {
      const prods = (Array.isArray(section.props?.products)
        ? (section.props.products as ProductItem[])
        : undefined);
      const defaultSlots = getDefaultCatalogSlots(preset, prods);
      const activeOrder = getEffectiveCatalogElementOrder(
        preset,
        section.props?.elementOrder,
        prods,
        section.props?.catalogPreset as string
      );
      const missing = defaultSlots.filter((s) => !s.startsWith('product_item_') && !activeOrder.includes(s));
      const options: NodeOption[] = missing.map((s) => ({
        type: s,
        label: `+ ${getCatalogSlotLabel(s, preset, prods)}`,
      }));
      options.push({ type: 'product_item', label: '+ Produk Baru' });
      return options;
    }
    return genericNodeMap[section.type] || [];
  })();
</script>

<div class="mt-1 p-1 bg-base-100 border border-base-200 rounded-lg shadow-xl space-y-0.5 z-40 text-base-content min-w-[160px]">
  {#if nodeOptions.length === 0}
    <p class="px-2 py-1 text-[10px] text-base-content/50 italic text-center">
      Semua elemen aktif
    </p>
  {:else}
    {#each nodeOptions as opt}
      <Button
        type="button"
        variant="ghost"
        size="xs"
        on:click={() => addNode(opt.type)}
        class="!w-full !justify-start !text-[10px] !h-auto !min-h-0 !py-1 !px-2 rounded hover:bg-primary/10 hover:text-primary font-normal"
      >
        {opt.label}
      </Button>
    {/each}
  {/if}
</div>
