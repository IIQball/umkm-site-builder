<script lang="ts">
  import { Layers, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trash2, Plus } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';
  import {
    DEFAULT_SLOTS_BY_SECTION,
    SLOT_LABELS,
    getDefaultHeroSlots,
    getHeroSlotLabel,
    getEffectiveHeroElementOrder,
    getHeroSplitVisualSlot,
    isHeroVisualOnLeft,
    getHeroSlotDirection,
    getDefaultFeaturesSlots,
    getFeaturesSlotLabel,
    getEffectiveFeaturesElementOrder,
    getFeaturesSplitSlot,
    isFeaturesVisualOnLeft,
    getFeaturesSlotDirection,
    isFeaturesSplitLayout,
    getAddedSlotDefaultProps,
  } from './sectionSlot.helpers';
  import { isHeroSplitLayout } from '../sections/hero/heroLayout.helpers';
  import HeaderSlotControls from './HeaderSlotControls.svelte';

  export let section: TemplateSection;

  $: isHeader = section.type === 'header_announcement';
  $: preset =
    section.layoutPreset ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    (section.type === 'hero' ? 'split_left_text' : section.type === 'features' ? 'grid_3_cards' : 'default_split');

  // Generic / Hero / Features Section Slots:
  $: isSplitHero = section.type === 'hero' && isHeroSplitLayout(preset);
  $: isSplitFeatures = section.type === 'features' && isFeaturesSplitLayout(preset);
  $: isSplit = isSplitHero || isSplitFeatures;

  $: splitVisualSlot = isSplitHero
    ? getHeroSplitVisualSlot(preset)
    : isSplitFeatures
      ? getFeaturesSplitSlot(preset)
      : null;

  $: defaultStandardSlots =
    section.type === 'hero'
      ? getDefaultHeroSlots(preset)
      : section.type === 'features'
        ? getDefaultFeaturesSlots(preset)
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
        : (Array.isArray(section.props?.elementOrder) && section.props.elementOrder.length > 0
            ? (section.props.elementOrder as string[])
            : defaultStandardSlots
          ).filter((s) => defaultStandardSlots.includes(s));

  $: missingStandardSlots = defaultStandardSlots.filter((s) => !standardElementOrder.includes(s));

  const getSlotLabel = (slot: string): string => {
    if (section.type === 'hero') return getHeroSlotLabel(slot);
    if (section.type === 'features') return getFeaturesSlotLabel(slot, preset);
    return SLOT_LABELS[slot] || slot;
  };

  const getSlotDirection = (slot: string, p: string): 'horizontal' | 'vertical' | 'none' => {
    if (section.type === 'hero') return getHeroSlotDirection(p, slot);
    if (section.type === 'features') return getFeaturesSlotDirection(p, slot);
    if (section.type === 'footer') return 'horizontal';
    return 'vertical';
  };

  $: isVisualLeft = isSplit && splitVisualSlot
    ? (section.type === 'hero'
        ? isHeroVisualOnLeft(preset, standardElementOrder, preset === 'split_right_text' || preset === 'brand_story_founder')
        : isFeaturesVisualOnLeft(preset, standardElementOrder, false))
    : false;

  $: splitTextSlots = isSplit
    ? standardElementOrder.filter((s) => s !== splitVisualSlot && getSlotDirection(s, preset) === 'vertical')
    : [];

  const isMoveDisabled = (slot: string, direction: -1 | 1, p: string): boolean => {
    const dir = getSlotDirection(slot, p);
    if (dir === 'none') return true;

    if (isSplit) {
      if (dir === 'horizontal') {
        const isThisLeft = slot === splitVisualSlot ? isVisualLeft : !isVisualLeft;
        return direction === -1 ? isThisLeft : !isThisLeft;
      }
      const textIdx = splitTextSlots.indexOf(slot);
      if (textIdx === -1) return true;
      return direction === -1 ? textIdx === 0 : textIdx === splitTextSlots.length - 1;
    }

    const idx = standardElementOrder.indexOf(slot);
    return direction === -1 ? idx === 0 : idx === standardElementOrder.length - 1;
  };

  const getMoveTitle = (slot: string, direction: -1 | 1, p: string): string => {
    const dir = getSlotDirection(slot, p);
    if (dir === 'horizontal') {
      const isThisLeft = slot === splitVisualSlot ? isVisualLeft : !isVisualLeft;
      return direction === -1
        ? (isThisLeft ? 'Posisi sudah di Sisi Kiri' : 'Pindah ke Sisi Kiri')
        : (!isThisLeft ? 'Posisi sudah di Sisi Kanan' : 'Pindah ke Sisi Kanan');
    }
    return direction === -1 ? 'Pindah ke Atas' : 'Pindah ke Bawah';
  };

  const handleMoveSlot = (slot: string, direction: -1 | 1) => {
    const dir = getSlotDirection(slot, preset);
    if (dir === 'none') return;

    if (isSplit) {
      if (dir === 'horizontal') {
        const visual = splitVisualSlot;
        if (!visual || !standardElementOrder.includes(visual)) return;
        const filtered = standardElementOrder.filter((s) => s !== visual);
        const wantVisualLeft = slot === visual ? direction === -1 : direction === 1;
        const newOrder = wantVisualLeft ? [visual, ...filtered] : [...filtered, visual];
        editorStore.updateSectionProps(section.id, {
          elementOrder: newOrder,
          ...(section.type === 'hero' ? { heroPreset: preset } : {}),
          ...(section.type === 'features' ? { featuresPreset: preset } : {}),
          layoutPreset: preset,
        });
        return;
      }

      const fromTextIdx = splitTextSlots.indexOf(slot);
      const toTextIdx = fromTextIdx + direction;
      if (toTextIdx < 0 || toTextIdx >= splitTextSlots.length) return;

      const newTextSlots = [...splitTextSlots];
      const [moved] = newTextSlots.splice(fromTextIdx, 1);
      newTextSlots.splice(toTextIdx, 0, moved);

      const fixedSlots = standardElementOrder.filter((s) => getSlotDirection(s, preset) === 'none');
      const newOrder = splitVisualSlot && standardElementOrder.includes(splitVisualSlot)
        ? (isVisualLeft ? [splitVisualSlot, ...newTextSlots, ...fixedSlots] : [...newTextSlots, ...fixedSlots, splitVisualSlot])
        : [...newTextSlots, ...fixedSlots];

      editorStore.updateSectionProps(section.id, {
        elementOrder: newOrder,
        ...(section.type === 'hero' ? { heroPreset: preset } : {}),
        ...(section.type === 'features' ? { featuresPreset: preset } : {}),
        layoutPreset: preset,
      });
      return;
    }

    const fromIdx = standardElementOrder.indexOf(slot);
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= standardElementOrder.length) return;

    const order = [...standardElementOrder];
    const [moved] = order.splice(fromIdx, 1);
    order.splice(toIdx, 0, moved);
    editorStore.updateSectionProps(section.id, {
      elementOrder: order,
      ...(section.type === 'hero' ? { heroPreset: preset, layoutPreset: preset } : {}),
      ...(section.type === 'features' ? { featuresPreset: preset, layoutPreset: preset } : {}),
    });
  };

  const handleDeleteSlot = (slot: string) => {
    const newOrder = standardElementOrder.filter((s) => s !== slot);
    editorStore.updateSectionProps(section.id, {
      elementOrder: newOrder,
      ...(section.type === 'hero' ? { heroPreset: preset, layoutPreset: preset } : {}),
      ...(section.type === 'features' ? { featuresPreset: preset, layoutPreset: preset } : {}),
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
      ...defaultProps,
    });
  };
</script>

{#if isHeader}
  <HeaderSlotControls {section} {preset} />
{:else if standardElementOrder.length > 0}
  <div class="space-y-3">
    <div class="flex items-center justify-between border-b border-base-200 dark:border-slate-800 pb-1.5">
      <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70">
        <Layers size={13} class="text-[var(--theme-primary, var(--color-primary))]" />
        <span>Urutan Slot Elemen</span>
      </div>
      <span class="badge badge-ghost badge-xs font-mono font-semibold uppercase">
        {isSplit ? 'Kiri - Kanan & Atas - Bawah' : section.type === 'footer' ? 'Kiri - Kanan' : 'Atas - Bawah'}
      </span>
    </div>

    <div class="space-y-1.5">
      {#each standardElementOrder as slot (slot)}
        {@const dir = getSlotDirection(slot, preset)}
        <div class="flex items-center justify-between p-2 rounded-lg bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 text-xs">
          <span class="font-medium text-base-content">{getSlotLabel(slot)}</span>
          <div class="flex items-center gap-1">
            {#if dir !== 'none'}
              <button
                type="button"
                disabled={isMoveDisabled(slot, -1, preset)}
                on:click={() => handleMoveSlot(slot, -1)}
                class="btn btn-ghost btn-xs btn-square bg-base-100 disabled:opacity-30"
                title={getMoveTitle(slot, -1, preset)}
                aria-label={getMoveTitle(slot, -1, preset)}
              >
                {#if dir === 'horizontal'}
                  <ArrowLeft size={12} />
                {:else}
                  <ArrowUp size={12} />
                {/if}
              </button>
              <button
                type="button"
                disabled={isMoveDisabled(slot, 1, preset)}
                on:click={() => handleMoveSlot(slot, 1)}
                class="btn btn-ghost btn-xs btn-square bg-base-100 disabled:opacity-30"
                title={getMoveTitle(slot, 1, preset)}
                aria-label={getMoveTitle(slot, 1, preset)}
              >
                {#if dir === 'horizontal'}
                  <ArrowRight size={12} />
                {:else}
                  <ArrowDown size={12} />
                {/if}
              </button>
            {/if}
            <button
              type="button"
              on:click={() => handleDeleteSlot(slot)}
              class="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-error hover:bg-error/10 ml-0.5"
              title="Hapus Elemen"
              aria-label="Hapus Elemen"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      {/each}

      {#if missingStandardSlots.length > 0}
        <div class="flex flex-wrap gap-1 pt-1">
          {#each missingStandardSlots as slot}
            <button
              type="button"
              on:click={() => handleAddSlot(slot)}
              class="btn btn-ghost btn-xs border border-dashed border-primary/40 text-primary hover:bg-primary/10 gap-1 font-semibold"
            >
              <Plus size={10} />
              <span>Tambah {getSlotLabel(slot)}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}
