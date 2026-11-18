<script lang="ts">
  import { Badge } from '@/components/ui';
  import { PRESET_COLOR_PALETTES } from './logo-wizard.constants';
  import { HEX_COLOR_REGEX } from '@/lib/validators/ai-logo';

  export let selectedColors: string[] = ['#C85A32', '#F7F4EE', '#2A2A2A'];
  export let error: string = '';

  type PaletteMode = 'preset' | 'custom';
  let mode: PaletteMode = 'preset';

  function applyPreset(colors: string[]) {
    selectedColors = [...colors].slice(0, 3);
    error = '';
  }

  function handleColorChange(index: number, newColor: string) {
    const trimmed = newColor.trim().toUpperCase();
    if (!HEX_COLOR_REGEX.test(trimmed)) {
      error = 'Format warna tidak valid (gunakan format hex seperti #C85A32)';
      return;
    }
    const updated = [...selectedColors];
    updated[index] = trimmed;
    selectedColors = updated;
    error = '';
  }

  function addColorSlot() {
    if (selectedColors.length >= 3) {
      error = 'Maksimal 3 warna agar logo tetap simpel dan elegan';
      return;
    }
    const fallbackPalette = ['#2563EB', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6'];
    const nextColor = fallbackPalette.find((c) => !selectedColors.includes(c)) || '#3B82F6';
    selectedColors = [...selectedColors, nextColor];
    error = '';
  }

  function removeColor(index: number) {
    if (selectedColors.length <= 1) {
      error = 'Pilih minimal 1 warna dasar untuk logo Anda';
      return;
    }
    selectedColors = selectedColors.filter((_, i) => i !== index);
    error = '';
  }
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between">
    <span class="block text-label-caps text-muted">
      Pilihan Warna Logo <span class="text-error">*</span>
    </span>
    <Badge variant={selectedColors.length === 3 ? 'warning' : 'info'} size="sm" dot={true}>
      {selectedColors.length}/3 Warna (Maksimal)
    </Badge>
  </div>

  <!-- Pilihan Mode: Rekomendasi vs Pilih Sendiri -->
  <div class="flex items-center p-1 bg-nested rounded-xl border border-light w-fit gap-1">
    <button
      type="button"
      class="px-3 py-1 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer {mode === 'preset'
        ? 'bg-card text-main shadow-2xs border border-light'
        : 'text-secondary hover:text-main'}"
      on:click={() => (mode = 'preset')}
    >
      Kombinasi Rekomendasi
    </button>
    <button
      type="button"
      class="px-3 py-1 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer {mode === 'custom'
        ? 'bg-card text-main shadow-2xs border border-light'
        : 'text-secondary hover:text-main'}"
      on:click={() => (mode = 'custom')}
    >
      Pilih Warna Sendiri
    </button>
  </div>

  {#if mode === 'preset'}
    <!-- Pilihan Kombinasi Warna Cepat -->
    <div class="flex flex-wrap gap-2">
      {#each PRESET_COLOR_PALETTES as preset}
        {@const isActive = preset.colors.slice(0, 3).join(',') === selectedColors.join(',')}
        <button
          type="button"
          class="px-2.5 py-1 text-xs rounded-xl border-2 flex items-center gap-1.5 transition-all cursor-pointer {isActive
            ? 'border-primary ring-2 ring-primary/30 bg-primary/10 shadow-xs text-main font-semibold'
            : 'border-light bg-nested hover:bg-card text-secondary'}"
          on:click={() => applyPreset(preset.colors)}
        >
          <div class="flex -space-x-1">
            {#each preset.colors as color}
              <span class="w-3 h-3 rounded-full border border-card shadow-xs" style="background-color: {color};"></span>
            {/each}
          </div>
          <span class="text-2xs">{preset.name}</span>
          {#if isActive}
            <span class="text-primary flex items-center justify-center ml-0.5" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Slot Warna Terpilih / Pengatur Warna Kustom -->
  <div class="p-3 bg-nested rounded-2xl border border-light space-y-3">
    <div class="flex items-center justify-between text-2xs text-secondary font-medium">
      <span>Warna Logo Aktif (Bisa Diatur Langsung):</span>
      <span>Maksimal 3 warna</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      {#each selectedColors as color, index}
        <div class="flex items-center justify-between gap-2 p-2 bg-card rounded-xl border border-light shadow-2xs">
          <div class="flex items-center gap-2 min-w-0">
            <input
              type="color"
              value={color}
              on:input={(e) => handleColorChange(index, e.currentTarget.value)}
              class="w-7 h-7 rounded-lg cursor-pointer border border-light p-0.5 bg-card flex-shrink-0"
              title="Klik untuk memilih warna"
            />
            <input
              type="text"
              value={color}
              on:change={(e) => handleColorChange(index, e.currentTarget.value)}
              maxlength="7"
              class="w-20 px-1.5 py-1 text-2xs font-mono font-bold rounded-lg border border-light bg-nested text-main uppercase"
            />
          </div>
          {#if selectedColors.length > 1}
            <button
              type="button"
              class="text-muted hover:text-error transition-colors p-1 rounded cursor-pointer"
              on:click={() => removeColor(index)}
              title="Hapus warna"
              aria-label="Hapus warna ke-{index + 1}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          {/if}
        </div>
      {/each}

      {#if selectedColors.length < 3}
        <button
          type="button"
          class="flex items-center justify-center gap-1.5 p-2 border-2 border-dashed border-light hover:border-primary/50 hover:bg-card text-secondary hover:text-primary rounded-xl text-xs font-medium transition-all cursor-pointer h-full min-h-[42px]"
          on:click={addColorSlot}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Tambah Warna</span>
        </button>
      {/if}
    </div>
  </div>

  {#if error}
    <p class="text-xs text-error mt-1.5">{error}</p>
  {/if}
</div>
