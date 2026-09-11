<script lang="ts">
  import { Check, Search, LayoutGrid, Sparkles } from 'lucide-svelte';
  import { Modal, Button } from '@/components/ui';
  import {
    SECTION_TYPE_LABELS,
    PRESETS_BY_SECTION_TYPE,
  } from './layoutPresets.data';
  import { getPresetSchematicSvg } from './layoutSchematics.helpers';

  export let open = false;
  export let sectionType: string = '';
  export let activePresetId: string = '';
  export let onSelectPreset: (presetId: string) => void;
  export let onClose: () => void = () => {};

  let searchQuery = '';

  $: allPresets = PRESETS_BY_SECTION_TYPE[sectionType] || [];
  $: sectionLabel = SECTION_TYPE_LABELS[sectionType] || 'Section Layout';

  $: filteredPresets = allPresets.filter((preset) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      preset.label.toLowerCase().includes(q) ||
      preset.desc.toLowerCase().includes(q) ||
      (preset.tag && preset.tag.toLowerCase().includes(q))
    );
  });

  const handleSelect = (presetId: string) => {
    onSelectPreset(presetId);
  };
</script>

<Modal
  bind:open
  size="full"
  class="max-w-6xl w-full h-[88vh] flex flex-col p-0 overflow-hidden"
  bodyPadding={false}
  on:close={onClose}
>
  <!-- Modal Header (Dribbble Showcase Style) -->
  <svelte:fragment slot="header">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full pr-6">
      <div class="space-y-1 min-w-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
            <LayoutGrid size={16} />
          </div>
          <div>
            <h3 class="text-base font-extrabold text-main font-heading leading-tight flex items-center gap-2">
              <span>Eksplorasi Tata Letak (8pt Grid)</span>
              <span class="text-3xs font-mono uppercase bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold">
                {filteredPresets.length} Pilihan
              </span>
            </h3>
            <p class="text-2xs text-secondary mt-0.5">
              {sectionLabel} — Klik kartu untuk langsung mengubah tata letak pada kanvas
            </p>
          </div>
        </div>
      </div>

      <!-- Search Input -->
      <div class="relative flex-shrink-0 w-full sm:w-64">
        <span class="absolute inset-y-0 left-3 flex items-center text-muted pointer-events-none">
          <Search size={14} />
        </span>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari preset layout..."
          class="w-full pl-9 pr-3 py-1.5 text-xs bg-nested border border-light rounded-xl text-main placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>
    </div>
  </svelte:fragment>

  <!-- Modal Body: Side-by-Side Visual Shot Grid (Ala Dribbble) -->
  <div class="flex-1 overflow-y-auto p-5 sm:p-7 bg-base-200/30">
    {#if filteredPresets.length === 0}
      <div class="py-16 text-center text-secondary space-y-2">
        <Sparkles size={28} class="mx-auto text-muted/60" />
        <p class="text-sm font-semibold text-main">Tidak ada tata letak yang cocok</p>
        <p class="text-xs text-secondary">Coba gunakan kata kunci pencarian yang lain.</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredPresets as preset}
          {@const isSelected = activePresetId === preset.id}
          <div
            role="button"
            tabindex="0"
            on:click={() => handleSelect(preset.id)}
            on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(preset.id)}
            class={`group relative flex flex-col rounded-2xl border text-left overflow-hidden cursor-pointer transition-all duration-300 ${
              isSelected
                ? 'bg-card border-primary ring-2 ring-primary/40 shadow-xl shadow-primary/10'
                : 'bg-card border-light hover:border-primary/40 hover:shadow-xl hover:-translate-y-1'
            }`}
          >
            <!-- Visual Wireframe Shot (Dribbble View) -->
            <div class="relative w-full aspect-[16/9] bg-slate-950 p-3 overflow-hidden border-b border-light flex items-center justify-center">
              {@html getPresetSchematicSvg(sectionType, preset.id)}

              <!-- Tag Pill -->
              {#if preset.tag}
                <span class="absolute top-3 left-3 px-2 py-0.5 rounded-full text-3xs font-bold font-mono tracking-wider bg-slate-900/90 text-slate-300 border border-slate-700/60 backdrop-blur-xs">
                  {preset.tag}
                </span>
              {/if}

              <!-- Active Badge -->
              {#if isSelected}
                <div class="absolute top-3 right-3 flex items-center gap-1 bg-primary text-white text-3xs font-bold font-mono uppercase px-2.5 py-1 rounded-full shadow-md animate-fade-in">
                  <Check size={10} strokeWidth={3} />
                  <span>Aktif</span>
                </div>
              {/if}
            </div>

            <!-- Content Details -->
            <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between gap-2">
                  <h4 class={`text-xs font-bold font-heading transition-colors ${isSelected ? 'text-primary' : 'text-main group-hover:text-primary'}`}>
                    {preset.label}
                  </h4>
                  {#if isSelected}
                    <span class="w-2 h-2 rounded-full bg-primary flex-shrink-0 animate-pulse"></span>
                  {/if}
                </div>
                <p class="text-2xs text-secondary mt-1 leading-relaxed line-clamp-2">
                  {preset.desc}
                </p>
              </div>

              <!-- Action button inside card -->
              <div class="pt-2 border-t border-light/50 flex items-center justify-between">
                <span class="text-3xs font-mono text-muted">Preset ID: {preset.id}</span>
                <button
                  type="button"
                  on:click|stopPropagation={() => handleSelect(preset.id)}
                  class={`text-2xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-nested hover:bg-primary/10 text-secondary hover:text-primary'
                  }`}
                >
                  {#if isSelected}
                    <Check size={12} />
                    <span>Sedang Digunakan</span>
                  {:else}
                    <span>Pilih Layout</span>
                  {/if}
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Modal Footer -->
  <svelte:fragment slot="footer">
    <div class="flex items-center justify-between w-full">
      <span class="text-2xs text-muted font-sans hidden sm:inline">
        💡 Tips: Klik kartu preview untuk melihat perubahan tata letak secara instan di layar kanvas.
      </span>
      <Button variant="outline" size="sm" on:click={onClose}>
        <span>Tutup Galeri</span>
      </Button>
    </div>
  </svelte:fragment>
</Modal>
