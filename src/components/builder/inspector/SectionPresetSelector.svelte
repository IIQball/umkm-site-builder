<script lang="ts">
  import { LayoutGrid, Sparkles, Check, ChevronRight } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';
  import { PRESETS_BY_SECTION_TYPE } from './layoutPresets.data';
  import LayoutSelectorModal from './LayoutSelectorModal.svelte';

  export let section: TemplateSection;

  let isModalOpen = false;

  $: currentPresets = PRESETS_BY_SECTION_TYPE[section.type] || [];
  $: activePresetId = section.layoutPreset || (section.props?.layoutPreset as string) || (currentPresets[0]?.id ?? '');
  $: activePresetObj = currentPresets.find((p) => p.id === activePresetId) || currentPresets[0];

  const handlePresetSelect = (presetId: string) => {
    editorStore.updateSectionLayoutPreset(section.id, presetId);
  };
</script>

{#if currentPresets.length > 0}
  <div class="space-y-3">
    <div class="flex items-center justify-between border-b border-base-200 dark:border-slate-800 pb-1.5">
      <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70">
        <LayoutGrid size={13} class="text-[var(--theme-primary,#2563eb)]" />
        <span>Tata Letak ({currentPresets.length} Variasi)</span>
      </div>
      <button
        type="button"
        on:click={() => (isModalOpen = true)}
        class="text-3xs font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
      >
        <span>Lihat Semua</span>
        <ChevronRight size={10} />
      </button>
    </div>

    <!-- Active Preset Hero Card (Click to open Dribbble-style Modal) -->
    <div
      role="button"
      tabindex="0"
      on:click={() => (isModalOpen = true)}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (isModalOpen = true)}
      class="p-3.5 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent text-left relative group hover:border-primary transition-all cursor-pointer shadow-xs hover:shadow-md"
      title="Buka Galeri Tata Letak ala Dribbble"
    >
      <div class="flex items-center justify-between gap-2 mb-1.5">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span class="font-bold text-xs text-base-content font-heading">
            {activePresetObj?.label || 'Default Layout'}
          </span>
        </div>
        <span class="inline-flex items-center gap-1 text-3xs font-bold font-mono px-2 py-0.5 rounded-full bg-primary text-white shadow-2xs">
          <Check size={9} strokeWidth={3} />
          <span>Aktif</span>
        </span>
      </div>

      <p class="text-[11px] text-base-content/70 line-clamp-2 leading-relaxed">
        {activePresetObj?.desc || 'Tata letak default komponen.'}
      </p>

      <!-- Trigger Button -->
      <div class="mt-3 pt-2.5 border-t border-primary/20 flex items-center justify-between">
        <span class="text-3xs font-mono text-base-content/50 uppercase tracking-wider">
          {section.type}
        </span>
        <span class="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
          <Sparkles size={12} />
          <span>Ganti Tata Letak</span>
          <ChevronRight size={12} />
        </span>
      </div>
    </div>
  </div>

  <!-- Dribbble-style Near-Fullscreen Layout Selector Modal -->
  <LayoutSelectorModal
    open={isModalOpen}
    sectionType={section.type}
    {activePresetId}
    onSelectPreset={handlePresetSelect}
    onClose={() => (isModalOpen = false)}
  />
{/if}
