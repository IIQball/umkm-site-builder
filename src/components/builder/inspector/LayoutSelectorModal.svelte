<script lang="ts">
  import { tick } from 'svelte';
  import { Check, Search, LayoutGrid, Sparkles } from 'lucide-svelte';
  import { Modal, Button, Input } from '@/components/ui';
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

  const RECENT_PRESETS_KEY = 'pinoka_recent_layout_presets';

  function getRecentPreset(type: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(RECENT_PRESETS_KEY);
      if (!raw) return null;
      const map = JSON.parse(raw);
      return map[type] || null;
    } catch {
      return null;
    }
  }

  function saveRecentPreset(type: string, id: string) {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(RECENT_PRESETS_KEY);
      const map = raw ? JSON.parse(raw) : {};
      map[type] = id;
      localStorage.setItem(RECENT_PRESETS_KEY, JSON.stringify(map));
    } catch {
      // safe fallback
    }
  }

  let searchQuery = '';
  let scrollContainerEl: HTMLElement | null = null;
  let prevOpen = false;
  let recentPresetId: string | null = null;

  $: if (open && sectionType) {
    recentPresetId = getRecentPreset(sectionType);
  }

  $: allPresets = PRESETS_BY_SECTION_TYPE[sectionType] || [];
  $: sectionLabel = SECTION_TYPE_LABELS[sectionType] || 'Section Layout';

  $: orderedPresets = (() => {
    if (!recentPresetId) return allPresets;
    const recent = allPresets.find((p) => p.id === recentPresetId);
    if (!recent) return allPresets;
    return [recent, ...allPresets.filter((p) => p.id !== recentPresetId)];
  })();

  $: filteredPresets = orderedPresets.filter((preset) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      preset.label.toLowerCase().includes(q) ||
      preset.desc.toLowerCase().includes(q) ||
      (preset.tag && preset.tag.toLowerCase().includes(q))
    );
  });

  async function scrollToActivePreset(smooth = true) {
    await tick();
    if (!scrollContainerEl || !activePresetId) return;
    const targetCard = scrollContainerEl.querySelector(`[data-preset-id="${activePresetId}"]`) as HTMLElement;
    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'center',
      });
    }
  }

  $: if (open && !prevOpen) {
    prevOpen = true;
    setTimeout(() => {
      scrollToActivePreset(false);
    }, 50);
    setTimeout(() => {
      scrollToActivePreset(false);
    }, 180);
  } else if (!open) {
    prevOpen = false;
  }

  const handleSelect = (presetId: string) => {
    activePresetId = presetId;
    saveRecentPreset(sectionType, presetId);
    recentPresetId = presetId;
    onSelectPreset(presetId);
    scrollToActivePreset(true);
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
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-mono font-bold uppercase tracking-wider border border-primary/30 bg-primary/10 text-primary">
                {filteredPresets.length} Pilihan
              </span>
            </h3>
            <p class="text-2xs text-secondary mt-0.5">
              {sectionLabel} - Klik kartu untuk langsung mengubah tata letak pada kanvas
            </p>
          </div>
        </div>
      </div>

      <!-- Search Input -->
      <div class="flex-shrink-0 w-full sm:w-64">
        <Input
          bind:value={searchQuery}
          placeholder="Cari preset layout..."
          size="sm"
        >
          <svelte:fragment slot="prefix">
            <Search size={14} class="text-muted" />
          </svelte:fragment>
        </Input>
      </div>
    </div>
  </svelte:fragment>

  <!-- Modal Body: Side-by-Side Visual Shot Grid (Ala Dribbble) -->
  <div bind:this={scrollContainerEl} class="flex-1 overflow-y-auto p-5 sm:p-7 bg-nested/30">
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
            data-preset-id={preset.id}
            role="button"
            tabindex="0"
            on:click={() => handleSelect(preset.id)}
            on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(preset.id)}
            class={`group relative flex flex-col rounded-2xl border text-left overflow-hidden cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              isSelected
                ? 'bg-card border-primary ring-2 ring-primary/40 shadow-xl shadow-primary/10'
                : 'bg-card border-light hover:border-primary/40 hover:shadow-xl hover:-translate-y-1'
            }`}
          >
            <!-- Visual Wireframe Shot (Dribbble View) -->
            <div class="relative w-full aspect-[16/9] bg-[#090d16] p-3 overflow-hidden border-b border-light flex items-center justify-center">
              {@html getPresetSchematicSvg(sectionType, preset.id)}

              <!-- Tag Pill -->
              {#if preset.id === recentPresetId}
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-mono font-bold tracking-wider absolute top-2.5 left-2.5 z-10 shadow-md bg-amber-400 text-slate-950 border border-amber-300">
                  Terbaru Dipilih
                </span>
              {:else if preset.tag}
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-mono font-bold tracking-wider absolute top-2.5 left-2.5 z-10 shadow-md bg-slate-800/95 text-slate-100 border border-slate-600/80 backdrop-blur-xs">
                  {preset.tag}
                </span>
              {/if}

              <!-- Active Badge -->
              {#if isSelected}
                <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-mono uppercase font-bold tracking-wider absolute top-2.5 right-2.5 z-10 shadow-md bg-primary text-slate-950 border border-primary-light/50 animate-fade-in">
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
                <span class="text-2xs font-mono text-muted">Preset ID: {preset.id}</span>
                <Button
                  type="button"
                  size="xs"
                  variant={isSelected ? 'primary' : 'ghost'}
                  on:click={(e) => { e.stopPropagation(); handleSelect(preset.id); }}
                  class={isSelected ? 'shadow-xs' : 'bg-nested hover:bg-primary/10 text-secondary hover:text-primary'}
                >
                  {#if isSelected}
                    <Check size={12} />
                    <span>Sedang Digunakan</span>
                  {:else}
                    <span>Pilih Layout</span>
                  {/if}
                </Button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

</Modal>
