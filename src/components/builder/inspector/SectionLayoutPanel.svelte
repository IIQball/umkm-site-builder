<script lang="ts">
  import { LayoutGrid, Sliders, Layers, ArrowUp, ArrowDown, Check } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';
  import { PRESETS_BY_SECTION_TYPE } from './sectionLayout.constants';

  export let section: TemplateSection;
  export let onStyleChange: (key: string, value: string) => void;
  export let onStylesChange: ((updates: Record<string, string | undefined>) => void) | undefined = undefined;

  const applyStyles = (updates: Record<string, string | undefined>) => {
    if (onStylesChange) {
      onStylesChange(updates);
    } else {
      for (const [k, v] of Object.entries(updates)) {
        onStyleChange(k, v || '');
      }
    }
  };

  $: presets = PRESETS_BY_SECTION_TYPE[section.type] || [];
  $: currentPreset = section.layoutPreset || (section.props?.layoutPreset as string) || (section.styles?.layoutPreset as string) || (presets[0]?.id ?? '');

  const selectPreset = (presetId: string) => {
    editorStore.updateSectionLayoutPreset(section.id, presetId);
  };

  // Reorder element slots (for Hero section elementOrder)
  $: defaultElementOrder = ['badge', 'title', 'subtitle', 'image', 'cta'];
  $: currentOrder = (section.props?.elementOrder as string[]) || defaultElementOrder;

  const slotLabels: Record<string, string> = {
    badge: 'Promo Badge',
    title: 'Judul Heading',
    subtitle: 'Subjudul Deskripsi',
    image: 'Gambar Banner',
    cta: 'Tombol Aksi (CTA)',
  };

  const moveSlot = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= currentOrder.length) return;
    editorStore.reorderSectionSlot(section.id, fromIdx, toIdx);
  };
</script>

<div class="space-y-6 text-xs">
  <!-- 1. Layout Preset Selection -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
      <LayoutGrid size={14} class="text-primary" />
      <span>Pilih Variasi Layout Section (8 Pilihan)</span>
    </div>

    <div class="grid grid-cols-1 gap-2">
      {#each presets as p}
        <button
          type="button"
          on:click={() => selectPreset(p.id)}
          class="p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 {currentPreset === p.id ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-base-200 dark:border-slate-800 bg-base-100 dark:bg-slate-900 hover:border-base-300'}"
        >
          <div class="space-y-0.5 flex-1">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-xs text-base-content">{p.label}</span>
              {#if currentPreset === p.id}
                <span class="badge badge-primary badge-xs">Aktif</span>
              {/if}
            </div>
            <p class="text-[11px] text-base-content/60 leading-snug">{p.desc}</p>
          </div>
          {#if currentPreset === p.id}
            <div class="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check size={12} />
            </div>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- 2. Slot Element Reorder (Hero Section) -->
  {#if section.type === 'hero'}
    <div class="space-y-3 pt-4 border-t border-base-200 dark:border-slate-800">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
        <Layers size={14} class="text-primary" />
        <span>Urutan Elemen (Element Slots)</span>
      </div>

      <div class="space-y-1.5">
        {#each currentOrder as slot, idx}
          <div class="flex items-center justify-between p-2 rounded-lg bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800">
            <span class="font-medium text-xs text-base-content">{slotLabels[slot] || slot}</span>
            <div class="flex items-center gap-1">
              <button
                type="button"
                on:click={() => moveSlot(idx, idx - 1)}
                disabled={idx === 0}
                class="p-1 rounded hover:bg-base-300 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                title="Pindah ke atas"
              >
                <ArrowUp size={12} />
              </button>
              <button
                type="button"
                on:click={() => moveSlot(idx, idx + 1)}
                disabled={idx === currentOrder.length - 1}
                class="p-1 rounded hover:bg-base-300 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                title="Pindah ke bawah"
              >
                <ArrowDown size={12} />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- 3. Responsive Column Grid (Product Catalog / Features) -->
  {#if section.type === 'product_catalog' || section.type === 'features'}
    <div class="space-y-3 pt-4 border-t border-base-200 dark:border-slate-800">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
        <Sliders size={14} class="text-primary" />
        <span>Jumlah Kolom Grid (Desktop & Mobile)</span>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="layout-cols-desktop" class="block font-medium text-[11px] text-base-content/70 mb-1">Desktop (1200px)</label>
          <select
            id="layout-cols-desktop"
            value={String(section.styles?.columnsDesktop || (section.type === 'product_catalog' ? '3' : '3'))}
            on:change={(e) => applyStyles({ columnsDesktop: e.currentTarget.value })}
            class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
          >
            <option value="2">2 Kolom</option>
            <option value="3">3 Kolom</option>
            <option value="4">4 Kolom</option>
          </select>
        </div>
        <div>
          <label for="layout-cols-mobile" class="block font-medium text-[11px] text-base-content/70 mb-1">Mobile (375px)</label>
          <select
            id="layout-cols-mobile"
            value={String(section.styles?.columnsMobile || '1')}
            on:change={(e) => applyStyles({ columnsMobile: e.currentTarget.value })}
            class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
          >
            <option value="1">1 Kolom (Vertical)</option>
            <option value="2">2 Kolom (Compact)</option>
          </select>
        </div>
      </div>
    </div>
  {/if}
</div>
